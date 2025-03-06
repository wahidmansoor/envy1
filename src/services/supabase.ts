import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export const createCancerScreeningTable = async () => {
  const { data, error } = await supabase.rpc('create_cancer_screening_table');
  if (error) {
    console.error('Error creating table:', error);
    throw error;
  }
  console.log('Table created successfully:', data);
};

export const insertScreeningGuidelines = async (guidelines: any[]) => {
  const { data, error } = await supabase.from('cancer_screening_guidelines').insert(guidelines);
  if (error) {
    console.error('Error inserting guidelines:', error);
    throw error;
  }
  console.log('Guidelines inserted successfully:', data);
};

export const fetchScreeningGuidelines = async () => {
  const { data, error } = await supabase.from('cancer_screening_guidelines').select('*');
  if (error) {
    console.error('Error fetching guidelines:', error);
    throw error;
  }
  return data;
};