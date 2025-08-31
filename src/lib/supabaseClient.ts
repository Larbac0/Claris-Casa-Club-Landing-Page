import { createClient } from '@supabase/supabase-js';

// Use VITE_ environment variables injected by Vite. This keeps credentials out of source.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
	// eslint-disable-next-line no-console
	console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment. Supabase client may fail.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);