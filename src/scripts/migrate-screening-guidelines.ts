import { screeningGuidelines } from '../components/opd/CancerScreening';
import { createCancerScreeningTable, insertScreeningGuidelines } from '../services/supabase';

async function migrateData() {
  try {
    await createCancerScreeningTable();
    await insertScreeningGuidelines(screeningGuidelines);
    console.log('Data migration to Supabase completed successfully!');
  } catch (error:any) {
    console.error('Data migration failed:', error);
  }
}

migrateData();