import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { createClient } from '@supabase/supabase-js';

// Configure Node.js environment
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://pgbqawjatdatnoudfriu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYnFhd2phdGRhdG5vdWRmcml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNDk1MTksImV4cCI6MjA1NDkyNTUxOX0.Q2TcYivfDWnrfxE_9uRfjJfavhHLuZMn2zrbi_DG6Z0';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    headers: {
        'X-Client-Info': 'import-protocols-script'
    },
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const BATCH_SIZE = 100;

// Tumour group mappings
const TUMOUR_GROUPS = {
    'HL': 'Hematology',
    'BRA': 'Breast Cancer',
    'BMT': 'Leukemia/BMT',
    'LYM': 'Lymphoma',
    'GI': 'Gastrointestinal',
    'LU': 'Lung Cancer',
    'GU': 'Genitourinary',
    'CNS': 'Central Nervous System',
    'HN': 'Head and Neck Cancer',
    'SK': 'Skin',
    'GO': 'Gynecologic Oncology',
    'MY': 'Myeloma',
    'SA': 'Sarcoma',
    'LK': 'Leukemia'
};

// 🛠 Clean text to standardize format
function cleanText(text) {
    if (!text) return '';
    return text
        .replace(/\0/g, '') // Remove null chars
        .replace(/[]/g, '') // Remove replacement chars
        .replace(/Page \d+ of \d+/gi, '') // Remove page numbers
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/-?\s*\n\s*/g, ' ') // Fix line breaks
        .replace(/\s*\([^)]*\)/g, '') // Remove parentheses
        .replace(/[^\w\s,.:\/-]/g, '') // Allow required punctuation
        .replace(/\d+\s*\.\s*/g, '') // Remove numbered bullets
        .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
        .trim();
}

// 🛠 Extract exclusion criteria from text
function extractExclusions(text) {
    const exclusions = [];
    const lines = text.split('\n');
    let inExclusionsSection = false;
    
    // More robust exclusion section header patterns
    const exclusionHeaders = [
        /^exclusions?:?$/i,
        /^contraindications?:?$/i,
        /^not eligible:?$/i,
        /^ineligible:?$/i,
        /^exclusion criteria:?$/i
    ];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check for start of exclusions section using multiple patterns
        if (exclusionHeaders.some(pattern => pattern.test(line))) {
            inExclusionsSection = true;
            console.log('Found exclusions section at line:', i, 'with header:', line);
            continue;
        }
        
        // Check for end of exclusions section (next section header or end of content)
        if (inExclusionsSection && (line.match(/^[A-Z][A-Z\s]+:/) || line.match(/^\d+\.\s*[A-Z]/) || line === '')) {
            console.log('End of exclusions section at line:', i);
            inExclusionsSection = false;
            continue;
        }
        
        // Collect exclusion criteria
        if (inExclusionsSection && line) {
            const cleanedLine = cleanText(line);
            if (cleanedLine && !exclusionHeaders.some(pattern => pattern.test(cleanedLine))) {
                exclusions.push(cleanedLine);
                console.log('Added exclusion:', cleanedLine);
            }
        }
    }
    
    return exclusions;
}

// 🛠 Extract treatment details
function extractTreatment(text) {
    const treatment = {
        drugs: [],
        schedule: [],
        duration: '',
        type: 'Other'
    };

    let isChemo = false;
    let isImmuno = false;

    const chemoRegex = /\b(cisplatin|carboplatin|oxaliplatin|paclitaxel|docetaxel|doxorubicin|gemcitabine|vincristine|etoposide|cyclophosphamide|mitomycin|fluorouracil|leucovorin|pembrolizumab)\b/gi;
    const doseRegex = /(\d+(?:\.\d+)?\s*(mg|g|mg\/m²|g\/m²|mcg|units|IU|ml))/gi;

    text.split(/\r?\n/).forEach(line => {
        const l = line.toLowerCase();
        const drugMatches = line.match(chemoRegex);
        const doseMatches = line.match(doseRegex);

        if (drugMatches) {
            const uniqueDrugs = [...new Set(drugMatches.map(d => d.toLowerCase()))];
            uniqueDrugs.forEach(drug => {
                const dose = doseMatches && doseMatches[0] ? doseMatches[0] : '';
                treatment.drugs.push({ name: drug, dose: dose.trim() });
            });
        }

        if (l.includes('chemotherapy')) isChemo = true;
        if (l.includes('immunotherapy')) isImmuno = true;

        if (l.match(/\b(day|cycle|week|repeat|every)\b/i)) {
            treatment.schedule.push(cleanText(line));
        }

        if (l.match(/\b(duration|continue|maximum)\b/i)) {
            treatment.duration = cleanText(line);
        }
    });

    treatment.type = isChemo ? 'Chemotherapy' : isImmuno ? 'Immunotherapy' : 'Other';
    treatment.schedule = Array.from(new Set(treatment.schedule));

    return treatment;
}

// 🛠 Extract protocol data from PDF text
async function extractProtocolData(text, filename) {
    const code = filename.split('_')[0];
    const data = {
        code: code,
        tumour_group: 'Unknown',
        cancer_site: 'Unknown',
        treatment_intent: 'Treatment',
        treatment_protocol: filename.replace('.pdf', ''),
        dates: { start_date: new Date().toISOString() },
        eligibility: [],
        exclusions: { criteria: [] },
        tests: { baseline: [], monitoring: [] },
        treatment: { drugs: [], schedule: [], duration: '', type: 'Other' },
        dose_modifications: { hematological: [], nonHematological: [], renal: [], hepatic: [] },
        precautions: [],
        reference_list: [],
    };

    // First pass: Split into sections
    const lines = text.split('\n').map(line => cleanText(line.trim()));
    const sections = {};
    let currentSection = '';
    
    // Store section positions for debugging
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        
        if (line.match(/^(protocol code|tumour group|eligibility|exclusions?|tests|treatment|dose modifications|precautions|references?):/i)) {
            currentSection = line.replace(':', '').trim().toLowerCase();
            sections[currentSection] = i;
            console.log(`Found section "${currentSection}" at line ${i}`);
        }
    }

    // Extract exclusions using dedicated function
    data.exclusions.criteria = extractExclusions(text);
    console.log('Extracted exclusions:', JSON.stringify(data.exclusions.criteria, null, 2));

    // Process other sections
    if (text.toLowerCase().includes('eligibility:')) {
        const eligibilityLines = text
            .split(/eligibility:/i)[1]
            .split(/\n\s*\n/)[0]
            .split('\n')
            .map(cleanText)
            .filter(Boolean);
        data.eligibility = eligibilityLines;
    }

    // Extract treatment
    data.treatment = extractTreatment(text);

    // Process tests section
    const testSection = text.match(/tests:(.+?)(?=\n\s*\n[A-Z]|$)/is);
    if (testSection) {
        const testLines = testSection[1].split('\n');
        testLines.forEach(line => {
            const cleanLine = cleanText(line);
            if (cleanLine.toLowerCase().includes('baseline') || cleanLine.toLowerCase().includes('prior to')) {
                data.tests.baseline.push(cleanLine);
            } else if (cleanLine.toLowerCase().includes('monitor') || cleanLine.toLowerCase().includes('during')) {
                data.tests.monitoring.push(cleanLine);
            }
        });
    }

    // Extract tumour group
    const tumourGroupMatch = text.match(/Tumour Group:\s*([^\n]+)/);
    if (tumourGroupMatch) {
        const group = tumourGroupMatch[1].trim();
        if (group === 'LeukemiaBMT') {
            data.tumour_group = 'Leukemia/BMT';
        } else {
            data.tumour_group = TUMOUR_GROUPS[group.substring(0, 3)] || group;
        }
    }

    // Extract treatment intent
    if (text.toLowerCase().includes('palliative')) {
        data.treatment_intent = 'Palliative';
    } else if (text.toLowerCase().includes('curative')) {
        data.treatment_intent = 'Curative';
    } else if (text.toLowerCase().includes('adjuvant')) {
        data.treatment_intent = 'Adjuvant';
    } else if (text.toLowerCase().includes('neoadjuvant')) {
        data.treatment_intent = 'Neoadjuvant';
    }

    return data;
}

// 🛠 Batch upsert to Supabase
async function batchUpsert(records) {
    try {
        const preparedRecords = records.map(record => ({
            ...record,
            eligibility: JSON.stringify(record.eligibility),
            exclusions: JSON.stringify(record.exclusions),
            tests: JSON.stringify(record.tests),
            treatment: JSON.stringify(record.treatment),
            dose_modifications: JSON.stringify(record.dose_modifications),
            precautions: JSON.stringify(record.precautions),
            reference_list: JSON.stringify(record.reference_list),
            dates: JSON.stringify(record.dates)
        }));

        const { error } = await supabase
            .from('protocols')
            .upsert(preparedRecords, { 
                onConflict: 'code'
            });

        if (error) {
            console.error('Error upserting batch:', error.message);
            return false;
        }

        console.log(`Successfully upserted ${records.length} protocols`);
        return true;
    } catch (error) {
        console.error('Exception during batch upsert:', error.message);
        return false;
    }
}

// 🛠 Import protocols from PDF files
async function importProtocols(directoryPath) {
    try {
        // Get only first 4 files for testing
        const files = fs.readdirSync(directoryPath)
            .filter(file => path.extname(file).toLowerCase() === '.pdf')
            .sort()
            .slice();

        console.log(`Processing first 4 PDF files from directory`);
        console.log('This may take a while...\n');
        
        const batch = [];
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            console.log(`Processing ${file}...`);
            
            try {
                const dataBuffer = fs.readFileSync(filePath);
                const pdfData = await pdfParse(dataBuffer);
                
                if (!pdfData || !pdfData.text) {
                    console.warn(`Warning: No text content found in ${file}`);
                    continue;
                }

                console.log(`Extracted ${pdfData.text.length} characters of text`);
                let protocolData = await extractProtocolData(pdfData.text, file);
                
                batch.push(protocolData);
                console.log(`Extracted protocol code: ${protocolData.code}`);
                console.log(`Tumour group: ${protocolData.tumour_group}`);
                console.log(`Cancer site: ${protocolData.cancer_site}`);
                console.log(`Treatment intent: ${protocolData.treatment_intent}`);
                console.log('---');
                // Log exclusions content for debugging
                if (protocolData.exclusions && protocolData.exclusions.criteria) {
                    console.log('Exclusions section content:', JSON.stringify(protocolData.exclusions.criteria, null, 2));
                }

            } catch (error) {
                console.error(`Error processing ${file}:`, error.message);
                continue;
            }

            if (batch.length === BATCH_SIZE) {
                console.log(`\nUpserting batch of ${batch.length} protocols...`);
                await batchUpsert(batch);
                batch.length = 0;
            }
        }

        if (batch.length > 0) {
            console.log(`\nUpserting final batch of ${batch.length} protocols...`);
            await batchUpsert(batch);
        }
        console.log('\nImport completed!');
    } catch (error) {
        console.error('Error reading directory:', error.message);
    }
}

// 🛠 Run connection test before starting
async function testSupabaseConnection() {
    try {
        console.log('Testing Supabase connection...');
        
        const { data, error } = await supabase
            .from('protocols')
            .select('id')
            .limit(1);

        if (error) throw error;
        
        console.log('Connection successful!');
        console.log('Database is accessible.');
        
        const testRecord = {
            code: 'TEST123',
            tumour_group: 'Test Group',
            cancer_site: 'Test Site',
            treatment_intent: 'Curative',
            treatment_protocol: 'Test Protocol',
            dates: JSON.stringify({}),
            eligibility: JSON.stringify([]),
            exclusions: JSON.stringify([]),
            tests: JSON.stringify({}),
            treatment: JSON.stringify({
                drugs: [],
                schedule: [],
                duration: '',
                type: 'Other'
            }),
            dose_modifications: JSON.stringify({}),
            precautions: JSON.stringify([]),
            reference_list: JSON.stringify([])
        };

        const { error: insertError } = await supabase.from('protocols').insert(testRecord);
        if (insertError) throw new Error(`Insert error: ${insertError.message}\nDetails: ${JSON.stringify(insertError.details)}`);
        console.log('Test record inserted successfully');

    } catch (error) {
        console.error('Connection test failed:', error.message);
        process.exit(1);
    } finally {
        await supabase.from('protocols').delete().eq('code', 'TEST123');
    }
}

// Start the import process
testSupabaseConnection().then(() => {
    importProtocols(path.join(__dirname, 'PDF', 'protocols')).catch(console.error);
});
