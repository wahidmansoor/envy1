import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

if (!config.supabase.url || !config.supabase.key) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(config.supabase.url, config.supabase.key);
