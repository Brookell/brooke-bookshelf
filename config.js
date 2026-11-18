// Public runtime config, committed so the live site can reach Supabase.
//
// Everything here is safe to ship to browsers:
// - The anon key only carries the `anon` role. Data access is enforced by
//   Row Level Security in supabase/schema.sql (auth.uid() = user_id).
// - Never put a service_role key or any other secret in this file.
//
// For local overrides (for example a Google Books API key), use
// config.local.js, which is Git-ignored and only loaded on localhost.
//
// Where Supabase is reached:
// - on vercel.app, github.io and localhost: Supabase directly;
// - on our own domain (the Hong Kong server, see deploy/): through
//   https://api.<domain>, which that server relays to Supabase. Mainland
//   China can reach it even when supabase.co is blocked or slow.
(function () {
  var direct = "https://oipsefmckxyojnntiaax.supabase.co";
  var host = location.hostname.replace(/^www\./, "");
  var useDirect = /(^|\.)(vercel\.app|github\.io)$/.test(host)
    || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(host)
    || /(^|\.)localhost$/.test(host)
    || /^\d+\.\d+\.\d+\.\d+$/.test(host)
    || location.protocol === "file:";
  var base = useDirect ? direct : "https://api." + host;
  window.BROOKE_SUPABASE_DIRECT_URL = direct;
  window.BROOKE_SUPABASE_URL = base;
  window.BROOKE_SUPABASE_FUNCTIONS_URL = base + "/functions/v1";
})();
window.BROOKE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcHNlZm1ja3h5b2pubnRpYWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMDk2ODQsImV4cCI6MjEwMjg4NTY4NH0.fDcKebJP8jKEg7eyOng0NkBjpaNB4kvTKUd1tPSlUfU";
