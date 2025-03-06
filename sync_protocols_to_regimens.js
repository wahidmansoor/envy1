import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pgbqawjatdatnoudfriu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYnFhd2phdGRhdG5vdWRmcml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNDk1MTksImV4cCI6MjA1NDkyNTUxOX0.Q2TcYivfDWnrfxE_9uRfjJfavhHLuZMn2zrbi_DG6Z0';

async function syncProtocolsToRegimens() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Starting sync process...');

    // Fetch all protocols
    const { data: protocols, error: fetchError } = await supabase
      .from('protocols')
      .select('code, tumour_group, cancer_site, treatment_intent, eligibility, exclusions, tests, treatment, dose_modifications, precautions, reference_list');

    if (fetchError) {
      throw new Error(`Error fetching protocols: ${fetchError.message}`);
    }

    console.log(`Found ${protocols?.length || 0} protocols to sync`);

    if (!protocols || protocols.length === 0) {
      console.log('No protocols found to sync');
      return;
    }

    // First clear the regimens table
    const { error: clearError } = await supabase
      .from('regimens')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy condition to delete all

    if (clearError) {
      throw new Error(`Error clearing regimens: ${clearError.message}`);
    }

    // Insert protocols into regimens table
    const { error: insertError } = await supabase
      .from('regimens')
      .insert(
        protocols.map(protocol => ({
          ...protocol,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
      );

    if (insertError) {
      throw new Error(`Error syncing to regimens: ${insertError.message}`);
    }

    console.log('Successfully synced protocols to regimens table');

  } catch (error) {
    console.error('Sync failed:', error);
  }
}

syncProtocolsToRegimens().catch(console.error);