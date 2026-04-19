import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "⚠️ Supabase credentials are missing! Check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API base URL — reads from env, no more hardcoded localhost
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';