// Book search and book details for signed-in users.
//
// POST { query, limit }  -> { results: SearchResult[] }
// POST { bookId }        -> { info: BookInfo | null }   (WeRead /book/info)
// POST { coverColor: url } -> { color: "#rrggbb" | null } (cover's main colour)
//
// Tries WeRead's /store/search first (good Chinese coverage and covers), then
// falls back to Google Books. Both upstream keys live in Supabase secrets:
//   WEREAD_API_KEY        (required for WeRead; the site owner's personal key)
//   GOOGLE_BOOKS_API_KEY  (optional; keyless Google is heavily rate limited)
//   WEREAD_SKILL_VERSION  (optional; starting version, see callGateway)
//
// Because WEREAD_API_KEY belongs to one person's account, every search is:
// - only allowed for signed-in users (JWT verified by the gateway + /auth/v1/user)
// - rate limited per user (RATE_LIMIT_PER_HOUR upstream calls)
// - cached by query for CACHE_TTL_HOURS so repeats never hit WeRead again

import { decode } from "https://deno.land/x/imagescript@1.2.17/mod.ts";

const WEREAD_GATEWAY_URL = "https://i.weread.qq.com/api/agent/gateway";
// Must match the `version` in tencent/wechatreading skills/SKILL.md; the
// gateway refuses older versions with an upgrade_info message.
const INITIAL_SKILL_VERSION = Deno.env.get("WEREAD_SKILL_VERSION") || "1.0.6";
const MAX_LIMIT = 12;
// Enough for a user to fill intros for a few dozen saved books in one go.
const RATE_LIMIT_PER_HOUR = 120;
const CACHE_TTL_HOURS = 24 * 7;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type SearchResult = {
  id: string;
  source: "weread" | "google";
  title: string;
  author: string;
  cover: string;
  description: string;
  publishedDate: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

const env = (name: string) => Deno.env.get(name) || "";

async function getUserId(request: Request) {
  const authorization = request.headers.get("Authorization");
  if (!authorization) return null;
  const response = await fetch(`${env("SUPABASE_URL")}/auth/v1/user`, {
    headers: { Authorization: authorization, apikey: env("SUPABASE_ANON_KEY") },
  });
  if (!response.ok) return null;
  const user = await response.json();
  return typeof user.id === "string" ? user.id : null;
}

// Minimal PostgREST helper using the service role (tables have RLS on and no
// policies, so only this function can touch them).
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

// deno-lint-ignore no-explicit-any
async function readCache(cacheKey: string): Promise<any | null> {
  const since = new Date(Date.now() - CACHE_TTL_HOURS * 3600_000).toISOString();
  const response = await rest(
    `book_search_cache?select=results&query_key=eq.${encodeURIComponent(cacheKey)}&created_at=gte.${encodeURIComponent(since)}`,
  );
  if (!response.ok) return null;
  const rows = await response.json();
  return rows[0]?.results ?? null;
}

// deno-lint-ignore no-explicit-any
async function writeCache(cacheKey: string, results: any) {
  await rest("book_search_cache?on_conflict=query_key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({ query_key: cacheKey, results, created_at: new Date().toISOString() }),
  });
}

async function overRateLimit(userId: string) {
  const since = new Date(Date.now() - 3600_000).toISOString();
  const response = await rest(
    `book_search_log?select=id&user_id=eq.${userId}&created_at=gte.${encodeURIComponent(since)}`,
    { headers: { Prefer: "count=exact", Range: "0-0" } },
  );
  const total = Number(response.headers.get("content-range")?.split("/")[1] || 0);
  return total >= RATE_LIMIT_PER_HOUR;
}

async function logSearch(userId: string, query: string, source: string) {
  await rest("book_search_log", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, query, source }),
  });
}

function largerWereadCover(url: string) {
  // WeRead serves sizes by prefix: s_ (small) … t9_ (large).
  return url.replace(/\/s_([^/]+)$/, "/t9_$1").replace(/^http:/, "https:");
}

// WeRead refuses calls made with an outdated skill version (upgrade_info).
// Start from the version we know and, if refused, read the current one from
// the official skill file (Tencent/wechatreading skills/SKILL.md) and retry
// once. The version is kept for the life of this function instance.
const SKILL_FILE_URL = "https://raw.githubusercontent.com/Tencent/wechatreading/main/skills/SKILL.md";
let currentSkillVersion = "";

async function latestSkillVersion(): Promise<string> {
  try {
    const response = await fetch(SKILL_FILE_URL, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return "";
    const match = (await response.text()).match(/^version:\s*([0-9][0-9.]*)\s*$/m);
    return match ? match[1] : "";
  } catch {
    return "";
  }
}

// deno-lint-ignore no-explicit-any
async function callGateway(apiKey: string, body: Record<string, unknown>): Promise<{ response: Response; data: any }> {
  if (!currentSkillVersion) currentSkillVersion = INITIAL_SKILL_VERSION;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch(WEREAD_GATEWAY_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, skill_version: currentSkillVersion }),
    });
    const data = await response.json().catch(() => ({}));
    if (data.upgrade_info && attempt === 0) {
      const latest = await latestSkillVersion();
      if (latest && latest !== currentSkillVersion) {
        console.log("weread skill version", currentSkillVersion, "->", latest);
        currentSkillVersion = latest;
        continue;
      }
    }
    return { response, data };
  }
  throw new Error("unreachable");
}

async function searchWeread(query: string, limit: number): Promise<SearchResult[]> {
  const apiKey = env("WEREAD_API_KEY");
  if (!apiKey) return [];
  const { response, data } = await callGateway(apiKey, {
    api_name: "/store/search",
    keyword: query,
    scope: 10,
    count: limit,
  });
  if (!response.ok || data.errcode || data.upgrade_info) {
    console.error("weread search failed", response.status, data.errcode, data.errmsg || data.upgrade_info?.message);
    return [];
  }
  const groups = Array.isArray(data.results) ? data.results : [];
  const books = groups.flatMap((group: { books?: unknown[] }) => (Array.isArray(group.books) ? group.books : []));
  const seen = new Set<string>();
  const results: SearchResult[] = [];
  for (const entry of books as { bookInfo?: Record<string, unknown> }[]) {
    const info = entry.bookInfo || {};
    const bookId = String(info.bookId || "");
    const title = String(info.title || "").trim();
    if (!bookId || !title || seen.has(bookId)) continue;
    seen.add(bookId);
    results.push({
      id: `weread-${bookId}`,
      source: "weread",
      title,
      author: String(info.author || "").trim(),
      cover: info.cover ? largerWereadCover(String(info.cover)) : "",
      description: String(info.intro || "").replace(/\s+/g, " ").trim(),
      publishedDate: String(info.publishTime || "").slice(0, 10),
    });
    if (results.length >= limit) break;
  }
  return results;
}

type BookInfo = {
  bookId: string;
  intro: string;
  publisher: string;
  publishTime: string;
  category: string;
  isbn: string;
  rating: number | null;
};

async function wereadBookInfo(bookId: string): Promise<BookInfo | null> {
  const apiKey = env("WEREAD_API_KEY");
  if (!apiKey) return null;
  const { response, data } = await callGateway(apiKey, { api_name: "/book/info", bookId });
  if (!response.ok || data.errcode || data.upgrade_info) {
    console.error("weread book info failed", response.status, data.errcode, data.errmsg || data.upgrade_info?.message);
    return null;
  }
  const info = data.bookInfo && typeof data.bookInfo === "object" ? data.bookInfo : data;
  const rating = Number(info.newRating);
  return {
    bookId,
    intro: String(info.intro || "").replace(/\r/g, "").trim(),
    publisher: String(info.publisher || "").trim(),
    publishTime: String(info.publishTime || "").slice(0, 10),
    category: String(info.category || "").trim(),
    isbn: String(info.isbn || "").trim(),
    // WeRead reports ratings on a 0–100 scale.
    rating: Number.isFinite(rating) && rating > 0 ? rating : null,
  };
}

// Cover hosts the site uses. Anything else is refused so the function can't
// be used to fetch arbitrary URLs.
const COVER_HOSTS = [
  /(^|\.)weread\.qq\.com$/,
  /(^|\.)myqcloud\.com$/,
  /^books\.google\.com$/,
  /(^|\.)googleusercontent\.com$/,
  /^oipsefmckxyojnntiaax\.supabase\.co$/,
];

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

// Main colour of a cover: shrink it, group pixels into coarse colour
// buckets, ignore near-white margins, and pick the bucket with the most
// pixels (weighted a little towards saturated colours). Covers that are
// mostly white get a warm off-white instead, so a white cover with black
// lettering reads as cream, not black.
const LIGHT_COVER_COLOR = "#f3ecdf";
const LIGHT_COVER_SHARE = 0.45;
async function coverColor(url: string): Promise<string | null> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" || !COVER_HOSTS.some((host) => host.test(parsed.hostname))) return null;
  const response = await fetch(parsed);
  if (!response.ok) return null;
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length > 4 * 1024 * 1024) return null;
  // deno-lint-ignore no-explicit-any
  const image: any = await decode(bytes);
  if (!image?.width) return null;
  image.resize(48, Math.max(1, Math.round((48 * image.height) / image.width)));
  const buckets = new Map<number, { r: number; g: number; b: number; n: number; w: number }>();
  let total = 0;
  let light = 0;
  for (let y = 1; y <= image.height; y += 1) {
    for (let x = 1; x <= image.width; x += 1) {
      const [r, g, b, a] = image.getRGBAAt(x, y);
      if (a < 128) continue;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      total += 1;
      if (min > 232) {
        light += 1; // paper-white borders and backgrounds
        continue;
      }
      const saturation = max === 0 ? 0 : (max - min) / max;
      const key = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
      const bucket = buckets.get(key) || { r: 0, g: 0, b: 0, n: 0, w: 0 };
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.n += 1;
      bucket.w += 1 + saturation;
      buckets.set(key, bucket);
    }
  }
  if (total && light / total >= LIGHT_COVER_SHARE) return LIGHT_COVER_COLOR;
  let best: { r: number; g: number; b: number; n: number; w: number } | null = null;
  for (const bucket of buckets.values()) {
    if (!best || bucket.w > best.w) best = bucket;
  }
  return best ? rgbToHex(best.r / best.n, best.g / best.n, best.b / best.n) : null;
}

async function searchGoogle(query: string, limit: number): Promise<SearchResult[]> {
  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", String(limit));
  url.searchParams.set("printType", "books");
  url.searchParams.set("projection", "lite");
  const key = env("GOOGLE_BOOKS_API_KEY");
  if (key) url.searchParams.set("key", key);
  const response = await fetch(url);
  if (!response.ok) {
    console.error("google search failed", response.status);
    return [];
  }
  const data = await response.json();
  return (data.items || [])
    .filter((item: { volumeInfo?: { title?: string } }) => item.volumeInfo?.title)
    .map((item: { id: string; volumeInfo: Record<string, any> }) => {
      const info = item.volumeInfo;
      const links = info.imageLinks || {};
      const cover = links.extraLarge || links.large || links.medium || links.small || links.thumbnail || links.smallThumbnail || "";
      return {
        id: `google-${item.id}`,
        source: "google" as const,
        title: info.title,
        author: (info.authors || []).slice(0, 2).join(" / "),
        cover: String(cover).replace(/^http:/, "https:"),
        description: String(info.description || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
        publishedDate: info.publishedDate || "",
      };
    });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  try {
    const userId = await getUserId(request);
    if (!userId) return jsonResponse({ error: "sign_in_required" }, 401);

    const body = await request.json().catch(() => ({}));

    if (body.coverColor !== undefined) {
      const url = String(body.coverColor || "").slice(0, 600);
      const cacheKey = `color2|${url}`;
      const cached = await readCache(cacheKey);
      if (cached) return jsonResponse({ color: cached.color ?? null, cached: true });
      if (await overRateLimit(userId)) return jsonResponse({ error: "rate_limited" }, 429);
      let color: string | null = null;
      try {
        color = await coverColor(url);
      } catch (error) {
        console.error("cover colour failed", error);
      }
      if (color) await writeCache(cacheKey, { color });
      return jsonResponse({ color });
    }

    if (body.bookId !== undefined) {
      const bookId = String(body.bookId || "").trim().slice(0, 40);
      if (!/^[\w-]+$/.test(bookId)) return jsonResponse({ error: "invalid_book_id" }, 400);
      const cacheKey = `info|${bookId}`;
      const cached = await readCache(cacheKey);
      if (cached) return jsonResponse({ info: cached, cached: true });
      if (await overRateLimit(userId)) return jsonResponse({ error: "rate_limited" }, 429);
      const info = await wereadBookInfo(bookId);
      await logSearch(userId, `info:${bookId}`, info ? "weread-info" : "none");
      // deno-lint-ignore no-explicit-any
      if (info) await writeCache(cacheKey, info as any);
      return jsonResponse({ info, cached: false });
    }

    const query = String(body.query || "").trim().slice(0, 80);
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(body.limit) || 8));
    if (!query) return jsonResponse({ error: "missing_query" }, 400);

    const cacheKey = `${query.toLowerCase()}|${limit}`;
    const cached = await readCache(cacheKey);
    if (cached) return jsonResponse({ results: cached, cached: true });

    if (await overRateLimit(userId)) return jsonResponse({ error: "rate_limited" }, 429);

    let results = await searchWeread(query, limit);
    let source = "weread";
    if (!results.length) {
      results = await searchGoogle(query, limit);
      source = "google";
    }
    await logSearch(userId, query, results.length ? source : "none");
    if (results.length) await writeCache(cacheKey, results);
    return jsonResponse({ results, cached: false });
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "unexpected_error" }, 500);
  }
});
