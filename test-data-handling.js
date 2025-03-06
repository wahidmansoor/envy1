import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pgbqawjatdatnoudfriu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYnFhd2phdGRhdG5vdWRmcml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNDk1MTksImV4cCI6MjA1NDkyNTUxOX0.Q2TcYivfDWnrfxE_9uRfjJfavhHLuZMn2zrbi_DG6Z0';

async function testDataHandling() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Insert Data
  const { error: insertError } = await supabase
    .from('protocols')
    .insert([{
      code: 'TEST002',
      tumour_group: 'Test Group',
      cancer_site: 'Test Site',
      treatment_intent: 'Test Intent',
      eligibility: JSON.stringify(['Patient must be 18+']),  // Array for eligibility
      exclusions: JSON.stringify({ comorbidities: ['heart disease'] }),  // Object for exclusions
      tests: JSON.stringify({ baseline: ['CBC'], monitoring: ['LFT'] }),
      treatment: JSON.stringify({
        drugs: [{ name: 'DOXORubicin', dose: '60 mg/m²' }],
        schedule: ['Day 1, 8, 15'],
        duration: '6 weeks'
      }),
      dose_modifications: JSON.stringify({
        hematological: ['Reduce dose if ANC < 1.0'],
        nonHematological: ['Reduce dose if creatinine > 2.0']
      }),
      precautions: JSON.stringify(['Monitor LVEF']),
      reference_list: JSON.stringify(['https://example.com'])
    }]);

  if (insertError) {
    console.error('Insertion Error:', insertError.message);
    return;
  }
  console.log('Data inserted successfully.');

  // Extract Data
  const { data, error: fetchError } = await supabase
    .from('protocols')
    .select('id, code, eligibility, exclusions, treatment')
    .eq('code', 'TEST002');

  if (fetchError) {
    console.error('Fetch Error:', fetchError.message);
    return;
  }

  console.log('Extracted Data:', data);

  if (data && data.length > 0) {
    // Validate and extract data
    const eligibility = Array.isArray(data[0].eligibility) ? data[0].eligibility : [];
    const exclusions = typeof data[0].exclusions === 'object' ? data[0].exclusions : {};
    const treatment = typeof data[0].treatment === 'object' ? data[0].treatment : {};

    console.log('Eligibility:', eligibility);
    console.log('Exclusions:', exclusions);
    console.log('Treatment:', treatment);
  } else {
    console.log('No data found.');
  }

  // Clean up test data
  await supabase.from('protocols').delete().eq('code', 'TEST002');
}

testDataHandling().catch(console.error);