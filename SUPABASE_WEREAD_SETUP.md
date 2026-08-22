# WeRead + Supabase Setup

This project includes the first WeRead sync flow:

1. User enters a WeRead API Key in the frontend.
2. Frontend calls `sync-weread-shelf`.
3. The Supabase Edge Function calls WeRead Agent API Gateway `/shelf/sync`.
4. The function returns normalized books to the frontend.
5. If the request includes a Supabase user JWT and service role secrets are configured, the function also upserts rows into `public.user_books`.

## Database

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor.

## Deploy Function

For the current no-login prototype, deploy without JWT verification:

```bash
supabase functions deploy sync-weread-shelf --project-ref oipsefmckxyojnntiaax --no-verify-jwt
```

Current deployment status: deployed to `oipsefmckxyojnntiaax` on 2026-08-22.

When Supabase Auth is added, remove `--no-verify-jwt` and send the user's access token from the frontend.

## Local Config

`config.local.js` should include:

```js
window.BROOKE_SUPABASE_FUNCTIONS_URL = "https://oipsefmckxyojnntiaax.supabase.co/functions/v1";
```

Do not commit `config.local.js`; it is ignored by Git.
