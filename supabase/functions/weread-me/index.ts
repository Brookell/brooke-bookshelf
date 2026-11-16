// Personal WeRead data for the reading panel, using the user's own key.
//
// Signed-in users only. A user may save their WeRead API key so the panel
// can update by itself; the key is encrypted with AES-GCM (secret
// WEREAD_KEY_SECRET, 32 random bytes, base64) and kept in
// public.user_weread_keys, which only this function (service role) can read.
//
// POST { action: "status" }                     -> { connected, connectedAt }
// POST { action: "connect", wereadApiKey }      -> { connected: true }
// POST { action: "disconnect" }                 -> { connected: false }
// POST { action: "stats", mode }                -> reading statistics
// POST { action: "notebooks" }                  -> books with highlights / thoughts
// POST { action: "highlights", bookId }         -> highlights + thoughts for one book
// POST { action: "progress", bookIds }          -> reading progress per book (max 40)
// POST { action: "shelf" }                      -> the user's WeRead shelf
// POST { action: "recommend" }                  -> WeRead's 为你推荐 for this user

const WEREAD_GATEWAY_URL = "https://i.weread.qq.com/api/agent/gateway";
// Must match the `version` in tencent/wechatreading skills/SKILL.md.
const SKILL_VERSION = "1.0.5";
const RATE_LIMIT_PER_HOUR = 200;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const env = (name: string) => Deno.env.get(name) || "";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

class WereadError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

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

// ---- Rate limit (shares book_search_log with search-books) ----

async function overRateLimit(userId: string) {
  const since = new Date(Date.now() - 3600_000).toISOString();
  const response = await rest(
    `book_search_log?select=id&user_id=eq.${userId}&source=like.me*&created_at=gte.${encodeURIComponent(since)}`,
    { headers: { Prefer: "count=exact", Range: "0-0" } },
  );
  const total = Number(response.headers.get("content-range")?.split("/")[1] || 0);
  return total >= RATE_LIMIT_PER_HOUR;
}

async function logCall(userId: string, action: string) {
  await rest("book_search_log", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, query: action, source: `me:${action}` }),
  });
}

// ---- Key encryption ----

const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const fromBase64 = (text: string) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

async function cryptoKey() {
  const raw = fromBase64(env("WEREAD_KEY_SECRET"));
  if (raw.length !== 32) throw new Error("WEREAD_KEY_SECRET must be 32 random bytes in base64");
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function encryptKey(plain: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await cryptoKey(), new TextEncoder().encode(plain));
  return { ciphertext: toBase64(new Uint8Array(data)), iv: toBase64(iv) };
}

async function decryptKey(ciphertext: string, iv: string) {
  const data = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromBase64(iv) }, await cryptoKey(), fromBase64(ciphertext));
  return new TextDecoder().decode(data);
}

async function loadSavedKey(userId: string) {
  const response = await rest(`user_weread_keys?select=ciphertext,iv,created_at&user_id=eq.${userId}`);
  if (!response.ok) return null;
  const [row] = await response.json();
  if (!row) return null;
  return { key: await decryptKey(row.ciphertext, row.iv), createdAt: row.created_at as string };
}

// ---- WeRead gateway ----

// deno-lint-ignore no-explicit-any
async function weread(apiKey: string, apiName: string, params: Record<string, unknown> = {}): Promise<any> {
  const response = await fetch(WEREAD_GATEWAY_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ api_name: apiName, skill_version: SKILL_VERSION, ...params }),
  });
  const data = await response.json().catch(() => ({}));
  if (data.upgrade_info) throw new WereadError("weread_upgrade_required", data.upgrade_info.message || "");
  if (data.errcode === -2012) throw new WereadError("weread_key_expired", data.errmsg || "");
  if (!response.ok || data.errcode) {
    throw new WereadError("weread_failed", `${apiName}: ${data.errcode ?? response.status} ${data.errmsg || ""}`);
  }
  return data;
}

function bookSummary(book: Record<string, unknown> | undefined) {
  if (!book) return null;
  return {
    bookId: String(book.bookId || ""),
    title: String(book.title || ""),
    author: String(book.author || ""),
    cover: String(book.cover || ""),
  };
}

// ---- Actions ----

// deno-lint-ignore no-explicit-any
async function stats(apiKey: string, mode: string): Promise<any> {
  const data = await weread(apiKey, "/readdata/detail", { mode, baseTime: 0 });
  return {
    mode,
    baseTime: data.baseTime ?? 0,
    totalReadTime: data.totalReadTime ?? 0,
    readDays: data.readDays ?? 0,
    dayAverageReadTime: data.dayAverageReadTime ?? 0,
    compare: data.compare ?? null,
    readTimes: data.readTimes || {},
    dailyReadTimes: data.dailyReadTimes || {},
    readStat: (data.readStat || []).map((item: Record<string, unknown>) => ({ stat: item.stat, counts: item.counts })),
    readLongest: (data.readLongest || []).map((item: Record<string, unknown>) => {
      // deno-lint-ignore no-explicit-any
      const album = item.albumInfo as any;
      return {
        book: bookSummary(item.book as Record<string, unknown>) ||
          (album ? { bookId: String(album.albumId || ""), title: album.name || "", author: album.authorName || "", cover: album.cover || "" } : null),
        readTime: item.readTime ?? 0,
        tags: item.tags || [],
      };
    }),
    preferCategory: (data.preferCategory || []).map((item: Record<string, unknown>) => ({
      title: item.categoryTitle,
      val: item.val,
      readingTime: item.readingTime,
      readingCount: item.readingCount,
    })),
    preferCategoryWord: data.preferCategoryWord || "",
    preferTimeWord: data.preferTimeWord || "",
  };
}

async function notebooks(apiKey: string) {
  // deno-lint-ignore no-explicit-any
  const books: any[] = [];
  let lastSort: number | undefined;
  for (let page = 0; page < 10; page += 1) {
    const data = await weread(apiKey, "/user/notebooks", lastSort ? { count: 50, lastSort } : { count: 50 });
    const list = Array.isArray(data.books) ? data.books : [];
    books.push(...list);
    if (data.hasMore !== 1 || !list.length) break;
    lastSort = list[list.length - 1].sort;
  }
  return books.map((item) => ({
    book: bookSummary({ ...(item.book || {}), bookId: item.bookId }),
    highlights: item.noteCount ?? 0,
    thoughts: item.reviewCount ?? 0,
    bookmarks: item.bookmarkCount ?? 0,
    progress: item.readingProgress ?? null,
    finished: item.markedStatus === 1,
    sort: item.sort ?? 0,
  }));
}

async function highlights(apiKey: string, bookId: string) {
  const marks = await weread(apiKey, "/book/bookmarklist", { bookId });
  // deno-lint-ignore no-explicit-any
  const reviews: any[] = [];
  let synckey = 0;
  for (let page = 0; page < 10; page += 1) {
    const data = await weread(apiKey, "/review/list/mine", { bookid: bookId, synckey, count: 50 });
    const list = Array.isArray(data.reviews) ? data.reviews : [];
    reviews.push(...list);
    if (data.hasMore !== 1 || !list.length) break;
    synckey = data.synckey;
  }
  return {
    book: bookSummary(marks.book),
    chapters: (marks.chapters || []).map((chapter: Record<string, unknown>) => ({
      chapterUid: chapter.chapterUid,
      chapterIdx: chapter.chapterIdx,
      title: chapter.title,
    })),
    highlights: (marks.updated || []).map((mark: Record<string, unknown>) => ({
      chapterUid: mark.chapterUid,
      text: mark.markText,
      range: mark.range,
      createTime: mark.createTime,
    })),
    thoughts: reviews.map((item) => {
      const review = item.review || {};
      return {
        content: review.content || "",
        quote: review.abstract || "",
        chapterUid: review.chapterUid ?? null,
        chapterName: review.chapterName || "",
        star: review.star ?? -1,
        createTime: review.createTime ?? 0,
      };
    }),
  };
}

async function progress(apiKey: string, bookIds: string[]) {
  const result: Record<string, unknown> = {};
  for (let i = 0; i < bookIds.length; i += 8) {
    await Promise.all(bookIds.slice(i, i + 8).map(async (bookId) => {
      try {
        const data = await weread(apiKey, "/book/getprogress", { bookId });
        const book = data.book || {};
        result[bookId] = {
          progress: book.progress ?? 0,
          readingTime: book.recordReadingTime ?? 0,
          updateTime: book.updateTime ?? null,
          finishTime: book.finishTime ?? null,
        };
      } catch (error) {
        if (error instanceof WereadError && error.code !== "weread_failed") throw error;
      }
    }));
  }
  return result;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  try {
    const userId = await getUserId(request);
    if (!userId) return jsonResponse({ error: "sign_in_required" }, 401);
    const body = await request.json().catch(() => ({}));
    const action = String(body.action || "");

    if (action === "status") {
      const response = await rest(`user_weread_keys?select=created_at&user_id=eq.${userId}`);
      const [row] = response.ok ? await response.json() : [];
      return jsonResponse({ connected: Boolean(row), connectedAt: row?.created_at ?? null });
    }

    if (action === "disconnect") {
      await rest(`user_weread_keys?user_id=eq.${userId}`, { method: "DELETE" });
      return jsonResponse({ connected: false });
    }

    if (await overRateLimit(userId)) return jsonResponse({ error: "rate_limited" }, 429);

    if (action === "connect") {
      const key = String(body.wereadApiKey || "").trim();
      if (!/^wrk-[\w-]{6,}$/.test(key)) return jsonResponse({ error: "invalid_key" }, 400);
      await weread(key, "/user/notebooks", { count: 1 }); // proves the key works
      const { ciphertext, iv } = await encryptKey(key);
      await rest("user_weread_keys?on_conflict=user_id", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify({ user_id: userId, ciphertext, iv, updated_at: new Date().toISOString() }),
      });
      await logCall(userId, "connect");
      return jsonResponse({ connected: true });
    }

    const saved = await loadSavedKey(userId);
    if (!saved) return jsonResponse({ error: "not_connected" }, 409);
    await logCall(userId, action);

    if (action === "stats") {
      const mode = ["weekly", "monthly", "annually", "overall"].includes(body.mode) ? body.mode : "monthly";
      return jsonResponse(await stats(saved.key, mode));
    }
    if (action === "notebooks") return jsonResponse({ books: await notebooks(saved.key) });
    if (action === "highlights") {
      const bookId = String(body.bookId || "").trim();
      if (!/^[\w-]{1,40}$/.test(bookId)) return jsonResponse({ error: "invalid_book_id" }, 400);
      return jsonResponse(await highlights(saved.key, bookId));
    }
    if (action === "progress") {
      const bookIds = (Array.isArray(body.bookIds) ? body.bookIds : [])
        .map((id: unknown) => String(id))
        .filter((id: string) => /^[\w-]{1,40}$/.test(id))
        .slice(0, 40);
      return jsonResponse({ progress: await progress(saved.key, bookIds) });
    }
    if (action === "recommend") {
      const data = await weread(saved.key, "/book/recommend", { count: 12 });
      // deno-lint-ignore no-explicit-any
      const books = (Array.isArray(data.books) ? data.books : []).map((book: any) => ({
        bookId: String(book.bookId || ""),
        title: String(book.title || ""),
        author: String(book.author || ""),
        cover: String(book.cover || ""),
        intro: String(book.intro || ""),
        reason: String(book.reason || ""),
        rating: Number(book.newRating) > 0 ? Number(book.newRating) : null,
        ratingTitle: book.newRatingDetail?.title || "",
      })).filter((book: { bookId: string; title: string }) => book.bookId && book.title);
      return jsonResponse({ books });
    }
    if (action === "shelf") {
      const data = await weread(saved.key, "/shelf/sync");
      return jsonResponse({ books: data.books || [], albums: data.albums || [] });
    }
    return jsonResponse({ error: "unknown_action" }, 400);
  } catch (error) {
    if (error instanceof WereadError) {
      console.error(error.code, error.message);
      const status = error.code === "weread_key_expired" ? 401 : 502;
      return jsonResponse({ error: error.code }, status);
    }
    console.error(error);
    return jsonResponse({ error: "unexpected_error" }, 500);
  }
});
