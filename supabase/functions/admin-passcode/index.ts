// Passcode login for admin.html.
//
// POST { passcode } -> { token, data }   token keeps the page signed in
// POST { token }    -> { data }          admin_overview_data()
// POST { token, resetPassword: { userId, password } } -> { ok }
//                    sets a new 6-digit password for one user (accounts
//                    made with a username have no email to reset with)
//
// The passcode lives in the secret ADMIN_PASSCODE (never in the repo).
// Tokens are HMAC-signed with a key derived from the passcode and the
// service role key, so changing the passcode signs every browser out.
// Wrong passcodes are recorded in public.admin_passcode_failures: 5 per IP
// per hour, or 30 in total per hour, and further tries are refused.
// Deploy with --no-verify-jwt (the page has no Supabase login).

const TOKEN_DAYS = 365;
const FAILS_PER_IP = 5;
const FAILS_TOTAL = 30;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const env = (name: string) => Deno.env.get(name) || "";
const encoder = new TextEncoder();

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function rest(path: string, init: RequestInit = {}) {
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  return fetch(`${env("SUPABASE_URL")}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(`${env("ADMIN_PASSCODE")}:${env("SUPABASE_SERVICE_ROLE_KEY")}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toBase64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(message))));
}

// Compare without leaking how many leading characters match.
function sameText(a: string, b: string) {
  const x = encoder.encode(a);
  const y = encoder.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i += 1) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

async function makeToken() {
  const expires = Date.now() + TOKEN_DAYS * 86400_000;
  return `${expires}.${await hmac(`admin:${expires}`)}`;
}

async function tokenValid(token: string) {
  const [expires, signature] = token.split(".");
  if (!/^\d{10,16}$/.test(expires || "") || !signature) return false;
  if (Number(expires) < Date.now()) return false;
  return sameText(signature, await hmac(`admin:${expires}`));
}

function clientIp(request: Request) {
  return (request.headers.get("x-forwarded-for") || "").split(",")[0].trim().slice(0, 64);
}

async function countFailures(filter: string) {
  const since = new Date(Date.now() - 3600_000).toISOString();
  const response = await rest(`admin_passcode_failures?select=id&created_at=gte.${encodeURIComponent(since)}${filter}`, {
    headers: { Prefer: "count=exact", Range: "0-0" },
  });
  const range = response.headers.get("content-range") || "";
  return Number(range.split("/")[1]) || 0;
}

async function overview() {
  const response = await rest("rpc/admin_overview_data", { method: "POST", body: "{}" });
  if (!response.ok) throw new Error(`admin_overview_data ${response.status}`);
  return response.json();
}

async function resetPassword(input: { userId?: unknown; password?: unknown }) {
  const userId = String(input?.userId ?? "");
  const password = String(input?.password ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(userId)) return jsonResponse({ error: "bad_user" }, 400);
  if (!/^\d{6}$/.test(password)) return jsonResponse({ error: "bad_password" }, 400);
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  const response = await fetch(`${env("SUPABASE_URL")}/auth/v1/admin/users/${userId}`, {
    method: "PUT",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (response.status === 404) return jsonResponse({ error: "no_user" }, 404);
  if (!response.ok) {
    console.error("reset password", response.status, await response.text().catch(() => ""));
    return jsonResponse({ error: "reset_failed" }, 500);
  }
  return jsonResponse({ ok: true });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);
  if (!env("ADMIN_PASSCODE")) return jsonResponse({ error: "not_configured" }, 500);

  try {
    const body = await request.json().catch(() => ({}));

    if (typeof body.token === "string") {
      if (!(await tokenValid(body.token))) return jsonResponse({ error: "signed_out" }, 401);
      if (body.resetPassword) return await resetPassword(body.resetPassword);
      return jsonResponse({ data: await overview() });
    }

    const ip = clientIp(request);
    if (
      (await countFailures(`&ip=eq.${encodeURIComponent(ip)}`)) >= FAILS_PER_IP ||
      (await countFailures("")) >= FAILS_TOTAL
    ) {
      return jsonResponse({ error: "locked" }, 429);
    }

    const passcode = String(body.passcode ?? "").slice(0, 200);
    if (!sameText(passcode, env("ADMIN_PASSCODE"))) {
      await rest("admin_passcode_failures", { method: "POST", body: JSON.stringify({ ip }) });
      return jsonResponse({ error: "wrong_passcode" }, 401);
    }
    return jsonResponse({ token: await makeToken(), data: await overview() });
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "server_error" }, 500);
  }
});
