import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pgbqawjatdatnoudfriu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYnFhd2phdGRhdG5vdWRmcml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNDk1MTksImV4cCI6MjA1NDkyNTUxOX0.Q2TcYivfDWnrfxE_9uRfjJfavhHLuZMn2zrbi_DG6Z0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function cleanDrugList(drugs) {
  // Remove duplicates and standardize drug names
  const uniqueDrugs = new Set();
  return drugs
    .filter(drug => drug.name)
    .map(drug => ({
      ...drug,
      name: drug.name.charAt(0).toUpperCase() + drug.name.slice(1).toLowerCase()
    }))
    .filter(drug => {
      const key = drug.name;
      if (uniqueDrugs.has(key)) return false;
      uniqueDrugs.add(key);
      return true;
    });
}

async function fixTreatmentData() {
  try {
    console.log('Starting treatment data cleanup...');

    // Get all protocols
    const { data: protocols, error: fetchError } = await supabase
      .from('protocols')
      .select('id, code, treatment');

    if (fetchError) throw fetchError;
    console.log(`Found ${protocols.length} protocols to process`);

    let updated = 0;
    for (const protocol of protocols) {
      let treatment = typeof protocol.treatment === 'string' 
        ? JSON.parse(protocol.treatment)
        : protocol.treatment;

      // Clean up the treatment data
      treatment = {
        ...treatment,
        drugs: cleanDrugList(treatment.drugs || []),
        type: treatment.drugs?.length > 0 ? 'Chemotherapy' : 'Other',
        schedule: treatment.schedule || [],
        duration: treatment.duration || ''
      };

      // Update both tables
      const { error: updateError } = await supabase
        .from('protocols')
        .update({ treatment })
        .eq('id', protocol.id);

      if (updateError) {
        console.error(`Error updating protocol ${protocol.code}:`, updateError);
        continue;
      }

      const { error: regimenError } = await supabase
        .from('regimens')
        .update({ treatment })
        .eq('code', protocol.code);

      if (regimenError) {
        console.error(`Error updating regimen ${protocol.code}:`, regimenError);
        continue;
      }

      updated++;
      if (updated % 50 === 0) {
        console.log(`Processed ${updated} protocols...`);
      }
    }

    console.log(`\nCompleted! Updated ${updated} protocols`);
    
  } catch (error) {
    console.error('Failed to fix treatment data:', error);
  }
}

fixTreatmentData().catch(console.error);