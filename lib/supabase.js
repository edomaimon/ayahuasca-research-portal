import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Public client — safe for client-side reads.
 * Uses the anon key (row-level security enforced).
 */
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || supabaseServiceKey,
  { auth: { persistSession: false } }
);

/**
 * Service client — for server-side operations only.
 * Bypasses RLS. Never expose to the browser.
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  { auth: { persistSession: false } }
);
