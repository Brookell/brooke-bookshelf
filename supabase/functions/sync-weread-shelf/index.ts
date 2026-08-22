const WEREAD_GATEWAY_URL = "https://i.weread.qq.com/api/agent/gateway";
const SKILL_VERSION = "1.0.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type WereadBook = {
  bookId?: string;
  title?: string;
  author?: string;
  cover?: string;
  category?: string;
  deepLink?: string;
  readUpdateTime?: number;
  finishReading?: number;
  updateTime?: number;
  isTop?: number;
  secret?: number;
};

type WereadAlbum = {
  albumInfo?: {
    albumId?: string;
    name?: string;
    authorName?: string;
    cover?: string;
    intro?: string;
    updateTime?: number;
    finish?: number;
    finishStatus?: string;
  };
  albumInfoExtra?: {
    lectureReadUpdateTime?: number;
    isTop?: number;
    secret?: number;
  };
};

type NormalizedWereadItem = {
  type: "book" | "album";
  bookId?: string;
  albumId?: string;
  title: string;
  author: string;
  cover: string;
  category: string;
  deepLink: string;
  readUpdateTime: number | null;
  finishReading: number;
  updateTime: number | null;
  isTop: number;
  secret: number;
  intro?: string;
  finishStatus?: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function normalizeBook(item: WereadBook): NormalizedWereadItem {
  return {
    type: "book",
    bookId: item.bookId || "",
    title: item.title || "未命名书籍",
    author: item.author || "作者未知",
    cover: item.cover || "",
    category: item.category || "",
    deepLink: item.deepLink || "",
    readUpdateTime: item.readUpdateTime || null,
    finishReading: item.finishReading || 0,
    updateTime: item.updateTime || null,
    isTop: item.isTop || 0,
    secret: item.secret || 0,
  };
}

function normalizeAlbum(item: WereadAlbum): NormalizedWereadItem {
  const info = item.albumInfo || {};
  const extra = item.albumInfoExtra || {};
  return {
    type: "album",
    albumId: info.albumId || "",
    title: info.name || "未命名有声书",
    author: info.authorName || "作者未知",
    cover: info.cover || "",
    category: "有声书",
    deepLink: "",
    readUpdateTime: extra.lectureReadUpdateTime || null,
    finishReading: info.finish || 0,
    updateTime: info.updateTime || null,
    isTop: extra.isTop || 0,
    secret: extra.secret || 0,
    intro: info.intro || "",
    finishStatus: info.finishStatus || "",
  };
}

function unixToIso(value: number | null | undefined) {
  return value ? new Date(value * 1000).toISOString() : null;
}

async function getUserIdFromRequest(request: Request) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const authorization = request.headers.get("Authorization");
  if (!supabaseUrl || !anonKey || !authorization) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      Authorization: authorization,
      apikey: anonKey,
    },
  });
  if (!response.ok) return null;
  const user = await response.json();
  return typeof user.id === "string" ? user.id : null;
}

async function upsertUserBooks(request: Request, items: NormalizedWereadItem[]) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const userId = await getUserIdFromRequest(request);
  if (!supabaseUrl || !serviceRoleKey || !userId || !items.length) return false;

  const rows = items.map((item) => ({
    user_id: userId,
    source: "weread",
    source_id: item.bookId || item.albumId,
    title: item.title,
    author: item.author,
    cover_url: item.cover,
    category: item.category,
    status: item.finishReading ? "finished" : "want_to_read",
    deep_link: item.deepLink,
    read_update_time: unixToIso(item.readUpdateTime),
    raw: item,
  }));

  const response = await fetch(`${supabaseUrl}/rest/v1/user_books?on_conflict=user_id,source,source_id`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(rows),
  });
  if (!response.ok) {
    console.error("user_books upsert failed", await response.text());
    return false;
  }
  return true;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  try {
    const { wereadApiKey } = await request.json();
    if (!wereadApiKey || typeof wereadApiKey !== "string") {
      return jsonResponse({ error: "missing_weread_api_key" }, 400);
    }

    const wereadResponse = await fetch(WEREAD_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${wereadApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_name: "/shelf/sync",
        skill_version: SKILL_VERSION,
      }),
    });
    const wereadData = await wereadResponse.json();
    if (!wereadResponse.ok || wereadData.errcode) {
      return jsonResponse({
        error: "weread_sync_failed",
        message: wereadData.errmsg || wereadData.message || "微信读书同步失败",
      }, 502);
    }
    if (wereadData.upgrade_info) {
      return jsonResponse({
        error: "weread_skill_upgrade_required",
        message: wereadData.upgrade_info.message,
      }, 409);
    }

    const books = Array.isArray(wereadData.books) ? wereadData.books.map(normalizeBook) : [];
    const albums = Array.isArray(wereadData.albums) ? wereadData.albums.map(normalizeAlbum) : [];
    const syncedToDatabase = await upsertUserBooks(request, [...books, ...albums]);
    const mpCount = wereadData.mp ? 1 : 0;

    return jsonResponse({
      books: [...books, ...albums],
      syncedToDatabase,
      summary: {
        books: books.length,
        albums: albums.length,
        mp: mpCount,
        total: books.length + albums.length + mpCount,
      },
    });
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "unexpected_error" }, 500);
  }
});
