const WEREAD_GATEWAY_URL = "https://i.weread.qq.com/api/agent/gateway";
const SKILL_VERSION = "1.0.4";
const IMPORT_LIMIT = 20;
const MAX_IMPORT = 60;
const COVER_SAMPLE_SIZE = 40;
const COVER_MAX_BYTES = 3_000_000;
const COVER_TIMEOUT_MS = 6000;
const MAX_COVER_REQUEST = 40;
// Only fetch covers from known image hosts, so this function cannot be used to request arbitrary URLs.
const COVER_HOST_SUFFIXES = [".qq.com", ".qpic.cn", ".google.com", ".googleusercontent.com", ".ggpht.com"];
// Exact hosts for cover storage buckets that WeRead uses.
const COVER_HOSTS_EXACT = ["wfqqreader-1252317822.image.myqcloud.com", "weread-1258476243.file.myqcloud.com"];

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

function isAllowedCoverUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    return COVER_HOSTS_EXACT.includes(url.hostname) || COVER_HOST_SUFFIXES.some((suffix) => url.hostname.endsWith(suffix));
  } catch {
    return false;
  }
}

// The most common non-paper colour, as a hex string. Same rules as the front end used before.
function dominantColorFromPixels(pixels: number[][]) {
  const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();
  for (const [r, g, b, alpha] of pixels) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (alpha < 200) continue;
    if (max > 245 && min > 230) continue; // paper-white margins
    if (max < 25) continue; // near-black outlines
    const key = `${r >> 4},${g >> 4},${b >> 4}`;
    const bucket = buckets.get(key) || { count: 0, r: 0, g: 0, b: 0 };
    bucket.count += 1;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    buckets.set(key, bucket);
  }
  let best: { count: number; r: number; g: number; b: number } | null = null;
  for (const bucket of buckets.values()) {
    if (!best || bucket.count > best.count) best = bucket;
  }
  if (!best) return null;
  const hex = (value: number) => Math.round(value / best!.count).toString(16).padStart(2, "0");
  return `#${hex(best.r)}${hex(best.g)}${hex(best.b)}`;
}

type DecodedImage = { width: number; height: number; data: Uint8Array };

// Pure-JavaScript decoders: the native image library does not run on the edge runtime.
async function decodeCover(bytes: Uint8Array): Promise<DecodedImage | null> {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    const module = await import("npm:jpeg-js@0.4.4");
    const jpeg = module.default ?? module;
    const decoded = jpeg.decode(bytes, { useTArray: true, formatAsRGBA: true, maxMemoryUsageInMB: 64 });
    return { width: decoded.width, height: decoded.height, data: decoded.data };
  }
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    const { Buffer } = await import("node:buffer");
    const pngModule = await import("npm:pngjs@7.0.0");
    const PNG = pngModule.PNG ?? pngModule.default.PNG;
    const png = PNG.sync.read(Buffer.from(bytes));
    return { width: png.width, height: png.height, data: png.data };
  }
  return null; // WebP and other formats are not sampled
}

async function coverColorFromUrl(value: string): Promise<string | null> {
  if (!isAllowedCoverUrl(value)) return null;
  try {
    const response = await fetch(value, { signal: AbortSignal.timeout(COVER_TIMEOUT_MS) });
    if (!response.ok) return null;
    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > COVER_MAX_BYTES) return null;
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > COVER_MAX_BYTES) return null;
    const image = await decodeCover(bytes);
    if (!image) return null;
    const stepX = Math.max(1, Math.floor(image.width / COVER_SAMPLE_SIZE));
    const stepY = Math.max(1, Math.floor(image.height / COVER_SAMPLE_SIZE));
    const pixels: number[][] = [];
    for (let y = 0; y < image.height; y += stepY) {
      for (let x = 0; x < image.width; x += stepX) {
        const index = (y * image.width + x) * 4;
        pixels.push([image.data[index], image.data[index + 1], image.data[index + 2], image.data[index + 3]]);
      }
    }
    return dominantColorFromPixels(pixels);
  } catch (error) {
    console.error("cover colour failed", error);
    return null;
  }
}

function itemId(item: NormalizedWereadItem) {
  return item.bookId || item.albumId || "";
}

function toListItem(item: NormalizedWereadItem) {
  return {
    id: itemId(item),
    type: item.type,
    title: item.title,
    author: item.author,
    cover: item.cover,
    category: item.category,
    finished: item.finishReading > 0,
  };
}

function unixToIso(value: number | null | undefined) {
  return value ? new Date(value * 1000).toISOString() : null;
}

function sampleItems<T>(items: T[], limit: number) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled.slice(0, limit);
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
    const { wereadApiKey, mode, bookIds, covers } = await request.json();

    // Cover mode needs no WeRead key: it only samples the colours of cover images that were sent in.
    if (mode === "covers") {
      const requested = Array.isArray(covers) ? covers.slice(0, MAX_COVER_REQUEST) : [];
      const colors: Record<string, string | null> = {};
      await Promise.all(requested.map(async (entry) => {
        if (entry && typeof entry.id === "string" && typeof entry.cover === "string") {
          colors[entry.id] = await coverColorFromUrl(entry.cover);
        }
      }));
      return jsonResponse({ colors });
    }

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

    // List mode: return the whole shelf so the user can choose what to import. Nothing is written.
    if (mode === "list") {
      return jsonResponse({
        items: allItems.map(toListItem),
        total: allItems.length,
        limit: MAX_IMPORT,
      });
    }

    // Import mode: import only the books the user ticked. IDs are matched against a fresh shelf read,
    // so the client cannot import anything that is not on the shelf.
    if (mode === "import") {
      const wanted = new Set(
        Array.isArray(bookIds) ? bookIds.filter((id) => typeof id === "string").slice(0, MAX_IMPORT) : [],
      );
      const picked = allItems.filter((item) => wanted.has(itemId(item)));
      if (!picked.length) {
        return jsonResponse({ error: "no_books_selected" }, 400);
      }
      const colors = await Promise.all(picked.map((item) => coverColorFromUrl(item.cover)));
      const withColors = picked.map((item, index) => ({ ...item, coverColor: colors[index] || "" }));
      const saved = await upsertUserBooks(request, withColors);
      return jsonResponse({ books: withColors, syncedToDatabase: saved });
    }

    // Legacy mode (no `mode` field): random sample, kept so older clients keep working.
    const selectedItems = sampleItems(allItems, IMPORT_LIMIT);
    const selectedBookCount = selectedItems.filter((item) => item.type === "book").length;
    const selectedAlbumCount = selectedItems.filter((item) => item.type === "album").length;
    const syncedToDatabase = await upsertUserBooks(request, selectedItems);
    const mpCount = wereadData.mp ? 1 : 0;

    return jsonResponse({
      books: selectedItems,
      syncedToDatabase,
      summary: {
        books: selectedBookCount,
        albums: selectedAlbumCount,
        availableBooks: books.length,
        availableAlbums: albums.length,
        mp: mpCount,
        total: selectedItems.length,
        availableTotal: books.length + albums.length + mpCount,
        limit: IMPORT_LIMIT,
      },
    });
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "unexpected_error" }, 500);
  }
});
