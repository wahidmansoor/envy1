import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3003,
  supabase: {
    url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    key: process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY
  }
};
