import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import config from './config.js';
import { extractTextFromPDF } from './robust_pdf_parser.js';

// Configure Node.js environment
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(config.supabase.url, config.supabase.anonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Common tumor groups/sites mappings based on protocol codes
const protocolCodeMappings = {
  // BC Cancer protocol codes
  'BRAV': { tumorGroup: 'Breast', cancerSite: 'Breast - Metastatic' },
  'BRAJ': { tumorGroup: 'Breast', cancerSite: 'Breast - Adjuvant' },
  'LUSCPE': { tumorGroup: 'Lung', cancerSite: 'Lung - Small Cell' },
  'LUAVPE': { tumorGroup: 'Lung', cancerSite: 'Lung - Non-Small Cell' },
  'GIENDO': { tumorGroup: 'GI', cancerSite: 'Neuroendocrine' },
  'GIGAJPOX': { tumorGroup: 'GI', cancerSite: 'Gastrointestinal' },
  'GIAJFFOX': { tumorGroup: 'GI', cancerSite: 'Colorectal' },
  'CNTORI': { tumorGroup: 'Neuro-Oncology', cancerSite: 'CNS' },
  'HNOSNAC': { tumorGroup: 'Head & Neck', cancerSite: 'Head & Neck' },
  'GOUAJPEM': { tumorGroup: 'Genitourinary', cancerSite: 'Urothelial' },
  'LYMRIT': { tumorGroup: 'Lymphoma', cancerSite: 'Non-Hodgkin Lymphoma' },
  'BMT': { tumorGroup: 'Leukemia/BMT', cancerSite: 'Bone Marrow Transplantation' }
};

/**
 * Extract tumor group and cancer site from PDF text using multiple strategies
 */
function extractTumorGroupAndCancerSite(text, filename) {
  const result = {
    tumorGroup: null,
    cancerSite: null
  };
  
  // Strategy 1: Check protocol code prefix against known mappings
  const code = filename.split('_')[0];
  const prefix = code.slice(0, 4); // Get first 4 characters of code
  
  if (protocolCodeMappings[prefix]) {
    result.tumorGroup = protocolCodeMappings[prefix].tumorGroup;
    result.cancerSite = protocolCodeMappings[prefix].cancerSite;
  }
  
  // Strategy 2: Look for "BC Cancer Protocol Summary for" pattern
  const protocolSummaryMatch = text.match(
    /BC Cancer Protocol Summary(?:\s+for)?\s+([^:]+?)(?:Protocol|Page|with|for|treatment|\d|$)/i
  );
  
  if (protocolSummaryMatch && protocolSummaryMatch[1]) {
    result.cancerSite = protocolSummaryMatch[1].trim();
    
    // Infer tumor group from cancer site
    if (result.cancerSite.toLowerCase().includes('breast')) {
      result.tumorGroup = 'Breast';
    } else if (result.cancerSite.toLowerCase().includes('lung')) {
      result.tumorGroup = 'Lung';
    } else if (/colon|rectal|colorectal|gastric|stomach|pancrea/i.test(result.cancerSite)) {
      result.tumorGroup = 'GI';
    } else if (/lymphoma|hodgkin/i.test(result.cancerSite)) {
      result.tumorGroup = 'Lymphoma';
    }
  }
  
  // Strategy 3: Look for explicit "Tumour Group:" pattern
  const tumorGroupMatch = text.match(/Tumou?r Group\s*[:=]\s*([^\n]+)/i);
  if (tumorGroupMatch && tumorGroupMatch[1]) {
    result.tumorGroup = tumorGroupMatch[1].trim();
  }
  
  // Strategy 4: Look for explicit "Cancer Site:" pattern
  const cancerSiteMatch = text.match(/(?:Cancer\s+Site|Diagnosis|Indication)\s*[:=]\s*([^\n]+)/i);
  if (cancerSiteMatch && cancerSiteMatch[1]) {
    result.cancerSite = cancerSiteMatch[1].trim();
  }
  
  // Strategy 5: BC Cancer-specific pattern
  const bcCancerMatch = text.match(/BC Cancer Protocol Summary\s+([A-Z]+)/i);
  if (bcCancerMatch && bcCancerMatch[1]) {
    const protocolCode = bcCancerMatch[1].trim();
    
    // Set BC Cancer as default tumor group if nothing else is found
    if (!result.tumorGroup) {
      result.tumorGroup = 'BC Cancer';
    }
    
    // Try to infer from protocol code
    if (protocolCode.startsWith('BR')) {
      result.tumorGroup = 'Breast';
      if (!result.cancerSite) {
        result.cancerSite = protocolCode.includes('AJ') ? 'Breast - Adjuvant' : 'Breast';
      }
    }
  }
  
  // Clean up values
  if (result.tumorGroup) {
    result.tumorGroup = result.tumorGroup.replace(/\s+/g, ' ').trim();
  }
  
  if (result.cancerSite) {
    result.cancerSite = result.cancerSite.replace(/\s+/g, ' ').trim();
  }
  
  return result;
}

/**
 * Fix unknown tumor_group and cancer_site in the database
 */
async function fixUnknownFields() {
  const startTime = new Date();
  console.log('Checking for records with unknown fields...');
  
  const { data: records, error } = await supabase
    .from('protocols')
    .select('id, code, tumour_group, cancer_site, treatment_protocol')
    .or('tumour_group.eq.Unknown', 'cancer_site.eq.Unknown');
  
  if (error) {
    console.error('Error fetching records:', error.message);
    return;
  }
  
  console.log(`Found ${records.length} records with unknown fields`);
  console.log(`Starting update process...`);
  const pdfDirectory = path.join(__dirname, config.import.pdfDirectory || 'PDF/protocols');
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (const record of records) {
    const pdfFilename = `${record.code}_Protocol.pdf`;
    const pdfPath = path.join(pdfDirectory, pdfFilename);
    
    console.log(`Processing ${pdfFilename}...`);
    
    if (!fs.existsSync(pdfPath)) {
      console.warn(`PDF file not found: ${pdfPath}`);
      skippedCount++;
      continue;
    }
    
    try {
      // Extract text using robust PDF parser
      const text = await extractTextFromPDF(pdfPath);
      
      if (!text || text.length < 100) {
        console.warn(`Insufficient text extracted from ${pdfFilename}`);
        skippedCount++;
        continue;
      }
      
      // Extract tumor group and cancer site
      const { tumorGroup, cancerSite } = extractTumorGroupAndCancerSite(text, pdfFilename);
      
      const updates = {};
      
      if (tumorGroup && record.tumour_group === 'Unknown') {
        updates.tumour_group = tumorGroup;
      }
      
      if (cancerSite && record.cancer_site === 'Unknown') {
        updates.cancer_site = cancerSite;
      }
      
      if (Object.keys(updates).length > 0) {
        // Update the record
        const { error: updateError } = await supabase
          .from('protocols')
          .update(updates)
          .eq('id', record.id);
        
        if (updateError) {
          console.error(`Error updating record ${record.id}:`, updateError.message);
        } else {
          console.log(`Updated record ${record.id}:`, updates);
          updatedCount++;
        }
      } else {
        console.log(`No new information found for ${pdfFilename}`);
        skippedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${pdfFilename}:`, error.message);
      skippedCount++;
    }
  }
  
  const endTime = new Date();
  console.log('\n--- Summary ---');
  console.log(`Total records processed: ${records.length}`);
  console.log(`Updated: ${updatedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Total time: ${endTime - startTime}ms`);
}

// Run the fix
fixUnknownFields()
  .then(() => {
    console.log('Completed fixing unknown fields');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error running fix:', error);
    process.exit(1);
  });
