window.BROOKE_BOOKS_READY.then((books) => {
const shelfGaps = window.BROOKE_SHELF_GAPS;

const entryScreen = document.querySelector("#entryScreen");
const spaceSwitch = document.querySelector(".space-switch");
const viewport = document.querySelector("#shelfViewport");
const track = document.querySelector("#booksTrack");
const activeTitle = document.querySelector("#activeTitle");
const activeNumber = document.querySelector("#activeNumber");
const totalBooks = document.querySelector("#totalBooks");
const previousBook = document.querySelector("#previousBook");
const nextBook = document.querySelector("#nextBook");
const bookIndexToggle = document.querySelector("#bookIndexToggle");
const bookIndex = document.querySelector("#bookIndex");
const bookIndexClose = document.querySelector("#bookIndexClose");
const bookIndexCount = document.querySelector("#bookIndexCount");
const bookIndexList = document.querySelector("#bookIndexList");
const myShelfToggle = document.querySelector("#myShelfToggle");
const addBookToggle = document.querySelector("#addBookToggle");
const roomOnlyToggle = document.querySelector("#roomOnlyToggle");
const addBookPanel = document.querySelector("#addBookPanel");
const addBookClose = document.querySelector("#addBookClose");
const addBookSearch = document.querySelector("#addBookSearch");
const addBookQuery = document.querySelector("#addBookQuery");
const addBookStatus = document.querySelector("#addBookStatus");
const addBookResults = document.querySelector("#addBookResults");
const wereadImportForm = document.querySelector("#wereadImportForm");
const wereadManualImportForm = document.querySelector("#wereadManualImportForm");
const wereadApiKey = document.querySelector("#wereadApiKey");
const wereadImportText = document.querySelector("#wereadImportText");
const wereadImportStatus = document.querySelector("#wereadImportStatus");
const wereadPicker = document.querySelector("#wereadPicker");
const wereadPickerSearch = document.querySelector("#wereadPickerSearch");
const wereadPickerCount = document.querySelector("#wereadPickerCount");
const wereadPickerAll = document.querySelector("#wereadPickerAll");
const wereadPickerRandom = document.querySelector("#wereadPickerRandom");
const wereadPickerNone = document.querySelector("#wereadPickerNone");
const wereadPickerList = document.querySelector("#wereadPickerList");
const wereadPickerImport = document.querySelector("#wereadPickerImport");
const WEREAD_MAX_PICK = 60;
const WEREAD_RANDOM_PICK = 20;
// Shelf from the last list request, the ticked IDs, and the key kept only in memory for the import step.
let wereadShelfItems = [];
const wereadPickedIds = new Set();
let wereadSessionKey = "";
let wereadImporting = false;
const authGate = document.querySelector("#authGate");
const authGateClose = document.querySelector("#authGateClose");
const authGateForm = document.querySelector("#authGateForm");
const authEmail = document.querySelector("#authEmail");
const authGateGuest = document.querySelector("#authGateGuest");
const myShelf = document.querySelector("#myShelf");
const myShelfClose = document.querySelector("#myShelfClose");
const myShelfCount = document.querySelector("#myShelfCount");
const myShelfList = document.querySelector("#myShelfList");
const myShelfEmpty = document.querySelector("#myShelfEmpty");
const myShelfEmptyAdd = document.querySelector("#myShelfEmptyAdd");
const myShelfFilters = document.querySelector(".my-shelf-filters");
const myShelfSummary = document.querySelector("#myShelfSummary");
const myShelfViewToggle = document.querySelector(".my-shelf-view-toggle");
const myShelfListView = document.querySelector("#myShelfListView");
const myShelfRoomView = document.querySelector("#myShelfRoomView");
const myShelfRoom = document.querySelector("#myShelfRoom");
const myRoomTitle = document.querySelector("#myRoomTitle");
const myRoomNameForm = document.querySelector("#myRoomNameForm");
const myRoomNameInput = document.querySelector("#myRoomNameInput");
const shelfHelpToggle = document.querySelector("#shelfHelpToggle");
const shelfHelp = document.querySelector("#shelfHelp");
const shelfHelpClose = document.querySelector("#shelfHelpClose");
const shelfOnboarding = document.querySelector("#shelfOnboarding");
const shelfOnboardingKicker = document.querySelector("#shelfOnboardingKicker");
const shelfOnboardingTitle = document.querySelector("#shelfOnboardingTitle");
const shelfOnboardingCopy = document.querySelector("#shelfOnboardingCopy");
const shelfOnboardingStart = document.querySelector("#shelfOnboardingStart");
const shelfOnboardingRoom = document.querySelector("#shelfOnboardingRoom");
const library = document.querySelector(".library");
const masthead = document.querySelector(".masthead");
const shelfRegion = document.querySelector(".shelf-region");
const detail = document.querySelector("#bookDetail");
const detailClose = document.querySelector("#detailClose");
const detailReturn = document.querySelector("#detailReturn");
const detailBookShell = document.querySelector("#detailBookShell");
const detailFront = document.querySelector("#detailFront");
const detailCopy = document.querySelector("#detailCopy");
const detailNumber = document.querySelector("#detailNumber");
const detailTitle = document.querySelector("#detailTitle");
const detailAuthor = document.querySelector("#detailAuthor");
const detailDescription = document.querySelector("#detailDescription");
const detailSave = document.querySelector("#detailSave");
const detailSaveLabel = document.querySelector("#detailSaveLabel");
const detailStatus = document.querySelector("#detailStatus");

const bookElements = [];
const SHELF_STORAGE_KEY = "brooke-bookshelf:user-books:v1";
const CUSTOM_BOOKS_STORAGE_KEY = "brooke-bookshelf:custom-books:v1";
const GOOGLE_BOOKS_API_KEY_STORAGE_KEY = "brooke-bookshelf:google-books-api-key:v1";
const AUTH_STORAGE_KEY = "brooke-bookshelf:auth-prototype:v1";
const DEFAULT_SUPABASE_URL = "https://oipsefmckxyojnntiaax.supabase.co";
const DEFAULT_SUPABASE_FUNCTIONS_URL = "https://oipsefmckxyojnntiaax.supabase.co/functions/v1";
const ROOM_DEFAULT_STORAGE_KEY = "brooke-bookshelf:show-my-room-first:v1";
const ROOM_NAME_STORAGE_KEY = "brooke-bookshelf:room-name:v1";
const DEFAULT_STATUS = "want_to_read";
const CUSTOM_BOOK_PALETTE = [
  ["#67242d", "#f8f0e5", "#5a1f28", "#f8f0e5"],
  ["#178b78", "#fbf7ee", "#0f7668", "#fbf7ee"],
  ["#254c39", "#fbf7ee", "#214431", "#fbf7ee"],
  ["#e4c1a9", "#171514", "#d3ac93", "#171514"],
  ["#f0eee8", "#171514", "#ddd8cf", "#171514"],
  ["#665095", "#fbf7ee", "#5a4687", "#fbf7ee"],
  ["#56595a", "#fbf7ee", "#4c5050", "#fbf7ee"],
  ["#27899a", "#111111", "#217b8a", "#111111"],
];
const I18N = {
  zh: {
    languageName: "中文",
    helpTitle: "书架操作",
    helpButton: "如何使用书架",
    helpClose: "关闭书架操作",
    mouse: "鼠标",
    mouseHelp: "悬停预览 · 点击打开",
    keyboard: "键盘",
    keyboardHelp: "← → 选择 · Space 打开 / 返回",
    shelfStatus: "使用左右方向键选择一本书。按空格打开或返回书架。",
    viewAll: "查看全部书籍",
    myShelf: "我的书架",
    addBook: "增添书籍",
    previousBook: "上一本书",
    nextBook: "下一本书",
    bookIndexMeta: "全部书目 / {count} 本",
    allBooks: "全部书籍",
    returnToShelf: "返回书架",
    personalShelfMeta: "个人书架 / {count} 本",
    filterShelf: "筛选我的书架",
    shelfSummary: "我的书架统计",
    shelfView: "我的书架视图",
    all: "全部",
    want: "想读",
    wantToRead: "想读",
    reading: "在读",
    finished: "读完",
    list: "列表",
    room: "房间",
    personalReadingRoom: "个人阅读房间",
    nameYourRoom: "设计房间名",
    roomNamePlaceholder: "Your Reading Room",
    saveRoomName: "保存",
    myRoomShelf: "我的阅读房间书架",
    emptyShelf: "你保存的书会出现在这里。",
    emptyShelfAction: "搜索并添加第一本书",
    detailKicker: "Brooke Reading Room",
    personalShelfControls: "个人书架操作",
    addToShelf: "加入我的书架",
    onShelf: "已在我的书架",
    readingStatus: "阅读状态",
    saved: "已保存",
    openBook: "打开《{title}》",
    selectedPages: "Selected pages",
    onboardingBuildKicker: "Brooke 的空间是一个范例",
    onboardingBuildTitle: "看一看，再开始你的",
    onboardingBuildCopy: "你可以先在这里随意翻看，遇到喜欢的书就加入自己的书架；也可以直接进入我的空间，从空房间开始布置。",
    onboardingChoose: "继续浏览范例",
    onboardingStartRoom: "直接打造我的书架",
    onboardingSavedKicker: "第一本已保存",
    onboardingSavedTitle: "你的房间准备好了",
    onboardingSavedCopy: "《{title}》已经在你的书架上。打开你的房间看看第一个版本，然后继续添加喜欢的书。",
    onboardingKeepBrowsing: "继续浏览",
    onboardingOpenRoom: "打开我的房间",
    searchBookLabel: "搜索书名、作者或 ISBN",
    searchBookPlaceholder: "例如：献给阿尔吉侬的花束",
    searchBookAction: "搜索",
    searchBookIdle: "可以搜索公开书目，选择一本加入你的书架。",
    searchBookLoading: "正在搜索...",
    searchBookEmpty: "没有找到合适的结果，试试换一个关键词。",
    searchBookError: "搜索暂时失败，请稍后再试。",
    searchBookQuotaError: "搜索次数暂时用完了，请过几分钟再试。",
    addSearchResult: "加入书架",
    addedSearchResult: "已加入",
    wereadImportIdle: "先从微信读书复制书名列表，再粘贴到这里导入。",
    wereadSyncIdle: "输入 WeRead API Key 后，读取你的微信读书书架，再勾选想导入的书。",
    wereadListDone: "微信读书书架里共有 {count} 本，勾选想导入的书。",
    wereadListEmpty: "微信读书书架里还没有书。",
    wereadPickCount: "已选 {count} / {max} 本",
    wereadPickLimit: "一次最多导入 {max} 本，请先取消一些。",
    wereadPickImport: "导入选中的 {count} 本",
    wereadPickImportIdle: "导入选中的书",
    wereadPickOnShelf: "已在书架",
    wereadPickEmpty: "没有符合搜索的书。",
    wereadPickNone: "请先勾选至少一本书。",
    wereadPickSearch: "搜索书名或作者",
    wereadPickAll: "全选当前结果",
    wereadPickRandom: "随机选 20 本",
    wereadPickClear: "清空",
    wereadImportingSelected: "正在导入选中的书...",
    wereadImportEmpty: "请先粘贴至少一本书名。",
    wereadApiKeyEmpty: "请先输入微信读书 API Key。",
    wereadImportLoading: "正在匹配第 {current} / {total} 本...",
    wereadSyncLoading: "正在读取你的微信读书书架...",
    wereadImportDone: "已导入 {count} 本书到你的书架。",
    wereadImportPartial: "已导入 {count} 本，{failed} 本暂时没有匹配到。",
    wereadSyncError: "微信读书同步暂时失败，请确认 API Key 或 Edge Function 是否已部署。",
    wereadFunctionOutdated: "同步服务还是旧版本，需要在 Supabase 重新部署 sync-weread-shelf 后再试。",
    wereadReason: "原因",
  },
  en: {
    languageName: "English",
    helpTitle: "Shelf controls",
    helpButton: "How to use the shelf",
    helpClose: "Close shelf controls",
    mouse: "Mouse",
    mouseHelp: "Hover to preview · Click to open",
    keyboard: "Keyboard",
    keyboardHelp: "← → choose · Space open / return",
    shelfStatus: "Use the left and right arrow keys to choose a book. Press Space to open it or return to the shelf.",
    viewAll: "View all books",
    myShelf: "My shelf",
    addBook: "Add book",
    previousBook: "Previous book",
    nextBook: "Next book",
    bookIndexMeta: "Book index / {count} volumes",
    allBooks: "All books",
    returnToShelf: "Return to shelf",
    personalShelfMeta: "Personal shelf / {count} saved",
    filterShelf: "Filter my shelf",
    shelfSummary: "My shelf summary",
    shelfView: "My shelf view",
    all: "All",
    want: "Want",
    wantToRead: "Want to read",
    reading: "Reading",
    finished: "Finished",
    list: "List",
    room: "Room",
    personalReadingRoom: "Personal reading room",
    nameYourRoom: "Name your room",
    roomNamePlaceholder: "Your Reading Room",
    saveRoomName: "Save",
    myRoomShelf: "My reading room shelf",
    emptyShelf: "Your saved books will appear here.",
    emptyShelfAction: "Search and add your first book",
    detailKicker: "Brooke Reading Room",
    personalShelfControls: "Personal shelf controls",
    addToShelf: "Add to my shelf",
    onShelf: "On my shelf",
    readingStatus: "Reading status",
    saved: "Saved",
    openBook: "Open {title}",
    selectedPages: "Selected pages",
    onboardingBuildKicker: "Brooke's space is the example",
    onboardingBuildTitle: "Look around, then make yours",
    onboardingBuildCopy: "Browse first, save a book when one catches your eye, or open your own space and begin from an empty room.",
    onboardingChoose: "Browse the example",
    onboardingStartRoom: "Build my shelf",
    onboardingSavedKicker: "First book saved",
    onboardingSavedTitle: "Your room is ready",
    onboardingSavedCopy: "{title} is on your shelf. Open your room to see the first version, then keep adding books as you browse.",
    onboardingKeepBrowsing: "Keep browsing",
    onboardingOpenRoom: "Open my room",
    searchBookLabel: "Search by title, author, or ISBN",
    searchBookPlaceholder: "For example: Flowers for Algernon",
    searchBookAction: "Search",
    searchBookIdle: "Search public book records and add one to your shelf.",
    searchBookLoading: "Searching...",
    searchBookEmpty: "No matching books yet. Try another keyword.",
    searchBookError: "Search is unavailable right now. Please try again later.",
    searchBookQuotaError: "Search is busy right now. Please try again in a few minutes.",
    addSearchResult: "Add to shelf",
    addedSearchResult: "Added",
    wereadImportIdle: "Copy book titles from WeRead, then paste them here to import.",
    wereadSyncIdle: "Enter a WeRead API Key to load your WeRead shelf, then choose the books you want.",
    wereadListDone: "Your WeRead shelf has {count} books. Choose the ones you want.",
    wereadListEmpty: "Your WeRead shelf is empty.",
    wereadPickCount: "{count} / {max} selected",
    wereadPickLimit: "You can import up to {max} books at a time. Unselect some first.",
    wereadPickImport: "Import {count} selected",
    wereadPickImportIdle: "Import selected books",
    wereadPickOnShelf: "On shelf",
    wereadPickEmpty: "No books match your search.",
    wereadPickNone: "Select at least one book first.",
    wereadPickSearch: "Search title or author",
    wereadPickAll: "Select visible",
    wereadPickRandom: "Pick 20 at random",
    wereadPickClear: "Clear",
    wereadImportingSelected: "Importing the selected books...",
    wereadImportEmpty: "Paste at least one title first.",
    wereadApiKeyEmpty: "Enter your WeRead API Key first.",
    wereadImportLoading: "Matching book {current} / {total}...",
    wereadSyncLoading: "Reading your WeRead shelf...",
    wereadImportDone: "Imported {count} books to your shelf.",
    wereadImportPartial: "Imported {count}; {failed} could not be matched yet.",
    wereadSyncError: "WeRead sync failed. Check the API key or Edge Function deployment.",
    wereadFunctionOutdated: "The sync service is still the old version. Redeploy sync-weread-shelf in Supabase, then try again.",
    wereadReason: "Reason",
  },
};
const STATUS_LABEL_KEYS = {
  want_to_read: "wantToRead",
  reading: "reading",
  finished: "finished",
};
let activeIndex = null;
let pinnedIndex = null;
let userBooks = readUserBooks();
let showMyRoomFirst = readShowMyRoomFirst();
let myRoomName = readRoomName();
let activeSpace = "brooke";
let myShelfFilter = "all";
let myShelfView = "list";
let myRoomActiveIndex = null;
let dragStartX = 0;
let dragStartScroll = 0;
let isDragging = false;
let hasDragged = false;
let didSetInitialScroll = false;
let detailIndex = null;
let detailOriginRect = null;
let detailSourceElement = null;
let detailSourceMode = "shelf";
let detailOpenTimer = 0;
let detailCopyTimer = 0;
let detailSettleTimer = 0;
let detailCloseTimer = 0;
let bookIndexCloseTimer = 0;
let myShelfCloseTimer = 0;
let myShelfViewSwitchTimer = 0;
let shelfHelpCloseTimer = 0;
let onboardingCloseTimer = 0;
let addBookCloseTimer = 0;
let authGateCloseTimer = 0;
let myShelfToolsHintTimer = 0;
let pendingAuthAction = null;
let addBookAbortController = null;
let lastSearchResults = [];
let supabaseClient = null;
let supabaseSession = null;
let hasLoadedRemoteShelf = false;
let isSyncingRemoteShelf = false;

const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
}[character]));

function t(key, replacements = {}) {
  const dictionary = I18N.zh;
  const template = dictionary[key] ?? I18N.zh[key] ?? key;
  return Object.entries(replacements).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template,
  );
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function setHtml(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = value;
}

function setButtonLabel(button, label) {
  if (!button) return;
  button.title = label;
  button.setAttribute("aria-label", label);
  const srOnly = button.querySelector(".sr-only");
  if (srOnly) srOnly.textContent = label;
}

function updateSpaceSwitch() {
  spaceSwitch?.querySelectorAll("[data-space-target]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.spaceTarget === activeSpace));
  });
  library.classList.toggle("is-user-space", activeSpace === "user");
  roomOnlyToggle?.setAttribute("aria-pressed", String(activeSpace === "user"));
}

function readRoomName() {
  try {
    const value = window.localStorage.getItem(ROOM_NAME_STORAGE_KEY)?.trim();
    return value || "Your Reading Room";
  } catch {
    return "Your Reading Room";
  }
}

function writeRoomName(value) {
  try {
    window.localStorage.setItem(ROOM_NAME_STORAGE_KEY, value);
  } catch {
    // Room naming still updates for the current session when storage is unavailable.
  }
  syncSettingsToSupabase();
}

function formatRoomTitle(value) {
  const title = (value || "Your Reading Room").trim() || "Your Reading Room";
  const words = title.split(/\s+/);
  if (words.length <= 1) return escapeHtml(title);
  if (/^your$/i.test(words[0]) && /^reading$/i.test(words[1]) && /^room$/i.test(words[2] || "")) {
    return "Your<br />Reading Room";
  }
  const midpoint = Math.ceil(words.length / 2);
  return `${escapeHtml(words.slice(0, midpoint).join(" "))}<br />${escapeHtml(words.slice(midpoint).join(" "))}`;
}

function slugifyText(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function slugifyBook(book, index) {
  const raw = `${book.title}-${book.author}-${index + 1}`;
  const normalized = slugifyText(raw);
  return normalized || `book-${index + 1}`;
}

books.forEach((book, index) => {
  book.id = book.id || slugifyBook(book, index);
});
books.push(...readCustomBooks());
window.BROOKE_BOOKS = books;

function normalizeBook(book, index = books.length) {
  const palette = CUSTOM_BOOK_PALETTE[index % CUSTOM_BOOK_PALETTE.length];
  const safeTitle = String(book.title || "未命名书籍").trim();
  const safeAuthor = String(book.author || "作者未知").trim();
  const width = Number(book.width) || 280;
  const spineWidth = Number(book.spineWidth) || Math.min(84, Math.max(56, Math.round(34 + safeTitle.length * 1.8)));
  return {
    id: book.id || `custom-${slugifyText(`${safeTitle}-${safeAuthor}`) || Date.now()}`,
    title: safeTitle,
    author: safeAuthor,
    description: Array.isArray(book.description) && book.description.length
      ? book.description.map(String)
      : ["这是你自己加入书架的书。之后接入用户数据库后，它会成为你专属书架的一部分。"],
    color: book.color || palette[0],
    ink: book.ink || palette[1],
    spine: book.spine || palette[2],
    spineInk: book.spineInk || palette[3],
    detailColor: book.detailColor || book.color || palette[0],
    width,
    spineWidth,
    height: Number(book.height) || 1,
    shelfGap: Number(book.shelfGap) || 28,
    image: book.image || "",
    originalCover: Boolean(book.originalCover || book.image),
    opacity: Number(book.opacity) || 1,
    filter: book.filter || "none",
    coverRatio: Number(book.coverRatio) || 2 / 3,
    isCustom: Boolean(book.isCustom),
    coverColor: book.coverColor || "",
    source: book.source || "",
    sourceId: book.sourceId || "",
    deepLink: book.deepLink || "",
  };
}

function readCustomBooks() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CUSTOM_BOOKS_STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.map((book, index) => normalizeBook(book, index)).filter((book) => book.id);
  } catch {
    return [];
  }
}

// Cover colours are computed by the sync function, because browsers cannot read pixels from most cover hosts.
async function fetchCoverColors(covers) {
  const data = await callSyncWereadFunction({ mode: "covers", covers });
  return data.colors || {};
}

function shadeHex(hex, percent) {
  const factor = 1 + percent / 100;
  const channel = (start) => {
    const value = Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(start, start + 2), 16) * factor)));
    return value.toString(16).padStart(2, "0");
  };
  return `#${channel(1)}${channel(3)}${channel(5)}`;
}

function readableInkFor(hex) {
  const value = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const luminance = 0.2126 * value[0] + 0.7152 * value[1] + 0.0722 * value[2];
  return luminance > 0.55 ? "#151515" : "#f8f0e5";
}

// Gives a cover-based book the cover's own colour as its detail background and spine colour.
function paintCoverColor(book, color) {
  if (!color) return;
  book.coverColor = color;
  book.color = color;
  book.detailColor = color;
  book.spine = shadeHex(color, -16);
  book.spineInk = readableInkFor(book.spine);
  book.ink = readableInkFor(color);
}

async function applyCoverColor(book) {
  if (!book?.image || book.coverColor) return book;
  try {
    const colors = await fetchCoverColors([{ id: book.id, cover: book.image }]);
    paintCoverColor(book, colors[book.id]);
  } catch (error) {
    console.error(error);
  }
  return book;
}

// Books imported before this change keep their palette colours until the server has sampled their cover.
async function backfillCoverColors() {
  const pending = books.filter((book) => book.isCustom && book.image && !book.coverColor);
  if (!pending.length) return;
  try {
    for (let start = 0; start < pending.length; start += 40) {
      const batch = pending.slice(start, start + 40);
      const colors = await fetchCoverColors(batch.map((book) => ({ id: book.id, cover: book.image })));
      batch.forEach((book) => paintCoverColor(book, colors[book.id]));
    }
    writeCustomBooks();
  } catch (error) {
    console.error(error);
  }
}

function writeCustomBooks() {
  const customBooks = books.filter((book) => book.isCustom);
  window.localStorage.setItem(CUSTOM_BOOKS_STORAGE_KEY, JSON.stringify(customBooks));
}

function readGoogleBooksApiKey() {
  return String(
    window.BROOKE_GOOGLE_BOOKS_API_KEY ||
    window.localStorage.getItem(GOOGLE_BOOKS_API_KEY_STORAGE_KEY) ||
    "",
  ).trim();
}

function readSupabaseFunctionsUrl() {
  return String(window.BROOKE_SUPABASE_FUNCTIONS_URL || DEFAULT_SUPABASE_FUNCTIONS_URL).replace(/\/+$/, "");
}

function readSupabaseUrl() {
  return String(window.BROOKE_SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/+$/, "");
}

function readSupabaseAnonKey() {
  return String(window.BROOKE_SUPABASE_ANON_KEY || "").trim();
}

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  const key = readSupabaseAnonKey();
  if (!key || !window.supabase?.createClient) return null;
  supabaseClient = window.supabase.createClient(readSupabaseUrl(), key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return supabaseClient;
}

function readUserBooks() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SHELF_STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeUserBooks() {
  window.localStorage.setItem(SHELF_STORAGE_KEY, JSON.stringify(userBooks));
}

function readShowMyRoomFirst() {
  return window.localStorage.getItem(ROOM_DEFAULT_STORAGE_KEY) === "true";
}

function writeShowMyRoomFirst(value) {
  window.localStorage.setItem(ROOM_DEFAULT_STORAGE_KEY, String(value));
  syncSettingsToSupabase();
}

function readAuthSession() {
  if (supabaseSession?.user) {
    return {
      email: supabaseSession.user.email || "",
      mode: "supabase",
      userId: supabaseSession.user.id,
    };
  }
  try {
    return JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function writeAuthSession(session) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
    email: session.email || "",
    mode: session.mode || "prototype",
    createdAt: session.createdAt || new Date().toISOString(),
  }));
}

function hasAuthSession() {
  return Boolean(readAuthSession());
}

async function signInWithEmail(email) {
  const client = getSupabaseClient();
  if (!client) {
    writeAuthSession({ email, mode: "email-prototype" });
    return { mode: "prototype" };
  }
  const redirectTo = window.location.href.split("#")[0];
  const { error } = await client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) throw error;
  return { mode: "supabase" };
}

function getBookState(book) {
  return userBooks[book.id] || null;
}

function hasSavedBooks() {
  return books.some((book) => Boolean(getBookState(book)));
}

function getBookRemoteSource(book) {
  if (book.source) return book.source;
  return book.isCustom ? "manual" : "brooke";
}

function getBookRemoteSourceId(book) {
  return String(book.sourceId || book.id);
}

function rowToBook(row, offset = 0) {
  const raw = row.raw && typeof row.raw === "object" ? row.raw : {};
  return normalizeBook({
    ...raw,
    id: row.source === "weread"
      ? `weread-${slugifyText(row.source_id || row.title)}`
      : raw.id || `custom-${slugifyText(row.source_id || `${row.title}-${row.author || ""}`)}`,
    title: row.title,
    author: row.author || "作者未知",
    image: row.cover_url || raw.image || "",
    originalCover: Boolean(row.cover_url || raw.image),
    isCustom: row.source !== "brooke",
    source: row.source || "manual",
    sourceId: row.source_id || raw.sourceId || "",
    deepLink: row.deep_link || raw.deepLink || "",
  }, books.length + offset);
}

function findBookForRemoteRow(row, offset = 0) {
  const source = row.source || "manual";
  const sourceId = row.source_id || "";
  const existing = books.find((book) => getBookRemoteSource(book) === source && getBookRemoteSourceId(book) === sourceId)
    || books.find((book) => book.id === sourceId);
  if (existing) return existing;
  const book = rowToBook(row, offset);
  books.push(book);
  writeCustomBooks();
  createBook(book, books.length - 1);
  return book;
}

async function getSupabaseAccessToken() {
  const client = getSupabaseClient();
  if (!client) return "";
  const { data } = await client.auth.getSession();
  supabaseSession = data.session || null;
  return supabaseSession?.access_token || "";
}

async function syncBookStateToSupabase(book) {
  if (isSyncingRemoteShelf) return;
  const client = getSupabaseClient();
  const userId = supabaseSession?.user?.id;
  const state = getBookState(book);
  if (!client || !userId || !state) return;
  const { error } = await client.from("user_books").upsert({
    user_id: userId,
    source: getBookRemoteSource(book),
    source_id: getBookRemoteSourceId(book),
    title: book.title,
    author: book.author,
    cover_url: book.image || null,
    status: state.status || DEFAULT_STATUS,
    deep_link: book.deepLink || null,
    raw: book,
  }, { onConflict: "user_id,source,source_id" });
  if (error) console.error("Supabase user_books upsert failed", error);
}

async function removeBookStateFromSupabase(book) {
  const client = getSupabaseClient();
  const userId = supabaseSession?.user?.id;
  if (!client || !userId) return;
  const { error } = await client
    .from("user_books")
    .delete()
    .eq("user_id", userId)
    .eq("source", getBookRemoteSource(book))
    .eq("source_id", getBookRemoteSourceId(book));
  if (error) console.error("Supabase user_books delete failed", error);
}

async function loadShelfFromSupabase() {
  const client = getSupabaseClient();
  const userId = supabaseSession?.user?.id;
  if (!client || !userId || hasLoadedRemoteShelf) return;
  isSyncingRemoteShelf = true;
  const { data, error } = await client
    .from("user_books")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("Supabase user_books load failed", error);
    isSyncingRemoteShelf = false;
    return;
  }
  (data || []).forEach((row, index) => {
    const book = findBookForRemoteRow(row, index);
    userBooks[book.id] = {
      status: row.status || DEFAULT_STATUS,
      savedAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
    };
  });
  isSyncingRemoteShelf = false;
  hasLoadedRemoteShelf = true;
  writeUserBooks();
  totalBooks.textContent = String(books.length).padStart(2, "0");
  renderBookIndex();
  renderMyShelf();
  measureShelf();
  updateDetailShelfControls();
  updateOnboarding();
}

async function syncLocalShelfToSupabase() {
  const client = getSupabaseClient();
  if (!client || !supabaseSession?.user) return;
  await Promise.all(books.filter((book) => getBookState(book)).map((book) => syncBookStateToSupabase(book)));
}

async function loadSettingsFromSupabase() {
  const client = getSupabaseClient();
  const userId = supabaseSession?.user?.id;
  if (!client || !userId) return;
  const { data, error } = await client
    .from("user_settings")
    .select("room_name, show_my_room_first")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("Supabase user_settings load failed", error);
    return;
  }
  if (!data) {
    await syncSettingsToSupabase();
    return;
  }
  myRoomName = data.room_name || "Your Reading Room";
  showMyRoomFirst = Boolean(data.show_my_room_first);
  window.localStorage.setItem(ROOM_NAME_STORAGE_KEY, myRoomName);
  window.localStorage.setItem(ROOM_DEFAULT_STORAGE_KEY, String(showMyRoomFirst));
  myRoomTitle.innerHTML = formatRoomTitle(myRoomName);
  updateSpaceSwitch();
}

async function syncSettingsToSupabase() {
  const client = getSupabaseClient();
  const userId = supabaseSession?.user?.id;
  if (!client || !userId) return;
  const { error } = await client.from("user_settings").upsert({
    user_id: userId,
    room_name: myRoomName || "Your Reading Room",
    show_my_room_first: Boolean(showMyRoomFirst),
  }, { onConflict: "user_id" });
  if (error) console.error("Supabase user_settings upsert failed", error);
}

async function initializeSupabaseAuth() {
  const client = getSupabaseClient();
  if (!client) return;
  const { data, error } = await client.auth.getSession();
  if (error) {
    console.error("Supabase auth session failed", error);
    return;
  }
  supabaseSession = data.session || null;
  if (supabaseSession?.user) {
    await loadSettingsFromSupabase();
    await loadShelfFromSupabase();
    await syncLocalShelfToSupabase();
  }
  client.auth.onAuthStateChange(async (_event, session) => {
    supabaseSession = session || null;
    if (supabaseSession?.user) {
      hasLoadedRemoteShelf = false;
      await loadSettingsFromSupabase();
      await loadShelfFromSupabase();
      await syncLocalShelfToSupabase();
      if (!authGate.hidden) closeAuthGate({ restoreFocus: false, runPending: true });
    }
  });
}

function setOnboardingContent({ kicker, title, copy, primary, secondary = t("onboardingOpenRoom"), showRoom = false }) {
  shelfOnboardingKicker.textContent = kicker;
  shelfOnboardingTitle.textContent = title;
  shelfOnboardingCopy.textContent = copy;
  shelfOnboardingStart.textContent = primary;
  shelfOnboardingRoom.hidden = !showRoom;
  shelfOnboardingRoom.textContent = secondary;
}

function updateOnboarding() {
  window.clearTimeout(onboardingCloseTimer);
  // Only on the shelf itself: the detail page already has its own save control.
  const shouldShow = !hasSavedBooks() && detailIndex === null && bookIndex.hidden && myShelf.hidden && shelfHelp.hidden && addBookPanel.hidden;
  if (!shouldShow) {
    shelfOnboarding.classList.remove("is-visible");
    onboardingCloseTimer = window.setTimeout(() => {
      if (!shelfOnboarding.classList.contains("is-visible")) shelfOnboarding.hidden = true;
    }, 360);
    return;
  }

  setOnboardingContent({
    kicker: t("onboardingBuildKicker"),
    title: t("onboardingBuildTitle"),
    copy: t("onboardingBuildCopy"),
    primary: t("onboardingChoose"),
    secondary: t("onboardingStartRoom"),
    showRoom: true,
  });

  shelfOnboarding.hidden = false;
  requestAnimationFrame(() => shelfOnboarding.classList.add("is-visible"));
}

function showOnboardingRoomStep(book) {
  window.clearTimeout(onboardingCloseTimer);
  setOnboardingContent({
    kicker: t("onboardingSavedKicker"),
    title: t("onboardingSavedTitle"),
    copy: t("onboardingSavedCopy", { title: book.title }),
    primary: t("onboardingKeepBrowsing"),
    showRoom: true,
  });
  shelfOnboardingRoom.textContent = t("onboardingOpenRoom");
  shelfOnboarding.hidden = false;
  requestAnimationFrame(() => shelfOnboarding.classList.add("is-visible"));
}

function updateStaticLanguage() {
  document.documentElement.lang = "zh-Hans";

  setButtonLabel(shelfHelpToggle, "操作提示");
  setButtonLabel(bookIndexToggle, "全部书目");
  setButtonLabel(myShelfToggle, "我的空间");
  setButtonLabel(addBookToggle, t("addBook"));
  setButtonLabel(roomOnlyToggle, "进入我的空间");
  setButtonLabel(previousBook, "上一本书");
  setButtonLabel(nextBook, "下一本书");
  setButtonLabel(shelfHelpClose, t("helpClose"));
  setButtonLabel(bookIndexClose, t("returnToShelf"));
  setButtonLabel(myShelfClose, t("returnToShelf"));
  setButtonLabel(addBookClose, t("returnToShelf"));
  setButtonLabel(detailClose, t("returnToShelf"));

  setText("#shelfHelpTitle", t("helpTitle"));
  setText(".shelf-help-row:nth-of-type(1) strong", t("mouse"));
  setText(".shelf-help-row:nth-of-type(1) span", t("mouseHelp"));
  setText(".shelf-help-row:nth-of-type(2) strong", t("keyboard"));
  setText(".shelf-help-row:nth-of-type(2) span", t("keyboardHelp"));
  setText("#shelfStatus", t("shelfStatus"));
  setText("#bookIndexTitle", t("allBooks"));
  setText("#myShelfTitle", t("myShelf"));
  setText("#myShelfEmptyText", t("emptyShelf"));
  setText("#myShelfEmptyAdd", t("emptyShelfAction"));
  setText("#addBookTitle", t("addBook"));
  setText(".add-book-header p", "新增书籍");
  setText(".add-book-search label", t("searchBookLabel"));
  setText(".add-book-search button span", t("searchBookAction"));
  setText("#wereadImportForm label", "输入你的微信读书 API Key");
  setText("#wereadImportForm button span", "同步微信读书书架");
  setText("#wereadManualImportForm label", "粘贴微信读书书架里的书名，每行一本");
  setText("#wereadManualImportForm button span", "导入书名列表");
  if (wereadPickerSearch) {
    wereadPickerSearch.placeholder = t("wereadPickSearch");
    setText("#wereadPickerAll", t("wereadPickAll"));
    setText("#wereadPickerRandom", t("wereadPickRandom"));
    setText("#wereadPickerNone", t("wereadPickClear"));
    if (wereadShelfItems.length) renderWereadPicker();
    else updateWereadPickerCount();
  }
  if (wereadImportStatus && !wereadImportStatus.textContent.trim()) wereadImportStatus.textContent = t("wereadSyncIdle");
  if (addBookQuery) addBookQuery.placeholder = t("searchBookPlaceholder");
  if (addBookStatus && !addBookStatus.textContent.trim()) addBookStatus.textContent = t("searchBookIdle");
  setText(".detail-kicker", t("detailKicker"));
  setText("#myShelfEmptyText", t("emptyShelf"));
  setText("#myShelfEmptyAdd", t("emptyShelfAction"));
  updateDetailShelfControls();
  setText("#detailReturn span", t("returnToShelf"));
  setText(".my-room-heading p", t("personalReadingRoom"));
  myRoomTitle.innerHTML = formatRoomTitle(myRoomName);
  myRoomTitle.title = "点击修改房间名";
  myRoomTitle.setAttribute("aria-label", "点击修改房间名");
  myRoomNameInput.placeholder = t("roomNamePlaceholder");
  myRoomNameInput.value = myRoomName === "Your Reading Room" ? "" : myRoomName;
  myRoomNameForm.querySelector("button").textContent = t("saveRoomName");

  const bookIndexMeta = document.querySelector("#bookIndex .book-index-header p");
  if (bookIndexMeta) {
    bookIndexMeta.childNodes[0].textContent = "全部书目 / ";
    bookIndexMeta.childNodes[2].textContent = " 本";
  }
  const myShelfMeta = document.querySelector("#myShelf .book-index-header p");
  if (myShelfMeta) {
    myShelfMeta.childNodes[0].textContent = "个人书架 / ";
    myShelfMeta.childNodes[2].textContent = " 本";
  }

  myShelfFilters.setAttribute("aria-label", t("filterShelf"));
  myShelfSummary.setAttribute("aria-label", t("shelfSummary"));
  myShelfViewToggle.setAttribute("aria-label", t("shelfView"));
  myShelfRoom.setAttribute("aria-label", t("myRoomShelf"));
  detail.querySelector(".detail-shelf-actions")?.setAttribute("aria-label", t("personalShelfControls"));
  detailStatus.setAttribute("aria-label", t("readingStatus"));

  myShelfFilters.querySelector('[data-shelf-filter="all"]').textContent = t("all");
  myShelfFilters.querySelector('[data-shelf-filter="want_to_read"]').textContent = t("want");
  myShelfFilters.querySelector('[data-shelf-filter="reading"]').textContent = t("reading");
  myShelfFilters.querySelector('[data-shelf-filter="finished"]').textContent = t("finished");
  setButtonLabel(myShelfViewToggle.querySelector('[data-my-shelf-view="list"]'), t("list"));
  setButtonLabel(myShelfViewToggle.querySelector('[data-my-shelf-view="room"]'), t("room"));
  setButtonLabel(myShelfViewToggle.querySelector('[data-my-shelf-action="info"]'), "查看操作提示");
  setButtonLabel(myShelfViewToggle.querySelector('[data-my-shelf-action="add"]'), t("addBook"));
  setButtonLabel(myShelfViewToggle.querySelector('[data-my-shelf-action="brooke"]'), "回到 Brooke 的空间");
  setButtonLabel(myShelfViewToggle.querySelector('[data-my-shelf-action="previous"]'), t("previousBook"));
  setButtonLabel(myShelfViewToggle.querySelector('[data-my-shelf-action="next"]'), t("nextBook"));
  detailStatus.querySelector('[data-detail-status="want_to_read"]').textContent = t("want");
  detailStatus.querySelector('[data-detail-status="reading"]').textContent = t("reading");
  detailStatus.querySelector('[data-detail-status="finished"]').textContent = t("finished");
  updateSpaceSwitch();
  updateDetailShelfControls();
}

function openCurrentBookFromOnboarding() {
  closeShelfHelp({ immediate: true });
  const index = activeIndex ?? 0;
  const element = bookElements[index];
  if (!element) return;
  pinnedIndex = index;
  openBook(index, true);
  element.focus({ preventScroll: true });
  window.clearTimeout(detailOpenTimer);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  detailOpenTimer = window.setTimeout(() => {
    detailOpenTimer = 0;
    openBookDetail(index);
  }, prefersReducedMotion ? 20 : 420);
}

function openMyRoomFromOnboarding() {
  shelfOnboarding.classList.remove("is-visible");
  showMyRoomFirst = true;
  writeShowMyRoomFirst(showMyRoomFirst);
  const openRoom = () => requireAuth(() => openMyShelf({ view: "room", restoreFocus: false }));
  if (detailIndex !== null) {
    closeBookDetail();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(openRoom, prefersReducedMotion ? 40 : 1080);
  } else {
    openRoom();
  }
}

function saveBookState(book, status = DEFAULT_STATUS) {
  const wasEmpty = !hasSavedBooks();
  const now = new Date().toISOString();
  const previous = getBookState(book);
  userBooks[book.id] = {
    status,
    savedAt: previous?.savedAt || now,
    updatedAt: now,
  };
  writeUserBooks();
  renderMyShelf();
  updateDetailShelfControls();
  syncBookStateToSupabase(book);
  if (wasEmpty) showOnboardingRoomStep(book);
  else updateOnboarding();
}

function removeBookState(book) {
  delete userBooks[book.id];
  writeUserBooks();
  renderMyShelf();
  updateDetailShelfControls();
  removeBookStateFromSupabase(book);
  updateOnboarding();
}

function colorLuminance(value) {
  const normalized = String(value).trim().replace("#", "");
  const hex = normalized.length === 3
    ? normalized.split("").map((character) => character + character).join("")
    : normalized;
  if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
  const channels = [0, 2, 4].map((offset) => {
    const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function colorContrast(first, second) {
  const firstLuminance = colorLuminance(first);
  const secondLuminance = colorLuminance(second);
  if (firstLuminance === null || secondLuminance === null) return 0;
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function readableDetailInk(book) {
  const background = book.detailColor ?? book.color;
  if (colorContrast(background, book.ink) >= 4.5) return book.ink;
  if (colorContrast(background, book.spineInk) >= 4.5) return book.spineInk;
  const dark = "#161514";
  const light = "#f5f1e9";
  return colorContrast(background, dark) > colorContrast(background, light) ? dark : light;
}

function notifyParentTheme(book = null) {
  if (window.parent === window) return;
  let targetOrigin = "*";
  try {
    const referrerOrigin = new URL(document.referrer).origin;
    if (referrerOrigin !== "null") targetOrigin = referrerOrigin;
  } catch {
    // Local file previews have no usable parent origin.
  }
  window.parent.postMessage({
    type: "brooke:bookshelf-theme",
    state: book ? "detail" : "shelf",
    background: book ? (book.detailColor ?? book.color) : null,
    ink: book ? readableDetailInk(book) : null,
  }, targetOrigin);
}

function applyLanguage() {
  updateStaticLanguage();
  renderBookIndex();
  renderMyShelf();
  updateOnboarding();
  if (detailIndex !== null) {
    populateBookDetail(detailIndex);
  }
  window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });
}

function renderBookIndex() {
  bookIndexCount.textContent = String(books.length).padStart(2, "0");
  bookIndexList.innerHTML = books.map((book, index) => `
    <li>
      <button type="button" data-book-index="${index}" aria-label="${escapeHtml(t("openBook", { title: book.title }))}">
        <span class="book-index-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="book-index-swatch" style="--book-index-color: ${book.spine}" aria-hidden="true"></span>
        <span class="book-index-copy">
          <strong>${escapeHtml(book.title)}</strong>
          <small>${escapeHtml(book.author)}</small>
        </span>
        <i data-lucide="arrow-up-right" aria-hidden="true"></i>
      </button>
    </li>
  `).join("");
}

function renderMyShelf() {
  const allSavedEntries = books
    .map((book, index) => ({ book, index, state: getBookState(book) }))
    .filter(({ state }) => state);
  const savedEntries = books
    .map((book, index) => ({ book, index, state: getBookState(book) }))
    .filter(({ state }) => state && (myShelfFilter === "all" || state.status === myShelfFilter));
  const totalSaved = allSavedEntries.length;
  const statusCounts = allSavedEntries.reduce((counts, { state }) => {
    counts[state.status] = (counts[state.status] || 0) + 1;
    return counts;
  }, {});
  myShelfCount.textContent = String(totalSaved).padStart(2, "0");
  myShelf.classList.toggle("is-room-view", myShelfView === "room");
  myShelfEmpty.hidden = savedEntries.length > 0;
  myShelfListView.hidden = savedEntries.length === 0 || myShelfView !== "list";
  myShelfRoomView.hidden = savedEntries.length === 0 || myShelfView !== "room";
  myShelfSummary.hidden = totalSaved === 0 || myShelfView !== "list";
  myShelfSummary.innerHTML = [
    [t("saved"), totalSaved, "all"],
    [t("want"), statusCounts.want_to_read || 0, "want_to_read"],
    [t("reading"), statusCounts.reading || 0, "reading"],
    [t("finished"), statusCounts.finished || 0, "finished"],
  ].map(([label, value, filter]) => `
    <button type="button" data-summary-filter="${filter}" aria-pressed="${String(myShelfFilter === filter)}">
      <strong>${String(value).padStart(2, "0")}</strong>
      <small>${label}</small>
    </button>
  `).join("");
  myShelfList.innerHTML = savedEntries.map(({ book, index, state }) => `
    <li>
      <div class="my-shelf-item">
      <button class="my-shelf-open" type="button" data-my-shelf-index="${index}" aria-label="${escapeHtml(t("openBook", { title: book.title }))}">
        <span class="book-index-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="book-index-swatch" style="--book-index-color: ${book.spine}" aria-hidden="true"></span>
        <span class="book-index-copy">
          <strong>${escapeHtml(book.title)}</strong>
          <small>${escapeHtml(book.author)}</small>
        </span>
        <i data-lucide="arrow-up-right" aria-hidden="true"></i>
      </button>
      </div>
    </li>
  `).join("");
  myShelfRoom.innerHTML = savedEntries.map(({ book, index, state }, roomIndex) => `
    <button class="my-room-book" type="button" data-my-shelf-index="${index}" style="--room-spine: ${book.spine}; --room-ink: ${book.spineInk}; --room-width: ${book.spineWidth}px; --room-cover-width: ${book.width}px; --room-height: ${Math.round(430 * book.height)}px; --room-gap: ${Math.max(book.shelfGap, 18)}px; --room-cover: ${book.color}; --room-cover-ink: ${book.ink}; --art-opacity: ${book.opacity ?? 1}; --art-filter: ${book.filter ?? "none"}; --room-delay: ${roomIndex * 22}ms;" aria-label="${escapeHtml(t("openBook", { title: book.title }))}">
      <span class="my-room-book-cover${book.originalCover ? " has-original-cover" : ""}" aria-hidden="true">
        ${coverMarkup(book, index)}
      </span>
      <span class="my-room-book-spine">
        <span>${escapeHtml(book.title)}</span>
      </span>
      <span class="my-room-book-meta">
        <strong>${escapeHtml(book.title)}</strong>
        <small>${escapeHtml(t(STATUS_LABEL_KEYS[state.status] || "saved"))}</small>
      </span>
    </button>
  `).join("");
  myShelfRoom.querySelectorAll(".my-room-book").forEach((element, roomIndex) => {
    element.addEventListener("mouseenter", () => openMyRoomBook(roomIndex));
    element.addEventListener("mouseleave", () => {
      if (myRoomActiveIndex === roomIndex && document.activeElement !== element) resetMyRoomBooks();
    });
    element.addEventListener("focus", () => openMyRoomBook(roomIndex));
  });
  myShelfFilters.querySelectorAll("[data-shelf-filter]").forEach((button) => {
    const pressed = button.dataset.shelfFilter === myShelfFilter;
    button.setAttribute("aria-pressed", String(pressed));
  });
  myShelfViewToggle.querySelectorAll("[data-my-shelf-view]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.myShelfView === myShelfView));
  });
  window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });
}

function switchMyShelfView(nextView) {
  if (!nextView || nextView === myShelfView) return;
  window.clearTimeout(myShelfViewSwitchTimer);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    myShelfView = nextView;
    renderMyShelf();
    if (myShelfView === "room") {
      requestAnimationFrame(() => {
        if (!myShelfRoomView.hidden) openMyRoomBook(0, { focus: true });
      });
    }
    return;
  }

  myShelf.classList.add("is-view-switching");
  myShelfViewSwitchTimer = window.setTimeout(() => {
    myShelfView = nextView;
    renderMyShelf();
    requestAnimationFrame(() => {
      myShelf.classList.remove("is-view-switching");
      if (myShelfView === "room") {
        requestAnimationFrame(() => {
          if (!myShelfRoomView.hidden) openMyRoomBook(0, { focus: true });
        });
      }
    });
  }, 170);
}

function navigateMyRoom(delta) {
  if (myShelfView !== "room") {
    switchMyShelfView("room");
    window.setTimeout(() => navigateMyRoom(delta), 360);
    return;
  }
  const roomBooks = [...myShelfRoom.querySelectorAll(".my-room-book")];
  if (!roomBooks.length) return;
  const current = myRoomActiveIndex ?? 0;
  openMyRoomBook((current + delta + roomBooks.length) % roomBooks.length, { focus: true });
}

function showMyShelfToolsHint() {
  window.clearTimeout(myShelfToolsHintTimer);
  myShelfViewToggle.classList.add("is-hint-visible");
  myShelfToolsHintTimer = window.setTimeout(() => {
    myShelfViewToggle.classList.remove("is-hint-visible");
  }, 2600);
}

function bookExists(id) {
  return books.some((book) => book.id === id);
}

function coverUrlFromSearchResult(result) {
  const links = result.volumeInfo?.imageLinks || {};
  const image = links.extraLarge || links.large || links.medium || links.small || links.thumbnail || links.smallThumbnail || "";
  return image ? image.replace(/^http:/, "https:") : "";
}

function customBookFromSearchResult(result, offset = 0) {
  const info = result.volumeInfo || {};
  const title = info.title || "未命名书籍";
  const author = info.authors?.slice(0, 2).join(" / ") || "作者未知";
  const publishYear = info.publishedDate ? `出版时间：${info.publishedDate}` : "来自 Google Books 搜索。";
  const description = String(info.description || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const idSource = result.id || `${title}-${author}`;
  const paletteIndex = books.length + offset;
  const palette = CUSTOM_BOOK_PALETTE[paletteIndex % CUSTOM_BOOK_PALETTE.length];
  const cover = coverUrlFromSearchResult(result);
  return normalizeBook({
    id: `custom-${slugifyText(idSource)}`,
    title,
    author,
    color: palette[0],
    ink: palette[1],
    spine: palette[2],
    spineInk: palette[3],
    detailColor: palette[0],
    width: cover ? 300 : 270,
    spineWidth: Math.min(88, Math.max(58, Math.round(36 + title.length * 1.7))),
    height: 0.94 + (paletteIndex % 5) * 0.02,
    shelfGap: 30,
    image: cover,
    originalCover: Boolean(cover),
    description: [
      publishYear,
      description || "这本书由你搜索加入，可以继续设置为想读、在读或读完。",
    ],
    isCustom: true,
  }, paletteIndex);
}

function customBookFromWereadItem(item, offset = 0) {
  const title = item.title || item.name || "未命名书籍";
  const author = item.author || item.authorName || "作者未知";
  const idSource = item.bookId || item.albumId || `${title}-${author}`;
  const paletteIndex = books.length + offset;
  const palette = CUSTOM_BOOK_PALETTE[paletteIndex % CUSTOM_BOOK_PALETTE.length];
  const status = item.finishReading || item.finish ? "finished" : "want_to_read";
  const description = [
    item.category ? `微信读书分类：${item.category}` : "来自微信读书书架同步。",
    item.deepLink ? "这本书保留了微信读书打开链接。" : "这本书由微信读书同步加入。",
  ];
  return {
    book: normalizeBook({
      id: `weread-${slugifyText(idSource)}`,
      title,
      author,
      description,
      color: palette[0],
      ink: palette[1],
      spine: palette[2],
      spineInk: palette[3],
      detailColor: palette[0],
      width: item.cover ? 300 : 270,
      spineWidth: Math.min(88, Math.max(58, Math.round(36 + title.length * 1.7))),
      height: 0.94 + (paletteIndex % 5) * 0.02,
      shelfGap: 30,
      image: item.cover || "",
      originalCover: Boolean(item.cover),
      isCustom: true,
      source: "weread",
      sourceId: idSource,
      deepLink: item.deepLink || "",
    }, paletteIndex),
    status,
  };
}

function renderAddBookResults(results = lastSearchResults) {
  lastSearchResults = results;
  addBookResults.innerHTML = results.map((book, index) => {
    const saved = Boolean(getBookState(book)) || bookExists(book.id);
    return `
      <li>
        <article class="add-book-result">
          <div class="add-book-cover" style="--book-index-color: ${book.spine}">
            ${book.image ? `<img src="${book.image}" alt="" loading="lazy" />` : `<span>${escapeHtml(book.title.slice(0, 2))}</span>`}
          </div>
          <div class="add-book-copy">
            <h3>${escapeHtml(book.title)}</h3>
            <p>${escapeHtml(book.author)}</p>
            <small>${escapeHtml(book.description[0] || "")}</small>
          </div>
          <button type="button" data-add-book-result="${index}" ${saved ? "disabled" : ""}>
            ${saved ? t("addedSearchResult") : t("addSearchResult")}
          </button>
        </article>
      </li>
    `;
  }).join("");
}

async function searchBooks(query) {
  const trimmed = query.trim();
  if (!trimmed) return;
  addBookAbortController?.abort();
  addBookAbortController = new AbortController();
  addBookStatus.textContent = t("searchBookLoading");
  addBookResults.innerHTML = "";
  try {
    const results = (await fetchGoogleBooks(trimmed, { limit: 8, signal: addBookAbortController.signal }))
      .map((result, index) => customBookFromSearchResult(result, index));
    addBookStatus.textContent = results.length ? `找到 ${results.length} 本相关书籍` : t("searchBookEmpty");
    renderAddBookResults(results);
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error(error);
    addBookStatus.textContent = error.name === "GoogleBooksQuotaError" ? t("searchBookQuotaError") : t("searchBookError");
  } finally {
    addBookAbortController = null;
  }
}

async function fetchGoogleBooks(query, { limit = 8, signal = null } = {}) {
  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.set("q", query.trim());
  url.searchParams.set("maxResults", String(limit));
  url.searchParams.set("printType", "books");
  url.searchParams.set("projection", "lite");
  const apiKey = readGoogleBooksApiKey();
  if (apiKey) url.searchParams.set("key", apiKey);
  const response = await fetch(url, { signal });
  if (response.status === 429 || response.status === 403) {
    console.warn(`Google Books quota limited (${response.status}). Set an API key or a Supabase proxy for production.`);
    const quotaError = new Error(`Google Books quota limited: ${response.status}`);
    quotaError.name = "GoogleBooksQuotaError";
    throw quotaError;
  }
  if (!response.ok) throw new Error(`Google Books responded ${response.status}`);
  const data = await response.json();
  return (data.items || []).filter((result) => result.volumeInfo?.title);
}

async function importWereadBooks(text) {
  const titles = [...new Set(text
    .split(/\n+/)
    .map((line) => line.replace(/^\s*[\d*•\-、.]+/, "").trim())
    .filter(Boolean))].slice(0, 20);
  if (!titles.length) {
    wereadImportStatus.textContent = t("wereadImportEmpty");
    return;
  }

  let imported = 0;
  let failed = 0;
  wereadImportForm.querySelector("button").disabled = true;
  for (const [index, title] of titles.entries()) {
    wereadImportStatus.textContent = t("wereadImportLoading", { current: index + 1, total: titles.length });
    try {
      const [result] = await fetchGoogleBooks(title, { limit: 1 });
      if (!result) {
        failed += 1;
        continue;
      }
      const book = customBookFromSearchResult(result, index);
      if (!bookExists(book.id)) {
        books.push(book);
        writeCustomBooks();
        createBook(book, books.length - 1);
        imported += 1;
      }
      saveBookState(book, DEFAULT_STATUS);
    } catch (error) {
      console.error(error);
      failed += 1;
      if (error.name === "GoogleBooksQuotaError") break;
    }
  }
  totalBooks.textContent = String(books.length).padStart(2, "0");
  renderBookIndex();
  renderMyShelf();
  measureShelf();
  wereadImportStatus.textContent = failed
    ? t("wereadImportPartial", { count: imported, failed })
    : t("wereadImportDone", { count: imported });
  wereadImportForm.querySelector("button").disabled = false;
  if (imported > 0) {
    closeAddBookPanel({ restoreFocus: false });
    window.setTimeout(() => openMyShelf({ view: "room", restoreFocus: false }), 240);
  }
}

async function callSyncWereadFunction(payload) {
  const accessToken = await getSupabaseAccessToken();
  const response = await fetch(`${readSupabaseFunctionsUrl()}/sync-weread-shelf`, {
    method: "POST",
    // text/plain is a "simple" request type, so the browser sends no CORS preflight. The function parses
    // the body as JSON regardless of the header.
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || `sync failed: ${response.status}`);
    // Server-side reason (for example an invalid key), shown to the user so they can act on it.
    error.serverMessage = data.message || data.error || "";
    throw error;
  }
  return data;
}

// Step 1: read the whole WeRead shelf and show it as a list to choose from. Nothing is imported yet.
async function syncWereadShelf(apiKey) {
  const trimmed = apiKey.trim();
  if (!trimmed) {
    wereadImportStatus.textContent = t("wereadApiKeyEmpty");
    return;
  }

  const button = wereadImportForm.querySelector("button");
  button.disabled = true;
  wereadImportStatus.textContent = t("wereadSyncLoading");

  try {
    const data = await callSyncWereadFunction({ wereadApiKey: trimmed, mode: "list" });
    if (!Array.isArray(data.items)) {
      // An older function deployment ignores `mode` and returns `books` instead.
      const outdated = new Error("sync-weread-shelf does not support list mode");
      outdated.name = "WereadFunctionOutdated";
      throw outdated;
    }

    wereadShelfItems = data.items;
    wereadSessionKey = trimmed;
    wereadPickedIds.clear();
    wereadApiKey.value = "";
    wereadPickerSearch.value = "";
    wereadPicker.hidden = false;
    renderWereadPicker();
    wereadImportStatus.textContent = wereadShelfItems.length
      ? t("wereadListDone", { count: wereadShelfItems.length })
      : t("wereadListEmpty");
  } catch (error) {
    console.error(error);
    // Without a server reply (blocked or unreachable request), fall back to the browser's own error text.
    const reason = error.serverMessage || error.message;
    const detail = reason ? ` ${t("wereadReason")}: ${reason}` : "";
    wereadImportStatus.textContent = error.name === "WereadFunctionOutdated"
      ? t("wereadFunctionOutdated")
      : `${t("wereadSyncError")}${detail}`;
  } finally {
    button.disabled = false;
  }
}

function wereadBookIdFor(item) {
  return `weread-${slugifyText(item.id || `${item.title}-${item.author}`)}`;
}

function wereadItemOnShelf(item) {
  return bookExists(wereadBookIdFor(item));
}

function visibleWereadItems() {
  const query = wereadPickerSearch.value.trim().toLowerCase();
  if (!query) return wereadShelfItems;
  return wereadShelfItems.filter((item) => `${item.title} ${item.author}`.toLowerCase().includes(query));
}

function updateWereadPickerCount() {
  const count = wereadPickedIds.size;
  wereadPickerCount.textContent = t("wereadPickCount", { count, max: WEREAD_MAX_PICK });
  wereadPickerImport.disabled = count === 0 || wereadImporting;
  wereadPickerImport.textContent = count ? t("wereadPickImport", { count }) : t("wereadPickImportIdle");
}

function renderWereadPicker() {
  const rows = visibleWereadItems().map((item) => {
    const onShelf = wereadItemOnShelf(item);
    const row = document.createElement("li");
    row.className = `weread-pick${onShelf ? " is-on-shelf" : ""}`;

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = wereadPickedIds.has(item.id);
    checkbox.disabled = onShelf;
    checkbox.addEventListener("change", () => {
      if (!checkbox.checked) {
        wereadPickedIds.delete(item.id);
      } else if (wereadPickedIds.size >= WEREAD_MAX_PICK) {
        checkbox.checked = false;
        wereadImportStatus.textContent = t("wereadPickLimit", { max: WEREAD_MAX_PICK });
        return;
      } else {
        wereadPickedIds.add(item.id);
      }
      updateWereadPickerCount();
    });

    const title = document.createElement("span");
    title.className = "weread-pick-title";
    title.textContent = item.title;
    const meta = document.createElement("span");
    meta.className = "weread-pick-meta";
    meta.textContent = onShelf ? t("wereadPickOnShelf") : [item.author, item.category].filter(Boolean).join(" · ");

    label.append(checkbox, title, meta);
    row.append(label);
    return row;
  });

  if (!rows.length) {
    const empty = document.createElement("li");
    empty.className = "weread-pick-empty";
    empty.textContent = t("wereadPickEmpty");
    rows.push(empty);
  }
  wereadPickerList.replaceChildren(...rows);
  updateWereadPickerCount();
}

function selectWereadItems(items) {
  let capped = false;
  for (const item of items) {
    if (wereadItemOnShelf(item)) continue;
    if (wereadPickedIds.size >= WEREAD_MAX_PICK) {
      capped = true;
      break;
    }
    wereadPickedIds.add(item.id);
  }
  if (capped) wereadImportStatus.textContent = t("wereadPickLimit", { max: WEREAD_MAX_PICK });
  renderWereadPicker();
}

function pickRandomWereadItems() {
  const pool = wereadShelfItems.filter((item) => !wereadItemOnShelf(item));
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swap]] = [pool[swap], pool[index]];
  }
  wereadPickedIds.clear();
  selectWereadItems(pool.slice(0, WEREAD_RANDOM_PICK));
}

function resetWereadPicker() {
  wereadShelfItems = [];
  wereadPickedIds.clear();
  wereadSessionKey = "";
  wereadPickerSearch.value = "";
  wereadPicker.hidden = true;
  wereadPickerList.replaceChildren();
}

async function addWereadItems(items) {
  let imported = 0;
  for (const [index, item] of items.entries()) {
    const { book, status } = customBookFromWereadItem(item, index);
    if (!bookExists(book.id)) {
      paintCoverColor(book, item.coverColor);
      books.push(book);
      writeCustomBooks();
      createBook(book, books.length - 1);
      imported += 1;
    }
    saveBookState(book, status || DEFAULT_STATUS);
  }
  totalBooks.textContent = String(books.length).padStart(2, "0");
  renderBookIndex();
  renderMyShelf();
  measureShelf();
  return imported;
}

// Step 2: import only the ticked books. The server re-reads the shelf and matches these IDs against it.
async function importSelectedWereadBooks() {
  if (!wereadPickedIds.size) {
    wereadImportStatus.textContent = t("wereadPickNone");
    return;
  }
  if (!wereadSessionKey) {
    wereadImportStatus.textContent = t("wereadApiKeyEmpty");
    return;
  }

  wereadImporting = true;
  updateWereadPickerCount();
  wereadImportStatus.textContent = t("wereadImportingSelected");
  try {
    const data = await callSyncWereadFunction({
      wereadApiKey: wereadSessionKey,
      mode: "import",
      bookIds: [...wereadPickedIds],
    });
    const picked = Array.isArray(data.books) ? data.books : [];
    const imported = await addWereadItems(picked);
    wereadImportStatus.textContent = t("wereadImportDone", { count: imported });
    resetWereadPicker();
    if (imported > 0) {
      closeAddBookPanel({ restoreFocus: false });
      window.setTimeout(() => openMyShelf({ view: "room", restoreFocus: false }), 240);
    }
  } catch (error) {
    console.error(error);
    wereadImportStatus.textContent = t("wereadSyncError");
  } finally {
    wereadImporting = false;
    updateWereadPickerCount();
  }
}

async function addCustomBook(book) {
  await applyCoverColor(book);
  if (!bookExists(book.id)) {
    books.push(book);
    writeCustomBooks();
    createBook(book, books.length - 1);
    totalBooks.textContent = String(books.length).padStart(2, "0");
    renderBookIndex();
    measureShelf();
  }
  saveBookState(book, DEFAULT_STATUS);
  renderAddBookResults();
  closeAddBookPanel({ restoreFocus: false });
  window.setTimeout(() => openMyShelf({ view: "room", restoreFocus: false }), 240);
}

function openMyRoomBook(roomIndex, { focus = false } = {}) {
  const roomBooks = [...myShelfRoom.querySelectorAll(".my-room-book")];
  const active = roomBooks[roomIndex];
  if (!active) return;
  myRoomActiveIndex = roomIndex;
  const coverWidth = Number.parseFloat(getComputedStyle(active).getPropertyValue("--room-cover-width"));
  const spineWidth = Number.parseFloat(getComputedStyle(active).getPropertyValue("--room-width"));
  const extra = Math.max(0, coverWidth - spineWidth);
  const beforeShift = -extra * 0.34;
  const afterShift = extra * 0.66;
  const activeShift = beforeShift;

  roomBooks.forEach((book, index) => {
    const shift = index < roomIndex ? beforeShift : index > roomIndex ? afterShift : activeShift;
    book.classList.toggle("is-open", index === roomIndex);
    book.style.setProperty("--room-shift", `${Math.round(shift)}px`);
  });
  if (focus) active.focus({ preventScroll: true });
  active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
}

function resetMyRoomBooks() {
  myRoomActiveIndex = null;
  myShelfRoom.querySelectorAll(".my-room-book").forEach((book) => {
    book.classList.remove("is-open");
    book.style.setProperty("--room-shift", "0px");
  });
}

function updateDetailShelfControls() {
  if (detailIndex === null) return;
  const book = books[detailIndex];
  const state = getBookState(book);
  const status = state?.status || "";
  detailSave.classList.toggle("is-saved", Boolean(state));
  detailSaveLabel.textContent = state ? t("onShelf") : t("addToShelf");
  detailSave.setAttribute("aria-pressed", String(Boolean(state)));
  let activeStatusIndex = -1;
  detailStatus.querySelectorAll("[data-detail-status]").forEach((button, index) => {
    const pressed = Boolean(state) && button.dataset.detailStatus === status;
    button.setAttribute("aria-pressed", String(pressed));
    if (pressed) activeStatusIndex = index;
  });
  const statusOptions = detailStatus.querySelector(".detail-status-options");
  statusOptions?.classList.toggle("has-active-status", activeStatusIndex >= 0);
  statusOptions?.style.setProperty("--active-index", String(Math.max(activeStatusIndex, 0)));
}

function closeShelfHelp({ restoreFocus = false, immediate = false } = {}) {
  if (shelfHelp.hidden) return;
  window.clearTimeout(shelfHelpCloseTimer);
  shelfHelp.classList.remove("is-visible");
  shelfHelp.setAttribute("aria-hidden", "true");
  shelfHelpToggle.setAttribute("aria-expanded", "false");
  const finish = () => {
    if (!shelfHelp.classList.contains("is-visible")) shelfHelp.hidden = true;
  };
  if (immediate) finish();
  else shelfHelpCloseTimer = window.setTimeout(finish, 240);
  if (restoreFocus) viewport.focus({ preventScroll: true });
}

function toggleShelfHelp() {
  if (!shelfHelp.hidden) {
    closeShelfHelp({ restoreFocus: true });
    return;
  }
  window.clearTimeout(shelfHelpCloseTimer);
  shelfHelp.hidden = false;
  shelfHelp.setAttribute("aria-hidden", "false");
  shelfHelpToggle.setAttribute("aria-expanded", "true");
  requestAnimationFrame(() => shelfHelp.classList.add("is-visible"));
}

function openBookIndex() {
  if (detailIndex !== null) return;
  activeSpace = "brooke";
  updateSpaceSwitch();
  closeShelfHelp({ immediate: true });
  closeMyShelf({ restoreFocus: false, immediate: true });
  closeAddBookPanel({ restoreFocus: false, immediate: true });
  window.clearTimeout(bookIndexCloseTimer);
  pinnedIndex = null;
  if (activeIndex !== null) closeBook(activeIndex, true);
  bookElements.forEach((element) => element.classList.remove("is-hovered"));
  bookIndex.hidden = false;
  bookIndex.setAttribute("aria-hidden", "false");
  bookIndexToggle.setAttribute("aria-expanded", "true");
  updateOnboarding();
  requestAnimationFrame(() => {
    library.classList.add("is-index-open");
    bookIndex.classList.add("is-visible");
    bookIndexClose.focus({ preventScroll: true });
  });
}

function closeBookIndex({ restoreFocus = true, immediate = false } = {}) {
  if (bookIndex.hidden) return;
  window.clearTimeout(bookIndexCloseTimer);
  library.classList.remove("is-index-open");
  bookIndex.classList.remove("is-visible");
  bookIndex.setAttribute("aria-hidden", "true");
  bookIndexToggle.setAttribute("aria-expanded", "false");
  const finish = () => {
    if (!bookIndex.classList.contains("is-visible")) bookIndex.hidden = true;
  };
  if (immediate) finish();
  else bookIndexCloseTimer = window.setTimeout(finish, 480);
  if (restoreFocus) bookIndexToggle.focus({ preventScroll: true });
  updateOnboarding();
}

function openAddBookPanel() {
  if (detailIndex !== null) return;
  activeSpace = "user";
  updateSpaceSwitch();
  closeShelfHelp({ immediate: true });
  closeBookIndex({ restoreFocus: false, immediate: true });
  closeMyShelf({ restoreFocus: false, immediate: true });
  window.clearTimeout(addBookCloseTimer);
  pinnedIndex = null;
  if (activeIndex !== null) closeBook(activeIndex, true);
  addBookPanel.hidden = false;
  addBookPanel.setAttribute("aria-hidden", "false");
  addBookToggle.setAttribute("aria-expanded", "true");
  updateOnboarding();
  requestAnimationFrame(() => {
    library.classList.add("is-add-book-open");
    addBookPanel.classList.add("is-visible");
    addBookQuery.focus({ preventScroll: true });
  });
}

function closeAddBookPanel({ restoreFocus = true, immediate = false } = {}) {
  if (addBookPanel.hidden) return;
  activeSpace = "brooke";
  updateSpaceSwitch();
  window.clearTimeout(addBookCloseTimer);
  addBookAbortController?.abort();
  addBookAbortController = null;
  library.classList.remove("is-add-book-open");
  addBookPanel.classList.remove("is-visible");
  addBookPanel.setAttribute("aria-hidden", "true");
  addBookToggle.setAttribute("aria-expanded", "false");
  const finish = () => {
    if (!addBookPanel.classList.contains("is-visible")) addBookPanel.hidden = true;
  };
  if (immediate) finish();
  else addBookCloseTimer = window.setTimeout(finish, 480);
  if (restoreFocus) addBookToggle.focus({ preventScroll: true });
  updateOnboarding();
}

function openAuthGate(action) {
  pendingAuthAction = action;
  closeShelfHelp({ immediate: true });
  closeBookIndex({ restoreFocus: false, immediate: true });
  closeMyShelf({ restoreFocus: false, immediate: true });
  closeAddBookPanel({ restoreFocus: false, immediate: true });
  window.clearTimeout(authGateCloseTimer);
  authGate.hidden = false;
  authGate.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => {
    library.classList.add("is-auth-gate-open");
    authGate.classList.add("is-visible");
    authEmail.focus({ preventScroll: true });
  });
}

function closeAuthGate({ restoreFocus = true, immediate = false, runPending = false } = {}) {
  if (authGate.hidden) return;
  window.clearTimeout(authGateCloseTimer);
  authGate.classList.remove("is-visible");
  authGate.setAttribute("aria-hidden", "true");
  library.classList.remove("is-auth-gate-open");
  const action = pendingAuthAction;
  pendingAuthAction = null;
  const finish = () => {
    if (!authGate.classList.contains("is-visible")) authGate.hidden = true;
    if (runPending && typeof action === "function") action();
  };
  if (immediate) finish();
  else authGateCloseTimer = window.setTimeout(finish, 280);
  if (restoreFocus && !runPending) myShelfToggle.focus({ preventScroll: true });
}

function requireAuth(action) {
  if (hasAuthSession()) {
    action();
    return;
  }
  openAuthGate(action);
}

function openUserSpace({ restoreFocus = false } = {}) {
  activeSpace = "user";
  showMyRoomFirst = true;
  writeShowMyRoomFirst(showMyRoomFirst);
  updateSpaceSwitch();
  openMyShelf({ view: "room", restoreFocus });
}

function openBrookeSpace({ restoreFocus = false } = {}) {
  showMyRoomFirst = false;
  writeShowMyRoomFirst(showMyRoomFirst);
  closeAddBookPanel({ restoreFocus: false, immediate: true });
  if (myShelf.hidden) {
    activeSpace = "brooke";
    updateSpaceSwitch();
  } else {
    closeMyShelf({ restoreFocus, immediate: false, targetSpace: "brooke" });
  }
}

function openMyShelf({ view = myShelfView, restoreFocus = true } = {}) {
  if (detailIndex !== null) return;
  activeSpace = "user";
  updateSpaceSwitch();
  closeShelfHelp({ immediate: true });
  closeBookIndex({ restoreFocus: false, immediate: true });
  closeAddBookPanel({ restoreFocus: false, immediate: true });
  window.clearTimeout(myShelfCloseTimer);
  myShelfView = view;
  pinnedIndex = null;
  if (activeIndex !== null) closeBook(activeIndex, true);
  bookElements.forEach((element) => element.classList.remove("is-hovered"));
  renderMyShelf();
  myShelf.hidden = false;
  myShelf.setAttribute("aria-hidden", "false");
  myShelfToggle.setAttribute("aria-expanded", "true");
  updateOnboarding();
  requestAnimationFrame(() => {
    library.classList.add("is-my-shelf-open");
    myShelf.classList.add("is-visible");
    if (myShelfView === "room" && !myShelfRoomView.hidden) openMyRoomBook(0, { focus: true });
    else if (restoreFocus) myShelfClose.focus({ preventScroll: true });
  });
}

function closeMyShelf({ restoreFocus = true, immediate = false, targetSpace = "brooke" } = {}) {
  if (myShelf.hidden) return;
  window.clearTimeout(myShelfCloseTimer);
  library.classList.remove("is-my-shelf-open");
  myShelf.classList.remove("is-visible");
  myShelf.setAttribute("aria-hidden", "true");
  myShelfToggle.setAttribute("aria-expanded", "false");
  const finish = () => {
    if (!myShelf.classList.contains("is-visible")) {
      myShelf.hidden = true;
      myShelf.classList.remove("is-room-view");
      myShelfView = "list";
      activeSpace = targetSpace;
      updateSpaceSwitch();
    }
  };
  if (immediate) finish();
  else myShelfCloseTimer = window.setTimeout(finish, 480);
  if (restoreFocus) myShelfToggle.focus({ preventScroll: true });
  updateOnboarding();
}

function openBookFromMyShelf(index) {
  closeMyShelf({ restoreFocus: false, immediate: true });
  pinnedIndex = index;
  openBook(index, true);
  window.clearTimeout(detailOpenTimer);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  detailOpenTimer = window.setTimeout(() => {
    detailOpenTimer = 0;
    openBookDetail(index);
  }, prefersReducedMotion ? 20 : 180);
}

function openBookFromMyRoom(index, sourceButton) {
  const sourceElement = sourceButton.querySelector(".my-room-book-cover") || sourceButton;
  const roomBooks = [...myShelfRoom.querySelectorAll(".my-room-book")];
  const roomIndex = roomBooks.indexOf(sourceButton);
  const wasOpen = sourceButton.classList.contains("is-open");
  if (roomIndex >= 0) openMyRoomBook(roomIndex);
  window.clearTimeout(detailOpenTimer);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  detailOpenTimer = window.setTimeout(() => {
    detailOpenTimer = 0;
    openBookDetail(index, { sourceElement, sourceMode: "my-room" });
  }, prefersReducedMotion ? 20 : wasOpen ? 80 : 420);
}

function openBookFromIndex(index) {
  closeBookIndex({ restoreFocus: false, immediate: true });
  pinnedIndex = index;
  openBook(index, true);
  window.clearTimeout(detailOpenTimer);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  detailOpenTimer = window.setTimeout(() => {
    detailOpenTimer = 0;
    openBookDetail(index);
  }, prefersReducedMotion ? 20 : 180);
}

function coverMarkup(book, index) {
  const safeTitle = escapeHtml(book.title);
  const safeAuthor = escapeHtml(book.author);
  if (book.originalCover && book.image) {
    return `<img class="cover-art cover-art--original" src="${book.image}" alt="" draggable="false" />`;
  }
  const coverArt = book.image
    ? `<img class="cover-art" src="${book.image}" alt="" draggable="false" />`
    : "";
  return `
    <span class="cover-series"><span>${escapeHtml(t("selectedPages"))}</span><span>${String(index + 1).padStart(2, "0")}</span></span>
    <span class="cover-main">
      ${coverArt}
      <span class="cover-rule"></span>
      <span class="cover-title">${safeTitle}</span>
    </span>
    <span class="cover-author">${safeAuthor}</span>
  `;
}

function createBook(book, index) {
  const element = document.createElement("button");
  element.className = "book-slot";
  element.type = "button";
  element.dataset.index = String(index);
  element.dataset.openSide = "right";
  element.setAttribute("aria-label", `${book.title}, 作者：${book.author}`);
  element.setAttribute("aria-expanded", "false");
  element.setAttribute("aria-controls", "bookDetail");
  element.setAttribute("aria-haspopup", "dialog");
  element.style.setProperty("--book-width", `${book.width}px`);
  element.style.setProperty("--spine-width", `${book.spineWidth}px`);
  element.style.setProperty("--cover", book.color);
  element.style.setProperty("--cover-ink", book.ink);
  element.style.setProperty("--spine", book.spine);
  element.style.setProperty("--spine-ink", book.spineInk);
  element.style.setProperty("--art-opacity", String(book.opacity ?? 1));
  element.style.setProperty("--art-filter", book.filter ?? "none");

  const safeTitle = escapeHtml(book.title);
  element.innerHTML = `
    <span class="book-object" aria-hidden="true">
      <span class="book-back"></span>
      <span class="book-page-edge"></span>
      <span class="book-cover${book.originalCover ? " has-original-cover" : ""}">${coverMarkup(book, index)}</span>
    </span>
    <span class="book-spine" aria-hidden="true"><span class="spine-title">${safeTitle}</span></span>
    <span class="book-hit-area" aria-hidden="true"></span>
  `;

  const hitArea = element.querySelector(".book-hit-area");
  hitArea.addEventListener("mouseenter", () => {
    if (isDragging) return;
    if (pinnedIndex !== null && pinnedIndex !== index) return;
    element.classList.add("is-hovered");
    if (pinnedIndex === null) openBook(index, false);
  });
  element.addEventListener("mouseleave", () => {
    element.classList.remove("is-hovered");
    if (pinnedIndex === null && activeIndex === index) closeBook(index);
  });
  element.addEventListener("click", (event) => {
    if (hasDragged) {
      event.preventDefault();
      return;
    }

    const wasOpen = activeIndex === index && element.classList.contains("is-open");
    window.clearTimeout(detailOpenTimer);
    pinnedIndex = index;
    openBook(index, true);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    detailOpenTimer = window.setTimeout(() => {
      detailOpenTimer = 0;
      openBookDetail(index);
    }, prefersReducedMotion ? 20 : wasOpen ? 80 : 420);
  });

  track.append(element);
  bookElements.push(element);
}

function measureShelf() {
  const availableHeight = viewport.clientHeight;
  const maximumHeight = Math.max(260, Math.min(430, availableHeight - 8));
  let cursor = 0;
  books.forEach((book, index) => {
    const element = bookElements[index];
    element.style.setProperty("--book-height", `${Math.round(maximumHeight * book.height)}px`);
    element.style.setProperty("--x", `${cursor}px`);
    cursor += book.spineWidth + (shelfGaps[index] ?? book.shelfGap ?? 24);
  });
  const sidePadding = Math.max(190, viewport.clientWidth * 0.38);
  track.style.setProperty("--track-pad", `${Math.ceil(sidePadding)}px`);
  track.style.setProperty("--track-width", `${Math.ceil(cursor + sidePadding * 2)}px`);
  if (activeIndex !== null) applyBookShifts(activeIndex);
  if (!didSetInitialScroll) {
    didSetInitialScroll = true;
    requestAnimationFrame(() => {
      viewport.scrollLeft = Math.max(0, (viewport.scrollWidth - viewport.clientWidth) / 2);
      viewport.scrollTop = 0;
    });
  }
}

function getOpenSide(index) {
  const element = bookElements[index];
  const bounds = element.getBoundingClientRect();
  const coverWidth = books[index].width;
  const leftRoom = bounds.left - viewport.getBoundingClientRect().left;
  const rightRoom = viewport.getBoundingClientRect().right - bounds.right;

  if (coverWidth + 24 > rightRoom && leftRoom > rightRoom) return "left";
  if (coverWidth + 24 > leftRoom && rightRoom >= leftRoom) return "right";
  return bounds.left + bounds.width / 2 > window.innerWidth / 2 ? "left" : "right";
}

function applyBookShifts(index) {
  const book = books[index];
  const openSide = bookElements[index].dataset.openSide;
  const extra = book.width - book.spineWidth;
  const beforeShift = openSide === "right" ? -extra * 0.34 : -extra * 0.68;
  const afterShift = openSide === "right" ? extra * 0.66 : extra * 0.32;
  const activeShift = openSide === "right" ? beforeShift : afterShift;

  bookElements.forEach((element, itemIndex) => {
    const shift = itemIndex < index ? beforeShift : itemIndex > index ? afterShift : activeShift;
    element.style.setProperty("--shift", `${Math.round(shift)}px`);
    element.style.setProperty("--hit-shift", `${Math.round(-shift)}px`);
  });
}

function keepCoverInView(index) {
  const element = bookElements[index];
  const correctPosition = (behavior) => {
    if (!element.classList.contains("is-open") || detailIndex !== null) return;
    const object = element.querySelector(".book-object");
    const bounds = object.getBoundingClientRect();
    const viewBounds = viewport.getBoundingClientRect();
    const inset = 18;
    let delta = 0;
    if (bounds.left < viewBounds.left + inset) delta = bounds.left - viewBounds.left - inset;
    if (bounds.right > viewBounds.right - inset) delta = bounds.right - viewBounds.right + inset;
    if (Math.abs(delta) > 1) viewport.scrollBy({ left: delta, behavior });
  };

  window.setTimeout(() => correctPosition("smooth"), 90);
  window.setTimeout(() => correctPosition("auto"), 620);
}

function openBook(index, pin = false) {
  if (activeIndex === index && bookElements[index].classList.contains("is-open")) return;
  if (activeIndex !== null && activeIndex !== index) closeBook(activeIndex, true);

  const element = bookElements[index];
  const side = getOpenSide(index);
  activeIndex = index;
  if (pin) pinnedIndex = index;
  element.dataset.openSide = side;
  element.classList.add("is-open");
  element.setAttribute("aria-expanded", "true");
  applyBookShifts(index);
  activeTitle.textContent = `${books[index].title} / ${books[index].author}`;
  activeNumber.textContent = String(index + 1).padStart(2, "0");
  keepCoverInView(index);
}

function resetBookShifts() {
  bookElements.forEach((element) => {
    element.style.setProperty("--shift", "0px");
    element.style.setProperty("--hit-shift", "0px");
  });
}

function closeBook(index, force = false) {
  if (!force && pinnedIndex === index) return;
  const element = bookElements[index];
  element.classList.remove("is-open");
  element.setAttribute("aria-expanded", "false");
  if (activeIndex === index) activeIndex = null;
  resetBookShifts();
}

function getDetailBookRect(index = detailIndex ?? activeIndex ?? 0) {
  const compact = window.innerWidth <= 720;
  const shortCompact = compact && window.innerHeight <= 640;
  const book = books[index];
  const coverRatio = book.coverRatio || 2 / 3;
  const idealWidth = compact
    ? Math.min(174, window.innerWidth * 0.44)
    : Math.min(330, Math.max(290, window.innerWidth * 0.25));
  const maxHeight = compact
    ? window.innerHeight * (shortCompact ? 0.34 : 0.42)
    : window.innerHeight * 0.7;
  const height = Math.min(idealWidth / coverRatio, maxHeight);
  const width = height * coverRatio;
  const left = compact
    ? (window.innerWidth - width) / 2
    : window.innerWidth * 0.25 - width / 2;
  const top = compact
    ? Math.max(shortCompact ? 56 : 72, window.innerHeight * (shortCompact ? 0.08 : 0.11))
    : window.innerHeight * 0.53 - height / 2;
  return { left, top, width, height };
}

function getShellTransform(rect, shellRect) {
  const scaleX = rect.width / shellRect.width;
  const scaleY = rect.height / shellRect.height;
  return `translate3d(${rect.left}px, ${rect.top}px, 0) scale(${scaleX}, ${scaleY})`;
}

function populateBookDetail(index) {
  const book = books[index];
  detail.style.setProperty("--detail-bg", book.detailColor ?? book.color);
  detail.style.setProperty("--detail-ink", readableDetailInk(book));
  // The space switch sits outside .book-detail, so it reads its own copy of the ink from the root.
  document.documentElement.style.setProperty("--detail-tab-ink", readableDetailInk(book));
  detail.style.setProperty("--cover", book.color);
  detail.style.setProperty("--cover-ink", book.ink);
  detail.style.setProperty("--spine", book.spine);
  detail.style.setProperty("--spine-ink", book.spineInk);
  detail.style.setProperty("--art-opacity", String(book.opacity ?? 1));
  detail.style.setProperty("--art-filter", book.filter ?? "none");
  detailFront.innerHTML = coverMarkup(book, index);
  detailNumber.textContent = `${String(index + 1).padStart(2, "0")} / ${String(books.length).padStart(2, "0")}`;
  detailTitle.textContent = book.title;
  detailAuthor.textContent = book.author;
  detailDescription.innerHTML = book.description
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
  updateDetailShelfControls();
}

function positionDetailBook(index = detailIndex ?? activeIndex ?? 0) {
  const target = getDetailBookRect(index);
  detailBookShell.style.width = `${target.width}px`;
  detailBookShell.style.height = `${target.height}px`;
  detailBookShell.style.transform = `translate3d(${target.left}px, ${target.top}px, 0) scale(1)`;
}

function openBookDetail(index, { sourceElement = null, sourceMode = "shelf" } = {}) {
  if (detailIndex !== null) return;
  if (sourceMode === "shelf" && activeIndex !== index) return;
  closeShelfHelp({ immediate: true });
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const source = sourceElement || bookElements[index].querySelector(".book-object");
  const sourceRect = source.getBoundingClientRect();
  const target = getDetailBookRect(index);
  detailOriginRect = {
    left: sourceRect.left,
    top: sourceRect.top,
    width: sourceRect.width,
    height: sourceRect.height,
  };
  window.clearTimeout(detailCopyTimer);
  window.clearTimeout(detailSettleTimer);
  window.clearTimeout(detailCloseTimer);
  detailIndex = index;
  detailSourceElement = sourceMode === "my-room" ? source.closest(".my-room-book") : bookElements[index];
  detailSourceMode = sourceMode;
  populateBookDetail(index);
  notifyParentTheme(books[index]);
  detailCopy.classList.remove("is-visible");
  detail.classList.remove("is-returning");
  detail.classList.remove("is-settled");
  detail.hidden = false;
  detail.setAttribute("aria-hidden", "false");
  updateOnboarding();
  if (detailSourceMode === "my-room") {
    myShelf.setAttribute("aria-hidden", "true");
    myShelf.setAttribute("inert", "");
    myShelf.inert = true;
  } else {
    masthead.setAttribute("aria-hidden", "true");
    shelfRegion.setAttribute("aria-hidden", "true");
    shelfRegion.setAttribute("inert", "");
    shelfRegion.inert = true;
  }
  detailBookShell.style.width = `${target.width}px`;
  detailBookShell.style.height = `${target.height}px`;
  detailBookShell.style.transform = getShellTransform(detailOriginRect, target);
  detailBookShell.getBoundingClientRect();

  requestAnimationFrame(() => {
    library.classList.add("is-detail-open");
    detail.classList.add("is-visible");
    detailSourceElement?.classList.add("is-detail-source");
    positionDetailBook(index);
    detailCopyTimer = window.setTimeout(() => {
      detailCopy.classList.add("is-visible");
    }, prefersReducedMotion ? 20 : 560);
    detailSettleTimer = window.setTimeout(() => {
      detail.classList.add("is-settled");
      detailCopy.focus({ preventScroll: true });
    }, prefersReducedMotion ? 40 : 980);
  });
}

function closeBookDetail() {
  if (detailIndex === null || detail.classList.contains("is-returning")) return;
  const returnIndex = detailIndex;
  const target = getDetailBookRect();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.clearTimeout(detailCopyTimer);
  window.clearTimeout(detailSettleTimer);
  window.clearTimeout(detailCloseTimer);
  detail.classList.add("is-returning");
  detail.classList.remove("is-settled");
  detailCopy.classList.remove("is-visible");
  library.classList.remove("is-detail-open");
  notifyParentTheme();
  if (detailOriginRect) detailBookShell.style.transform = getShellTransform(detailOriginRect, target);

  detailCloseTimer = window.setTimeout(() => {
    detailSourceElement?.classList.remove("is-detail-source");
    detail.hidden = true;
    detail.setAttribute("aria-hidden", "true");
    detail.classList.remove("is-visible");
    detail.classList.remove("is-returning");
    detailIndex = null;
    pinnedIndex = null;
    if (detailSourceMode === "my-room") {
      myShelf.removeAttribute("aria-hidden");
      myShelf.removeAttribute("inert");
      myShelf.inert = false;
      detailSourceElement?.focus({ preventScroll: true });
    } else {
      masthead.removeAttribute("aria-hidden");
      shelfRegion.removeAttribute("aria-hidden");
      shelfRegion.removeAttribute("inert");
      shelfRegion.inert = false;
      bookElements[returnIndex].classList.remove("is-hovered");
      closeBook(returnIndex, true);
      bookElements[returnIndex].focus({ preventScroll: true });
    }
    detailSourceElement = null;
    detailSourceMode = "shelf";
    updateOnboarding();
  }, prefersReducedMotion ? 20 : 1040);
}

function navigateTo(index) {
  const normalized = (index + books.length) % books.length;
  pinnedIndex = normalized;
  openBook(normalized, true);
  const element = bookElements[normalized];
  const viewBounds = viewport.getBoundingClientRect();
  const bounds = element.getBoundingClientRect();
  viewport.scrollBy({
    left: bounds.left - viewBounds.left - viewBounds.width / 2 + bounds.width / 2,
    behavior: "smooth",
  });
  element.focus({ preventScroll: true });
}

books.forEach(createBook);
totalBooks.textContent = String(books.length).padStart(2, "0");
activeTitle.textContent = books[0].title;
applyLanguage();
measureShelf();
backfillCoverColors();

// Wheel and trackpad deltas are large, so scale them down to move roughly one book at a time.
const WHEEL_SCROLL_SCALE = 0.3;
viewport.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaY) < 0.1 && Math.abs(event.deltaX) < 0.1) return;
  event.preventDefault();
  // deltaMode 1 means "lines" (classic mouse wheel), so convert to pixels first.
  const lineSize = event.deltaMode === 1 ? 16 : 1;
  viewport.scrollLeft += (event.deltaY + event.deltaX) * lineSize * WHEEL_SCROLL_SCALE;
}, { passive: false });

viewport.addEventListener("scroll", () => {
  if (viewport.scrollTop !== 0) viewport.scrollTop = 0;
});

viewport.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  dragStartX = event.clientX;
  dragStartScroll = viewport.scrollLeft;
  isDragging = true;
  hasDragged = false;
});

viewport.addEventListener("pointermove", (event) => {
  if (!isDragging) return;
  const distance = event.clientX - dragStartX;
  if (Math.abs(distance) > 5 && !hasDragged) {
    hasDragged = true;
    bookElements.forEach((element) => element.classList.remove("is-hovered"));
    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(event.pointerId);
  }
  if (!hasDragged) return;
  viewport.scrollLeft = dragStartScroll - distance;
});

function endDrag(event) {
  if (!isDragging) return;
  isDragging = false;
  viewport.classList.remove("is-dragging");
  if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
  window.setTimeout(() => {
    hasDragged = false;
  }, 0);
}

viewport.addEventListener("pointerup", endDrag);
viewport.addEventListener("pointercancel", endDrag);

previousBook.addEventListener("click", () => navigateTo((activeIndex ?? 0) - 1));
nextBook.addEventListener("click", () => navigateTo((activeIndex ?? -1) + 1));
spaceSwitch.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-space-target]") : null;
  if (!button) return;
  if (button.dataset.spaceTarget === "user") requireAuth(() => openUserSpace({ restoreFocus: false }));
  else openBrookeSpace({ restoreFocus: false });
});
shelfHelpToggle.addEventListener("click", toggleShelfHelp);
shelfHelpClose.addEventListener("click", () => closeShelfHelp({ restoreFocus: true }));
shelfOnboardingStart.addEventListener("click", () => {
  if (detailIndex !== null && !hasSavedBooks()) {
    saveBookState(books[detailIndex], DEFAULT_STATUS);
    return;
  }
  if (hasSavedBooks() && !shelfOnboardingRoom.hidden) {
    shelfOnboarding.classList.remove("is-visible");
    if (detailIndex !== null) closeBookDetail();
    return;
  }
  openCurrentBookFromOnboarding();
});
shelfOnboardingRoom.addEventListener("click", openMyRoomFromOnboarding);
bookIndexToggle.addEventListener("click", openBookIndex);
bookIndexClose.addEventListener("click", () => closeBookIndex());
addBookToggle.addEventListener("click", () => requireAuth(openAddBookPanel));
myShelfEmptyAdd.addEventListener("click", () => requireAuth(openAddBookPanel));
addBookClose.addEventListener("click", () => closeAddBookPanel());
addBookSearch.addEventListener("submit", (event) => {
  event.preventDefault();
  searchBooks(addBookQuery.value);
});
wereadImportForm.addEventListener("submit", (event) => {
  event.preventDefault();
  syncWereadShelf(wereadApiKey.value);
});
wereadManualImportForm.addEventListener("submit", (event) => {
  event.preventDefault();
  importWereadBooks(wereadImportText.value);
});
wereadPickerSearch.addEventListener("input", renderWereadPicker);
wereadPickerAll.addEventListener("click", () => selectWereadItems(visibleWereadItems()));
wereadPickerRandom.addEventListener("click", pickRandomWereadItems);
wereadPickerNone.addEventListener("click", () => {
  wereadPickedIds.clear();
  renderWereadPicker();
});
wereadPickerImport.addEventListener("click", importSelectedWereadBooks);
addBookResults.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-add-book-result]") : null;
  if (!button) return;
  const index = Number(button.dataset.addBookResult);
  const book = lastSearchResults[index];
  if (Number.isInteger(index) && book) addCustomBook(book);
});
authGateClose.addEventListener("click", () => closeAuthGate({ restoreFocus: true }));
authGateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = authGateForm.querySelector("button");
  const email = authEmail.value.trim();
  if (!email) return;
  button.disabled = true;
  try {
    const result = await signInWithEmail(email);
    if (result.mode === "prototype") {
      closeAuthGate({ restoreFocus: false, runPending: true });
      return;
    }
    authGate.querySelector(".auth-gate-copy").textContent = "登录链接已经发送到你的邮箱。打开邮件里的链接后，你的书架会自动保存到 Supabase。";
  } catch (error) {
    console.error(error);
    authGate.querySelector(".auth-gate-copy").textContent = "登录链接发送失败，请稍后再试，或先体验后注册。";
  } finally {
    button.disabled = false;
  }
});
authGateGuest.addEventListener("click", () => {
  writeAuthSession({ email: "", mode: "guest-prototype" });
  closeAuthGate({ restoreFocus: false, runPending: true });
});
myShelfToggle.addEventListener("click", () => requireAuth(() => openMyShelf({ view: "room" })));
myShelfClose.addEventListener("click", () => closeMyShelf());
bookIndexList.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-book-index]") : null;
  if (!button) return;
  const index = Number(button.dataset.bookIndex);
  if (Number.isInteger(index) && books[index]) openBookFromIndex(index);
});
myShelfList.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-my-shelf-index]") : null;
  if (!button) return;
  const index = Number(button.dataset.myShelfIndex);
  if (Number.isInteger(index) && books[index]) openBookFromMyShelf(index);
});
myShelfFilters.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-shelf-filter]") : null;
  if (!button) return;
  myShelfFilter = button.dataset.shelfFilter || "all";
  renderMyShelf();
});
myShelfSummary.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-summary-filter]") : null;
  if (!button) return;
  myShelfFilter = button.dataset.summaryFilter || "all";
  renderMyShelf();
});
myShelfViewToggle.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-my-shelf-view]") : null;
  if (button) {
    switchMyShelfView(button.dataset.myShelfView || "list");
    return;
  }
  const actionButton = event.target instanceof Element ? event.target.closest("[data-my-shelf-action]") : null;
  if (!actionButton) return;
  const action = actionButton.dataset.myShelfAction;
  if (action === "info") showMyShelfToolsHint();
  else if (action === "add") openAddBookPanel();
  else if (action === "brooke") openBrookeSpace({ restoreFocus: false });
  else if (action === "previous") navigateMyRoom(-1);
  else if (action === "next") navigateMyRoom(1);
});
myRoomTitle.addEventListener("click", () => {
  myRoomNameForm.hidden = !myRoomNameForm.hidden;
  if (!myRoomNameForm.hidden) {
    myRoomNameInput.value = myRoomName === "Your Reading Room" ? "" : myRoomName;
    myRoomNameInput.focus({ preventScroll: true });
  }
});
myRoomNameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  myRoomName = myRoomNameInput.value.trim() || "Your Reading Room";
  writeRoomName(myRoomName);
  myRoomTitle.innerHTML = formatRoomTitle(myRoomName);
  myRoomNameForm.hidden = true;
  myRoomTitle.focus({ preventScroll: true });
});
roomOnlyToggle.addEventListener("click", () => {
  if (activeSpace === "user") openBrookeSpace({ restoreFocus: false });
  else requireAuth(() => openUserSpace({ restoreFocus: false }));
});
// The personal room rail scrolls sideways, so map wheel and trackpad input onto it with the same slow-down.
myShelfRoom.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaY) < 0.1 && Math.abs(event.deltaX) < 0.1) return;
  event.preventDefault();
  const lineSize = event.deltaMode === 1 ? 16 : 1;
  myShelfRoom.scrollLeft += (event.deltaY + event.deltaX) * lineSize * WHEEL_SCROLL_SCALE;
}, { passive: false });

myShelfRoom.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-my-shelf-index]") : null;
  if (!button) return;
  const index = Number(button.dataset.myShelfIndex);
  if (Number.isInteger(index) && books[index]) openBookFromMyRoom(index, button);
});

detailClose.addEventListener("click", closeBookDetail);
detailReturn.addEventListener("click", closeBookDetail);
detailSave.addEventListener("click", () => {
  if (detailIndex === null) return;
  const book = books[detailIndex];
  if (getBookState(book)) removeBookState(book);
  else saveBookState(book, DEFAULT_STATUS);
});
detailStatus.addEventListener("click", (event) => {
  if (detailIndex === null) return;
  const button = event.target instanceof Element ? event.target.closest("[data-detail-status]") : null;
  if (!button) return;
  const book = books[detailIndex];
  const status = button.dataset.detailStatus || "";
  saveBookState(book, status || DEFAULT_STATUS);
});

document.addEventListener("keydown", (event) => {
  const isSpace = event.code === "Space" || event.key === " ";
  if (!authGate.hidden) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAuthGate({ restoreFocus: true });
    }
    return;
  }

  if (detailIndex !== null) {
    if (isSpace && !(event.target instanceof HTMLButtonElement)) {
      event.preventDefault();
      if (!event.repeat) closeBookDetail();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeBookDetail();
    }
    return;
  }

  if (!bookIndex.hidden) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeBookIndex();
    }
    return;
  }

  if (!addBookPanel.hidden) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAddBookPanel();
    }
    return;
  }

  if (!myShelf.hidden) {
    if (myShelfView === "room" && !myShelfRoomView.hidden) {
      const roomBooks = [...myShelfRoom.querySelectorAll(".my-room-book")];
      const current = myRoomActiveIndex ?? 0;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (!event.repeat && roomBooks.length) openMyRoomBook((current + 1) % roomBooks.length, { focus: true });
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (!event.repeat && roomBooks.length) openMyRoomBook((current - 1 + roomBooks.length) % roomBooks.length, { focus: true });
      } else if (isSpace || event.key === "Enter") {
        event.preventDefault();
        if (!event.repeat && roomBooks[current]) roomBooks[current].click();
      } else if (event.key === "Escape") {
        event.preventDefault();
        closeMyShelf();
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeMyShelf();
    }
    return;
  }

  if (!shelfHelp.hidden) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeShelfHelp({ restoreFocus: true });
    }
    return;
  }

  const target = event.target instanceof Element ? event.target : null;
  const focusedBook = target?.closest(".book-slot");
  if (target?.closest("button") && !focusedBook) return;
  const focusedIndex = focusedBook ? Number(focusedBook.dataset.index) : null;
  const current = Number.isInteger(focusedIndex) ? focusedIndex : (activeIndex ?? 0);

  if (event.key === "ArrowRight") {
    event.preventDefault();
    if (!event.repeat) navigateTo(current + 1);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    if (!event.repeat) navigateTo(current - 1);
  } else if (isSpace) {
    event.preventDefault();
    if (!event.repeat) bookElements[current]?.click();
  } else if (event.key === "Escape") {
    pinnedIndex = null;
    if (activeIndex !== null) closeBook(activeIndex, true);
    viewport.focus({ preventScroll: true });
  }
});

document.addEventListener("pointerdown", (event) => {
  if (shelfHelp.hidden) return;
  if (shelfHelp.contains(event.target) || shelfHelpToggle.contains(event.target)) return;
  closeShelfHelp();
});

window.addEventListener("resize", () => {
  measureShelf();
  if (detailIndex !== null && !detail.classList.contains("is-returning")) positionDetailBook();
});

if (showMyRoomFirst && hasSavedBooks()) {
  requestAnimationFrame(() => openMyShelf({ view: "room", restoreFocus: false }));
}

initializeSupabaseAuth();
updateOnboarding();
notifyParentTheme();
window.setTimeout(() => {
  entryScreen?.classList.add("is-done");
}, 1250);
}).catch((error) => {
  console.error(error);
  const status = document.querySelector("#activeTitle");
  if (status) status.textContent = "书单加载失败，请检查 books.tsv";
});
