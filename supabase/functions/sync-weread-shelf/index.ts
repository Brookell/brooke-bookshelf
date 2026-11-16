const WEREAD_GATEWAY_URL = "https://i.weread.qq.com/api/agent/gateway";
// Must match the `version` in tencent/wechatreading skills/SKILL.md.
const SKILL_VERSION = "1.0.5";

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
    const allItems = [...books, ...albums];
    // Most recently read first, so the list the user picks from starts with
    // what they are reading now. Nothing is imported here: the site imports
    // only the books the user ticks.
    allItems.sort((a, b) => (b.readUpdateTime || b.updateTime || 0) - (a.readUpdateTime || a.updateTime || 0));
    return jsonResponse({
      items: allItems,
      summary: {
        books: books.length,
        albums: albums.length,
        total: allItems.length,
      },
    });
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "unexpected_error" }, 500);
  }
});
