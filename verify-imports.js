import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pgbqawjatdatnoudfriu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYnFhd2phdGRhdG5vdWRmcml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNDk1MTksImV4cCI6MjA1NDkyNTUxOX0.Q2TcYivfDWnrfxE_9uRfjJfavhHLuZMn2zrbi_DG6Z0';

async function verifyImports() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Starting verification...');

    // Get counts from both tables
    const [protocolsResult, regimensResult] = await Promise.all([
      supabase.from('protocols').select('code, tumour_group', { count: 'exact' }),
      supabase.from('regimens').select('code, tumour_group', { count: 'exact' })
    ]);

    console.log('\nCounts:');
    console.log('Protocols:', protocolsResult.count);
    console.log('Regimens:', regimensResult.count);

    // Get tumor group distribution in protocols
    const { data: protocolGroups } = await supabase
      .from('protocols')
      .select('tumour_group')
      .not('tumour_group', 'eq', 'Unknown');

    const groupCounts = protocolGroups.reduce((acc, { tumour_group }) => {
      acc[tumour_group] = (acc[tumour_group] || 0) + 1;
      return acc;
    }, {});

    console.log('\nTumor Group Distribution:');
    Object.entries(groupCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([group, count]) => {
        console.log(`${group}: ${count} protocols`);
      });

    // Sample a few protocols to verify content
    const { data: sampleProtocols } = await supabase
      .from('protocols')
      .select('code, treatment')
      .not('treatment', 'eq', '{}')
      .limit(5);

    console.log('\nSample Protocols with Treatments:');
    sampleProtocols.forEach(protocol => {
      console.log(`\n${protocol.code}:`);
      console.log(JSON.stringify(protocol.treatment, null, 2));
    });

  } catch (error) {
    console.error('Verification failed:', error);
  }
}

verifyImports().catch(console.error);