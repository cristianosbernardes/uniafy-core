import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://otbvjbfsogvbnevdtkgf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90YnZqYmZzb2d2Ym5ldmR0a2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMzg4NTAsImV4cCI6MjA4MzgxNDg1MH0.cAt0mbT4ZoY0o5JWOW9bO_E9ZP98TCji2XeVEYSWk64';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
