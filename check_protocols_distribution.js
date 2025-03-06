import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pgbqawjatdatnoudfriu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYnFhd2phdGRhdG5vdWRmcml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNDk1MTksImV4cCI6MjA1NDkyNTUxOX0.Q2TcYivfDWnrfxE_9uRfjJfavhHLuZMn2zrbi_DG6Z0';

async function checkProtocolsDistribution() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Checking protocols distribution...\n');

    // Get all protocols
    const { data: protocols, error } = await supabase
      .from('protocols')
      .select('code, tumour_group, cancer_site');

    if (error) {
      throw new Error(`Error fetching protocols: ${error.message}`);
    }

    console.log(`Total protocols found: ${protocols.length}\n`);

    // Check tumor group distribution
    const tumorGroups = {};
    protocols.forEach(protocol => {
      if (protocol.tumour_group) {
        tumorGroups[protocol.tumour_group] = (tumorGroups[protocol.tumour_group] || 0) + 1;
      }
    });

    console.log('Tumor Group Distribution:');
    Object.entries(tumorGroups)
      .sort(([,a], [,b]) => b - a)
      .forEach(([group, count]) => {
        console.log(`${group}: ${count} protocols`);
      });

    // Check for empty or null values
    const emptyTumorGroups = protocols.filter(p => !p.tumour_group || p.tumour_group === '').length;
    const emptyCancerSites = protocols.filter(p => !p.cancer_site || p.cancer_site === '').length;

    console.log('\nData Quality Check:');
    console.log(`Protocols with empty tumor groups: ${emptyTumorGroups}`);
    console.log(`Protocols with empty cancer sites: ${emptyCancerSites}`);

    // Check for duplicate codes
    const codeCounts = {};
    protocols.forEach(protocol => {
      if (protocol.code) {
        codeCounts[protocol.code] = (codeCounts[protocol.code] || 0) + 1;
      }
    });

    const duplicates = Object.entries(codeCounts)
      .filter(([,count]) => count > 1);

    if (duplicates.length > 0) {
      console.log('\nDuplicate Protocol Codes:');
      duplicates.forEach(([code, count]) => {
        console.log(`${code}: ${count} occurrences`);
      });
    } else {
      console.log('\nNo duplicate protocol codes found');
    }

  } catch (error) {
    console.error('Check failed:', error);
  }
}

checkProtocolsDistribution().catch(console.error);