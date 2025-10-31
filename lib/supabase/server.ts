import { createClient } from '@supabase/supabase-js';

export const supabaseServer = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_KEY;
    if (!url || !anon) {
    throw new Error('Missing SUPABASE_URL/SUPABASE_KEY (or NEXT_PUBLIC_ equivalents)');
  }
  return createClient(url, anon);
};

export default supabaseServer;
