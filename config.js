// Public runtime config, committed so the live site can reach Supabase.
//
// Everything here is safe to ship to browsers:
// - The anon key only carries the `anon` role. Data access is enforced by
//   Row Level Security in supabase/schema.sql (auth.uid() = user_id).
// - Never put a service_role key or any other secret in this file.
//
// For local overrides (for example a Google Books API key), use
// config.local.js, which is Git-ignored and only loaded on localhost.
window.BROOKE_SUPABASE_URL = "https://oipsefmckxyojnntiaax.supabase.co";
window.BROOKE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcHNlZm1ja3h5b2pubnRpYWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMDk2ODQsImV4cCI6MjEwMjg4NTY4NH0.fDcKebJP8jKEg7eyOng0NkBjpaNB4kvTKUd1tPSlUfU";
window.BROOKE_SUPABASE_FUNCTIONS_URL = "https://oipsefmckxyojnntiaax.supabase.co/functions/v1";
