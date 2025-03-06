import { supabase } from '../../lib/supabase';
import type { Protocol } from '../../types/protocol';

export async function getProtocols() {
  const { data, error } = await supabase
    .from('protocols')
    .select('*');
  
  if (error) throw error;
  return data as Protocol[];
}

export async function getProtocolByCode(code: string) {
  const { data, error } = await supabase
    .from('protocols')
    .select('*')
    .eq('code', code)
    .single();
  
  if (error) throw error;
  return data as Protocol;
}
