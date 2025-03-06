import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import * as pdfjsLib from 'pdfjs-dist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://pgbqawjatdatnoudfriu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYnFhd2phdGRhdG5vdWRmcml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNDk1MTksImV4cCI6MjA1NDkyNTUxOX0.Q2TcYivfDWnrfxE_9uRfjJfavhHLuZMn2zrbi_DG6Z0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BATCH_SIZE = 100;

// Clean text and standardize format
function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/-?\s*\n\s*/g, ' ')
    .trim();
}

// Extract tumor group from code
function extractTumorGroup(code) {
  const groups = {
    'BRA': 'Breast',
    'GI': 'Gastrointestinal',
    'CNB': 'CNS/Brain',
    'BMT': 'Blood and Marrow',
    'LY': 'Lymphoma',
    'SA': 'Sarcoma',
    'GU': 'Genitourinary'
  };

  for (const [prefix, group] of Object.entries(groups)) {
    if (code.startsWith(prefix)) {
      return group;
    }
  }
  return 'Other';
}

// Extract cancer site based on tumor group and content
function extractCancerSite(tumorGroup, text) {
  const sitePatterns = {
    'Breast': /breast cancer|invasive breast|metastatic breast/i,
    'Gastrointestinal': /colon|rectal|gastric|colorectal|pancreatic|liver/i,
    'CNS/Brain': /brain|glioma|glioblastoma|CNS|meningioma/i,
    'Blood and Marrow': /leukemia|lymphoma|myeloma|stem cell/i,
    'Lymphoma': /lymphoma|hodgkin|non-hodgkin/i,
    'Sarcoma': /sarcoma|soft tissue|bone tumor/i,
    'Genitourinary': /prostate|bladder|kidney|testicular/i
  };

  const pattern = sitePatterns[tumorGroup];
  if (pattern) {
    const match = text.match(pattern);
    if (match) {
      return match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
    }
  }
  return tumorGroup;
}

// Extract treatment intent from text
function extractTreatmentIntent(text) {
  const intents = {
    'Curative Intent': /curative|cure|curable|definitive/i,
    'Palliative Intent': /palliative|palliation|symptom control/i,
    'Neoadjuvant or Adjuvant Therapy': /neoadjuvant|adjuvant|pre-operative|post-operative/i
  };

  for (const [intent, pattern] of Object.entries(intents)) {
    if (pattern.test(text)) {
      return intent;
    }
  }
  return 'Unknown';
}

// Extract eligibility criteria
function extractEligibility(text) {
  const eligibilitySection = text.match(/Eligibility[\s\S]*?(?=Exclusion|Protocol|Treatment)/i);
  if (!eligibilitySection) return [];

  return eligibilitySection[0]
    .split(/[•\-\n]/)
    .map(item => cleanText(item))
    .filter(item => 
      item && 
      !item.toLowerCase().includes('eligibility') && 
      item.length > 10
    );
}

// Extract exclusion criteria
function extractExclusions(text) {
  const exclusionSection = text.match(/Exclusion[\s\S]*?(?=Protocol|Treatment)/i);
  if (!exclusionSection) return [];

  return exclusionSection[0]
    .split(/[•\-\n]/)
    .map(item => cleanText(item))
    .filter(item => 
      item && 
      !item.toLowerCase().includes('exclusion') && 
      item.length > 10
    );
}

// Extract tests
function extractTests(text) {
  const testsSection = text.match(/(?:Required )?Tests(?:\/Investigations)?[\s\S]*?(?=Treatment|Protocol|Dose)/i);
  if (!testsSection) return [];

  return testsSection[0]
    .split(/[•\-\n]/)
    .map(item => cleanText(item))
    .filter(item => 
      item && 
      !item.toLowerCase().includes('test') && 
      item.length > 10
    );
}

// Extract treatment details
function extractTreatment(text) {
  const treatment = {
    drugs: [],
    schedule: [],
    duration: '',
    type: 'Other'
  };

  const drugPatterns = [
    /(?:administer|give|infuse|inject)\s+(\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?)\s*(mg|g|mcg|mg\/m²|units|IU)(?:\/\w+)?\s+(?:of\s+)?([A-Za-z]+(?:\s*[A-Za-z-]+)*)/gi,
    /([A-Za-z]+(?:\s*[A-Za-z-]+)*)\s+(\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?)\s*(mg|g|mcg|mg\/m²|units|IU)(?:\/\w+)?/gi
  ];

  drugPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const [_, dose1, dose2, drugName] = match;
      const drug = {
        name: drugName.trim(),
        dose: `${dose1} ${dose2}`.trim(),
        administration: ''
      };

      // Look for administration details in nearby text
      const administrationMatch = text.slice(match.index, match.index + 200)
        .match(/(?:given|administered|infused)\s+([^\.;]+)/i);
      if (administrationMatch) {
        drug.administration = cleanText(administrationMatch[1]);
      }

      treatment.drugs.push(drug);
    }
  });

  // Remove duplicates
  treatment.drugs = Array.from(
    new Map(treatment.drugs.map(drug => [drug.name.toLowerCase(), drug])).values()
  );

  treatment.type = treatment.drugs.length > 0 ? 'Chemotherapy' : 'Other';

  return treatment;
}

// Extract dose modifications
function extractDoseModifications(text) {
  const doseSection = text.match(/Dose\s+(?:Modification|Adjustment|Reduction)[\s\S]*?(?=References|$)/i);
  if (!doseSection) return {};

  const modifications = {};
  const sections = doseSection[0].split(/(?=Hematologic|Non-Hematologic|Renal|Hepatic)/i);

  sections.forEach(section => {
    const titleMatch = section.match(/^(Hematologic|Non-Hematologic|Renal|Hepatic)/i);
    if (titleMatch) {
      const title = titleMatch[1];
      modifications[title] = section
        .split(/[•\-\n]/)
        .map(item => cleanText(item))
        .filter(item => 
          item && 
          !item.includes(title) && 
          item.length > 10
        );
    }
  });

  return modifications;
}

// Extract precautions
function extractPrecautions(text) {
  const precautionSection = text.match(/(?:Precautions?|Warning|Caution)[\s\S]*?(?=References|$)/i);
  if (!precautionSection) return [];

  return precautionSection[0]
    .split(/[•\-\n]/)
    .map(item => cleanText(item))
    .filter(item => 
      item && 
      !item.toLowerCase().includes('precaution') && 
      !item.toLowerCase().includes('warning') && 
      item.length > 10
    );
}

// Extract protocol data from PDF text
async function extractProtocolData(text, filename) {
  const code = filename.split('_')[0];
  const tumorGroup = extractTumorGroup(code);
  const cancerSite = extractCancerSite(tumorGroup, text);
  const treatmentIntent = extractTreatmentIntent(text);

  const data = {
    code,
    tumour_group: tumorGroup,
    cancer_site: cancerSite,
    treatment_intent: treatmentIntent,
    eligibility: extractEligibility(text),
    exclusions: extractExclusions(text),
    tests: extractTests(text),
    treatment: extractTreatment(text),
    dose_modifications: extractDoseModifications(text),
    precautions: extractPrecautions(text),
    reference_list: []  // References can be added later if needed
  };

  return data;
}

// Robust PDF Parsing with pdfjs-dist
async function parsePDF(filePath) {
  try {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf = await pdfjsLib.getDocument({
      data,
      standardFontDataUrl: path.join(__dirname, 'standard_fonts'),
      disableFontFace: true
    }).promise;

    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      text += pageText + '\n';
    }

    return text;
  } catch (error) {
    if (error.message.includes('TT: undefined function: 32')) {
      console.warn(`Suppressed font warning for ${filePath}`);
    } else {
      console.warn(`Warning parsing PDF ${filePath}:`, error.message);
    }
    return '';
  }
}

// Batch upsert to Supabase
async function batchUpsert(records) {
  try {
    const { error } = await supabase
      .from('protocols')
      .upsert(records, { onConflict: 'code' });

    if (error) console.error('Error upserting batch:', error.message);
    else console.log(`Successfully upserted ${records.length} protocols`);
  } catch (error) {
    console.error('Exception during batch upsert:', error.message);
  }
}

// Import protocols from PDF files
async function importProtocols(directoryPath) {
     let processedCount = 0; // Counter for processed files
  try {
    const files = fs.readdirSync(directoryPath)
      .filter(file => path.extname(file).toLowerCase() === '.pdf');

    console.log(`Found ${files.length} PDF files in directory`);

    const batch = [];
    for (const file of files) {
             processedCount++;
      const filePath = path.join(directoryPath, file);
      const pdfText = await parsePDF(filePath);
      const protocolData = await extractProtocolData(pdfText, file);
             console.log(`Processed file ${processedCount} of ${files.length}: ${file}`); // Log progress

      batch.push(protocolData);

      if (batch.length === BATCH_SIZE) {
        await batchUpsert(batch);
        batch.length = 0;
      }
    }

    if (batch.length > 0) await batchUpsert(batch);
    console.log('Import completed!');
  } catch (error) {
    console.error('Error reading directory:', error.message);
  }
}

// Test Supabase connection before starting
async function testSupabaseConnection() {
  try {
    const { error } = await supabase.from('protocols').select('*').limit(1);
    if (error) throw error;
    console.log('Supabase connection successful!');
  } catch (error) {
    console.error('Supabase connection failed:', error.message);
    process.exit(1);
  }
}

testSupabaseConnection().then(() => {
  importProtocols(path.join(__dirname, 'PDF', 'protocols')).catch(console.error);
});
