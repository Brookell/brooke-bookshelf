window.BROOKE_BOOKS_READY.then((books) => {
const shelfGaps = window.BROOKE_SHELF_GAPS;

const entryScreen = document.querySelector("#entryScreen");
const spaceSwitch = document.querySelector(".space-switch");
const accountButton = document.querySelector("#accountButton");
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
const wereadApiKey = document.querySelector("#wereadApiKey");
const wereadPick = document.querySelector("#wereadPick");
const wereadPickList = document.querySelector("#wereadPickList");
const wereadPickCount = document.querySelector("#wereadPickCount");
const wereadPickAll = document.querySelector("#wereadPickAll");
const wereadPickImport = document.querySelector("#wereadPickImport");
const wereadProgress = document.querySelector("#wereadProgress");
const wereadProgressText = document.querySelector("#wereadProgressText");
const wereadImportStatus = document.querySelector("#wereadImportStatus");
const authGate = document.querySelector("#authGate");
const authGateClose = document.querySelector("#authGateClose");
const authGateForm = document.querySelector("#authGateForm");
const authEmail = document.querySelector("#authEmail");
const authIdLabel = document.querySelector("label[for='authEmail']");
const authPasswordRow = document.querySelector("#authPasswordRow");
const authPinRow = document.querySelector("#authPinRow");
const authPinConfirmRow = document.querySelector("#authPinConfirmRow");

// 6-digit passwords as a row of slots (code-slots.js; light version of the
// dark palette: pale slots, ink digits, ink fill once accepted).
const PIN_SLOT_STYLE = {
  length: 6,
  accentColor: "#151515",
  inkColor: "#151515",
  slotColor: "rgba(21, 21, 21, 0.07)",
  digitColor: "#f4f1ec",
  dangerColor: "#ff3b30",
  slotSize: 44,
  gap: 8,
  radius: 12,
  bounce: 0.2,
  settle: 0.3,
  rise: 8,
  cascade: 20,
};
let authPinSlots = null;
let authPinConfirmSlots = null;

function setupPinSlots() {
  if (authPinSlots || typeof window.CodeSlots !== "function") return;
  authPinSlots = window.CodeSlots(document.querySelector("#authPin"), {
    ...PIN_SLOT_STYLE,
    onChange: () => {
      authPinSlots?.setStatus("idle");
      authPinConfirmSlots?.setStatus("idle");
    },
    // Sign-in goes as soon as the 6th digit is in; sign-up moves on to
    // 再输一次.
    onComplete: () => {
      if (authMode === "signup") authPinConfirmSlots?.focus();
      else authGateForm.requestSubmit();
    },
  });
  authPinConfirmSlots = window.CodeSlots(document.querySelector("#authPinConfirm"), {
    ...PIN_SLOT_STYLE,
    onChange: () => authPinConfirmSlots?.setStatus("idle"),
    onComplete: () => authGateForm.requestSubmit(),
  });
}

// Username accounts use the slots; an email in 用户名或邮箱 means an older
// account, whose password can be anything, so it gets a plain field.
function authUsesPin() {
  return authMode === "signup" || !authEmail.value.includes("@");
}

function updateAuthPasswordFields() {
  const pin = authUsesPin();
  authPinRow.hidden = !pin;
  authPasswordRow.hidden = pin;
  authPinConfirmRow.hidden = authMode !== "signup";
}
const authPassword = document.querySelector("#authPassword");
const authSubmit = document.querySelector("#authSubmit");
const authGateStatus = document.querySelector("#authGateStatus");
const authGateMagicLink = document.querySelector("#authGateMagicLink");
const authGateGuest = document.querySelector("#authGateGuest");
const myShelf = document.querySelector("#myShelf");
const myShelfClose = document.querySelector("#myShelfClose");
const myShelfCount = document.querySelector("#myShelfCount");
const myShelfList = document.querySelector("#myShelfList");
const myRoomCaption = document.querySelector("#myRoomCaption");
const readingPanel = document.querySelector("#readingPanel");
const readingPanelBody = document.querySelector("#readingPanelBody");
const profilePanel = document.querySelector("#profilePanel");
const profileBody = document.querySelector("#profileBody");
const profileClose = document.querySelector("#profileClose");
const tabBar = document.querySelector("#tabBar");
const quotePanel = document.querySelector("#quotePanel");
const quotePanelBody = document.querySelector("#quotePanelBody");
const quotePanelClose = document.querySelector("#quotePanelClose");
const readingPanelClose = document.querySelector("#readingPanelClose");
const readingPanelToggle = document.querySelector("#readingPanelToggle");
const coverPicker = document.querySelector("#coverPicker");
const coverPickerKicker = document.querySelector("#coverPickerKicker");
const coverPickerTitle = document.querySelector("#coverPickerTitle");
const coverPickerClose = document.querySelector("#coverPickerClose");
const coverPickerPreview = document.querySelector("#coverPickerPreview");
const coverPickerAlternativesLabel = document.querySelector("#coverPickerAlternatives");
const coverPickerGrid = document.querySelector("#coverPickerGrid");
const coverPickerStatus = document.querySelector("#coverPickerStatus");
const coverPickerFile = document.querySelector("#coverPickerFile");
const coverPickerUploadLabel = document.querySelector("#coverPickerUploadLabel");
const coverPickerTextButton = document.querySelector("#coverPickerText");
const coverPickerSave = document.querySelector("#coverPickerSave");
const coverPickerCancel = document.querySelector("#coverPickerCancel");
const myShelfEmpty = document.querySelector("#myShelfEmpty");
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
const detailHighlight = document.querySelector("#detailHighlight");
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
// Every user's own shelf is called this; it can't be renamed. (The user's
// own name lives separately, on 我的.)
const DEFAULT_ROOM_NAME = "A Room of My Own";
const LEGACY_ROOM_NAME = "Your Reading Room";
const roomNameOrDefault = (value) => {
  const name = String(value || "").trim();
  return !name || name === LEGACY_ROOM_NAME ? DEFAULT_ROOM_NAME : name;
};
const THEME_STORAGE_KEY = "brooke-bookshelf:theme:v1";
const AVATAR_STORAGE_KEY = "brooke-bookshelf:avatar:v1";
const DISPLAY_NAME_STORAGE_KEY = "brooke-bookshelf:display-name:v1";

// Theme colour for 阅读记录, 笔记 and 我的 (picked on 我的). Each colour is
// tuned so its ink reads on it. 'follow' keeps the old behaviour: each page
// takes the colour of the book it is about. The book detail page and the
// shelf always use the book's own colour.
const THEMES = [
  { id: "pine", name: "墨绿", color: "#2f4a3a" },
  { id: "navy", name: "深蓝", color: "#253a55" },
  { id: "wine", name: "酒红", color: "#6b2632" },
  { id: "ochre", name: "赭石", color: "#9b5a26" },
  { id: "plum", name: "灰紫", color: "#574f6e" },
  { id: "vermilion", name: "朱红", color: "#b8402f" },
  { id: "paper", name: "米白", color: "#e9e4da" },
  { id: "follow", name: "跟随书的颜色", color: null },
];
const DEFAULT_THEME = "pine";
// Set once anyone has signed in on this browser, so the sign-in sheet opens
// on 注册 for first-time visitors and on 登录 for returning ones.
const HAS_ACCOUNT_STORAGE_KEY = "brooke-bookshelf:has-account:v1";

function rememberHasAccount() {
  try { window.localStorage.setItem(HAS_ACCOUNT_STORAGE_KEY, "1"); } catch {}
}

function hasAccountOnThisBrowser() {
  try { return window.localStorage.getItem(HAS_ACCOUNT_STORAGE_KEY) === "1"; } catch { return false; }
}
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
    roomNamePlaceholder: "A Room of My Own",
    saveRoomName: "保存",
    myRoomShelf: "我的阅读房间书架",
    emptyShelf: "你保存的书会出现在这里。",
    detailKicker: "Reading Room",
    personalShelfControls: "个人书架操作",
    addToShelf: "加入我的书架",
    readingStatus: "阅读状态",
    saved: "已保存",
    openBook: "打开《{title}》",
    selectedPages: "Selected pages",
    onboardingBuildKicker: "这里是参考空间",
    onboardingBuildTitle: "看一看，再开始你的",
    onboardingBuildCopy: "你可以先在这里随意翻看，遇到喜欢的书就加入自己的书架；也可以直接进入我的空间，从空房间开始布置。",
    onboardingChoose: "继续浏览范例",
    onboardingStartRoom: "直接打造我的书架",
    onboardingAddKicker: "变成你的",
    onboardingAddTitle: "加入这本书",
    onboardingAddCopy: "喜欢《{title}》的话，把它加入书架，它会成为你房间里的第一本书。",
    onboardingAdd: "加入这本书",
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
    searchBookQuotaError: "Google Books 搜索额度暂时受限。登录后可以使用站内搜索。",
    searchBookRateLimited: "搜索有点频繁了，请过一会儿再试。",
    signIn: "登录",
    signOut: "退出登录",
    signedInAs: "已登录：{email}",
    changeCover: "换封面",
    chooseCover: "选封面",
    removeFromShelf: "移出书架",
    confirmRemove: "确认移出",
    coverPickerKicker: "选择封面",
    coverPickerAlternatives: "其他版本的封面",
    coverPickerLoading: "正在找其他封面…",
    coverPickerNone: "没有找到其他封面，可以上传自己的图片。",
    coverPickerUpload: "上传图片",
    coverPickerText: "使用文字封面",
    coverPickerSave: "保存封面",
    coverPickerCancel: "取消",
    coverPickerSaving: "正在保存…",
    coverPickerTooLarge: "图片太大了，请选择 8MB 以内的图片。",
    coverPickerBadType: "只支持 JPG、PNG 或 WebP 图片。",
    coverPickerFailed: "封面保存失败，请稍后再试。",
    addSearchResult: "加入书架",
    addedSearchResult: "已加入",
    wereadApiKeyEmpty: "请先输入微信读书 API Key。",
    wereadSyncLoading: "正在读取你的微信读书书架…",
    wereadPickCount: "书架上有 {total} 本，已选 {selected} 本",
    wereadPickEmpty: "微信读书书架是空的。",
    wereadPickImport: "导入选中的 {count} 本",
    wereadPickNone: "导入选中的书",
    wereadPickSelectAll: "全选",
    wereadPickClear: "全不选",
    wereadPickOnShelf: "已在书架",
    wereadSyncDone: "已导入 {count} 本书到你的书架。",
    wereadSyncError: "微信读书同步暂时失败，请确认 API Key 或 Edge Function 是否已部署。",
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
    roomNamePlaceholder: "A Room of My Own",
    saveRoomName: "Save",
    myRoomShelf: "My reading room shelf",
    emptyShelf: "Your saved books will appear here.",
    detailKicker: "Reading Room",
    personalShelfControls: "Personal shelf controls",
    addToShelf: "Add to my shelf",
    readingStatus: "Reading status",
    saved: "Saved",
    openBook: "Open {title}",
    selectedPages: "Selected pages",
    onboardingBuildKicker: "This is the reference space",
    onboardingBuildTitle: "Look around, then make yours",
    onboardingBuildCopy: "Browse first, save a book when one catches your eye, or open your own space and begin from an empty room.",
    onboardingChoose: "Browse the example",
    onboardingStartRoom: "Build my shelf",
    onboardingAddKicker: "Make it yours",
    onboardingAddTitle: "Add this book",
    onboardingAddCopy: "If you love {title}, add it and it becomes the first book in your room.",
    onboardingAdd: "Add this book",
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
    searchBookQuotaError: "Google Books search is temporarily limited. Sign in to use the built-in search.",
    searchBookRateLimited: "Too many searches for now. Please try again in a little while.",
    signIn: "Sign in",
    signOut: "Sign out",
    signedInAs: "Signed in as {email}",
    changeCover: "Change cover",
    chooseCover: "Choose cover",
    removeFromShelf: "Remove",
    confirmRemove: "Confirm remove",
    coverPickerKicker: "Choose a cover",
    coverPickerAlternatives: "Covers from other editions",
    coverPickerLoading: "Looking for other covers…",
    coverPickerNone: "No other covers found. You can upload your own image.",
    coverPickerUpload: "Upload image",
    coverPickerText: "Use a text cover",
    coverPickerSave: "Save cover",
    coverPickerCancel: "Cancel",
    coverPickerSaving: "Saving…",
    coverPickerTooLarge: "That image is too large. Please choose one under 8MB.",
    coverPickerBadType: "Only JPG, PNG or WebP images are supported.",
    coverPickerFailed: "Could not save the cover. Please try again.",
    addSearchResult: "Add to shelf",
    addedSearchResult: "Added",
    wereadApiKeyEmpty: "Enter your WeRead API Key first.",
    wereadSyncLoading: "Reading your WeRead shelf…",
    wereadPickCount: "{total} books on your shelf, {selected} selected",
    wereadPickEmpty: "Your WeRead shelf is empty.",
    wereadPickImport: "Import {count} selected",
    wereadPickNone: "Import selected books",
    wereadPickSelectAll: "Select all",
    wereadPickClear: "Clear",
    wereadPickOnShelf: "On your shelf",
    wereadSyncDone: "Imported {count} books to your shelf.",
    wereadSyncError: "WeRead sync failed. Check the API key or Edge Function deployment.",
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
const myRoomName = DEFAULT_ROOM_NAME;
let displayName = readDisplayName();
let themeId = readThemeId();
let avatarUrl = readAvatarUrl();
let activeSpace = "brooke";
let myShelfFilter = "all";
let myShelfView = "list";
let myRoomActiveIndex = null;
let dragStartX = 0;
let dragStartScroll = 0;
let isDragging = false;
// Last known mouse X, and where the mouse was when a book was pinned by
// keyboard/arrow navigation. Hover takes over again once the mouse moves.
let lastPointerX = null;
let pinPointerX = null;
let hasDragged = false;
let didSetInitialScroll = false;
let detailIndex = null;
let detailOriginRect = null;
let detailSourceElement = null;
let detailOriginStale = false;
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

const REFERENCE_ROOM_TITLE = "Reference<br />Room";

function updatePageTitle() {
  const pageTitle = document.getElementById("pageTitle");
  if (!pageTitle) return;
  pageTitle.innerHTML = activeSpace === "user" ? formatRoomTitle(myRoomName) : REFERENCE_ROOM_TITLE;
}

function updateSpaceSwitch() {
  updatePageTitle();
  // 参考空间 and 我的空间 are both always in the top bar, so you can always
  // get back to the reference room in one click.
  spaceSwitch?.querySelectorAll("[data-space-target]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.spaceTarget === activeSpace));
    button.hidden = false;
  });
  library.classList.toggle("is-user-space", activeSpace === "user");
  roomOnlyToggle?.setAttribute("aria-pressed", String(activeSpace === "user"));
}

function readDisplayName() {
  try {
    return (window.localStorage.getItem(DISPLAY_NAME_STORAGE_KEY) || "").trim().slice(0, 40);
  } catch {
    return "";
  }
}

function writeDisplayName(value) {
  displayName = String(value || "").trim().slice(0, 40);
  try {
    if (displayName) window.localStorage.setItem(DISPLAY_NAME_STORAGE_KEY, displayName);
    else window.localStorage.removeItem(DISPLAY_NAME_STORAGE_KEY);
  } catch { /* private mode */ }
}

// The name shown on 我的: the user's own, else their email before the @.
function userDisplayName(user = supabaseSession?.user) {
  return displayName || usernameFromEmail(user?.email) || String(user?.email || "").split("@")[0] || "读者";
}

function readAvatarUrl() {
  try {
    const saved = window.localStorage.getItem(AVATAR_STORAGE_KEY) || "";
    return saved.startsWith("https://") ? saved : "";
  } catch {
    return "";
  }
}

function writeAvatarUrl(url) {
  avatarUrl = url || "";
  try {
    if (avatarUrl) window.localStorage.setItem(AVATAR_STORAGE_KEY, avatarUrl);
    else window.localStorage.removeItem(AVATAR_STORAGE_KEY);
  } catch { /* private mode */ }
}

function readThemeId() {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.some((theme) => theme.id === saved) ? saved : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

// The theme's colour, or null when pages should follow the book.
function themeColor() {
  return THEMES.find((theme) => theme.id === themeId)?.color || null;
}

function setTheme(id) {
  if (!THEMES.some((theme) => theme.id === id) || id === themeId) return;
  themeId = id;
  try { window.localStorage.setItem(THEME_STORAGE_KEY, id); } catch { /* private mode */ }
  syncSettingsToSupabase();
  if (!readingPanel.hidden) renderReadingPanel();
  if (quotePanel && !quotePanel.hidden) applyNotesColor();
  if (!profilePanel.hidden) renderProfile();
}

function formatRoomTitle(value) {
  const title = roomNameOrDefault(value);
  const words = title.split(/\s+/);
  if (words.length <= 1) return escapeHtml(title);
  if (title === DEFAULT_ROOM_NAME) return "A Room<br />of My Own";
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

// The reference shelf shows only the curated books from books.tsv. Books a
// user searched for or imported (isCustom) live in their own room instead.
function isReferenceBook(book) {
  return Boolean(book) && !book.isCustom;
}

function referenceCount() {
  return books.filter(isReferenceBook).length;
}

function referencePosition(index) {
  return books.slice(0, index + 1).filter(isReferenceBook).length;
}

function formatReferenceCount() {
  return String(referenceCount()).padStart(2, "0");
}
window.BROOKE_BOOKS = books;

// Books a user adds get the same proportions as the curated reference shelf
// (books.tsv: spine 32–48px, cover 240–288px, height 0.84–0.96, gap 0–30px).
// Values are derived from a hash of the id so each book keeps its look.
function hashText(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function customBookDimensions(seed, title) {
  const hash = hashText(seed);
  const pick = (shift, min, max) => min + ((hash >>> shift) % (max - min + 1));
  const titleLength = [...String(title)].length;
  return {
    spineWidth: Math.min(48, 34 + Math.round(Math.min(titleLength, 14) * 0.7) + pick(0, 0, 4)),
    width: pick(4, 245, 288),
    height: pick(10, 84, 96) / 100,
    shelfGap: pick(16, 6, 24),
  };
}

// WeRead serves covers in sizes by file prefix: s_ is a 70px thumbnail,
// t6_ 250px, t9_ 428px. Always ask for the large one so covers are sharp.
function sharpCover(url) {
  const value = String(url || "");
  if (!/^https?:\/\/[^/]*(weread\.qq\.com|myqcloud\.com)\//.test(value)) return value;
  return value.replace(/\/(s|t[0-8])_([^/]+)$/, "/t9_$2").replace(/^http:/, "https:");
}

function normalizeBook(book, index = books.length) {
  const palette = CUSTOM_BOOK_PALETTE[index % CUSTOM_BOOK_PALETTE.length];
  const safeTitle = String(book.title || "未命名书籍").trim();
  const safeAuthor = String(book.author || "作者未知").trim();
  const id = book.id || `custom-${slugifyText(`${safeTitle}-${safeAuthor}`) || Date.now()}`;
  const customSize = book.isCustom ? customBookDimensions(id, safeTitle) : null;
  const width = customSize?.width || Number(book.width) || 280;
  const spineWidth = customSize?.spineWidth || Number(book.spineWidth) || 42;
  return {
    id,
    title: safeTitle,
    author: safeAuthor,
    // Intros fetched earlier were saved as [intro, "出版社 · 年月"]; keep only the intro.
    description: Array.isArray(book.description) && book.description.length
      ? book.description.map(String).slice(0, book.introLoaded ? 1 : undefined)
      : ["这是你自己加入书架的书。之后接入用户数据库后，它会成为你专属书架的一部分。"],
    color: book.color || palette[0],
    ink: book.ink || palette[1],
    spine: book.spine || palette[2],
    spineInk: book.spineInk || palette[3],
    detailColor: book.detailColor || book.color || palette[0],
    width,
    spineWidth,
    height: customSize?.height || Number(book.height) || 1,
    shelfGap: customSize ? customSize.shelfGap : (Number(book.shelfGap) || 28),
    image: sharpCover(book.image),
    originalCover: Boolean(book.originalCover || book.image),
    opacity: Number(book.opacity) || 1,
    filter: book.filter || "none",
    coverRatio: Number(book.coverRatio) || 2 / 3,
    isCustom: Boolean(book.isCustom),
    source: book.source || "",
    sourceId: book.sourceId || "",
    deepLink: book.deepLink || "",
    introLoaded: Boolean(book.introLoaded),
    introVersion: Number(book.introVersion) || 0,
    wereadBookId: book.wereadBookId || "",
    coverPalette: book.coverPalette || "",
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

// Photos uploaded to Supabase Storage were saved with whichever address was
// in use. On our own domain, load them through api.<domain> as well, so
// they show up where supabase.co is blocked (see config.js).
function siteImage(url) {
  const value = String(url || "");
  const direct = String(window.BROOKE_SUPABASE_DIRECT_URL || DEFAULT_SUPABASE_URL).replace(/\/+$/, "");
  const base = readSupabaseUrl();
  return base !== direct && value.startsWith(`${direct}/storage/`) ? base + value.slice(direct.length) : value;
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
      // Same key on every domain, whichever Supabase address is in use.
      storageKey: "sb-oipsefmckxyojnntiaax-auth-token",
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

// ---- Usernames ----
// New accounts sign up with a username and a 6-digit password; accounts
// made earlier keep signing in with their email. Supabase needs an email,
// so a username is stored as a hidden address on the reserved .invalid
// domain (no mail can ever reach it): "u" + base32 of the name's UTF-8.
// 12 characters at most keeps it within the 64-character email limit.
const USERNAME_DOMAIN = "users.reading-room.invalid";
const BASE32 = "abcdefghijklmnopqrstuvwxyz234567";

function normalizeUsername(value) {
  return String(value || "").normalize("NFKC").trim().toLowerCase();
}

function isValidUsername(name) {
  return /^[\p{L}\p{N}_-]{2,12}$/u.test(name);
}

function toBase32(bytes) {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += BASE32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += BASE32[(value << (5 - bits)) & 31];
  return out;
}

function fromBase32(text) {
  let bits = 0;
  let value = 0;
  const bytes = [];
  for (const char of text) {
    const index = BASE32.indexOf(char);
    if (index < 0) throw new Error("bad base32");
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
}

function usernameEmail(name) {
  return `u${toBase32(new TextEncoder().encode(normalizeUsername(name)))}@${USERNAME_DOMAIN}`;
}

// The username behind a hidden address, or "" for a real email.
function usernameFromEmail(email) {
  const match = /^u([a-z2-7]+)@users\.reading-room\.invalid$/i.exec(String(email || ""));
  if (!match) return "";
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(fromBase32(match[1].toLowerCase()));
  } catch {
    return "";
  }
}

// Six digits, but not the ones people guess first.
function weakPinReason(pin) {
  if (!/^\d{6}$/.test(pin)) return "密码要 6 位数字。";
  const digits = [...pin].map(Number);
  const steps = digits.slice(1).map((digit, i) => digit - digits[i]);
  if (steps.every((step) => step === 0)) return "密码太简单了（同一个数字），换一个吧。";
  if (steps.every((step) => step === 1) || steps.every((step) => step === -1)) return "密码太简单了（连续数字），换一个吧。";
  if (pin.slice(0, 2).repeat(3) === pin || pin.slice(0, 3).repeat(2) === pin) return "密码太简单了（重复的数字），换一个吧。";
  if (["112233", "111222", "147258", "159357", "520520", "520131", "123321", "654321"].includes(pin)) return "这个密码太常见了，换一个吧。";
  return "";
}

// 登录 takes a username or (for older accounts) an email; 注册 asks for a
// username and the 6-digit password twice. Email confirmation is off in
// Supabase, so a new account is signed in straight away.
let authMode = "signin";

function setAuthMode(mode) {
  authMode = mode === "signup" ? "signup" : "signin";
  authGate.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.authMode === authMode));
  });
  const signup = authMode === "signup";
  setupPinSlots();
  authIdLabel.textContent = signup ? "用户名" : "用户名或邮箱";
  authEmail.placeholder = signup ? "2–12 个字，中英文、数字都可以" : "用户名（以前用邮箱注册的，填邮箱）";
  authEmail.autocomplete = "username";
  document.querySelector("#authPin").autocomplete = signup ? "new-password" : "current-password";
  authPinSlots?.clear();
  authPinConfirmSlots?.clear();
  authPinSlots?.setStatus("idle");
  authPinConfirmSlots?.setStatus("idle");
  updateAuthPasswordFields();
  authSubmit.textContent = signup ? "注册" : "登录";
  // "忘记密码？" only makes sense when signing in.
  authGateMagicLink.hidden = signup;
  authGateStatus.textContent = "";
}

async function signInWithPassword(email, password) {
  const client = getSupabaseClient();
  if (!client) {
    writeAuthSession({ email, mode: "email-prototype" });
    return { mode: "prototype" };
  }
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (!error) return { mode: "signed-in" };
  if (/invalid login credentials/i.test(error.message)) return { mode: "wrong-credentials" };
  throw error;
}

async function signUpWithPassword(email, password) {
  const client = getSupabaseClient();
  if (!client) {
    writeAuthSession({ email, mode: "email-prototype" });
    return { mode: "prototype" };
  }
  const { data, error } = await client.auth.signUp({ email, password });
  if (error && /already registered/i.test(error.message)) return { mode: "already-registered" };
  if (error) throw error;
  return { mode: data.session ? "signed-up" : "check-email" };
}

function authErrorMessage(error) {
  const message = String(error?.message || "");
  if (/password should be at least|weak password/i.test(message)) return "密码太简单了，请至少用 6 位，最好包含字母和数字。";
  if (/email not confirmed/i.test(message)) return "这个邮箱之前注册时还没确认。请点下面的链接，用邮箱链接登录一次。";
  if (/invalid.*email|unable to validate email/i.test(message)) return "邮箱格式不太对，请检查一下。";
  if (/rate limit|too many/i.test(message)) return "尝试次数太多了，请稍等几分钟再试。";
  return "登录失败，请稍后再试。";
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
  totalBooks.textContent = formatReferenceCount();
  renderBookIndex();
  renderMyShelf();
  measureShelf();
  updateDetailShelfControls();
  updateOnboarding();
  loadMissingCoverPalettes();
  loadMissingIntros();
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
    .select("show_my_room_first, theme_color, avatar_url, display_name")
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
  writeDisplayName(typeof data.display_name === "string" ? data.display_name : "");
  showMyRoomFirst = Boolean(data.show_my_room_first);
  writeAvatarUrl(typeof data.avatar_url === "string" && data.avatar_url.startsWith("https://") ? data.avatar_url : "");
  if (THEMES.some((theme) => theme.id === data.theme_color)) {
    themeId = data.theme_color;
    try { window.localStorage.setItem(THEME_STORAGE_KEY, themeId); } catch { /* private mode */ }
  }
  window.localStorage.setItem(ROOM_DEFAULT_STORAGE_KEY, String(showMyRoomFirst));
  myRoomTitle.innerHTML = formatRoomTitle(myRoomName);
  updatePageTitle();
  updateSpaceSwitch();
}

async function syncSettingsToSupabase() {
  const client = getSupabaseClient();
  const userId = supabaseSession?.user?.id;
  if (!client || !userId) return;
  const { error } = await client.from("user_settings").upsert({
    user_id: userId,
    room_name: DEFAULT_ROOM_NAME,
    display_name: displayName || null,
    show_my_room_first: Boolean(showMyRoomFirst),
    theme_color: themeId,
    avatar_url: avatarUrl || null,
  }, { onConflict: "user_id" });
  if (error) console.error("Supabase user_settings upsert failed", error);
}

// Sign in / sign out in the top bar. Only a real Supabase session counts as
// signed in; the local "try first" mode still shows 登录 so people can
// upgrade to a real account at any time.
function isSignedIn() {
  return Boolean(supabaseSession?.user);
}

function updateAccountButton() {
  updateSpaceSwitch();
  if (!isSignedIn()) setupStatusRequested = false;
  updateSetupCard();
  if (!accountButton) return;
  const user = supabaseSession?.user;
  accountButton.hidden = !getSupabaseClient();
  accountButton.textContent = user ? t("signOut") : t("signIn");
  accountButton.title = user ? t("signedInAs", { email: usernameFromEmail(user.email) || user.email || "" }) : t("signIn");
  accountButton.classList.toggle("is-signed-in", Boolean(user));
}

async function signOutEverywhere() {
  const client = getSupabaseClient();
  accountButton.disabled = true;
  try {
    // Only this browser's session, so the admin page stays signed in.
    await client?.auth.signOut({ scope: "local" });
  } catch (error) {
    console.warn("Sign out failed", error);
  }
  // Everything a signed-in user has is already in Supabase, so clear this
  // browser's copy to keep the next person on a shared computer out of it.
  [AUTH_STORAGE_KEY, SHELF_STORAGE_KEY, CUSTOM_BOOKS_STORAGE_KEY, ROOM_NAME_STORAGE_KEY, ROOM_DEFAULT_STORAGE_KEY, AVATAR_STORAGE_KEY, DISPLAY_NAME_STORAGE_KEY]
    .forEach((key) => window.localStorage.removeItem(key));
  window.location.reload();
}

async function initializeSupabaseAuth() {
  const client = getSupabaseClient();
  updateAccountButton();
  if (!client) return;
  const { data, error } = await client.auth.getSession();
  if (error) {
    console.error("Supabase auth session failed", error);
    return;
  }
  supabaseSession = data.session || null;
  updateAccountButton();
  if (supabaseSession?.user) {
    rememberHasAccount();
    await loadSettingsFromSupabase();
    await loadShelfFromSupabase();
    await syncLocalShelfToSupabase();
  }
  let knownUserId = supabaseSession?.user?.id || null;
  client.auth.onAuthStateChange((event, session) => {
    supabaseSession = session || null;
    updateAccountButton();
    if (session?.user) rememberHasAccount();
    // Supabase also reports SIGNED_IN when it merely restores or refreshes
    // the same session; only a different account needs the reload below.
    if (event !== "SIGNED_IN" || !session?.user || session.user.id === knownUserId) return;
    knownUserId = session.user.id;
    // Supabase holds its auth lock while this callback runs, so calling other
    // Supabase methods from inside it deadlocks every later request. Do the
    // follow-up work after the callback has returned.
    window.setTimeout(async () => {
      hasLoadedRemoteShelf = false;
      reading.connected = null;
      await loadSettingsFromSupabase();
      await loadShelfFromSupabase();
      await syncLocalShelfToSupabase();
      if (!authGate.hidden) closeAuthGate({ restoreFocus: false, runPending: true });
    }, 0);
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
  updateSetupCard();
  window.clearTimeout(onboardingCloseTimer);
  // Not on a book's detail page: its own 加入我的书架 switch is right there,
  // and a second "add" card would only cover the cover.
  const shouldShow = !hasSavedBooks() && bookIndex.hidden && myShelf.hidden && shelfHelp.hidden && addBookPanel.hidden
    && (!readingPanel || readingPanel.hidden) && (!profilePanel || profilePanel.hidden) && (!quotePanel || quotePanel.hidden) && detailIndex === null;
  if (!shouldShow) {
    shelfOnboarding.classList.remove("is-visible");
    onboardingCloseTimer = window.setTimeout(() => {
      if (!shelfOnboarding.classList.contains("is-visible")) shelfOnboarding.hidden = true;
    }, 360);
    return;
  }

  if (detailIndex !== null) {
    const book = books[detailIndex];
    setOnboardingContent({
      kicker: t("onboardingAddKicker"),
      title: t("onboardingAddTitle"),
      copy: t("onboardingAddCopy", { title: book.title }),
      primary: t("onboardingAdd"),
    });
  } else {
    setOnboardingContent({
      kicker: t("onboardingBuildKicker"),
      title: t("onboardingBuildTitle"),
      copy: t("onboardingBuildCopy"),
      primary: t("onboardingChoose"),
      secondary: t("onboardingStartRoom"),
      showRoom: true,
    });
  }

  shelfOnboarding.hidden = false;
  requestAnimationFrame(() => shelfOnboarding.classList.add("is-visible"));
}

function showOnboardingRoomStep(book) {
  if (readingPanel && !readingPanel.hidden) return;
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
  setText("#myShelfEmpty", t("emptyShelf"));
  setText("#addBookTitle", t("addBook"));
  setText(".add-book-header p", "新增书籍");
  setText(".add-book-search label", t("searchBookLabel"));
  setText(".add-book-search button span", t("searchBookAction"));
  setText("#wereadImportForm label", "输入你的微信读书 API Key");
  setText("#wereadImportForm button span", "读取我的书架");
  if (addBookQuery) addBookQuery.placeholder = t("searchBookPlaceholder");
  if (addBookStatus && !addBookStatus.textContent.trim()) addBookStatus.textContent = t("searchBookIdle");
  setText(".detail-kicker", t("detailKicker"));
  setText("#detailSaveLabel", t("addToShelf"));
  setText("#detailReturn span", t("returnToShelf"));
  setText(".my-room-heading p", t("personalReadingRoom"));
  myRoomTitle.innerHTML = formatRoomTitle(myRoomName);
  updatePageTitle();
  myRoomTitle.title = "点击修改房间名";
  myRoomTitle.setAttribute("aria-label", "点击修改房间名");
  myRoomNameInput.placeholder = t("roomNamePlaceholder");
  myRoomNameInput.value = myRoomName === DEFAULT_ROOM_NAME ? "" : myRoomName;
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
  setButtonLabel(myShelfViewToggle.querySelector('[data-my-shelf-action="brooke"]'), "参考空间");
  setButtonLabel(myShelfViewToggle.querySelector('[data-my-shelf-action="reading"]'), "阅读记录");
  setButtonLabel(readingPanelToggle, "阅读记录");
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
  updateSpaceSwitch();
  if (wasEmpty) showOnboardingRoomStep(book);
  else updateOnboarding();
}

function removeBookState(book) {
  delete userBooks[book.id];
  writeUserBooks();
  renderMyShelf();
  updateDetailShelfControls();
  removeBookStateFromSupabase(book);
  updateSpaceSwitch();
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
  updateAccountButton();
  renderBookIndex();
  renderMyShelf();
  updateOnboarding();
  if (detailIndex !== null) {
    populateBookDetail(detailIndex);
  }
  window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });
}

function renderBookIndex() {
  bookIndexCount.textContent = formatReferenceCount();
  bookIndexList.innerHTML = books.map((book, index) => !isReferenceBook(book) ? "" : `
    <li>
      <button type="button" data-book-index="${index}" aria-label="${escapeHtml(t("openBook", { title: book.title }))}">
        <span class="book-index-number">${String(referencePosition(index)).padStart(2, "0")}</span>
        <span class="book-index-swatch" style="--book-index-color: ${book.spine}" aria-hidden="true"></span>
        <span class="book-index-copy">
          <strong>${escapeHtml(cleanBookTitle(book.title))}</strong>
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
  // In the room itself the menu takes the corner instead of a close button.
  library.classList.toggle("is-my-room-view", myShelfView === "room");
  myShelfEmpty.hidden = savedEntries.length > 0 || myShelfView === "room";
  myShelfListView.hidden = savedEntries.length === 0 || myShelfView !== "list";
  myShelfRoomView.hidden = myShelfView !== "room";
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
  myShelfList.innerHTML = savedEntries.map(({ book, index, state }, listIndex) => `
    <li>
      <div class="my-shelf-item">
      <button class="my-shelf-open" type="button" data-my-shelf-index="${index}" aria-label="${escapeHtml(t("openBook", { title: book.title }))}">
        <span class="book-index-number">${String(listIndex + 1).padStart(2, "0")}</span>
        <span class="book-index-swatch" style="--book-index-color: ${book.spine}" aria-hidden="true"></span>
        <span class="book-index-copy">
          <strong>${escapeHtml(cleanBookTitle(book.title))}</strong>
          <small>${escapeHtml(book.author)}</small>
        </span>
        <i data-lucide="arrow-up-right" aria-hidden="true"></i>
      </button>
      <div class="my-shelf-item-actions">
        ${book.isCustom ? `
        <button type="button" data-cover-book="${index}" title="${escapeHtml(t("changeCover"))}" aria-label="${escapeHtml(t("changeCover"))}：${escapeHtml(book.title)}">
          <i data-lucide="image-plus" aria-hidden="true"></i>
        </button>` : ""}
        <button type="button" data-remove-book="${index}" title="${escapeHtml(t("removeFromShelf"))}" aria-label="${escapeHtml(t("removeFromShelf"))}：${escapeHtml(book.title)}">
          <i data-lucide="trash-2" aria-hidden="true"></i>
        </button>
      </div>
      </div>
    </li>
  `).join("");
  myShelfRoom.innerHTML = savedEntries.length === 0
    ? `<p class="my-room-empty">${escapeHtml(t("emptyShelf"))}</p>`
    : savedEntries.map(({ book, index, state }, roomIndex) => `
    <button class="my-room-book" type="button" data-my-shelf-index="${index}" style="--room-spine: ${book.spine}; --room-ink: ${book.spineInk}; --room-width: ${book.spineWidth}px; --room-cover-width: ${book.width}px; --room-height: ${Math.round(430 * book.height)}px; --room-gap: ${book.shelfGap}px; --room-cover: ${book.color}; --room-cover-ink: ${book.ink}; --art-opacity: ${book.opacity ?? 1}; --art-filter: ${book.filter ?? "none"}; --room-delay: ${roomIndex * 22}ms;" aria-label="${escapeHtml(t("openBook", { title: book.title }))}">
      <span class="my-room-book-cover${book.originalCover ? " has-original-cover" : ""}" aria-hidden="true">
        ${coverMarkup(book, index)}
      </span>
      <span class="my-room-book-spine">
        <span>${escapeHtml(cleanBookTitle(book.title))}</span>
      </span>
      <span class="my-room-book-meta">
        <strong>${escapeHtml(cleanBookTitle(book.title))}</strong>
        <small>${escapeHtml(t(STATUS_LABEL_KEYS[state.status] || "saved"))}</small>
      </span>
    </button>
  `).join("");
  myShelfRoom.querySelectorAll(".my-room-book").forEach((element, roomIndex) => {
    // Like the reference shelf, hover follows what is on screen: a book
    // opens when the mouse reaches its visible spine and stays open while
    // the mouse is over its cover. Hover never scrolls the room (that made
    // it keep sliding as each newly centred book came under the mouse).
    element.querySelector(".my-room-book-spine")?.addEventListener("mouseenter", () => {
      if (roomHasDragged) return;
      openMyRoomBook(roomIndex, { scroll: false });
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
        if (!myShelfRoomView.hidden) centerMyRoom();
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
          if (!myShelfRoomView.hidden) centerMyRoom();
        });
      }
    });
  }, 170);
}

// Open the room scrolled to its middle with no book pulled out, the same way
// the reference shelf starts.
function centerMyRoom() {
  resetMyRoomBooks();
  // Centre the row of spines. Each book's box is as wide as its (closed)
  // cover, so the last one sticks out past its spine; measuring the
  // scroll width would push short rows left of centre.
  const roomBooks = [...myShelfRoom.querySelectorAll(".my-room-book")];
  myShelfRoom.style.paddingLeft = "";
  if (roomBooks.length) {
    const first = roomBooks[0];
    const last = roomBooks[roomBooks.length - 1];
    const lastSpine = parseFloat(getComputedStyle(last).getPropertyValue("--room-width")) || last.offsetWidth;
    const middle = (first.offsetLeft + last.offsetLeft + lastSpine) / 2;
    const shortBy = myShelfRoom.clientWidth / 2 - middle;
    // A short row can't scroll far enough left to sit in the middle; pad it.
    if (shortBy > 0) {
      myShelfRoom.style.paddingLeft = `${parseFloat(getComputedStyle(myShelfRoom).paddingLeft) + shortBy}px`;
      myShelfRoom.scrollLeft = 0;
    } else {
      myShelfRoom.scrollLeft = middle - myShelfRoom.clientWidth / 2;
    }
  } else {
    myShelfRoom.scrollLeft = Math.max(0, (myShelfRoom.scrollWidth - myShelfRoom.clientWidth) / 2);
  }
  updateMyRoomCaption(centerMyRoomIndex());
}

// Bottom-left "书名 / 作者" line, matching the reference shelf.
function updateMyRoomCaption(roomIndex) {
  if (!myRoomCaption) return;
  const element = myShelfRoom.querySelectorAll(".my-room-book")[roomIndex];
  const book = element ? books[Number(element.dataset.myShelfIndex)] : null;
  setShelfCaption(myRoomCaption, book, roomIndex + 1);
  if (book) setAmbientColor(myShelf, book);
}

// Bottom-left caption: the title in serif, the author after it.
function setShelfCaption(target, book, position) {
  if (!target) return;
  if (!book) {
    target.textContent = "";
    return;
  }
  target.innerHTML = `<b>${escapeHtml(cleanBookTitle(book.title))}</b><small>${escapeHtml(book.author || "")}</small>`;
}

// The room takes on a pale wash of the book in front of you.
function setAmbientColor(target, book) {
  const color = book?.color || book?.spine;
  if (!target || !/^#[0-9a-f]{6}$/i.test(color || "")) return;
  // Grey and black covers would only muddy the paper, so the wash is
  // stronger the more colourful the cover is (6% to 18%).
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === min ? 0 : (max - min) / (1 - Math.abs(max + min - 1));
  target.style.setProperty("--ambient", color);
  target.style.setProperty("--ambient-amount", `${Math.round(6 + 12 * saturation)}%`);
}

// The room book closest to the middle of the screen, used when the arrow
// keys are pressed before any book is open.
function centerMyRoomIndex() {
  const roomBooks = [...myShelfRoom.querySelectorAll(".my-room-book")];
  const railBounds = myShelfRoom.getBoundingClientRect();
  const middle = railBounds.left + railBounds.width / 2;
  let best = 0;
  let bestDistance = Infinity;
  roomBooks.forEach((book, index) => {
    const bounds = book.getBoundingClientRect();
    const distance = Math.abs(bounds.left + bounds.width / 2 - middle);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  });
  return best;
}

function navigateMyRoom(delta) {
  if (myShelfView !== "room") {
    switchMyShelfView("room");
    window.setTimeout(() => navigateMyRoom(delta), 360);
    return;
  }
  const roomBooks = [...myShelfRoom.querySelectorAll(".my-room-book")];
  if (!roomBooks.length) return;
  if (myRoomActiveIndex === null) {
    openMyRoomBook(centerMyRoomIndex(), { focus: true });
    return;
  }
  openMyRoomBook((myRoomActiveIndex + delta + roomBooks.length) % roomBooks.length, { focus: true });
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
  const sourceLabel = result.source === "weread" ? "来自微信读书搜索。" : "来自 Google Books 搜索。";
  const publishYear = info.publishedDate ? `出版时间：${info.publishedDate}` : sourceLabel;
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
    wereadBookId: result.source === "weread" ? String(result.id || "").replace(/^weread-/, "") : "",
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
            ${book.image ? `<img src="${escapeHtml(siteImage(book.image))}" alt="" loading="lazy" />` : `<span>${escapeHtml(book.title.slice(0, 2))}</span>`}
          </div>
          <div class="add-book-copy">
            <h3>${escapeHtml(book.title)}</h3>
            <p>${escapeHtml(book.author)}</p>
            ${(() => {
              const line = book.description.find((paragraph) => !PLACEHOLDER_INTRO.test(paragraph));
              return line ? `<small>${escapeHtml(line)}</small>` : "";
            })()}
          </div>
          <div class="add-book-result-actions">
            <button type="button" data-add-book-result="${index}" ${saved ? "disabled" : ""}>
              ${saved ? `✓ ${t("addedSearchResult")}` : t("addSearchResult")}
            </button>
            ${saved ? "" : `<button type="button" class="add-book-cover-choice" data-cover-result="${index}">${escapeHtml(t("chooseCover"))}</button>`}
          </div>
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
  addBookStatus.classList.add("is-loading");
  // Placeholder cards while WeRead answers (it can take several seconds).
  addBookResults.innerHTML = Array.from({ length: 4 }, () => `
    <li aria-hidden="true">
      <div class="add-book-result add-book-skeleton">
        <span class="add-book-cover"></span>
        <span class="add-book-skeleton-lines"><i></i><i></i><i></i></span>
      </div>
    </li>`).join("");
  const slowNote = window.setTimeout(() => {
    if (addBookStatus.classList.contains("is-loading")) addBookStatus.textContent = "还在找，书库比较大，再等几秒…";
  }, 4000);
  try {
    const results = (await fetchBookSearch(trimmed, { limit: 8, signal: addBookAbortController.signal }))
      .map((result, index) => customBookFromSearchResult(result, index));
    addBookStatus.textContent = results.length ? `找到 ${results.length} 本相关书籍` : t("searchBookEmpty");
    renderAddBookResults(results);
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error(error);
    addBookStatus.textContent = error.name === "GoogleBooksQuotaError"
      ? t("searchBookQuotaError")
      : error.name === "SearchRateLimitError" ? t("searchBookRateLimited") : t("searchBookError");
  } finally {
    window.clearTimeout(slowNote);
    addBookStatus.classList.remove("is-loading");
    if (addBookResults.querySelector(".add-book-skeleton")) addBookResults.innerHTML = "";
    addBookAbortController = null;
  }
}

// Signed-in users search through the search-books Edge Function (WeRead first,
// then Google Books, with server-side keys, caching and rate limiting).
// Guests, or any failure other than a rate limit, fall back to keyless Google.
async function fetchBookSearch(query, { limit = 8, signal = null } = {}) {
  const accessToken = await getSupabaseAccessToken();
  if (accessToken) {
    try {
      const response = await fetch(`${readSupabaseFunctionsUrl()}/search-books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          apikey: readSupabaseAnonKey(),
        },
        body: JSON.stringify({ query: query.trim(), limit }),
        signal,
      });
      if (response.status === 429) {
        const rateError = new Error("Book search rate limited");
        rateError.name = "SearchRateLimitError";
        throw rateError;
      }
      const data = await response.json().catch(() => ({}));
      if (response.ok) return (data.results || []).map(searchResultToVolume);
      console.warn("search-books failed", response.status, data.error);
    } catch (error) {
      if (error.name === "AbortError" || error.name === "SearchRateLimitError") throw error;
      console.warn(error);
    }
  }
  return fetchGoogleBooks(query, { limit, signal });
}

function searchResultToVolume(result) {
  return {
    id: result.id,
    source: result.source,
    volumeInfo: {
      title: result.title,
      authors: result.author ? [result.author] : [],
      description: result.description || "",
      publishedDate: result.publishedDate || "",
      imageLinks: result.cover ? { thumbnail: result.cover } : {},
    },
  };
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
    const quotaError = new Error(`Google Books quota limited: ${response.status}`);
    quotaError.name = "GoogleBooksQuotaError";
    throw quotaError;
  }
  if (!response.ok) throw new Error(`Google Books responded ${response.status}`);
  const data = await response.json();
  return (data.items || []).filter((result) => result.volumeInfo?.title);
}

// Read the user's WeRead shelf with their own key (used once, not stored)
// and let them tick which books to import, instead of importing a random
// sample.
let wereadPickItems = [];
const wereadPicked = new Set();

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
    const accessToken = await getSupabaseAccessToken();
    const response = await fetch(`${readSupabaseFunctionsUrl()}/sync-weread-shelf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ wereadApiKey: trimmed }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `sync failed: ${response.status}`);
    wereadApiKey.value = "";
    wereadPickItems = (Array.isArray(data.items) ? data.items : []).map((item, index) => ({
      item,
      book: customBookFromWereadItem(item, index).book,
    }));
    wereadPicked.clear();
    wereadImportStatus.textContent = wereadPickItems.length ? "" : t("wereadPickEmpty");
    renderWereadPick();
  } catch (error) {
    console.error(error);
    wereadImportStatus.textContent = t("wereadSyncError");
  } finally {
    button.disabled = false;
  }
}

// After WeRead is connected (key saved by weread-me), the shelf can be
// listed without typing the key again.
function updateWereadImportMode() {
  wereadImportForm.classList.toggle("is-connected", reading.connected === true);
}

async function loadWereadPickFromSavedKey() {
  updateWereadImportMode();
  wereadImportStatus.textContent = t("wereadSyncLoading");
  try {
    const data = await callWereadMe("shelf");
    const books = (data.books || []).map((book) => ({ ...book, type: "book" }));
    const albums = (data.albums || []).map((album) => {
      const info = album.albumInfo || {};
      return {
        type: "album",
        albumId: info.albumId || "",
        title: info.name || "未命名有声书",
        author: info.authorName || "作者未知",
        cover: info.cover || "",
        category: "有声书",
        finishReading: info.finish || 0,
        readUpdateTime: album.albumInfoExtra?.lectureReadUpdateTime || null,
      };
    });
    const items = [...books, ...albums]
      .sort((a, b) => (b.readUpdateTime || b.updateTime || 0) - (a.readUpdateTime || a.updateTime || 0));
    wereadPickItems = items.map((item, index) => ({ item, book: customBookFromWereadItem(item, index).book }));
    wereadPicked.clear();
    wereadImportStatus.textContent = wereadPickItems.length ? "" : t("wereadPickEmpty");
    renderWereadPick();
    document.querySelector("#wereadPick")?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error(error);
    wereadImportStatus.textContent = t("wereadSyncError");
  }
}

function isOnShelf(book) {
  return bookExists(book.id) && Boolean(getBookState(book));
}

// Counter and buttons only, so ticking a box never redraws (and scrolls)
// the list.
function updateWereadPickSummary() {
  const available = wereadPickItems.filter(({ book }) => !isOnShelf(book));
  wereadPickCount.textContent = t("wereadPickCount", { total: wereadPickItems.length, selected: wereadPicked.size });
  wereadPickAll.textContent = available.length && wereadPicked.size === available.length ? t("wereadPickClear") : t("wereadPickSelectAll");
  wereadPickImport.disabled = wereadPicked.size === 0;
  wereadPickImport.textContent = wereadPicked.size ? t("wereadPickImport", { count: wereadPicked.size }) : t("wereadPickNone");
}

function renderWereadPick() {
  wereadPick.hidden = wereadPickItems.length === 0;
  if (wereadPick.hidden) return;
  updateWereadPickSummary();
  wereadPickList.innerHTML = wereadPickItems.map(({ item, book }, index) => {
    const onShelf = isOnShelf(book);
    const checked = onShelf || wereadPicked.has(index);
    return `
      <li>
        <label class="weread-pick-item${onShelf ? " is-on-shelf" : ""}">
          <input type="checkbox" data-weread-pick="${index}" ${checked ? "checked" : ""} ${onShelf ? "disabled" : ""} />
          <span class="weread-pick-cover" style="--book-index-color: ${book.spine}">
            ${item.cover ? `<img src="${escapeHtml(item.cover)}" alt="" loading="lazy" />` : ""}
          </span>
          <span class="weread-pick-copy">
            <strong>${escapeHtml(cleanBookTitle(book.title))}</strong>
            <small>${escapeHtml(onShelf ? t("wereadPickOnShelf") : book.author)}</small>
          </span>
        </label>
      </li>
    `;
  }).join("");
}

function setWereadProgress(done, total) {
  const percent = total ? Math.round((done / total) * 100) : 0;
  wereadProgress.hidden = false;
  wereadProgress.querySelector(".weread-progress-bar").setAttribute("aria-valuenow", String(percent));
  wereadProgress.style.setProperty("--progress", `${percent}%`);
  wereadProgressText.textContent = `正在准备你的书：${done} / ${total}`;
}

function preloadImage(url) {
  if (!url) return Promise.resolve();
  return new Promise((resolve) => {
    const image = new Image();
    const finish = () => resolve();
    image.onload = finish;
    image.onerror = finish;
    window.setTimeout(finish, 8000);
    image.src = url;
  });
}

// Get one imported book fully ready (cover downloaded, colours taken from
// the cover, real intro fetched) before it is shown in the room.
async function prepareImportedBook(book) {
  await preloadImage(book.image);
  if (book.isCustom && book.image && book.coverPalette !== `${COVER_PALETTE_VERSION}|${book.image}`) {
    try {
      const color = await fetchCoverColor(book.image);
      if (color) applyCoverPalette(book, color);
    } catch (error) {
      console.warn("Cover colour failed", error);
    }
  }
  await loadRealIntro(book);
}

async function importPickedWereadBooks() {
  const picked = [...wereadPicked].map((index) => wereadPickItems[index]).filter(Boolean);
  if (!picked.length) return;
  wereadPickImport.disabled = true;
  wereadPickAll.disabled = true;
  wereadPickList.querySelectorAll("input").forEach((box) => { box.disabled = true; });
  wereadImportStatus.textContent = "";

  // Add the books (the add-book panel stays on top, so nothing half-ready is
  // visible yet), then prepare them a few at a time while the bar fills up.
  const prepared = picked.map(({ item, book: draft }, offset) => {
    const existing = books.find((book) => book.id === draft.id);
    const book = existing || draft;
    if (!existing) {
      books.push(book);
      createBook(book, books.length - 1);
    }
    const { status } = customBookFromWereadItem(item, offset);
    saveBookState(book, status || DEFAULT_STATUS);
    return book;
  });
  writeCustomBooks();
  totalBooks.textContent = formatReferenceCount();
  renderBookIndex();
  measureShelf();

  let done = 0;
  setWereadProgress(done, prepared.length);
  const queue = [...prepared];
  const worker = async () => {
    while (queue.length) {
      await prepareImportedBook(queue.shift());
      done += 1;
      setWereadProgress(done, prepared.length);
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, prepared.length) }, worker));

  renderMyShelf();
  wereadImportStatus.textContent = t("wereadSyncDone", { count: prepared.length });
  wereadProgress.hidden = true;
  wereadPickAll.disabled = false;
  wereadPicked.clear();
  wereadPickItems = [];
  renderWereadPick();
  closeAddBookPanel({ restoreFocus: false });
  window.setTimeout(() => openMyShelf({ view: "room", restoreFocus: false }), 240);
}

function addCustomBook(book) {
  if (!bookExists(book.id)) {
    books.push(book);
    writeCustomBooks();
    createBook(book, books.length - 1);
    totalBooks.textContent = formatReferenceCount();
    renderBookIndex();
    measureShelf();
  }
  saveBookState(book, DEFAULT_STATUS);
  loadCoverPalette(book);
  loadRealIntro(book);
  renderAddBookResults();
  // Stay on the results so several books can be added from one search;
  // closing the panel then goes back to the room.
  addBookStatus.textContent = `已把《${cleanBookTitle(book.title)}》加入你的书架，可以继续添加。`;
}

// ---- Shelf management: remove books, choose covers ----

function confirmRemoveFromShelf(button) {
  const book = books[Number(button.dataset.removeBook)];
  if (!book) return;
  const setLabel = (label) => {
    button.title = label;
    button.setAttribute("aria-label", `${label}：${book.title}`);
  };
  if (!button.classList.contains("is-confirming")) {
    button.classList.add("is-confirming");
    setLabel(t("confirmRemove"));
    window.setTimeout(() => {
      if (!button.isConnected) return;
      button.classList.remove("is-confirming");
      setLabel(t("removeFromShelf"));
    }, 3000);
    return;
  }
  removeBookState(book);
}

function applyCoverToBook(book, url) {
  book.image = url || "";
  book.originalCover = Boolean(url);
  book.coverPalette = "";
  if (book.isCustom && bookExists(book.id)) writeCustomBooks();
  const index = books.indexOf(book);
  const cover = index >= 0 ? bookElements[index]?.querySelector(".book-cover") : null;
  if (cover) {
    cover.classList.toggle("has-original-cover", book.originalCover);
    cover.innerHTML = coverMarkup(book, index);
  }
  renderMyShelf();
  if (index >= 0 && detailIndex === index) populateBookDetail(index);
  if (getBookState(book)) syncBookStateToSupabase(book);
  loadCoverPalette(book);
}

let coverPickerState = null;

function coverPickerPreviewMarkup(url, book) {
  return url
    ? `<img src="${escapeHtml(siteImage(url))}" alt="" />`
    : `<span>${escapeHtml(book.title.slice(0, 4))}</span>`;
}

function renderCoverPicker() {
  const state = coverPickerState;
  if (!state) return;
  const previewUrl = state.uploadPreview || state.selected;
  coverPickerPreview.style.setProperty("--book-index-color", state.book.spine);
  coverPickerPreview.innerHTML = coverPickerPreviewMarkup(previewUrl, state.book);
  coverPickerGrid.innerHTML = state.options.map((url, index) => `
    <button type="button" data-cover-option="${index}" aria-pressed="${String(!state.uploadBlob && state.selected === url)}">
      <img src="${escapeHtml(siteImage(url))}" alt="" loading="lazy" />
    </button>
  `).join("");
  coverPickerTextButton.setAttribute("aria-pressed", String(!state.uploadBlob && !state.selected));
}

async function openCoverPicker(book, onSaved = null) {
  coverPickerState = {
    book,
    onSaved,
    selected: book.image || "",
    options: book.image ? [book.image] : [],
    uploadBlob: null,
    uploadPreview: "",
  };
  coverPickerKicker.textContent = t("coverPickerKicker");
  coverPickerTitle.textContent = book.title;
  coverPickerAlternativesLabel.textContent = t("coverPickerAlternatives");
  coverPickerUploadLabel.textContent = t("coverPickerUpload");
  coverPickerTextButton.textContent = t("coverPickerText");
  coverPickerSave.textContent = t("coverPickerSave");
  coverPickerCancel.textContent = t("coverPickerCancel");
  coverPickerSave.disabled = false;
  coverPickerFile.value = "";
  coverPickerStatus.textContent = t("coverPickerLoading");
  renderCoverPicker();
  coverPicker.hidden = false;
  requestAnimationFrame(() => coverPicker.classList.add("is-visible"));
  coverPickerClose.focus({ preventScroll: true });

  const state = coverPickerState;
  try {
    const results = await fetchBookSearch(book.title, { limit: 12 });
    if (coverPickerState !== state) return;
    const covers = results.map(coverUrlFromSearchResult).filter(Boolean);
    state.options = [...new Set([...state.options, ...covers])];
    coverPickerStatus.textContent = state.options.length > (book.image ? 1 : 0) ? "" : t("coverPickerNone");
  } catch (error) {
    if (coverPickerState !== state) return;
    console.warn(error);
    coverPickerStatus.textContent = error.name === "SearchRateLimitError" ? t("searchBookRateLimited") : t("coverPickerNone");
  }
  renderCoverPicker();
}

function closeCoverPicker() {
  if (!coverPickerState) return;
  if (coverPickerState.uploadPreview) URL.revokeObjectURL(coverPickerState.uploadPreview);
  coverPickerState = null;
  coverPicker.classList.remove("is-visible");
  window.setTimeout(() => {
    if (!coverPickerState) coverPicker.hidden = true;
  }, 240);
}

async function resizeCoverImage(file, maxWidth) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("encode failed"))), "image/jpeg", 0.86);
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

// Signed-in users get the image stored in Supabase Storage (covers/<user id>/…);
// guests keep a small copy in this browser.
async function uploadCoverImage(file, book) {
  const client = getSupabaseClient();
  const userId = supabaseSession?.user?.id;
  if (client && userId) {
    const blob = await resizeCoverImage(file, 600);
    const path = `${userId}/${slugifyText(book.id).slice(0, 60) || "cover"}-${Date.now()}.jpg`;
    const { error } = await client.storage.from("covers").upload(path, blob, { contentType: "image/jpeg", upsert: false });
    if (error) throw error;
    return client.storage.from("covers").getPublicUrl(path).data.publicUrl;
  }
  return blobToDataUrl(await resizeCoverImage(file, 360));
}

async function saveCoverPicker() {
  const state = coverPickerState;
  if (!state) return;
  coverPickerSave.disabled = true;
  coverPickerStatus.textContent = t("coverPickerSaving");
  try {
    const url = state.uploadBlob ? await uploadCoverImage(state.uploadBlob, state.book) : state.selected;
    applyCoverToBook(state.book, url);
    state.onSaved?.(url);
    closeCoverPicker();
  } catch (error) {
    console.error(error);
    coverPickerStatus.textContent = t("coverPickerFailed");
    coverPickerSave.disabled = false;
  }
}

// ---- Reading panel: the user's own WeRead stats, progress and notes ----
// Uses the user's WeRead key, which they can save (encrypted on the server
// by the weread-me function) so the panel updates by itself.

const READING_MODES = [
  ["weekly", "本周"],
  ["monthly", "本月"],
  ["annually", "本年"],
  ["overall", "总计"],
];

const reading = {
  connected: null,
  mode: "monthly",
  stats: {},
  year: null,
  notebooks: null,
  progress: null,
  view: "overview",
  book: null,
  error: "",
  returnToShelf: false,
  loading: null,
  recommend: null,
  monthTops: null,
  // Cover colour per cover URL, for the masthead and charts.
  themeColors: {},
  quote: undefined,
  // Highlight texts per WeRead bookId, so 换一条 doesn't refetch a book.
  highlightCache: {},
};

async function callWereadMe(action, extra = {}) {
  const accessToken = await getSupabaseAccessToken();
  if (!accessToken) throw Object.assign(new Error("sign in"), { code: "sign_in_required" });
  const response = await fetch(`${readSupabaseFunctionsUrl()}/weread-me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      apikey: readSupabaseAnonKey(),
    },
    body: JSON.stringify({ action, ...extra }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(data.error || `weread-me ${response.status}`), { code: data.error });
  return data;
}

function readingErrorText(error) {
  switch (error?.code) {
    case "weread_key_expired": return "微信读书 API Key 已失效，请重新获取后再连接。";
    case "invalid_key": return "这个 API Key 格式不对，应以 wrk- 开头。";
    case "rate_limited": return "刷新得有点频繁，请过一会儿再试。";
    case "weread_upgrade_required": return "微信读书接口升级了，网站需要更新后才能继续读取。";
    case "not_connected": return "还没有连接微信读书。";
    default: return "读取微信读书数据失败，请稍后再试。";
  }
}

function formatDuration(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.round((total % 3600) / 60);
  if (hours && minutes) return `${hours} 小时 ${minutes} 分钟`;
  if (hours) return `${hours} 小时`;
  return `${minutes} 分钟`;
}

function openReadingPanel() {
  if (!supabaseSession?.user) {
    openAuthGate(() => openReadingPanel());
    return;
  }
  reading.returnToShelf = !myShelf.hidden;
  closeShelfHelp({ immediate: true });
  closeBookIndex({ restoreFocus: false, immediate: true });
  closeAddBookPanel({ restoreFocus: false, immediate: true });
  closeMyShelf({ restoreFocus: false, immediate: true, targetSpace: activeSpace });
  reading.view = "overview";
  readingPanel.hidden = false;
  readingPanel.setAttribute("aria-hidden", "false");
  updateOnboarding();
  requestAnimationFrame(() => {
    library.classList.add("is-reading-open");
    readingPanel.classList.add("is-visible");
    readingPanelClose.focus({ preventScroll: true });
  });
  renderReadingPanel();
  refreshReadingPanel();
}

// returnToShelf: false when the user is heading somewhere else (e.g. picked
// a space in the top switch), so the panel just gets out of the way.
function closeReadingPanel({ immediate = false, returnToShelf = reading.returnToShelf } = {}) {
  if (readingPanel.hidden) return;
  readingPanel.classList.remove("is-visible");
  readingPanel.setAttribute("aria-hidden", "true");
  library.classList.remove("is-reading-open");
  reading.returnToShelf = false;
  const hide = () => {
    if (!readingPanel.classList.contains("is-visible")) readingPanel.hidden = true;
    updateOnboarding();
  };
  if (immediate) hide();
  else window.setTimeout(hide, 380);
  if (returnToShelf) openMyShelf({ view: myShelfView, restoreFocus: false });
}

// Everything the dashboard needs is fetched first, behind a progress bar;
// the dashboard is drawn only once it is all in (or something failed).
async function refreshReadingPanel() {
  reading.error = "";
  try {
    if (reading.connected === null) {
      reading.loading = { done: 0, total: 1 };
      renderReadingPanel();
      reading.connected = (await callWereadMe("status")).connected;
    }
    if (!reading.connected) {
      reading.loading = null;
      renderReadingPanel();
      return;
    }
    const tasks = [];
    if (!reading.stats[reading.mode]) tasks.push(() => loadReadingStats(reading.mode));
    if (!reading.year) tasks.push(() => callWereadMe("stats", { mode: "annually" }).then((data) => { reading.year = data; }));
    if (!reading.monthTops) {
      tasks.push(() => callWereadMe("monthTops", { year: new Date().getFullYear() })
        .then((data) => { reading.monthTops = data.months || []; })
        .catch((error) => { console.warn(error); reading.monthTops = []; }));
    }
    if (!reading.notebooks) tasks.push(() => callWereadMe("notebooks").then((data) => { reading.notebooks = data.books || []; }));
    if (!reading.progress) tasks.push(() => loadReadingProgress());
    if (!reading.recommend) {
      tasks.push(() => callWereadMe("recommend")
        .then((data) => { reading.recommend = data.books || []; })
        .catch((error) => { console.warn(error); reading.recommend = []; }));
    }
    if (tasks.length) {
      reading.loading = { done: 0, total: tasks.length, images: null };
      renderReadingPanel();
      await Promise.all(tasks.map((task) => task().then(() => {
        reading.loading.done += 1;
        updateReadingLoading();
      })));
      // The masthead colour and the featured highlight.
      await Promise.all([loadReadingTheme(reading.mode), loadReadingQuote()]);
      // Then wait for the covers, so the panel opens with its pictures in.
      const urls = readingCoverUrls();
      reading.loading.images = { done: 0, total: urls.length };
      updateReadingLoading();
      await Promise.all(urls.map((url) => preloadImage(url).then(() => {
        reading.loading.images.done += 1;
        updateReadingLoading();
      })));
    }
  } catch (error) {
    console.warn(error);
    if (error.code === "not_connected") reading.connected = false;
    reading.error = readingErrorText(error);
  }
  if (reading.loading) await readingProgress.finish();
  reading.loading = null;
  readingProgress.reset();
  renderReadingPanel();
}

// Covers the dashboard shows without scrolling far: month tops, 读得最多,
// progress, recommendations and the first notebooks.
function readingCoverUrls() {
  const stats = reading.stats[reading.mode];
  const covers = [
    ...(reading.monthTops || []).filter((item) => item.readTime > 0).map((item) => item.book?.cover),
    ...(stats?.readLongest || []).slice(0, 10).map((item) => item.book?.cover),
    ...(reading.progress || []).map((item) => item.cover),
    ...(reading.recommend || []).map((item) => item.cover),
    ...(reading.notebooks || []).slice(0, 30).map((item) => item.book?.cover),
  ];
  return [...new Set(covers.filter(Boolean).map((cover) => sharpCover(cover)))];
}

// Resolves once the image has fully downloaded, or failed, or
// after 10 s, so a slow cover never blocks the panel for good.
function preloadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    const finish = () => { clearTimeout(timer); resolve(); };
    const timer = setTimeout(finish, 10000);
    image.onload = finish;
    image.onerror = finish;
    image.src = url;
  });
}

// Data counts for the first half of the bar, covers for the second.
function readingLoadingPercent() {
  const { done, total, images } = reading.loading;
  const data = total ? done / total : 1;
  if (!images) return Math.round(data * 50);
  return Math.round(50 + (images.total ? images.done / images.total : 1) * 50);
}

// ---- Loading indicators that never jump ----
// The real progress (0–1) only sets a target; every frame the drawn value
// glides toward it, and while a step is still running it keeps creeping a
// little further (never past 96%), so it doesn't stall or move in steps.
// finish() runs it quickly to 100% before the page appears.
function createSmoothProgress(draw) {
  const state = { target: 0, shown: 0, last: 0, raf: 0, finishing: false, onFull: null };
  const tick = (now) => {
    const dt = Math.min(64, now - (state.last || now));
    state.last = now;
    let goal;
    let tau;
    if (state.finishing) {
      goal = 1;
      tau = 170;
    } else if (state.shown < state.target) {
      goal = state.target;
      tau = 260;
    } else {
      goal = Math.min(0.96, state.target + 0.14);
      tau = 2600;
    }
    state.shown = Math.max(state.shown, state.shown + (goal - state.shown) * (1 - Math.exp(-dt / tau)));
    if (state.finishing && state.shown > 0.995) state.shown = 1;
    draw(state.shown);
    if (state.shown >= 1) {
      state.raf = 0;
      state.onFull?.();
      return;
    }
    state.raf = requestAnimationFrame(tick);
  };
  const run = () => {
    if (!state.raf) {
      state.last = 0;
      state.raf = requestAnimationFrame(tick);
    }
  };
  return {
    set(value) {
      state.target = Math.max(state.target, Math.min(1, value));
      run();
    },
    reset() {
      cancelAnimationFrame(state.raf);
      Object.assign(state, { target: 0, shown: 0, last: 0, raf: 0, finishing: false, onFull: null });
      draw(0);
    },
    // Resolves at 100%, or after 800 ms at most.
    finish() {
      state.finishing = true;
      run();
      return new Promise((resolve) => {
        const timer = setTimeout(resolve, 800);
        state.onFull = () => { clearTimeout(timer); resolve(); };
      });
    },
  };
}

// A thin ring with the percentage inside (笔记 and 阅读记录 while loading).
const PROGRESS_RING = 2 * Math.PI * 26;

function progressRingMarkup() {
  return `
    <div class="notes-ring" role="progressbar" aria-label="加载中" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
      <svg viewBox="0 0 60 60" aria-hidden="true">
        <circle class="notes-ring-track" cx="30" cy="30" r="26" />
        <circle class="notes-ring-arc" cx="30" cy="30" r="26" stroke-dasharray="${PROGRESS_RING}" stroke-dashoffset="${PROGRESS_RING}" />
      </svg>
      <b>0</b>
    </div>`;
}

function drawProgressRing(root, value) {
  const ring = root?.querySelector(".notes-ring");
  if (!ring) return;
  ring.querySelector(".notes-ring-arc").style.strokeDashoffset = String(PROGRESS_RING * (1 - value));
  ring.querySelector("b").textContent = `${Math.round(value * 100)}`;
  ring.setAttribute("aria-valuenow", String(Math.round(value * 100)));
}

const readingProgress = createSmoothProgress((value) => drawProgressRing(readingPanelBody, value));

function readingLoadingMarkup() {
  return progressRingMarkup();
}

function updateReadingLoading() {
  if (reading.loading) readingProgress.set(readingLoadingPercent() / 100);
}

async function loadReadingStats(mode) {
  if (reading.stats[mode]) return;
  reading.stats[mode] = await callWereadMe("stats", { mode });
}

async function loadReadingProgress() {
  const data = await callWereadMe("shelfProgress");
  reading.progress = data.books || [];
}

function readingConnectMarkup() {
  return `
    <div class="reading-connect">
      <p>连接你的微信读书后，这里会显示你的阅读时长、阅读日历、每本书的阅读进度，以及你的划线和想法。</p>
      <form id="readingConnectForm">
        <label for="readingKey">微信读书 API Key</label>
        <input id="readingKey" type="password" autocomplete="off" placeholder="wrk-xxxxxxxx" required />
        <label class="reading-consent">
          <input type="checkbox" id="readingConsent" required />
          <span>保存这个 Key，用来自动更新我的阅读数据。Key 会加密保存，可以随时断开并删除。</span>
        </label>
        <button type="submit">连接微信读书</button>
      </form>
      ${reading.error ? `<p class="reading-error">${escapeHtml(reading.error)}</p>` : ""}
      <details class="weread-howto" open>
        <summary>怎么获取 API Key？</summary>
        <ol>
          <li>在电脑或另一台设备上打开 <a href="https://weread.qq.com/r/weread-skills" target="_blank" rel="noopener">weread.qq.com/r/weread-skills</a>。</li>
          <li>用手机上的微信读书 App 扫页面上的二维码。</li>
          <li>按提示生成 Key，复制以 <code>wrk-</code> 开头的那一串，粘贴到上面。</li>
        </ol>
      </details>
      <p class="reading-note">没有用微信读书？阅读记录需要它的数据，不过你的书架和房间不受影响，可以照常加书、整理。</p>
    </div>
  `;
}

// WeRead timestamps are documented as seconds; accept milliseconds too so a
// unit mix-up can't push every day into a far-future (invisible) year.
// Calendar day of a WeRead timestamp. WeRead's days, months and years start
// at midnight Beijing time (UTC+8), which is still the evening before in
// Europe, so dates are read in Beijing time rather than the viewer's zone.
// Accepts seconds, milliseconds or a date string.
const BEIJING_OFFSET_MS = 8 * 3600 * 1000;

function wereadDay(value) {
  const number = Number(value);
  let ms;
  if (Number.isNaN(number)) {
    ms = new Date(String(value)).getTime();
    if (Number.isNaN(ms)) return null;
  } else {
    if (!number) return null;
    ms = number > 1e12 ? number : number * 1000;
  }
  const shifted = new Date(ms + BEIJING_OFFSET_MS);
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth(), date: shifted.getUTCDate() };
}

function readingYearNumber(year) {
  const now = new Date().getFullYear();
  const fromData = wereadDay(year?.baseTime)?.year;
  return fromData && Math.abs(fromData - now) <= 1 ? fromData : now;
}

// Per-day reading seconds for the year: dailyReadTimes when WeRead sends
// it, otherwise readTimes if those buckets are daily.
function readingDailyMap(year) {
  const yearNumber = readingYearNumber(year);
  const source = Object.keys(year?.dailyReadTimes || {}).length
    ? year.dailyReadTimes
    : Object.keys(year?.readTimes || {}).length > 12 ? year.readTimes : {};
  const map = new Map();
  Object.entries(source).forEach(([key, value]) => {
    const day = wereadDay(key);
    if (!day || day.year !== yearNumber) return;
    const id = `${day.month}-${day.date}`;
    map.set(id, (map.get(id) || 0) + (Number(value) || 0));
  });
  return map;
}

function readingHeatmapMarkup(year) {
  const yearNumber = readingYearNumber(year);
  const byDay = readingDailyMap(year);
  if (!byDay.size) return `<p class="reading-muted">微信读书这次没有返回每天的阅读数据。</p>`;
  const level = (seconds) => (!seconds ? 0 : seconds < 900 ? 1 : seconds < 1800 ? 2 : seconds < 3600 ? 3 : 4);
  const start = new Date(yearNumber, 0, 1);
  const cells = [];
  const offset = (start.getDay() + 6) % 7; // weeks start on Monday
  for (let i = 0; i < offset; i += 1) cells.push('<span class="is-blank"></span>');
  const today = new Date();
  for (let day = new Date(start); day.getFullYear() === yearNumber; day.setDate(day.getDate() + 1)) {
    const seconds = byDay.get(`${day.getMonth()}-${day.getDate()}`) || 0;
    const label = `${day.getMonth() + 1}月${day.getDate()}日：${seconds ? formatDuration(seconds) : "没有阅读"}`;
    cells.push(day > today ? '<span class="is-future"></span>' : `<span class="level-${level(seconds)}" data-label="${label}"></span>`);
  }
  return `<div class="reading-heatmap" role="img" aria-label="${yearNumber} 年每天的阅读时长">${cells.join("")}</div>`;
}

function readingCoverMarkup(cover, title = "") {
  cover = sharpCover(cover);
  return `<span class="rd-cover">${cover ? `<img src="${escapeHtml(siteImage(cover))}" alt="" loading="lazy" />` : `<span>${escapeHtml(String(title).slice(0, 2))}</span>`}</span>`;
}

// "3.5 小时" / "40 分钟": fits under a narrow month column.
function shortDuration(seconds) {
  const minutes = Math.round((Number(seconds) || 0) / 60);
  if (minutes < 60) return `${minutes} 分钟`;
  const hours = minutes / 60;
  return `${hours >= 10 ? Math.round(hours) : Math.round(hours * 10) / 10} 小时`;
}

// Reading time per month for the current year, as simple bars.
function readingMonthBars(year) {
  const yearNumber = readingYearNumber(year);
  const source = Object.keys(year?.dailyReadTimes || {}).length ? year.dailyReadTimes : year?.readTimes || {};
  const months = Array(12).fill(0);
  Object.entries(source).forEach(([key, value]) => {
    const day = wereadDay(key);
    if (day && day.year === yearNumber) months[day.month] += Number(value) || 0;
  });
  const max = Math.max(1, ...months);
  const now = new Date();
  const thisYear = yearNumber === now.getFullYear();
  // Each month's most-read book (from WeRead), shown under its bar.
  const tops = new Map((reading.monthTops || [])
    .filter((item) => item.book?.title && item.readTime > 0)
    .map((item) => [item.month, item]));
  return `
    <div class="rd-months">
      <div class="rd-bars" role="img" aria-label="每月阅读时长">
        ${months.map((seconds, month) => `
          <div class="rd-bar${thisYear && month === now.getMonth() ? " is-current" : ""}" title="${month + 1}月：${formatDuration(seconds)}">
            <span style="height: ${Math.max(seconds ? 3 : 0, Math.round((seconds / max) * 100))}%"></span>
            <small>${month + 1}</small>
          </div>`).join("")}
      </div>
      ${tops.size ? `
        <p class="rd-month-tops-label">每月读得最久的书</p>
        <ol class="rd-month-tops">
          ${months.map((_, month) => {
            const top = tops.get(month);
            if (!top) return '<li class="is-empty" aria-hidden="true"></li>';
            const label = `${month + 1}月读得最久：${cleanBookTitle(top.book.title)} · ${formatDuration(top.readTime)}`;
            return `
              <li title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}">
                ${readingCoverMarkup(top.book.cover, top.book.title)}
                <b>${escapeHtml(cleanBookTitle(top.book.title))}</b>
                <small>${shortDuration(top.readTime)}</small>
              </li>`;
          }).join("")}
        </ol>` : ""}
    </div>`;
}

function recommendBook(item) {
  return customBookFromSearchResult(searchResultToVolume({
    id: `weread-${item.bookId}`,
    source: "weread",
    title: item.title,
    author: item.author,
    cover: item.cover,
    description: shortenIntro(item.intro),
  }));
}

function isRecommendAdded(item) {
  const book = books.find((candidate) => candidate.id === recommendBook(item).id);
  return Boolean(book && getBookState(book));
}

// Add a recommended book without leaving the panel; colours and intro are
// filled in the background.
function addRecommendedBook(item) {
  const draft = recommendBook(item);
  const existing = books.find((book) => book.id === draft.id);
  const book = existing || draft;
  if (!existing) {
    books.push(book);
    writeCustomBooks();
    createBook(book, books.length - 1);
    totalBooks.textContent = formatReferenceCount();
    renderBookIndex();
    measureShelf();
  }
  saveBookState(book, DEFAULT_STATUS);
  loadCoverPalette(book);
  loadRealIntro(book);
}

// ---- Reading record: masthead colour, featured book and highlight ----

const READING_THEME_FALLBACK = "#3b4a3f";
const READING_PERIOD_TITLES = { weekly: "本周", monthly: "本月", annually: "今年", overall: "一直以来" };

// The book the masthead is about: the period's most-read, else the year's.
function readingFeature(mode = reading.mode) {
  return reading.stats[mode]?.readLongest?.find((item) => item.book?.title)
    || reading.year?.readLongest?.find((item) => item.book?.title)
    || null;
}

function readingThemeColor(mode = reading.mode) {
  if (themeColor()) return themeColor();
  const cover = readingFeature(mode)?.book?.cover;
  return (cover && reading.themeColors[cover]) || READING_THEME_FALLBACK;
}

async function loadReadingTheme(mode = reading.mode) {
  const cover = readingFeature(mode)?.book?.cover;
  if (!cover || reading.themeColors[cover]) return;
  try {
    const color = await Promise.race([
      fetchCoverColor(sharpCover(cover)),
      new Promise((resolve) => setTimeout(() => resolve(null), 6000)),
    ]);
    if (color) reading.themeColors[cover] = color;
  } catch (error) {
    console.warn("Reading theme colour failed", error);
  }
}

// 摘录: one of the user's highlights, picked at random from any annotated
// book (books with more highlights come up more often). 换一条 picks again.
function readingQuoteCandidates(texts) {
  const usable = texts
    .map((text) => String(text || "").replace(/\s+/g, " ").trim())
    .filter((text) => text.length >= 8);
  const fitting = usable.filter((text) => text.length <= 120);
  return fitting.length ? fitting : usable;
}

async function readingHighlightTexts(bookId) {
  if (!reading.highlightCache[bookId]) {
    const data = await callWereadMe("highlights", { bookId });
    reading.highlightCache[bookId] = readingQuoteCandidates((data.highlights || []).map((mark) => mark.text));
  }
  return reading.highlightCache[bookId];
}

function pickWeightedNotebook(exclude = new Set()) {
  const books = (reading.notebooks || []).filter((entry) => entry.highlights > 0 && entry.book?.bookId && !exclude.has(entry.book.bookId));
  const total = books.reduce((sum, entry) => sum + entry.highlights, 0);
  let roll = Math.random() * total;
  return books.find((entry) => (roll -= entry.highlights) < 0) || books[books.length - 1] || null;
}

async function pickReadingQuote() {
  const tried = new Set();
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const item = pickWeightedNotebook(tried);
    if (!item) return null;
    tried.add(item.book.bookId);
    const texts = await readingHighlightTexts(item.book.bookId);
    const choices = texts.filter((text) => text !== reading.quote?.text);
    if (!choices.length) continue;
    const text = choices[Math.floor(Math.random() * choices.length)];
    const quote = { text: text.length > 160 ? `${text.slice(0, 158)}…` : text, title: item.book.title, author: item.book.author || "", cover: item.book.cover || "" };
    await loadQuoteColor(quote);
    return quote;
  }
  return null;
}

async function loadReadingQuote() {
  if (reading.quote !== undefined) return;
  reading.quote = null;
  try {
    reading.quote = await pickReadingQuote();
  } catch (error) {
    console.warn("Reading quote failed", error);
  }
}

// The quote's bar takes its book's cover colour (shared cache with the
// masthead); vermilion until the colour is known.
async function loadQuoteColor(quote) {
  const cover = quote?.cover;
  if (!cover || reading.themeColors[cover]) return;
  try {
    const color = await Promise.race([
      fetchCoverColor(sharpCover(cover)),
      new Promise((resolve) => setTimeout(() => resolve(null), 4000)),
    ]);
    if (color) reading.themeColors[cover] = color;
  } catch (error) {
    console.warn("Quote colour failed", error);
  }
}

function quoteColorStyle(quote) {
  const color = quote?.cover && reading.themeColors[quote.cover];
  return color ? `--quote-c: ${color};` : "";
}

function readingQuoteCardInner(quote) {
  return `
    ${quote.cover ? `<figure class="rd-quote-cover">${readingCoverMarkup(quote.cover, quote.title)}</figure>` : ""}
    <blockquote class="rd-quote">${readingQuoteInner(quote)}</blockquote>`;
}

function readingQuoteInner(quote) {
  return `
    <p>${escapeHtml(quote.text)}</p>
    <cite>《${escapeHtml(cleanBookTitle(quote.title))}》${quote.author ? ` · ${escapeHtml(quote.author)}` : ""}</cite>`;
}

// 换一条: swap just the quote, with a short fade, without redrawing the panel.
async function shuffleReadingQuote(button, root = readingPanelBody) {
  const box = root.querySelector(".rd-quote-card");
  if (!box || button.disabled) return;
  button.disabled = true;
  box.classList.add("is-changing");
  try {
    const [next] = await Promise.all([pickReadingQuote(), new Promise((resolve) => setTimeout(resolve, 220))]);
    if (next) {
      reading.quote = next;
      if (root === quotePanelBody) applyNotesColor(next);
      box.setAttribute("style", quoteColorStyle(next));
      box.classList.toggle("has-cover", Boolean(next.cover));
      box.innerHTML = readingQuoteCardInner(next);
    }
  } catch (error) {
    console.warn("Reading quote failed", error);
  }
  box.classList.remove("is-changing");
  button.disabled = false;
}

// 23 小时 54 分 as big number + small unit pairs.
function readingDurationMarkup(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.round((total % 3600) / 60);
  const parts = hours ? [[hours, "小时"], [minutes, "分"]] : [[minutes, "分钟"]];
  return parts.map(([value, unit]) => `${value}<small>${unit}</small>`).join(" ");
}

// Section heading: serif title, a quiet note, and optionally a tool button
// right beside the title.
function readingSectionHead(title, _number, note = "", tool = "") {
  return `
    <header class="rd-sec-head">
      <h4>${title}${tool}${note ? ` <small>${note}</small>` : ""}</h4>
    </header>`;
}

function readingMastheadMarkup(stats) {
  const color = readingThemeColor();
  const ink = inkForColor(color);
  const feature = readingFeature();
  const yearNumber = readingYearNumber(reading.year);
  const period = READING_PERIOD_TITLES[reading.mode] || "";
  const compare = stats?.compare;
  const facts = [
    stats ? `${stats.readDays} 天在读` : "",
    stats?.dayAverageReadTime ? `日均 ${formatDuration(stats.dayAverageReadTime)}` : "",
    ...(stats?.readStat || []).map((item) => `${item.stat} ${item.counts}`),
    typeof compare === "number" && reading.mode !== "overall" ? `${compare >= 0 ? "比上期多" : "比上期少"} ${Math.abs(Math.round(compare * 100))}%` : "",
  ].filter(Boolean);
  return `
    <section class="rd-masthead" style="--rd-c: ${color}; --rd-on: ${ink};">
      <div class="rd-masthead-bar">
        ${readingSegmentMarkup()}
        <button type="button" class="reading-disconnect" id="readingDisconnect">断开微信读书</button>
      </div>
      <div class="rd-masthead-body">
        <div class="rd-masthead-copy">
          <p class="rd-eyebrow">${reading.mode === "overall" ? "全部" : yearNumber} · ${period}的阅读</p>
          <p class="rd-total">${stats ? readingDurationMarkup(stats.totalReadTime) : "—"}</p>
          <p class="rd-facts">${facts.map((fact) => `<span>${escapeHtml(fact)}</span>`).join("")}</p>
        </div>
        ${feature ? `
        <figure class="rd-feature">
          ${readingCoverMarkup(feature.book.cover, feature.book.title)}
          <figcaption><small>读得最久</small><b>${escapeHtml(cleanBookTitle(feature.book.title))}</b><span>${formatDuration(feature.readTime)}</span></figcaption>
        </figure>` : ""}
      </div>
    </section>`;
}

function readingQuoteMarkup(number) {
  const quote = reading.quote;
  // Phones have 笔记 as its own tab, so the reading record leaves it out.
  if (!quote || !number) return "";
  return `
    <section class="rd-section rd-span-3">
      ${readingSectionHead("摘录", number, "随机一条你划过的句子", `
        <button type="button" class="rd-quote-shuffle" data-quote-shuffle title="换一条" aria-label="换一条">
          <i data-lucide="shuffle" aria-hidden="true"></i>
        </button>`)}
      <div class="rd-quote-card${quote.cover ? " has-cover" : ""}" style="${quoteColorStyle(quote)}" aria-live="polite">${readingQuoteCardInner(quote)}</div>
    </section>`;
}

function readingOverviewMarkup() {
  // Everything here comes from WeRead; the room's own books aren't counted.
  const stats = reading.stats[reading.mode];
  const year = reading.year;
  const yearNumber = readingYearNumber(year);
  const modeLabel = READING_MODES.find(([mode]) => mode === reading.mode)?.[1] || "";
  const wall = (stats?.readLongest || []).slice(0, 10);
  const progressBooks = reading.progress || [];
  let number = 0;
  const next = () => (number += 1);

  return `
    ${readingMastheadMarkup(stats)}
    ${reading.error ? `<p class="reading-error">${escapeHtml(reading.error)}</p>` : ""}

    <div class="rd-grid">
      <section class="rd-section rd-span-3 rd-wall-card">
        ${readingSectionHead("读得最多", next(), modeLabel)}
        ${wall.length ? `<div class="rd-wall">${wall.map((item, index) => `
          <figure title="${escapeHtml(item.book?.title || "")} · ${formatDuration(item.readTime)}">
            <span class="rd-rank">${index + 1}</span>
            ${readingCoverMarkup(item.book?.cover, item.book?.title)}
            <figcaption>${escapeHtml(cleanBookTitle(item.book?.title || ""))}</figcaption>
            <small>${formatDuration(item.readTime)}</small>
          </figure>`).join("")}</div>` : `<p class="reading-muted">这段时间还没有阅读记录。</p>`}
      </section>

      <section class="rd-section rd-span-3">
        ${readingSectionHead("每月", next(), `${yearNumber} 年的阅读时长`)}
        ${year ? readingMonthBars(year) : `<p class="reading-muted">没有读取到全年数据。</p>`}
      </section>

      <section class="rd-section rd-span-3">
        ${readingSectionHead("阅读日历", next(), year ? `${yearNumber} · ${formatDuration(year.totalReadTime)} · ${year.readDays} 天` : "")}
        <div class="rd-calendar">
          ${year ? readingHeatmapMarkup(year) : `<p class="reading-muted">没有读取到全年数据。</p>`}
          <span class="rd-tooltip" role="tooltip" hidden></span>
        </div>
        ${year && readingDailyMap(year).size ? `<div class="rd-legend"><span>少</span><i class="level-1"></i><i class="level-2"></i><i class="level-3"></i><i class="level-4"></i><span>多</span></div>` : ""}
      </section>

      ${readingQuoteMarkup(reading.quote && !window.matchMedia("(max-width: 720px)").matches ? next() : 0)}

      <section class="rd-section">
        ${readingSectionHead("阅读进度", next(), `最近在读的 ${progressBooks.length} 本`)}
        ${progressBooks.length ? `<div class="rd-scroll"><ul class="reading-progress rd-progress-list">${progressBooks.map((item) => `
          <li>
            ${readingCoverMarkup(item.cover, item.title)}
            <span><strong>${escapeHtml(cleanBookTitle(item.title))}</strong>${item.readingTime ? `<small>已读 ${formatDuration(item.readingTime)}</small>` : ""}</span>
            <i style="--value: ${Math.min(100, Number(item.progress) || 0) / 100}"></i>
            <em>${Number(item.progress) || 0}%</em>
          </li>`).join("")}</ul></div>` : `<p class="reading-muted">微信读书书架是空的。</p>`}
      </section>

      <section class="rd-section rd-span-2">
        ${readingSectionHead("划线和想法", next(), reading.notebooks ? `${reading.notebooks.length} 本书有笔记` : "")}
        ${reading.notebooks?.length ? `
          <div class="rd-scroll"><table class="rd-table">
            <thead><tr><th>书名</th><th>作者</th><th class="num">划线</th><th class="num">想法</th><th></th></tr></thead>
            <tbody>${reading.notebooks.map((item, index) => `
              <tr data-reading-book="${index}" tabindex="0">
                <td><span class="rd-table-title">${readingCoverMarkup(item.book?.cover, item.book?.title)}${escapeHtml(cleanBookTitle(item.book?.title || ""))}</span></td>
                <td>${escapeHtml(item.book?.author || "")}</td>
                <td class="num">${item.highlights}</td>
                <td class="num">${item.thoughts}</td>
                <td class="num"><i data-lucide="arrow-up-right" aria-hidden="true"></i></td>
              </tr>`).join("")}
            </tbody>
          </table></div>` : `<p class="reading-muted">${reading.notebooks ? "还没有笔记。" : ""}</p>`}
      </section>

      ${reading.recommend?.length ? `
      <section class="rd-section rd-span-3">
        ${readingSectionHead("为你推荐", next(), "来自微信读书")}
        <ul class="rd-recommend">${reading.recommend.map((item, index) => {
          const added = isRecommendAdded(item);
          return `
          <li>
            ${readingCoverMarkup(item.cover, item.title)}
            <strong>${escapeHtml(cleanBookTitle(item.title))}</strong>
            <small>${escapeHtml(item.author)}</small>
            ${item.reason ? `<em>${escapeHtml(item.reason)}</em>` : item.rating ? `<em>微信读书 ${(item.rating / 10).toFixed(1)}${item.ratingTitle ? ` · ${escapeHtml(item.ratingTitle)}` : ""}</em>` : ""}
            <button type="button" data-reading-recommend="${index}" ${added ? "disabled" : ""}>${added ? "已加入" : "加入书架"}</button>
          </li>`;
        }).join("")}</ul>
      </section>` : ""}
    </div>
  `;
}

// ---- Phones: the reading record as one coloured poster ----
// Big title, monthly bars, each month's longest read as photo cards, the
// year as a week-by-week heat grid, then the period's numbers in pills.

const isCompactScreen = () => window.matchMedia("(max-width: 720px)").matches;

// "12h 30m" / "45m": short enough for a card caption.
function compactDuration(seconds) {
  const minutes = Math.round((Number(seconds) || 0) / 60);
  const hours = Math.floor(minutes / 60);
  if (!hours) return `${minutes}m`;
  return minutes % 60 ? `${hours}h ${minutes % 60}m` : `${hours}h`;
}

function readingMonthSeconds(year) {
  const yearNumber = readingYearNumber(year);
  const source = Object.keys(year?.dailyReadTimes || {}).length ? year.dailyReadTimes : year?.readTimes || {};
  const months = Array(12).fill(0);
  Object.entries(source).forEach(([key, value]) => {
    const day = wereadDay(key);
    if (day && day.year === yearNumber) months[day.month] += Number(value) || 0;
  });
  return months;
}

function insightsBarsMarkup(year) {
  const months = readingMonthSeconds(year);
  const max = Math.max(1, ...months);
  // Hours, unless the whole year is under three hours a month.
  const inHours = max >= 3 * 3600;
  const now = new Date();
  const thisYear = readingYearNumber(year) === now.getFullYear();
  return `
    <div class="ri-bars" role="img" aria-label="每月阅读时长">
      ${months.map((seconds, month) => {
        const future = thisYear && month > now.getMonth();
        const value = inHours ? Math.round(seconds / 3600) : Math.round(seconds / 60);
        return `
          <div class="ri-bar${future ? " is-future" : ""}${thisYear && month === now.getMonth() ? " is-current" : ""}" style="--i: ${month}" title="${month + 1}月：${formatDuration(seconds)}">
            <b>${future ? "" : value}</b>
            <span><i style="--h: ${seconds ? Math.max(4, Math.round((seconds / max) * 100)) : 0}%"></i></span>
            <small>${month + 1}</small>
          </div>`;
      }).join("")}
    </div>
    <p class="ri-unit">${inHours ? "单位：小时" : "单位：分钟"}</p>`;
}

function insightsMonthTopsMarkup() {
  const tops = (reading.monthTops || []).filter((item) => item.book?.title && item.readTime > 0)
    .sort((a, b) => a.month - b.month);
  if (!tops.length) return `<p class="ri-empty">这一年还没有阅读记录。</p>`;
  return `
    <ol class="ri-cards" data-scroll-end>
      ${tops.map((top) => `
        <li title="${escapeHtml(cleanBookTitle(top.book.title))}">
          ${readingCoverMarkup(top.book.cover, top.book.title)}
          <b>${top.month + 1}月</b>
          <small>${compactDuration(top.readTime)}</small>
        </li>`).join("")}
    </ol>`;
}

// Columns are weeks (Monday first), rows are days; month numbers sit over
// the week each month starts in. Scrolled so today is in view.
function insightsHeatmapMarkup(year) {
  const yearNumber = readingYearNumber(year);
  const byDay = readingDailyMap(year);
  if (!byDay.size) return `<p class="ri-empty">微信读书这次没有返回每天的阅读数据。</p>`;
  const level = (seconds) => (!seconds ? 0 : seconds < 900 ? 1 : seconds < 1800 ? 2 : seconds < 3600 ? 3 : 4);
  const today = new Date();
  const start = new Date(yearNumber, 0, 1);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = yearNumber === today.getFullYear() ? today : new Date(yearNumber, 11, 31);
  const weeks = [];
  for (let monday = new Date(start); monday <= end; monday.setDate(monday.getDate() + 7)) {
    const days = [];
    let label = "";
    for (let i = 0; i < 7; i += 1) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      if (day.getFullYear() !== yearNumber || day > end) {
        days.push('<span class="is-blank"></span>');
        continue;
      }
      if (day.getDate() === 1) label = String(day.getMonth() + 1);
      const seconds = byDay.get(`${day.getMonth()}-${day.getDate()}`) || 0;
      days.push(`<span class="level-${level(seconds)}" data-day="${day.getMonth() + 1}月${day.getDate()}日" data-time="${seconds ? formatDuration(seconds) : "没有阅读"}"></span>`);
    }
    weeks.push(`<div class="ri-week"><em>${label}</em>${days.join("")}</div>`);
  }
  return `<div class="ri-heat" data-scroll-end role="img" aria-label="${yearNumber} 年每天的阅读时长">${weeks.join("")}</div>`;
}

function hoursText(seconds) {
  const hours = (Number(seconds) || 0) / 3600;
  return hours >= 10 ? String(Math.round(hours)) : String(Math.round(hours * 10) / 10);
}

function insightsStatsMarkup(stats) {
  const books = (stats?.readStat || []).find((item) => /读过/.test(item.stat))?.counts;
  const bookCount = books ? Number.parseInt(books, 10) : (stats?.readLongest || []).length;
  const pills = [
    ["总时长（小时）", stats ? hoursText(stats.totalReadTime) : "—"],
    ["阅读天数", stats ? stats.readDays : "—"],
    ["日均分钟", stats ? Math.round((stats.dayAverageReadTime || 0) / 60) : "—"],
    ["读过的书", Number.isFinite(bookCount) ? bookCount : "—"],
  ];
  return `
    <div class="ri-pills">
      ${pills.map(([label, value]) => `
        <div class="ri-pill"><small>${label}</small><b>${escapeHtml(String(value))}</b></div>`).join("")}
    </div>`;
}

// The pills' numbers by label, read before a redraw so the new ones can
// count from where the old ones were.
function insightNumbers() {
  const numbers = new Map();
  readingPanelBody?.querySelectorAll(".ri-pill").forEach((pill) => {
    const value = Number.parseFloat(pill.querySelector("b")?.textContent || "");
    if (Number.isFinite(value)) numbers.set(pill.querySelector("small")?.textContent || "", value);
  });
  return numbers;
}

// Count each pill from its previous value (0 on first show) to the new
// one, easing out, keeping the new value's decimal places.
function animateInsightNumbers(previous) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  readingPanelBody.querySelectorAll(".ri-pill").forEach((pill) => {
    const output = pill.querySelector("b");
    const text = output?.textContent || "";
    const target = Number.parseFloat(text);
    if (!Number.isFinite(target)) return;
    const decimals = (text.split(".")[1] || "").length;
    const from = previous.get(pill.querySelector("small")?.textContent || "") ?? 0;
    if (from === target) return;
    const duration = 700;
    const start = performance.now();
    const step = (now) => {
      if (!output.isConnected) return;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      output.textContent = (from + (target - from) * eased).toFixed(decimals);
      if (t < 1) requestAnimationFrame(step);
      else output.textContent = text;
    };
    output.textContent = from.toFixed(decimals);
    requestAnimationFrame(step);
  });
}

function readingInsightsMarkup() {
  const stats = reading.stats[reading.mode];
  const year = reading.year;
  const yearNumber = readingYearNumber(year);
  const progressBooks = reading.progress || [];
  return `
    <div class="ri">
      <header class="ri-title">
        <p>${yearNumber}</p>
        <h3>Reading<br />Record</h3>
      </header>
      ${reading.error ? `<p class="reading-error">${escapeHtml(reading.error)}</p>` : ""}

      <section class="ri-section">
        <h4>月度阅读时长</h4>
        ${year ? insightsBarsMarkup(year) : `<p class="ri-empty">没有读取到全年数据。</p>`}
      </section>

      <section class="ri-section">
        <h4>每月最长阅读</h4>
        ${insightsMonthTopsMarkup()}
      </section>

      <section class="ri-section">
        <h4>阅读日历热力图</h4>
        <div class="ri-heat-wrap">
          ${year ? insightsHeatmapMarkup(year) : `<p class="ri-empty">没有读取到全年数据。</p>`}
          <span class="ri-tip" role="status" hidden></span>
        </div>
      </section>

      <section class="ri-section">
        ${readingSegmentMarkup()}
        ${insightsStatsMarkup(stats)}
      </section>

      ${progressBooks.length ? `
      <section class="ri-section">
        <h4>正在读</h4>
        <ol class="ri-cards">
          ${progressBooks.map((item) => `
            <li title="${escapeHtml(cleanBookTitle(item.title))}">
              ${readingCoverMarkup(item.cover, item.title)}
              <b>${Number(item.progress) || 0}%</b>
              <small>${escapeHtml(cleanBookTitle(item.title))}</small>
            </li>`).join("")}
        </ol>
      </section>` : ""}

      ${reading.recommend?.length ? `
      <section class="ri-section">
        <h4>为你推荐</h4>
        <ol class="ri-cards ri-recommend">
          ${reading.recommend.map((item, index) => {
            const added = isRecommendAdded(item);
            return `
            <li>
              ${readingCoverMarkup(item.cover, item.title)}
              <b>${escapeHtml(cleanBookTitle(item.title))}</b>
              <button type="button" data-reading-recommend="${index}" ${added ? "disabled" : ""}>${added ? "已加入" : "加入书架"}</button>
            </li>`;
          }).join("")}
        </ol>
      </section>` : ""}

      <button type="button" class="ri-disconnect" id="readingDisconnect">断开微信读书</button>
    </div>`;
}

function readingBookMarkup(data = reading.book, backText = "← 返回阅读记录") {
  if (!data?.loaded) return `<button type="button" class="reading-back" data-reading-back>${backText}</button><p class="reading-muted">正在读取划线…</p>`;
  const chapters = new Map((data.chapters || []).map((chapter) => [String(chapter.chapterUid), chapter]));
  const start = (range) => Number(String(range || "").split("-")[0]) || 0;
  const groups = new Map();
  (data.highlights || []).forEach((mark) => {
    const key = String(mark.chapterUid);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(mark);
  });
  const ordered = [...groups.entries()].sort(([a], [b]) => (chapters.get(a)?.chapterIdx ?? 0) - (chapters.get(b)?.chapterIdx ?? 0));
  const highlights = ordered.map(([uid, marks]) => `
    <section class="reading-chapter">
      <h4>${escapeHtml(chapters.get(uid)?.title || "")}</h4>
      ${marks.sort((a, b) => start(a.range) - start(b.range)).map((mark) => `<blockquote>${escapeHtml(mark.text || "")}</blockquote>`).join("")}
    </section>`).join("");
  const thoughts = (data.thoughts || []).filter((item) => item.content).map((item) => `
    <article class="reading-thought">
      ${item.quote ? `<blockquote>${escapeHtml(item.quote)}</blockquote>` : ""}
      <p>${escapeHtml(item.content)}</p>
      <small>${escapeHtml(item.chapterName || "")}${item.createTime ? ` · ${new Date(item.createTime * 1000).toLocaleDateString("zh-CN")}` : ""}</small>
    </article>`).join("");
  return `
    <button type="button" class="reading-back" data-reading-back>${backText}</button>
    <h3 class="reading-book-title">${escapeHtml(data.title || "")}</h3>
    ${thoughts ? `<section class="reading-section"><h3>我的想法 <small>${data.thoughts.filter((item) => item.content).length} 条</small></h3>${thoughts}</section>` : ""}
    ${highlights ? `<section class="reading-section"><h3>我的划线 <small>${data.highlights.length} 条</small></h3>${highlights}</section>` : ""}
    ${!thoughts && !highlights ? `<p class="reading-muted">这本书还没有划线或想法。</p>` : ""}
  `;
}

// ---- 本周 / 本月 / 本年 / 总计: a "rubber" segmented control ----
// The thumb is a layer over the whole track holding a copy of every label;
// clip-path shows only the selected slot, so labels turn paper-coloured
// exactly where the thumb is. The selected slot can be dragged; pulled past
// either end the thumb stretches like rubber, and it springs to the nearest
// option on release.

const RUBBER_PULL = 0.35; // how much of an overshoot the thumb follows
const RUBBER_MAX = 18; // px it can stretch at most
const readingSegmentState = { switching: false, suppressClick: false, refocus: false };

function readingSegmentMarkup() {
  const items = READING_MODES.map(([mode, label]) => {
    const checked = mode === reading.mode;
    return `<button type="button" class="rubber-segment__item" role="radio" aria-checked="${checked}" tabindex="${checked ? 0 : -1}" data-reading-mode="${mode}">${label}</button>`;
  }).join("");
  const copies = READING_MODES.map(([, label]) => `<span class="rubber-segment__item rubber-segment__copy">${label}</span>`).join("");
  return `
    <div class="reading-tabs rubber-segment" role="radiogroup" aria-label="统计周期" data-equal data-draggable>
      ${items}
      <span class="rubber-segment__thumb" aria-hidden="true">${copies}</span>
    </div>`;
}

function segmentGeometry(segment) {
  const thumb = segment.querySelector(".rubber-segment__thumb");
  const items = [...segment.querySelectorAll("button.rubber-segment__item")];
  const inset = thumb.offsetLeft;
  const slots = items.map((item) => ({ left: item.offsetLeft - inset, width: item.offsetWidth }));
  return { thumb, items, slots, width: thumb.clientWidth };
}

// Show the thumb from `left` to `right` (px inside the thumb layer).
function clipSegmentThumb(thumb, left, right, width) {
  thumb.style.clipPath = `inset(0 ${(width - right).toFixed(1)}px 0 ${left.toFixed(1)}px round var(--rs-thumb-radius))`;
}

function placeSegmentThumb(segment, index) {
  const { thumb, slots, width } = segmentGeometry(segment);
  const slot = slots[index];
  if (slot && width) clipSegmentThumb(thumb, slot.left, slot.left + slot.width, width);
}

function checkedSegmentIndex(segment) {
  return [...segment.querySelectorAll("button.rubber-segment__item")].findIndex((item) => item.getAttribute("aria-checked") === "true");
}

// Slide the thumb, then load and redraw the panel for the new period.
async function selectReadingMode(segment, mode) {
  const items = [...segment.querySelectorAll("button.rubber-segment__item")];
  const index = items.findIndex((item) => item.dataset.readingMode === mode);
  placeSegmentThumb(segment, index);
  if (mode === reading.mode || readingSegmentState.switching) return;
  readingSegmentState.switching = true;
  items.forEach((item, i) => {
    item.setAttribute("aria-checked", String(i === index));
    item.tabIndex = i === index ? 0 : -1;
  });
  reading.mode = mode;
  const slide = new Promise((resolve) => setTimeout(resolve, 380));
  try {
    await Promise.all([slide, loadReadingStats(mode).then(() => loadReadingTheme(mode))]);
  } catch (error) {
    reading.error = readingErrorText(error);
  }
  readingSegmentState.switching = false;
  renderReadingPanel();
}

function setupReadingSegment() {
  const segment = readingPanelBody.querySelector(".rubber-segment");
  if (!segment) return;
  const place = () => placeSegmentThumb(segment, checkedSegmentIndex(segment));
  place();
  new ResizeObserver(place).observe(segment);
  // Turn transitions on only after the first placement, so it doesn't slide in.
  requestAnimationFrame(() => segment.setAttribute("data-ready", ""));
  if (readingSegmentState.refocus) {
    readingSegmentState.refocus = false;
    segment.querySelector('[aria-checked="true"]')?.focus({ preventScroll: true });
  }

  let drag = null;
  const release = (event) => {
    segment.querySelectorAll("[data-pressed]").forEach((item) => item.removeAttribute("data-pressed"));
    if (!drag) return;
    const { moved, center, geometry } = drag;
    drag = null;
    segment.removeAttribute("data-held");
    geometry.thumb.style.transform = "";
    if (!moved || event.type === "pointercancel") {
      place();
      return;
    }
    readingSegmentState.suppressClick = true;
    setTimeout(() => { readingSegmentState.suppressClick = false; }, 0);
    let nearest = 0;
    geometry.slots.forEach((slot, i) => {
      const best = geometry.slots[nearest];
      if (Math.abs(slot.left + slot.width / 2 - center) < Math.abs(best.left + best.width / 2 - center)) nearest = i;
    });
    selectReadingMode(segment, geometry.items[nearest].dataset.readingMode);
  };

  segment.addEventListener("pointerdown", (event) => {
    const item = event.target instanceof Element ? event.target.closest("button.rubber-segment__item") : null;
    if (!item || event.button !== 0 || readingSegmentState.switching) return;
    item.setAttribute("data-pressed", "");
    if (item.getAttribute("aria-checked") !== "true") return;
    const geometry = segmentGeometry(segment);
    const slot = geometry.slots[geometry.items.indexOf(item)];
    drag = { startX: event.clientX, start: slot.left + slot.width / 2, center: slot.left + slot.width / 2, moved: false, geometry, half: slot.width / 2 };
    segment.setPointerCapture(event.pointerId);
  });

  segment.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) < 4) return;
    if (!drag.moved) {
      drag.moved = true;
      segment.setAttribute("data-held", "");
      segment.querySelectorAll("[data-pressed]").forEach((item) => item.removeAttribute("data-pressed"));
    }
    const { slots, thumb, width } = drag.geometry;
    const first = slots[0].left + slots[0].width / 2;
    const last = slots[slots.length - 1].left + slots[slots.length - 1].width / 2;
    const wanted = drag.start + dx;
    const center = Math.min(last, Math.max(first, wanted));
    drag.center = center;
    const left = center - drag.half;
    const right = center + drag.half;
    clipSegmentThumb(thumb, left, right, width);
    // Past either end the thumb keeps its inner edge and stretches out
    // toward the pull, like rubber (scaled from that inner edge).
    const over = wanted - center;
    const stretch = Math.min(RUBBER_MAX, Math.abs(over) * RUBBER_PULL);
    if (stretch > 0.5) {
      const anchor = over < 0 ? right : left;
      thumb.style.transformOrigin = `${anchor.toFixed(1)}px 50%`;
      thumb.style.transform = `scaleX(${(1 + stretch / (drag.half * 2)).toFixed(3)})`;
    } else {
      thumb.style.transform = "";
    }
  });

  segment.addEventListener("pointerup", release);
  segment.addEventListener("pointercancel", release);
  segment.addEventListener("lostpointercapture", release);

  segment.addEventListener("keydown", (event) => {
    const items = [...segment.querySelectorAll("button.rubber-segment__item")];
    const current = checkedSegmentIndex(segment);
    const next = {
      ArrowRight: current + 1, ArrowDown: current + 1,
      ArrowLeft: current - 1, ArrowUp: current - 1,
      Home: 0, End: items.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const index = Math.max(0, Math.min(items.length - 1, next));
    items[index].focus();
    readingSegmentState.refocus = true;
    selectReadingMode(segment, items[index].dataset.readingMode);
  });
}

function renderReadingPanel() {
  if (!readingPanelBody) return;
  if (reading.loading) {
    readingPanelBody.innerHTML = readingLoadingMarkup();
    readingProgress.set(Math.max(0.04, readingLoadingPercent() / 100));
  }
  else if (reading.connected === null) readingPanelBody.innerHTML = reading.error ? `<p class="reading-error">${escapeHtml(reading.error)}</p>` : "";
  else if (!reading.connected) readingPanelBody.innerHTML = readingConnectMarkup();
  else {
    const previousNumbers = insightNumbers();
    readingPanelBody.innerHTML = reading.view === "book" ? readingBookMarkup()
      : isCompactScreen() ? readingInsightsMarkup() : readingOverviewMarkup();
    animateInsightNumbers(previousNumbers);
  }
  const insights = Boolean(readingPanelBody.querySelector(".ri")) || Boolean(reading.loading && isCompactScreen());
  readingPanel.toggleAttribute("data-insights", insights);
  // Card rows and the heat grid start at the latest month / today.
  readingPanelBody.querySelectorAll("[data-scroll-end]").forEach((row) => { row.scrollLeft = row.scrollWidth; });
  window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });
  // Charts and calendar take the masthead's cover colour.
  const themed = reading.connected && !reading.loading && reading.view !== "book";
  readingPanel.toggleAttribute("data-themed", Boolean(themed));
  if (themed) {
    readingPanel.style.setProperty("--rd-c", readingThemeColor());
    readingPanel.style.setProperty("--rd-on", inkForColor(readingThemeColor()));
    // The floating tab bar sits outside the panel and takes the same ink.
    library.style.setProperty("--page-tint", readingThemeColor());
    library.style.setProperty("--page-ink", inkForColor(readingThemeColor()));
  }
  if (insights && !themed) {
    readingPanel.style.setProperty("--rd-c", readingThemeColor());
    readingPanel.style.setProperty("--rd-on", inkForColor(readingThemeColor()));
    library.style.setProperty("--page-ink", inkForColor(readingThemeColor()));
  }
  library.classList.toggle("has-coloured-page", insights);
  setupReadingSegment();
  updateSetupCard();
}

async function openReadingBook(index) {
  const item = reading.notebooks?.[index];
  if (!item?.book?.bookId) return;
  reading.view = "book";
  reading.book = { title: item.book.title, loaded: false };
  renderReadingPanel();
  readingPanel.scrollTop = 0;
  try {
    const data = await callWereadMe("highlights", { bookId: item.book.bookId });
    reading.book = { ...data, title: item.book.title, loaded: true };
  } catch (error) {
    console.warn(error);
    reading.book = { title: item.book.title, loaded: true, highlights: [], thoughts: [] };
    reading.error = readingErrorText(error);
  }
  if (reading.view === "book") renderReadingPanel();
}

function openMyRoomBook(roomIndex, { focus = false, scroll = true } = {}) {
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
  updateMyRoomCaption(roomIndex);
  if (focus) active.focus({ preventScroll: true });
  if (scroll) active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
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
  detailSaveLabel.textContent = state ? "已在我的书架" : t("addToShelf");
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
  closeShelfHelp({ immediate: true });
  closeBookIndex({ restoreFocus: false, immediate: true });
  closeMyShelf({ restoreFocus: false, immediate: true, targetSpace: "user" });
  activeSpace = "user";
  updateSpaceSwitch();
  window.clearTimeout(addBookCloseTimer);
  pinnedIndex = null;
  if (activeIndex !== null) closeBook(activeIndex, true);
  updateWereadImportMode();
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

function closeAddBookPanel({ restoreFocus = true, immediate = false, targetSpace = "brooke" } = {}) {
  if (addBookPanel.hidden) return;
  activeSpace = targetSpace;
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
  setAuthMode(hasAccountOnThisBrowser() ? "signin" : "signup");
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
  closeAddBookPanel({ restoreFocus: false, immediate: true, targetSpace: "user" });
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
    if (myShelfView === "room" && !myShelfRoomView.hidden) centerMyRoom();
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
      library.classList.remove("is-my-room-view");
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
  const safeTitle = escapeHtml(cleanBookTitle(book.title));
  const safeAuthor = escapeHtml(book.author);
  if (book.originalCover && book.image) {
    return `<img class="cover-art cover-art--original" src="${escapeHtml(siteImage(book.image))}" alt="" draggable="false" />`;
  }
  const coverArt = book.image
    ? `<img class="cover-art" src="${escapeHtml(siteImage(book.image))}" alt="" draggable="false" />`
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
  element.className = isReferenceBook(book) ? "book-slot" : "book-slot is-personal";
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

  const safeTitle = escapeHtml(cleanBookTitle(book.title));
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
  hitArea.addEventListener("mouseenter", (event) => {
    if (isDragging) return;
    if (pinnedIndex !== null && pinnedIndex !== index) {
      // A click is about to open the detail page: keep that book.
      if (detailOpenTimer || detailIndex !== null) return;
      // Pinned by arrow keys: ignore hover caused by scrolling under a
      // still mouse, but let a real mouse move take over again.
      if (pinPointerX !== null && Math.abs(event.clientX - pinPointerX) < 6) return;
      pinnedIndex = null;
      pinPointerX = null;
    }
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
  // Phones: shorter books with air above them, instead of spines that reach
  // up to the title.
  const narrow = window.matchMedia("(max-width: 720px)").matches;
  const maximumHeight = narrow
    ? Math.max(190, Math.min(320, availableHeight * 0.86))
    : Math.max(260, Math.min(430, availableHeight - 8));
  let cursor = 0;
  const lastReferenceIndex = books.map(isReferenceBook).lastIndexOf(true);
  books.forEach((book, index) => {
    if (!isReferenceBook(book)) return;
    const element = bookElements[index];
    element.style.setProperty("--book-height", `${Math.round(maximumHeight * book.height)}px`);
    element.style.setProperty("--x", `${cursor}px`);
    const gap = shelfGaps[index] ?? book.shelfGap ?? 24;
    // Stretch each hover zone across the gap to the next spine, so moving the
    // mouse along the shelf never falls into a dead zone between books.
    const isLast = index === lastReferenceIndex;
    const hitGap = isLast ? 0 : gap;
    element.style.setProperty("--hit-gap", `${hitGap}px`);
    element.style.setProperty("--hit-width", `${book.spineWidth + hitGap}px`);
    cursor += book.spineWidth + gap;
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
  setShelfCaption(activeTitle, books[index], referencePosition(index));
  activeNumber.textContent = String(referencePosition(index)).padStart(2, "0");
  setAmbientColor(library, books[index]);
  keepCoverInView(index);
}

function resetBookShifts() {
  bookElements.forEach((element) => {
    element.style.setProperty("--shift", "0px");
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
  if (compact) {
    // Phones: the intro sits above, so the cover starts lower and a little
    // larger; the page's CSS lines the counter and title up with it.
    const phoneWidth = Math.min(236, window.innerWidth * 0.6);
    const phoneHeight = Math.min(phoneWidth / coverRatio, window.innerHeight * (shortCompact ? 0.36 : 0.43));
    const phoneTop = Math.round(Math.max(shortCompact ? 60 : 72, window.innerHeight * 0.1));
    const rect = { left: (window.innerWidth - phoneHeight * coverRatio) / 2, top: phoneTop, width: phoneHeight * coverRatio, height: phoneHeight };
    detail?.style.setProperty("--detail-cover-bottom", `${Math.round(rect.top + rect.height)}px`);
    return rect;
  }
  const left = window.innerWidth * 0.25 - width / 2;
  const top = window.innerHeight * 0.53 - height / 2;
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
  // The onboarding card and space switch sit outside #bookDetail, so expose
  // the detail palette on .library too.
  library.style.setProperty("--detail-bg", book.detailColor ?? book.color);
  library.style.setProperty("--detail-ink", readableDetailInk(book));
  detail.style.setProperty("--cover", book.color);
  detail.style.setProperty("--cover-ink", book.ink);
  detail.style.setProperty("--spine", book.spine);
  detail.style.setProperty("--spine-ink", book.spineInk);
  detail.style.setProperty("--art-opacity", String(book.opacity ?? 1));
  detail.style.setProperty("--art-filter", book.filter ?? "none");
  detailFront.innerHTML = coverMarkup(book, index);
  detailNumber.textContent = isReferenceBook(book)
    ? `${String(referencePosition(index)).padStart(2, "0")} / ${formatReferenceCount()}`
    : "";
  detailTitle.textContent = cleanBookTitle(book.title);
  detailAuthor.textContent = book.author;
  renderDetailExtras(book);
  loadBookExtras(book);
  renderDetailDescription(book);
  updateDetailShelfControls();
  loadRealIntro(book);
}

// Under the cover on phones: the sentence readers highlighted most (from
// WeRead via search-books { bookId }).
function renderDetailExtras(book) {
  if (!detailHighlight) return;
  detailHighlight.textContent = book.highlight || "";
  detailHighlight.hidden = !book.highlight;
}

const extrasRequests = new Set();

async function loadBookExtras(book) {
  if (book.extrasLoaded || extrasRequests.has(book.id)) return;
  if (!(await getSupabaseAccessToken())) return;
  extrasRequests.add(book.id);
  try {
    let bookId = wereadBookIdFor(book);
    if (!bookId) {
      bookId = await findWereadBookId(book);
      if (!bookId) return;
      book.wereadBookId = bookId;
    }
    const info = (await callBookFunction({ bookId }))?.info;
    if (!info) return;
    book.highlight = String(info.highlight || "");
    book.extrasLoaded = true;
    if (book.isCustom) writeCustomBooks();
    if (detailIndex === books.indexOf(book)) renderDetailExtras(book);
  } catch (error) {
    console.warn("WeRead book extras failed", error);
  } finally {
    extrasRequests.delete(book.id);
  }
}

function renderDetailDescription(book) {
  // Hide placeholder lines ("来自微信读书搜索。" …) once a real intro is there.
  const real = book.description.filter((paragraph) => !PLACEHOLDER_INTRO.test(paragraph));
  const paragraphs = book.isCustom && real.length ? real : book.description;
  detailDescription.innerHTML = paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

// Keep the detail page tidy: first paragraph of the intro, cut near 180
// characters at a sentence end where possible.
// Intro for the detail page: the opening sentences, joined across WeRead's
// one-sentence-per-line paragraphs, up to about 200 characters and ending
// at a sentence break, so it reads as a short summary rather than a lone line.
const INTRO_TARGET = 200;
// Bump when the intro rules change so saved intros are rebuilt.
const INTRO_VERSION = 2;

function shortenIntro(text) {
  const joined = String(text || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("");
  const characters = [...joined];
  if (characters.length <= INTRO_TARGET) return joined;
  const head = characters.slice(0, INTRO_TARGET).join("");
  const stop = Math.max(head.lastIndexOf("。"), head.lastIndexOf("！"), head.lastIndexOf("？"), head.lastIndexOf("……"));
  if (stop > 60) return head.slice(0, head.startsWith("……", stop) ? stop + 2 : stop + 1);
  return `${head}…`;
}

// ---- Spine / detail colours taken from the cover ----
// Books a user adds start with a rotating palette colour. Once a cover is
// known, its main colour (worked out by the search-books function, since
// cover hosts don't allow reading pixels in the browser) becomes the spine,
// cover and detail background colour, with matching readable ink.

function inkForColor(hex) {
  return colorContrast(hex, "#171514") >= colorContrast(hex, "#fbf7ee") ? "#171514" : "#fbf7ee";
}

function applyCoverPalette(book, color) {
  book.color = color;
  book.spine = color;
  book.detailColor = color;
  book.ink = inkForColor(color);
  book.spineInk = book.ink;
  book.coverPalette = `${COVER_PALETTE_VERSION}|${book.image}`;
  if (book.isCustom && bookExists(book.id)) writeCustomBooks();
  const index = books.indexOf(book);
  const element = index >= 0 ? bookElements[index] : null;
  if (element) {
    element.style.setProperty("--cover", book.color);
    element.style.setProperty("--cover-ink", book.ink);
    element.style.setProperty("--spine", book.spine);
    element.style.setProperty("--spine-ink", book.spineInk);
  }
  renderMyShelf();
  if (index >= 0 && detailIndex === index) populateBookDetail(index);
  if (getBookState(book)) syncBookStateToSupabase(book);
}

// Same rules as the search-books function: mostly-white covers become a
// warm off-white instead of picking up their dark lettering.
const LIGHT_COVER_COLOR = "#f3ecdf";
// Bump when the colour rules change so already-coloured books are redone.
const COVER_PALETTE_VERSION = "v2";

function dominantColorFromPixels(data) {
  const buckets = new Map();
  let total = 0;
  let light = 0;
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 128) continue;
    total += 1;
    if (Math.min(r, g, b) > 232) {
      light += 1;
      continue;
    }
    const max = Math.max(r, g, b);
    const saturation = max === 0 ? 0 : (max - Math.min(r, g, b)) / max;
    const key = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
    const bucket = buckets.get(key) || { r: 0, g: 0, b: 0, n: 0, w: 0 };
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    bucket.n += 1;
    bucket.w += 1 + saturation;
    buckets.set(key, bucket);
  }
  if (total && light / total >= 0.45) return LIGHT_COVER_COLOR;
  let best = null;
  buckets.forEach((bucket) => {
    if (!best || bucket.w > best.w) best = bucket;
  });
  if (!best) return null;
  return `#${[best.r, best.g, best.b].map((v) => Math.round(v / best.n).toString(16).padStart(2, "0")).join("")}`;
}

// Uploaded covers kept in the browser are data URLs, which can be read
// directly; everything else goes through the function.
async function readLocalCoverColor(dataUrl) {
  const image = new Image();
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.src = dataUrl;
  });
  const canvas = document.createElement("canvas");
  canvas.width = 48;
  canvas.height = Math.max(1, Math.round((48 * image.naturalHeight) / image.naturalWidth));
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return dominantColorFromPixels(context.getImageData(0, 0, canvas.width, canvas.height).data);
}

async function fetchCoverColor(url) {
  if (url.startsWith("data:")) return readLocalCoverColor(url);
  const accessToken = await getSupabaseAccessToken();
  if (!accessToken) return null;
  const response = await fetch(`${readSupabaseFunctionsUrl()}/search-books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      apikey: readSupabaseAnonKey(),
    },
    body: JSON.stringify({ coverColor: url }),
  });
  if (!response.ok) return null;
  const { color } = await response.json().catch(() => ({}));
  return /^#[0-9a-f]{6}$/i.test(color || "") ? color : null;
}

let paletteQueue = Promise.resolve();

function loadCoverPalette(book) {
  const done = `${COVER_PALETTE_VERSION}|${book?.image}`;
  if (!book?.isCustom || !book.image || book.coverPalette === done) return;
  const image = book.image;
  paletteQueue = paletteQueue.then(async () => {
    if (book.image !== image || book.coverPalette === done) return;
    try {
      const color = await fetchCoverColor(image);
      if (color && book.image === image) applyCoverPalette(book, color);
    } catch (error) {
      console.warn("Cover colour failed", error);
    }
  });
}

function loadMissingCoverPalettes() {
  books.filter((book) => book.isCustom && getBookState(book)).forEach(loadCoverPalette);
}

// Books imported from the WeRead shelf only come with a title, author and
// category, so their description starts as a placeholder. When a signed-in
// user opens one, fetch the real intro once via WeRead /book/info (through
// the search-books Edge Function) and keep it with the book.
const introRequests = new Set();

// WeRead bookId for a book: imported shelf books keep it as sourceId,
// searched books as wereadBookId, and older ones only inside their id
// ("weread-<bookId>" for early imports, "custom-weread-<bookId>" for search).
function wereadBookIdFor(book) {
  if (book.wereadBookId) return book.wereadBookId;
  if (book.source === "weread" && book.sourceId) return book.sourceId;
  const match = String(book.id).match(/^(?:custom-)?weread-([\w-]+)$/);
  return match ? match[1] : "";
}

// Placeholder lines written when a book was added without a real intro.
// "窄门（足本无删减，名家经典译本）" -> "窄门": drop edition notes in
// brackets for spines, captions and the detail heading. Search results keep
// the full title so editions can be told apart.
function cleanBookTitle(title) {
  const full = String(title || "").trim();
  // Everything from the first bracket on is edition talk ("（名家译、深度注释）
  // 最深的伤害…"), as long as a real title comes before it.
  const cut = full.search(/[（(【\[]/);
  const short = cut >= 2 ? full.slice(0, cut).trim() : full;
  return short || full;
}

const PLACEHOLDER_INTRO = /^(微信读书分类：|来自微信读书|这本书保留了微信读书|这本书由微信读书|来自 Google Books 搜索|这本书由你搜索加入|这是你自己加入书架的书|出版时间：)/;

function needsRealIntro(book) {
  if (!book?.isCustom) return false;
  // Intros saved under older rules (just the first line) are rebuilt; the
  // function answers these from its cache, so WeRead isn't asked again.
  if (book.introLoaded) return (book.introVersion || 1) < INTRO_VERSION && Boolean(wereadBookIdFor(book));
  return book.description.every((paragraph) => PLACEHOLDER_INTRO.test(paragraph));
}

async function callBookFunction(body) {
  const accessToken = await getSupabaseAccessToken();
  if (!accessToken) return null;
  const response = await fetch(`${readSupabaseFunctionsUrl()}/search-books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      apikey: readSupabaseAnonKey(),
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) return null;
  return response.json().catch(() => null);
}

// Books without a WeRead bookId (e.g. added from Google) are matched by
// searching WeRead for their title and taking the first same-titled book.
async function findWereadBookId(book) {
  const data = await callBookFunction({ query: book.title, limit: 5 });
  const normalize = (value) => String(value || "").replace(/[\s（）()【】《》:：·・-]/g, "").toLowerCase();
  const title = normalize(book.title);
  const match = (data?.results || []).find((result) => result.source === "weread"
    && (normalize(result.title) === title || normalize(result.title).startsWith(title) || title.startsWith(normalize(result.title))));
  return match ? String(match.id).replace(/^weread-/, "") : "";
}

async function loadRealIntro(book) {
  if (!needsRealIntro(book) || introRequests.has(book.id)) return;
  if (!(await getSupabaseAccessToken())) return;
  introRequests.add(book.id);
  try {
    let bookId = wereadBookIdFor(book);
    if (!bookId) {
      bookId = await findWereadBookId(book);
      if (!bookId) return;
      book.wereadBookId = bookId;
    }
    const data = await callBookFunction({ bookId });
    const intro = shortenIntro(data?.info?.intro);
    if (!intro) return;
    book.introLoaded = true;
    book.introVersion = INTRO_VERSION;
    book.description = [intro];
    if (book.isCustom) writeCustomBooks();
    if (getBookState(book)) syncBookStateToSupabase(book);
    if (detailIndex === books.indexOf(book)) renderDetailDescription(book);
    renderMyShelf();
  } catch (error) {
    console.warn("WeRead book info failed", error);
  } finally {
    introRequests.delete(book.id);
  }
}

// Fill in intros for every saved book that still shows placeholder text,
// one at a time so WeRead isn't hit all at once.
let introQueue = Promise.resolve();

function loadMissingIntros() {
  books.filter((book) => getBookState(book) && needsRealIntro(book)).forEach((book) => {
    introQueue = introQueue.then(() => loadRealIntro(book));
  });
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
  detailOriginStale = false;
  detailSwipeBusy = false;
  detail.classList.remove("is-swipe-animating", "is-swipe-swap", "is-swipe-copy-in");
  setDetailSwipe(0, 0);
  resetDetailPeek();
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
  if (detailOriginStale) {
    // Swiped to another book: fly back to where that one sits now.
    const source = detailSourceMode === "my-room"
      ? detailSourceElement?.querySelector(".my-room-book-cover") || detailSourceElement
      : bookElements[returnIndex]?.querySelector(".book-object");
    const rect = source?.getBoundingClientRect();
    if (rect?.width) detailOriginRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    detailOriginStale = false;
  }
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

// Next / previous book while the detail page is open: swipe on phones,
// arrow keys elsewhere. Shelf books step through the shelf (reference
// books only when a reference book is open); 我的书架 books step through
// that room. Both wrap around.
function detailNeighbor(step) {
  if (detailIndex === null) return null;
  if (detailSourceMode === "my-room") {
    const roomBooks = [...myShelfRoom.querySelectorAll(".my-room-book")];
    const current = roomBooks.indexOf(detailSourceElement);
    if (current < 0 || roomBooks.length < 2) return null;
    const roomIndex = (current + step + roomBooks.length) % roomBooks.length;
    const index = Number(roomBooks[roomIndex].dataset.myShelfIndex);
    return Number.isInteger(index) && books[index] ? { index, roomIndex, element: roomBooks[roomIndex] } : null;
  }
  const referenceOnly = isReferenceBook(books[detailIndex]);
  const order = books.map((book, index) => index).filter((index) => !referenceOnly || isReferenceBook(books[index]));
  const current = order.indexOf(detailIndex);
  if (current < 0 || order.length < 2) return null;
  const index = order[(current + step + order.length) % order.length];
  return { index, element: bookElements[index] };
}

function showDetailNeighbor(neighbor) {
  const previous = detailIndex;
  detailSourceElement?.classList.remove("is-detail-source");
  if (detailSourceMode === "my-room") {
    openMyRoomBook(neighbor.roomIndex);
    detailSourceElement = neighbor.element;
  } else {
    closeBook(previous, true);
    pinnedIndex = neighbor.index;
    openBook(neighbor.index, true);
    const viewBounds = viewport.getBoundingClientRect();
    const bounds = neighbor.element.getBoundingClientRect();
    viewport.scrollBy({ left: bounds.left - viewBounds.left - viewBounds.width / 2 + bounds.width / 2 });
    detailSourceElement = neighbor.element;
  }
  detailSourceElement.classList.add("is-detail-source");
  detailOriginStale = true;
  detailIndex = neighbor.index;
  populateBookDetail(neighbor.index);
  notifyParentTheme(books[neighbor.index]);
  detailCopy.scrollTop = 0;
  positionDetailBook(neighbor.index);
}

let detailSwipeBusy = false;
let detailPeekStep = 0;
let detailPeekNeighbor = null;
const detailPeek = document.querySelector("#detailPeek");
const detailPeekFront = document.querySelector("#detailPeekFront");
const detailBgNext = document.querySelector("#detailBgNext");

function detailSwipeSpacing() {
  return Math.min(window.innerWidth * 0.78, 420);
}

function setDetailSwipe(offset, progress) {
  detail.style.setProperty("--swipe-x", `${offset}px`);
  detail.style.setProperty("--swipe-progress", String(progress));
}

// The neighbouring cover waits just off-centre and moves with the finger,
// like a carousel; the next book's colour fades in behind it.
function prepareDetailPeek(step) {
  if (detailPeekStep === step && detailPeekNeighbor) return detailPeekNeighbor;
  const neighbor = detailNeighbor(step);
  detailPeekStep = step;
  detailPeekNeighbor = neighbor;
  if (!neighbor || !detailPeek) return neighbor;
  const book = books[neighbor.index];
  const rect = getDetailBookRect(neighbor.index);
  getDetailBookRect(detailIndex);
  detailPeekFront.innerHTML = coverMarkup(book, neighbor.index);
  detailPeek.style.width = `${rect.width}px`;
  detailPeek.style.height = `${rect.height}px`;
  detailPeek.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
  detailPeek.style.setProperty("--peek-offset", `${step * detailSwipeSpacing()}px`);
  detailPeek.style.setProperty("--cover", book.color);
  detailPeek.style.setProperty("--cover-ink", book.ink);
  detailPeek.style.setProperty("--art-opacity", String(book.opacity ?? 1));
  detailPeek.style.setProperty("--art-filter", book.filter ?? "none");
  detailBgNext.style.background = book.detailColor ?? book.color;
  detailPeek.hidden = false;
  return neighbor;
}

function resetDetailPeek() {
  detailPeekStep = 0;
  detailPeekNeighbor = null;
  if (detailPeek) detailPeek.hidden = true;
}

// Glide both covers one step, then hand the centre over to the neighbour.
function commitDetailStep(step) {
  const neighbor = prepareDetailPeek(step);
  if (!neighbor) return false;
  detailSwipeBusy = true;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  detail.classList.add("is-swipe-animating");
  setDetailSwipe(-step * detailSwipeSpacing(), 1);
  window.setTimeout(() => {
    detail.classList.remove("is-swipe-animating");
    detail.classList.add("is-swipe-swap");
    showDetailNeighbor(neighbor);
    resetDetailPeek();
    setDetailSwipe(0, 0);
    detail.style.setProperty("--copy-from", `${step * 28}px`);
    detail.getBoundingClientRect();
    detail.classList.remove("is-swipe-swap");
    detail.classList.add("is-swipe-copy-in");
    window.setTimeout(() => {
      detail.classList.remove("is-swipe-copy-in");
      detailSwipeBusy = false;
    }, reduced ? 20 : 420);
  }, reduced ? 20 : 340);
  return true;
}

function stepDetail(step) {
  if (detailSwipeBusy || !detail.classList.contains("is-settled")) return false;
  return commitDetailStep(step);
}

let detailTouch = null;

detail.addEventListener("touchstart", (event) => {
  if (detailSwipeBusy || event.touches.length !== 1 || !detail.classList.contains("is-settled")) return;
  const touch = event.touches[0];
  detailTouch = { x: touch.clientX, y: touch.clientY, lastX: touch.clientX, lastTime: Date.now(), velocity: 0, dx: 0, horizontal: null };
}, { passive: true });

detail.addEventListener("touchmove", (event) => {
  if (!detailTouch || event.touches.length !== 1) return;
  const touch = event.touches[0];
  const dx = touch.clientX - detailTouch.x;
  const dy = touch.clientY - detailTouch.y;
  if (detailTouch.horizontal === null && Math.hypot(dx, dy) > 8) detailTouch.horizontal = Math.abs(dx) > Math.abs(dy) * 1.2;
  if (!detailTouch.horizontal) return;
  event.preventDefault();
  const now = Date.now();
  detailTouch.velocity = (touch.clientX - detailTouch.lastX) / Math.max(1, now - detailTouch.lastTime);
  detailTouch.lastX = touch.clientX;
  detailTouch.lastTime = now;
  detailTouch.dx = dx;
  const step = dx < 0 ? 1 : -1;
  const spacing = detailSwipeSpacing();
  // No neighbour (a one-book room): resist instead of moving freely.
  const hasNeighbor = dx !== 0 && prepareDetailPeek(step);
  const offset = hasNeighbor ? dx : dx * 0.25;
  setDetailSwipe(offset, hasNeighbor ? Math.min(1, Math.abs(dx) / spacing) : 0);
}, { passive: false });

function endDetailTouch() {
  if (!detailTouch) return;
  const { dx, horizontal, velocity } = detailTouch;
  detailTouch = null;
  if (!horizontal) return;
  const step = dx < 0 ? 1 : -1;
  const flick = Math.abs(velocity) > 0.35 && Math.sign(velocity) === Math.sign(dx);
  if ((Math.abs(dx) > detailSwipeSpacing() * 0.28 || flick) && commitDetailStep(step)) return;
  detail.classList.add("is-swipe-animating");
  setDetailSwipe(0, 0);
  window.setTimeout(() => {
    detail.classList.remove("is-swipe-animating");
    resetDetailPeek();
  }, 340);
}

detail.addEventListener("touchend", endDetailTouch);
detail.addEventListener("touchcancel", endDetailTouch);

function navigateTo(index, step = 1) {
  let normalized = ((index % books.length) + books.length) % books.length;
  for (let tries = 0; tries < books.length && !isReferenceBook(books[normalized]); tries += 1) {
    normalized = (normalized + step + books.length) % books.length;
  }
  pinnedIndex = normalized;
  pinPointerX = lastPointerX;
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
totalBooks.textContent = formatReferenceCount();
setShelfCaption(activeTitle, books[0], 1);
applyLanguage();
measureShelf();

viewport.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaY) < 0.1 && Math.abs(event.deltaX) < 0.1) return;
  event.preventDefault();
  viewport.scrollLeft += event.deltaY + event.deltaX;
}, { passive: false });

viewport.addEventListener("scroll", () => {
  if (viewport.scrollTop !== 0) viewport.scrollTop = 0;
});

// Let a normal mouse wheel move the personal room sideways, like the shelf.
myShelfRoom.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaY) < 0.1 && Math.abs(event.deltaX) < 0.1) return;
  event.preventDefault();
  myShelfRoom.scrollLeft += event.deltaY + event.deltaX;
}, { passive: false });

// Drag the personal room sideways, the same way as the reference shelf.
let roomDrag = null;
let roomHasDragged = false;

myShelfRoom.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  roomDrag = { startX: event.clientX, startScroll: myShelfRoom.scrollLeft };
  roomHasDragged = false;
});

myShelfRoom.addEventListener("pointermove", (event) => {
  if (!roomDrag) return;
  const distance = event.clientX - roomDrag.startX;
  if (Math.abs(distance) > 5 && !roomHasDragged) {
    roomHasDragged = true;
    myShelfRoom.classList.add("is-dragging");
    myShelfRoom.setPointerCapture(event.pointerId);
  }
  if (!roomHasDragged) return;
  myShelfRoom.scrollLeft = roomDrag.startScroll - distance;
});

function endRoomDrag(event) {
  if (!roomDrag) return;
  roomDrag = null;
  myShelfRoom.classList.remove("is-dragging");
  if (myShelfRoom.hasPointerCapture(event.pointerId)) myShelfRoom.releasePointerCapture(event.pointerId);
  window.setTimeout(() => {
    roomHasDragged = false;
  }, 0);
}

myShelfRoom.addEventListener("pointerup", endRoomDrag);
myShelfRoom.addEventListener("mouseleave", () => {
  if (roomDrag || myShelfRoom.contains(document.activeElement)) return;
  resetMyRoomBooks();
});
myShelfRoom.addEventListener("pointercancel", endRoomDrag);

viewport.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  dragStartX = event.clientX;
  dragStartScroll = viewport.scrollLeft;
  isDragging = true;
  hasDragged = false;
});

document.addEventListener("pointermove", (event) => {
  if (event.pointerType === "mouse") lastPointerX = event.clientX;
}, { passive: true });

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

previousBook.addEventListener("click", () => navigateTo((activeIndex ?? 0) - 1, -1));
nextBook.addEventListener("click", () => navigateTo((activeIndex ?? -1) + 1));
accountButton?.addEventListener("click", () => {
  if (supabaseSession?.user) signOutEverywhere();
  else openAuthGate(null);
});
spaceSwitch.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-space-target]") : null;
  if (!button) return;
  closeReadingPanel({ immediate: true, returnToShelf: false });
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
// Adding books is part of your own space, so closing returns to your room.
addBookClose.addEventListener("click", () => {
  // openMyShelf closes this panel itself, so the room appears straight away
  // instead of the reference shelf flashing in between.
  if (isSignedIn() || hasSavedBooks()) openMyShelf({ view: "room", restoreFocus: false });
  else closeAddBookPanel({ restoreFocus: false });
});
addBookSearch.addEventListener("submit", (event) => {
  event.preventDefault();
  searchBooks(addBookQuery.value);
});
wereadImportForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // Connected accounts read the shelf with the saved key.
  if (reading.connected && !wereadApiKey.value.trim()) loadWereadPickFromSavedKey();
  else syncWereadShelf(wereadApiKey.value);
});
wereadPickList.addEventListener("change", (event) => {
  const box = event.target instanceof HTMLInputElement ? event.target : null;
  if (!box?.dataset.wereadPick) return;
  const index = Number(box.dataset.wereadPick);
  if (box.checked) wereadPicked.add(index);
  else wereadPicked.delete(index);
  updateWereadPickSummary();
});
wereadPickAll.addEventListener("click", () => {
  const available = wereadPickItems
    .map(({ book }, index) => ({ book, index }))
    .filter(({ book }) => !isOnShelf(book));
  const selectAll = !(available.length && wereadPicked.size === available.length);
  wereadPicked.clear();
  if (selectAll) available.forEach(({ index }) => wereadPicked.add(index));
  wereadPickList.querySelectorAll("input[data-weread-pick]:not(:disabled)").forEach((box) => {
    box.checked = wereadPicked.has(Number(box.dataset.wereadPick));
  });
  updateWereadPickSummary();
});
wereadPickImport.addEventListener("click", importPickedWereadBooks);
addBookResults.addEventListener("click", (event) => {
  const coverButton = event.target instanceof Element ? event.target.closest("[data-cover-result]") : null;
  if (coverButton) {
    const result = lastSearchResults[Number(coverButton.dataset.coverResult)];
    if (result) openCoverPicker(result, () => renderAddBookResults());
    return;
  }
  const button = event.target instanceof Element ? event.target.closest("[data-add-book-result]") : null;
  if (!button) return;
  const index = Number(button.dataset.addBookResult);
  const book = lastSearchResults[index];
  if (Number.isInteger(index) && book) addCustomBook(book);
});
authGateClose.addEventListener("click", () => closeAuthGate({ restoreFocus: true }));
// Typing an @ switches 登录 to the plain password field (older accounts).
authEmail.addEventListener("input", updateAuthPasswordFields);
authGate.querySelectorAll("[data-auth-mode]").forEach((button) => {
  button.addEventListener("click", () => setAuthMode(button.dataset.authMode));
});
authGateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = authEmail.value.trim();
  const usesPin = authUsesPin();
  const password = usesPin ? authPinSlots?.value || "" : authPassword.value;
  if (!id) {
    authGateStatus.textContent = authMode === "signup" ? "先起一个用户名。" : "先填用户名（或以前注册用的邮箱）。";
    authEmail.focus();
    return;
  }
  if (!password) {
    (usesPin ? authPinSlots : authPassword)?.focus();
    return;
  }
  let email = id;
  if (authMode === "signup") {
    const name = normalizeUsername(id);
    if (!isValidUsername(name)) {
      authGateStatus.textContent = "用户名要 2–12 个字，只能用中英文、数字、下划线或短横线。";
      authEmail.focus();
      return;
    }
    const weak = weakPinReason(password);
    if (weak) {
      authGateStatus.textContent = weak;
      authPinSlots.setStatus("error");
      authPinSlots.clear();
      authPinConfirmSlots.clear();
      authPinSlots.focus();
      return;
    }
    if (authPinConfirmSlots.value.length < 6) {
      authPinConfirmSlots.focus();
      return;
    }
    if (password !== authPinConfirmSlots.value) {
      authGateStatus.textContent = "两次输入的密码不一样，请再输一次。";
      authPinConfirmSlots.setStatus("error");
      authPinConfirmSlots.clear();
      authPinConfirmSlots.focus();
      return;
    }
    email = usernameEmail(name);
  } else if (!id.includes("@")) {
    email = usernameEmail(id);
  }
  authSubmit.disabled = true;
  authGateStatus.textContent = authMode === "signup" ? "正在注册…" : "正在登录…";
  try {
    const result = authMode === "signup"
      ? await signUpWithPassword(email, password)
      : await signInWithPassword(email, password);
    if (result.mode === "wrong-credentials") {
      if (usesPin) {
        authPinSlots.setStatus("error");
        authPinSlots.clear();
        authPinSlots.focus();
      }
      authGateStatus.textContent = id.includes("@")
        ? "邮箱或密码不对。忘记密码可以点下面的「忘记密码？」。"
        : "用户名或密码不对。还没有账号就先注册；忘记密码可以点下面的「忘记密码？」。";
      return;
    }
    if (result.mode === "already-registered") {
      authGateStatus.textContent = "这个用户名已经有人用了，换一个吧。";
      authEmail.focus();
      authEmail.select();
      return;
    }
    if (result.mode === "check-email") {
      authGateStatus.textContent = "注册成功，请打开邮箱里的确认链接后再登录。";
      return;
    }
    // The name shown on 我的 keeps the way it was typed ("Brooke"); the
    // login itself ignores case.
    if (authMode === "signup") {
      writeDisplayName(id.normalize("NFKC"));
      syncSettingsToSupabase();
    }
    if (usesPin) {
      // Slots fill in, then the sheet closes.
      authPinSlots.setStatus("success");
      if (authMode === "signup") authPinConfirmSlots.setStatus("success");
      await new Promise((resolve) => setTimeout(resolve, 420));
    }
    authPassword.value = "";
    authPinSlots?.clear();
    authPinConfirmSlots?.clear();
    authPinSlots?.setStatus("idle");
    authPinConfirmSlots?.setStatus("idle");
    authGateStatus.textContent = "";
    closeAuthGate({ restoreFocus: false, runPending: true });
  } catch (error) {
    console.error(error);
    authGateStatus.textContent = authErrorMessage(error);
  } finally {
    authSubmit.disabled = false;
  }
});
authGateMagicLink.addEventListener("click", async () => {
  const email = authEmail.value.trim();
  // Username accounts have no inbox to send a link to.
  if (!email.includes("@")) {
    authGateStatus.textContent = "用用户名注册的账号没有邮箱，忘记密码请联系管理员帮你重置。以前用邮箱注册的，在上面填邮箱再点这里。";
    return;
  }
  authGateMagicLink.disabled = true;
  try {
    await signInWithEmail(email);
    authGateStatus.textContent = "登录链接已发送到你的邮箱，打开邮件里的链接就会登录。";
  } catch (error) {
    console.error(error);
    authGateStatus.textContent = authErrorMessage(error);
  } finally {
    authGateMagicLink.disabled = false;
  }
});
authGateGuest.addEventListener("click", () => {
  writeAuthSession({ email: "", mode: "guest-prototype" });
  closeAuthGate({ restoreFocus: false, runPending: true });
});
myShelfToggle.addEventListener("click", () => requireAuth(() => openMyShelf({ view: "room" })));
// The list (我的书架) closes back into your room; leaving the room itself
// happens through the top switch or the menu.
myShelfClose.addEventListener("click", () => {
  if (myShelfView === "list") openMyShelf({ view: "room", restoreFocus: false });
  else closeMyShelf();
});
bookIndexList.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-book-index]") : null;
  if (!button) return;
  const index = Number(button.dataset.bookIndex);
  if (Number.isInteger(index) && books[index]) openBookFromIndex(index);
});
myShelfList.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const coverButton = target?.closest("[data-cover-book]");
  if (coverButton) {
    const book = books[Number(coverButton.dataset.coverBook)];
    if (book) openCoverPicker(book);
    return;
  }
  const removeButton = target?.closest("[data-remove-book]");
  if (removeButton) {
    confirmRemoveFromShelf(removeButton);
    return;
  }
  const button = target?.closest("[data-my-shelf-index]");
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
  else if (action === "reading") openReadingPanel();
  else if (action === "brooke") openBrookeSpace({ restoreFocus: false });
  else if (action === "previous") navigateMyRoom(-1);
  else if (action === "next") navigateMyRoom(1);
});
// The shelf title is fixed (A Room of My Own), so it isn't a rename button.
myRoomTitle.removeAttribute("title");
myRoomTitle.tabIndex = -1;
myRoomTitle.setAttribute("aria-disabled", "true");

roomOnlyToggle.addEventListener("click", () => {
  if (activeSpace === "user") openBrookeSpace({ restoreFocus: false });
  else requireAuth(() => openUserSpace({ restoreFocus: false }));
});
myShelfRoom.addEventListener("click", (event) => {
  if (roomHasDragged) {
    event.preventDefault();
    return;
  }
  const button = event.target instanceof Element ? event.target.closest("[data-my-shelf-index]") : null;
  if (!button) return;
  const index = Number(button.dataset.myShelfIndex);
  if (Number.isInteger(index) && books[index]) openBookFromMyRoom(index, button);
});

coverPickerGrid.addEventListener("click", (event) => {
  const option = event.target instanceof Element ? event.target.closest("[data-cover-option]") : null;
  if (!option || !coverPickerState) return;
  const state = coverPickerState;
  if (state.uploadPreview) URL.revokeObjectURL(state.uploadPreview);
  state.uploadBlob = null;
  state.uploadPreview = "";
  state.selected = state.options[Number(option.dataset.coverOption)] || "";
  renderCoverPicker();
});
coverPickerTextButton.addEventListener("click", () => {
  if (!coverPickerState) return;
  const state = coverPickerState;
  if (state.uploadPreview) URL.revokeObjectURL(state.uploadPreview);
  state.uploadBlob = null;
  state.uploadPreview = "";
  state.selected = "";
  renderCoverPicker();
});
coverPickerFile.addEventListener("change", () => {
  const file = coverPickerFile.files?.[0];
  const state = coverPickerState;
  if (!file || !state) return;
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
    coverPickerStatus.textContent = t("coverPickerBadType");
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    coverPickerStatus.textContent = t("coverPickerTooLarge");
    return;
  }
  if (state.uploadPreview) URL.revokeObjectURL(state.uploadPreview);
  state.uploadBlob = file;
  state.uploadPreview = URL.createObjectURL(file);
  coverPickerStatus.textContent = "";
  renderCoverPicker();
});
coverPickerSave.addEventListener("click", saveCoverPicker);
coverPickerCancel.addEventListener("click", closeCoverPicker);
coverPickerClose.addEventListener("click", closeCoverPicker);
coverPicker.addEventListener("click", (event) => {
  if (event.target === coverPicker) closeCoverPicker();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && coverPickerState) {
    event.stopImmediatePropagation();
    closeCoverPicker();
  }
}, true);

readingPanelToggle?.addEventListener("click", openReadingPanel);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !readingPanel.hidden && !coverPickerState) closeReadingPanel();
});
readingPanelClose.addEventListener("click", () => closeReadingPanel());
// Heat grid (phones): tap a square for its date and reading time.
function showHeatTip(cell) {
  const wrap = readingPanelBody.querySelector(".ri-heat-wrap");
  const tip = wrap?.querySelector(".ri-tip");
  if (!tip) return;
  wrap.querySelectorAll(".is-picked").forEach((picked) => picked.classList.remove("is-picked"));
  if (!cell) {
    tip.hidden = true;
    return;
  }
  cell.classList.add("is-picked");
  tip.innerHTML = `<b>${escapeHtml(cell.dataset.day)}</b>${escapeHtml(cell.dataset.time)}`;
  tip.hidden = false;
  const box = wrap.getBoundingClientRect();
  const rect = cell.getBoundingClientRect();
  const half = tip.offsetWidth / 2;
  const x = Math.min(Math.max(rect.left + rect.width / 2 - box.left, half + 4), box.width - half - 4);
  tip.style.left = `${x}px`;
  tip.style.top = `${rect.top - box.top}px`;
}

readingPanelBody.addEventListener("click", async (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const heatCell = target?.closest(".ri-week span[data-day]");
  if (heatCell || readingPanelBody.querySelector(".ri-heat .is-picked")) {
    showHeatTip(heatCell && !heatCell.classList.contains("is-picked") ? heatCell : null);
    if (heatCell) return;
  }
  const modeButton = target?.closest("[data-reading-mode]");
  if (modeButton) {
    // A drag that just ended also fires a click; the drag already chose.
    if (!readingSegmentState.suppressClick) {
      selectReadingMode(modeButton.closest(".rubber-segment"), modeButton.dataset.readingMode);
    }
    return;
  }
  const shuffleButton = target?.closest("[data-quote-shuffle]");
  if (shuffleButton) {
    shuffleReadingQuote(shuffleButton);
    return;
  }
  const recommendButton = target?.closest("[data-reading-recommend]");
  if (recommendButton) {
    const item = reading.recommend?.[Number(recommendButton.dataset.readingRecommend)];
    if (item) {
      addRecommendedBook(item);
      recommendButton.disabled = true;
      recommendButton.textContent = "已加入";
    }
    return;
  }
  const bookButton = target?.closest("[data-reading-book]");
  if (bookButton) {
    openReadingBook(Number(bookButton.dataset.readingBook));
    return;
  }
  if (target?.closest("[data-reading-back]")) {
    reading.view = "overview";
    reading.error = "";
    renderReadingPanel();
    return;
  }
  if (target?.closest("#readingDisconnect")) {
    try {
      await callWereadMe("disconnect");
    } catch (error) {
      console.warn(error);
    }
    Object.assign(reading, { connected: false, stats: {}, year: null, notebooks: null, progress: null, recommend: null, monthTops: null, quote: undefined, highlightCache: {}, error: "" });
    closeQuotePanel({ immediate: true });
    renderReadingPanel();
  }
});
// Calendar: show the day and reading time for the square under the mouse.
readingPanelBody.addEventListener("mouseover", (event) => {
  const cell = event.target instanceof Element ? event.target.closest(".reading-heatmap span[data-label]") : null;
  const calendar = cell?.closest(".rd-calendar");
  const tooltip = readingPanelBody.querySelector(".rd-tooltip");
  if (!tooltip) return;
  if (!cell || !calendar) {
    tooltip.hidden = true;
    return;
  }
  const box = calendar.getBoundingClientRect();
  const rect = cell.getBoundingClientRect();
  tooltip.textContent = cell.dataset.label;
  tooltip.hidden = false;
  const half = tooltip.offsetWidth / 2;
  const x = Math.min(Math.max(rect.left + rect.width / 2 - box.left, half), box.width - half);
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${rect.top - box.top}px`;
});
readingPanelBody.addEventListener("mouseleave", () => {
  const tooltip = readingPanelBody.querySelector(".rd-tooltip");
  if (tooltip) tooltip.hidden = true;
});
// Recommendations row: a normal mouse wheel scrolls it sideways.
readingPanelBody.addEventListener("wheel", (event) => {
  const row = event.target instanceof Element ? event.target.closest(".rd-recommend") : null;
  if (!row || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
  const max = row.scrollWidth - row.clientWidth;
  if (max <= 0) return;
  const next = Math.min(max, Math.max(0, row.scrollLeft + event.deltaY));
  if (next === row.scrollLeft) return;
  event.preventDefault();
  row.scrollLeft = next;
}, { passive: false });
readingPanelBody.addEventListener("keydown", (event) => {
  const row = event.target instanceof Element ? event.target.closest("tr[data-reading-book]") : null;
  if (row && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openReadingBook(Number(row.dataset.readingBook));
  }
});
readingPanelBody.addEventListener("submit", async (event) => {
  if (event.target?.id !== "readingConnectForm") return;
  event.preventDefault();
  const form = event.target;
  const key = form.querySelector("#readingKey").value.trim();
  const button = form.querySelector("button[type='submit']");
  button.disabled = true;
  button.textContent = "正在连接…";
  try {
    await callWereadMe("connect", { wereadApiKey: key });
    Object.assign(reading, { connected: true, error: "" });
    renderReadingPanel();
    refreshReadingPanel();
  } catch (error) {
    reading.error = readingErrorText(error);
    renderReadingPanel();
  }
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
    } else if ((event.key === "ArrowRight" || event.key === "ArrowLeft") && !event.repeat) {
      event.preventDefault();
      stepDetail(event.key === "ArrowRight" ? 1 : -1);
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
      const hasActive = myRoomActiveIndex !== null;
      const current = hasActive ? myRoomActiveIndex : centerMyRoomIndex();
      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (!event.repeat && roomBooks.length) openMyRoomBook(hasActive ? (current + 1) % roomBooks.length : current, { focus: true });
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (!event.repeat && roomBooks.length) openMyRoomBook(hasActive ? (current - 1 + roomBooks.length) % roomBooks.length : current, { focus: true });
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
    if (!event.repeat) navigateTo(current - 1, -1);
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

// Count a visit once per browser session for the admin dashboard. The id is
// random and stays in this browser; no IP or personal data is sent.
function logVisit() {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    if (window.sessionStorage.getItem("brooke-bookshelf:visit-logged")) return;
    let visitor = window.localStorage.getItem("brooke-bookshelf:visitor");
    if (!visitor) {
      visitor = window.crypto?.randomUUID?.() || `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem("brooke-bookshelf:visitor", visitor);
    }
    window.sessionStorage.setItem("brooke-bookshelf:visit-logged", "1");
    let referrer = null;
    try {
      if (document.referrer && new URL(document.referrer).host !== window.location.host) referrer = document.referrer;
    } catch {
      referrer = null;
    }
    client.rpc("log_visit", { visitor, page: window.location.pathname, ref: referrer }).then(({ error }) => {
      if (error) console.warn("Visit log failed", error);
    });
  } catch {
    // Private mode or blocked storage: skip counting.
  }
}

// ---- Phones: "做一间你自己的书房" — three steps over the example shelf ----
// Replaces the browse-first onboarding card on phones. The reference shelf
// behind it is the example; the steps are: account, connect WeRead,
// pick books. It goes away once the user is signed in with books on the
// shelf, or when closed (我的 can bring it back).
// var, not const/let: updateOnboarding() calls updateSetupCard() during
// start-up, before this point runs; it waits for setupReady.
var SETUP_DISMISSED_KEY = "brooke-bookshelf:setup-dismissed";
var setupStatusRequested = false;
var setupReady = false;
// Collapsed to a small hint button until tapped.
var setupOpen = false;

function setupDismissed() {
  try { return window.localStorage.getItem(SETUP_DISMISSED_KEY) === "1"; } catch { return false; }
}

function setSetupDismissed(value) {
  try {
    if (value) window.localStorage.setItem(SETUP_DISMISSED_KEY, "1");
    else window.localStorage.removeItem(SETUP_DISMISSED_KEY);
  } catch {}
}

function updateSetupCard() {
  const card = document.querySelector("#setupCard");
  if (!card || !setupReady) return;
  const signedIn = isSignedIn();
  const hasBooks = hasSavedBooks();
  if (signedIn && hasBooks) {
    card.hidden = true;
    return;
  }
  if (signedIn && reading.connected === null && !setupStatusRequested) {
    setupStatusRequested = true;
    callWereadMe("status")
      .then((data) => { reading.connected = Boolean(data.connected); updateSetupCard(); })
      .catch(() => {});
  }
  const connected = reading.connected === true;
  const steps = [
    ["account", "注册账号", "注册", signedIn],
    ["weread", "连接微信读书", "连接", connected],
    ["pick", "挑选书籍", "去挑书", hasBooks],
  ];
  const done = steps.filter((step) => step[3]).length;
  const current = steps.findIndex((step) => !step[3]);
  card.classList.toggle("is-collapsed", !setupOpen);
  if (!setupOpen) {
    card.innerHTML = `
      <button type="button" class="setup-pill" data-setup="open" aria-expanded="false">
        <i data-lucide="list-checks"></i><span>打造你的书架</span><b>${done}/${steps.length}</b>
      </button>`;
    card.hidden = false;
    window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });
    return;
  }
  card.innerHTML = `
    <header>
      <h2 id="setupCardTitle">打造你的书架</h2>
      <span class="setup-count">${done} / ${steps.length}</span>
      <button type="button" class="setup-close" data-setup="close" aria-label="收起"><i data-lucide="x"></i></button>
    </header>
    <div class="setup-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${steps.length}" aria-valuenow="${done}"><i style="width: ${(done / steps.length) * 100}%"></i></div>
    <ol>
      ${steps.map(([key, title, action, isDone], index) => `
        <li class="${isDone ? "is-done" : index === current ? "is-current" : ""}">
          <span class="setup-mark" aria-hidden="true">${isDone ? '<i data-lucide="check"></i>' : ""}</span>
          <span class="setup-label">${title}</span>
          ${!isDone && index === current ? `<button type="button" data-setup="${key}">${action}</button>` : ""}
        </li>`).join("")}
    </ol>
    <button type="button" class="setup-alt" data-setup="search">不用微信读书？搜书添加</button>`;
  card.hidden = false;
  window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });
}

document.querySelector("#setupCard")?.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-setup]") : null;
  if (!button) return;
  const step = button.dataset.setup;
  if (step === "close" || step === "open") {
    setupOpen = step === "open";
    updateSetupCard();
  } else if (step === "account") {
    openAuthGate(() => updateSetupCard());
  } else if (step === "weread") {
    requireAuth(openReadingPanel);
  } else if (step === "pick") {
    requireAuth(() => {
      openAddBookPanel();
      if (reading.connected) loadWereadPickFromSavedKey();
    });
  } else if (step === "search") {
    requireAuth(openAddBookPanel);
  }
});

setupReady = true;
updateSetupCard();

// Opened from the home screen it should feel like an app: no pinch or
// double-tap zoom, no rubber-band bounce (CSS .is-standalone).
if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) {
  document.documentElement.classList.add("is-standalone");
  document.querySelector('meta[name="viewport"]')?.setAttribute(
    "content",
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
  );
  // iOS Safari ignores user-scalable in some versions; stop pinch directly.
  ["gesturestart", "gesturechange"].forEach((type) => {
    document.addEventListener(type, (event) => event.preventDefault(), { passive: false });
  });
}

// ---- Add to home screen (phones) ----
// Shown once the visitor has looked around for a bit, never when the site
// already runs from the home screen. Android/Chrome gets a real 添加 button
// (beforeinstallprompt); iPhone Safari can't be prompted, so it gets the
// two taps to make. Closing it hides it for 30 days.
const INSTALL_HINT_KEY = "brooke-bookshelf:install-hint-dismissed";
let deferredInstallPrompt = null;

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function installHintDismissedRecently() {
  try {
    const at = Number(window.localStorage.getItem(INSTALL_HINT_KEY)) || 0;
    return Date.now() - at < 30 * 86400000;
  } catch {
    return false;
  }
}

function showInstallHint() {
  const hint = document.querySelector("#installHint");
  if (!hint || isStandalone() || installHintDismissedRecently()) return;
  if (!window.matchMedia("(max-width: 720px)").matches) return;
  const ua = window.navigator.userAgent;
  const ios = /iphone|ipad|ipod/i.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  const steps = document.querySelector("#installHintSteps");
  const action = document.querySelector("#installHintAction");
  if (deferredInstallPrompt) {
    steps.textContent = "像 App 一样从桌面打开，全屏阅读。";
    action.hidden = false;
  } else if (ios) {
    const inSafari = /safari/i.test(ua) && !/crios|fxios|edgios|micromessenger/i.test(ua);
    steps.innerHTML = inSafari
      ? "点底部的 <b>分享</b> 按钮，再选 <b>添加到主屏幕</b>。"
      : "请先用 Safari 打开本页，再点 <b>分享</b> → <b>添加到主屏幕</b>。";
    action.hidden = true;
  } else {
    steps.innerHTML = "点浏览器右上角的 <b>⋮</b> 菜单，选 <b>添加到主屏幕</b>。";
    action.hidden = true;
  }
  hint.hidden = false;
  requestAnimationFrame(() => hint.classList.add("is-visible"));
}

function hideInstallHint({ remember = true } = {}) {
  const hint = document.querySelector("#installHint");
  if (!hint || hint.hidden) return;
  hint.classList.remove("is-visible");
  window.setTimeout(() => { hint.hidden = true; }, 320);
  if (remember) {
    try { window.localStorage.setItem(INSTALL_HINT_KEY, String(Date.now())); } catch {}
  }
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});
window.addEventListener("appinstalled", () => hideInstallHint());
document.querySelector("#installHintClose")?.addEventListener("click", () => hideInstallHint());
document.querySelector("#installHintAction")?.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice.catch(() => null);
  deferredInstallPrompt = null;
  if (choice) hideInstallHint();
});
// ---- First visit in iPhone Safari: a step-by-step add-to-home guide ----
// Safari can't be asked to install, so the first time someone opens the
// site there a sheet shows the three taps. Once seen (or closed) it never
// comes back; the small hint above still covers other browsers.
const INSTALL_GUIDE_KEY = "brooke-bookshelf:install-guide-seen";

function isIphoneSafari() {
  const ua = window.navigator.userAgent;
  const ios = /iphone|ipod/i.test(ua) || (/ipad/i.test(ua)) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  return ios && /safari/i.test(ua) && !/crios|fxios|edgios|opios|micromessenger|qq\/|weibo|alipay|dingtalk/i.test(ua);
}

function installGuideSeen() {
  try {
    return Boolean(window.localStorage.getItem(INSTALL_GUIDE_KEY));
  } catch {
    return true;
  }
}

const SHARE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M7 10H5.5A1.5 1.5 0 0 0 4 11.5v8A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 18.5 10H17"/></svg>';
const ADD_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';

function showInstallGuide() {
  if (isStandalone() || installGuideSeen() || !isIphoneSafari()) return false;
  if (!window.matchMedia("(max-width: 720px)").matches) return false;
  try { window.localStorage.setItem(INSTALL_GUIDE_KEY, String(Date.now())); } catch { /* private mode */ }
  const sheet = document.createElement("div");
  sheet.className = "install-guide";
  sheet.innerHTML = `
    <section class="install-guide-card" role="dialog" aria-modal="true" aria-labelledby="installGuideTitle">
      <img src="./assets/icons/icon-192.png" alt="" width="60" height="60" />
      <h2 id="installGuideTitle">添加到主屏幕</h2>
      <p>像 App 一样从桌面打开：全屏、不用找网址。</p>
      <ol>
        <li><em>1</em><span>点 Safari 底部的 <b class="install-guide-icon">${SHARE_ICON}</b> <b>分享</b><small>看不到分享按钮，就先点 <b>···</b></small></span></li>
        <li><em>2</em><span>往下滑，选 <b class="install-guide-icon">${ADD_ICON}</b> <b>添加到主屏幕</b></span></li>
        <li><em>3</em><span>点右上角的 <b>添加</b></span></li>
      </ol>
      <button type="button" class="install-guide-ok">知道了</button>
    </section>`;
  document.body.append(sheet);
  requestAnimationFrame(() => sheet.classList.add("is-visible"));
  const close = () => {
    sheet.classList.remove("is-visible");
    window.setTimeout(() => sheet.remove(), 320);
  };
  sheet.querySelector(".install-guide-ok").addEventListener("click", close);
  sheet.addEventListener("click", (event) => { if (event.target === sheet) close(); });
  return true;
}

// First visit in iPhone Safari: the guide, soon after the page settles.
// Everyone else: the small hint after a while with the shelf.
window.setTimeout(() => {
  if (!showInstallGuide()) window.setTimeout(showInstallHint, 10500);
}, 1500);

// ---- 我的 (profile) page and the phone tab bar ----

let profileCloseTimer = 0;

// 我的: a card with the room (initial, name, email, when you joined), two
// number boxes, then a numbered list of what the tab bar doesn't reach.
// 阅读记录 has its own tab, so it isn't repeated. 我的空间 is listed: phones
// have no top switch, and signed-out visitors had no way in otherwise.
function profileRows(rows) {
  return `
    <ol class="pf-list">
      ${rows.map(([action, label, note = ""], index) => `
        <li><button type="button" data-profile-action="${action}">
          <em>${String(index + 1).padStart(2, "0")}</em>
          <span>${label}</span>
          ${note ? `<small>${escapeHtml(note)}</small>` : ""}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 6l6 6-6 6"/></svg>
        </button></li>`).join("")}
    </ol>`;
}

// 我的 itself is in the theme colour; with 'follow' (no single book here)
// it stays near-black.
function applyProfileColor() {
  const color = themeColor() || "#141414";
  const ink = inkForColor(color);
  profilePanel.style.setProperty("--pf-bg", color);
  profilePanel.style.setProperty("--pf-ink", ink);
  library.style.setProperty("--profile-bg", color);
  library.style.setProperty("--profile-ink", ink);
}

function avatarMarkup(user, url = avatarUrl) {
  const initial = escapeHtml(Array.from(userDisplayName(user))[0]?.toUpperCase() || "?");
  return url
    ? `<span class="pf-avatar has-photo" aria-hidden="true"><img src="${escapeHtml(siteImage(url))}" alt="" /></span>`
    : `<span class="pf-avatar" aria-hidden="true">${initial}</span>`;
}

// Sheet for changing the room's name and the avatar. A new photo is only
// uploaded on 保存; 用首字母 goes back to the letter.
let profileSheet = null;

function openProfileSheet() {
  const user = supabaseSession?.user;
  if (!user) return;
  profileSheet = { file: null, preview: "", photo: avatarUrl };
  const sheet = document.createElement("div");
  sheet.className = "pf-sheet";
  sheet.innerHTML = `
    <form class="pf-sheet-card" role="dialog" aria-modal="true" aria-label="修改名字和头像">
      <div class="pf-sheet-avatar" data-sheet-avatar>${avatarMarkup(user)}</div>
      <div class="pf-sheet-photo">
        <label class="pf-sheet-button">换头像<input type="file" accept="image/*" data-sheet-file hidden /></label>
        <button type="button" class="pf-sheet-button" data-sheet-letter ${avatarUrl ? "" : "hidden"}>用首字母</button>
      </div>
      <label class="pf-sheet-field">
        <span>名字</span>
        <input type="text" maxlength="40" data-sheet-name value="${escapeHtml(displayName)}" placeholder="${escapeHtml(userDisplayName(user))}" />
      </label>
      <p class="pf-sheet-status" data-sheet-status role="status"></p>
      <div class="pf-sheet-actions">
        <button type="button" class="pf-sheet-cancel" data-sheet-cancel>取消</button>
        <button type="submit" class="pf-sheet-save" data-sheet-save>保存</button>
      </div>
    </form>`;
  // On the page itself, so it sits above the floating tab bar.
  document.body.append(sheet);
  requestAnimationFrame(() => sheet.classList.add("is-visible"));

  const avatarBox = sheet.querySelector("[data-sheet-avatar]");
  const letterButton = sheet.querySelector("[data-sheet-letter]");
  const status = sheet.querySelector("[data-sheet-status]");
  const showAvatar = (url) => {
    avatarBox.innerHTML = avatarMarkup(user, url);
    letterButton.hidden = !url;
  };
  sheet.querySelector("[data-sheet-file]").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (profileSheet.preview) URL.revokeObjectURL(profileSheet.preview);
    profileSheet.file = file;
    profileSheet.preview = URL.createObjectURL(file);
    showAvatar(profileSheet.preview);
  });
  letterButton.addEventListener("click", () => {
    profileSheet.file = null;
    profileSheet.photo = "";
    showAvatar("");
  });
  sheet.querySelector("[data-sheet-cancel]").addEventListener("click", closeProfileSheet);
  sheet.addEventListener("click", (event) => { if (event.target === sheet) closeProfileSheet(); });
  sheet.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const save = sheet.querySelector("[data-sheet-save]");
    save.disabled = true;
    status.textContent = profileSheet.file ? "正在上传头像…" : "";
    try {
      let url = profileSheet.photo;
      if (profileSheet.file) url = await uploadAvatarImage(profileSheet.file);
      if (avatarUrl && avatarUrl !== url) removeStoredAvatar(avatarUrl);
      writeAvatarUrl(url);
      writeDisplayName(sheet.querySelector("[data-sheet-name]").value);
      syncSettingsToSupabase();
      closeProfileSheet();
      renderProfile();
    } catch (error) {
      console.warn("Profile save failed", error);
      status.textContent = "头像没有上传成功，请换一张图片或稍后再试。";
      save.disabled = false;
    }
  });
  sheet.querySelector("[data-sheet-name]").focus({ preventScroll: true });
}

function closeProfileSheet() {
  const sheet = document.querySelector(".pf-sheet");
  if (profileSheet?.preview) URL.revokeObjectURL(profileSheet.preview);
  profileSheet = null;
  if (!sheet) return;
  sheet.classList.remove("is-visible");
  window.setTimeout(() => sheet.remove(), 260);
}

// Best effort: drop a replaced avatar from the user's own folder.
function removeStoredAvatar(url) {
  const client = getSupabaseClient();
  const userId = supabaseSession?.user?.id;
  const path = decodeURIComponent(String(url).split("/object/public/covers/")[1] || "");
  if (!client || !userId || !path.startsWith(`${userId}/avatar-`)) return;
  client.storage.from("covers").remove([path]).catch((error) => console.warn("Old avatar not removed", error));
}

// Square, centre-cropped, 320 px JPEG in the user's own storage folder.
async function uploadAvatarImage(file) {
  const client = getSupabaseClient();
  const userId = supabaseSession?.user?.id;
  if (!client || !userId) throw new Error("sign in");
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const size = Math.min(320, side);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas.getContext("2d").drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size);
  bitmap.close?.();
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error("encode failed"))), "image/jpeg", 0.86);
  });
  const path = `${userId}/avatar-${Date.now()}.jpg`;
  const { error } = await client.storage.from("covers").upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (error) throw error;
  return client.storage.from("covers").getPublicUrl(path).data.publicUrl;
}

function themePickerMarkup() {
  const current = THEMES.find((theme) => theme.id === themeId);
  return `
    <section class="pf-theme" aria-label="主题色">
      <div class="pf-theme-head"><h4>主题色</h4><span>${escapeHtml(current?.name || "")}</span></div>
      <div class="pf-swatches" role="radiogroup" aria-label="主题色">
        ${THEMES.map((theme) => `
          <button type="button" role="radio" aria-checked="${theme.id === themeId}" aria-label="${theme.name}" title="${theme.name}"
            data-theme-id="${theme.id}" class="${theme.color ? "" : "is-follow"}" style="${theme.color ? `--sw: ${theme.color};` : ""}"></button>`).join("")}
      </div>
    </section>`;
}

function renderProfile() {
  if (!profileBody) return;
  const user = supabaseSession?.user;
  if (!user) {
    applyProfileColor();
    profileBody.innerHTML = `
      <div class="pf">
        <div class="pf-me is-guest">
          <span class="pf-avatar" aria-hidden="true">R</span>
          <span class="pf-me-name">还没有登录</span>
          <button type="button" class="pf-signin" data-profile-action="signin">登录 / 注册</button>
        </div>
        ${themePickerMarkup()}
        ${profileRows([["room", "我的空间", "登录后进入"], ["index", "全部书目"], ["help", "操作提示"], ["setup", "打造你的书架"]])}
      </div>`;
    return;
  }
  const saved = books.filter((book) => getBookState(book)).length;
  const connected = reading.connected;
  const rows = [["room", "我的空间"], ["add", "增添书籍"], ["reference", "参考书架", "范例"], ["index", "全部书目"], ["help", "操作提示"]];
  if (!hasSavedBooks()) rows.push(["setup", "打造你的书架"]);
  applyProfileColor();
  profileBody.innerHTML = `
    <div class="pf">
      <button type="button" class="pf-me" data-profile-action="edit-profile" aria-label="修改名字和头像">
        ${avatarMarkup(user)}
        <span class="pf-me-name">${escapeHtml(userDisplayName(user))}</span>
        <svg class="pf-me-edit" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4"/></svg>
      </button>

      <div class="pf-stats">
        <button type="button" data-profile-action="shelf">
          <b>${saved}<small>本</small></b>
          <span>书架上的书</span>
        </button>
        <button type="button" data-profile-action="reading">
          <b class="pf-weread${connected === true ? " is-on" : ""}">${connected === true ? "已连接" : connected === false ? "去连接" : "—"}</b>
          <span>微信读书</span>
        </button>
      </div>

      ${themePickerMarkup()}

      ${profileRows(rows)}

      <button type="button" class="pf-signout" data-profile-action="signout">退出登录</button>
    </div>`;
}

function openProfile() {
  if (detailIndex !== null) closeBookDetail();
  closeShelfHelp({ immediate: true });
  closeBookIndex({ restoreFocus: false, immediate: true });
  closeAddBookPanel({ restoreFocus: false, immediate: true, targetSpace: activeSpace });
  closeReadingPanel({ immediate: true, returnToShelf: false });
  window.clearTimeout(profileCloseTimer);
  renderProfile();
  profilePanel.hidden = false;
  profilePanel.setAttribute("aria-hidden", "false");
  updateOnboarding();
  requestAnimationFrame(() => {
    library.classList.add("is-profile-open");
    profilePanel.classList.add("is-visible");
  });
  // Fill in the WeRead line once we know it.
  if (isSignedIn() && reading.connected === null) {
    callWereadMe("status")
      .then((data) => { reading.connected = Boolean(data.connected); if (!profilePanel.hidden) renderProfile(); })
      .catch(() => {});
  }
}

function closeProfile({ immediate = false } = {}) {
  closeProfileSheet();
  if (profilePanel.hidden) return;
  window.clearTimeout(profileCloseTimer);
  library.classList.remove("is-profile-open");
  profilePanel.classList.remove("is-visible");
  profilePanel.setAttribute("aria-hidden", "true");
  const finish = () => {
    if (!profilePanel.classList.contains("is-visible")) profilePanel.hidden = true;
    updateOnboarding();
  };
  if (immediate) finish();
  else profileCloseTimer = window.setTimeout(finish, 480);
}

function runProfileAction(action) {
  if (action === "signin") {
    openAuthGate(() => openProfile());
    return;
  }
  if (action === "edit-profile") {
    openProfileSheet();
    return;
  }
  if (action === "signout") {
    closeProfile({ immediate: true });
    signOutEverywhere();
    return;
  }
  closeProfile({ immediate: true });
  if (action === "room") requireAuth(() => openUserSpace({ restoreFocus: false }));
  else if (action === "shelf") requireAuth(() => openMyShelf({ view: "list", restoreFocus: false }));
  else if (action === "add") requireAuth(openAddBookPanel);
  else if (action === "reading") openReadingPanel();
  else if (action === "index") openBookIndex();
  else if (action === "reference") openBrookeSpace({ restoreFocus: false });
  else if (action === "help" && shelfHelp.hidden) toggleShelfHelp();
  else if (action === "setup") {
    setupOpen = true;
    goToShelf();
    updateSetupCard();
  }
}

// ---- 笔记 page (phone tab) ----
// A random highlight on top (换一条 for another), then every book with
// highlights or thoughts; tapping one shows that book's notes here.

let quotePanelTimer = 0;
const notes = { view: "list", book: null };
const notesProgress = createSmoothProgress((value) => drawProgressRing(quotePanelBody, value));

function notesListMarkup() {
  const list = reading.notebooks || [];
  if (!list.length) return "";
  return `
    <section class="notes-all">
      <h3>全部笔记 <small>${list.length} 本书</small></h3>
      <ul class="notes-list">
        ${list.map((item, index) => `
          <li><button type="button" data-notes-book="${index}">
            ${readingCoverMarkup(item.book?.cover, item.book?.title)}
            <span>
              <b>${escapeHtml(cleanBookTitle(item.book?.title || ""))}</b>
              <small>${escapeHtml(item.book?.author || "")}</small>
              <em>${item.highlights} 条划线${item.thoughts ? ` · ${item.thoughts} 条想法` : ""}</em>
            </span>
            <i data-lucide="chevron-right" aria-hidden="true"></i>
          </button></li>`).join("")}
      </ul>
    </section>`;
}

// The whole 笔记 page takes the colour of the book the random note is
// from, with ink that reads on it; plain paper until a colour is known.
function applyNotesColor(quote = reading.quote) {
  if (!quotePanel) return;
  const color = themeColor() || (quote?.cover && reading.themeColors[quote.cover]);
  quotePanel.toggleAttribute("data-coloured", Boolean(color));
  library.classList.toggle("has-coloured-notes", Boolean(color));
  if (!color) return;
  const ink = inkForColor(color);
  quotePanel.style.setProperty("--notes-bg", color);
  quotePanel.style.setProperty("--notes-ink", ink);
  library.style.setProperty("--notes-ink", ink);
}

function renderQuotePanel(state = "ready") {
  if (!quotePanelBody) return;
  applyNotesColor(state === "ready" ? reading.quote : undefined);
  if (state === "loading") {
    quotePanelBody.innerHTML = progressRingMarkup();
  } else if (state === "connect") {
    quotePanelBody.innerHTML = `
      <div class="quote-panel-empty">
        <p>笔记来自你在微信读书里的划线和想法。连接微信读书后，这里会随机给你一句，下面是每本书的笔记。</p>
        <button type="button" class="quote-panel-button" data-quote-connect>去连接微信读书</button>
      </div>`;
  } else if (notes.view === "book") {
    quotePanelBody.innerHTML = `<div class="notes-book">${readingBookMarkup(notes.book, "← 全部笔记")}</div>`;
  } else if (!reading.quote) {
    quotePanelBody.innerHTML = `<div class="quote-panel-empty"><p>还没有找到你的划线。在微信读书里划过句子之后，这里就会出现。</p></div>${notesListMarkup()}`;
  } else {
    const quote = reading.quote;
    quotePanelBody.innerHTML = `
      <div class="rd-quote-card quote-panel-card${quote.cover ? " has-cover" : ""}" style="${quoteColorStyle(quote)}" aria-live="polite">${readingQuoteCardInner(quote)}</div>
      <button type="button" class="quote-panel-button" data-quote-shuffle>
        <i data-lucide="shuffle" aria-hidden="true"></i><span>换一条</span>
      </button>
      ${notesListMarkup()}`;
  }
  window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });
}

async function openNotesBook(index) {
  const item = reading.notebooks?.[index];
  if (!item?.book?.bookId) return;
  notes.listScroll = quotePanel.scrollTop;
  notes.view = "book";
  notes.book = { title: item.book.title, loaded: false };
  renderQuotePanel();
  quotePanel.scrollTop = 0;
  try {
    const data = await callWereadMe("highlights", { bookId: item.book.bookId });
    notes.book = { ...data, title: item.book.title, loaded: true };
  } catch (error) {
    console.warn(error);
    notes.book = { title: item.book.title, loaded: true, highlights: [], thoughts: [] };
  }
  if (notes.view === "book") renderQuotePanel();
}

function closeNotesBook() {
  notes.view = "list";
  notes.book = null;
  renderQuotePanel();
  quotePanel.scrollTop = notes.listScroll || 0;
}

async function openQuotePanel() {
  if (!isSignedIn()) {
    openAuthGate(() => openQuotePanel());
    return;
  }
  if (detailIndex !== null) closeBookDetail();
  closeProfile({ immediate: true });
  closeReadingPanel({ immediate: true, returnToShelf: false });
  closeShelfHelp({ immediate: true });
  closeBookIndex({ restoreFocus: false, immediate: true });
  closeAddBookPanel({ restoreFocus: false, immediate: true, targetSpace: activeSpace });
  window.clearTimeout(quotePanelTimer);
  quotePanel.hidden = false;
  quotePanel.setAttribute("aria-hidden", "false");
  updateOnboarding();
  requestAnimationFrame(() => {
    library.classList.add("is-quote-open");
    quotePanel.classList.add("is-visible");
  });
  if (reading.quote) {
    renderQuotePanel();
    return;
  }
  notesProgress.reset();
  renderQuotePanel("loading");
  notesProgress.set(0.08);
  try {
    if (reading.connected === null) reading.connected = Boolean((await callWereadMe("status")).connected);
    notesProgress.set(0.3);
    if (!reading.connected) {
      notesProgress.reset();
      renderQuotePanel("connect");
      return;
    }
    if (!reading.notebooks) reading.notebooks = (await callWereadMe("notebooks")).books || [];
    notesProgress.set(0.62);
    reading.quote = undefined;
    await loadReadingQuote();
    await notesProgress.finish();
  } catch (error) {
    console.warn(error);
    if (error.code === "not_connected") {
      reading.connected = false;
      renderQuotePanel("connect");
      return;
    }
  }
  renderQuotePanel();
}

function closeQuotePanel({ immediate = false } = {}) {
  if (!quotePanel || quotePanel.hidden) return;
  window.clearTimeout(quotePanelTimer);
  library.classList.remove("is-quote-open");
  quotePanel.classList.remove("is-visible");
  quotePanel.setAttribute("aria-hidden", "true");
  const finish = () => {
    if (!quotePanel.classList.contains("is-visible")) quotePanel.hidden = true;
    updateOnboarding();
  };
  if (immediate) finish();
  else quotePanelTimer = window.setTimeout(finish, 480);
}

quotePanelClose?.addEventListener("click", () => closeQuotePanel());
quotePanelBody?.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const shuffle = target?.closest("[data-quote-shuffle]");
  if (shuffle) {
    shuffleReadingQuote(shuffle, quotePanelBody);
    return;
  }
  if (target?.closest("[data-quote-connect]")) {
    closeQuotePanel({ immediate: true });
    openReadingPanel();
    return;
  }
  const bookButton = target?.closest("[data-notes-book]");
  if (bookButton) {
    openNotesBook(Number(bookButton.dataset.notesBook));
    return;
  }
  if (target?.closest("[data-reading-back]")) closeNotesBook();
});

// Which tab is lit follows whatever is on screen.
function updateTabBar() {
  if (!tabBar) return;
  const current = !readingPanel.hidden && library.classList.contains("is-reading-open") ? "reading"
    : !profilePanel.hidden && library.classList.contains("is-profile-open") ? "profile"
      : quotePanel && !quotePanel.hidden && library.classList.contains("is-quote-open") ? "quote"
        : "shelf";
  tabBar.querySelectorAll("[data-tab]").forEach((button) => {
    if (button.dataset.tab === current) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function goToShelf() {
  const somethingOpen = !profilePanel.hidden || (quotePanel && !quotePanel.hidden) || !readingPanel.hidden
    || !shelfHelp.hidden || !bookIndex.hidden || !addBookPanel.hidden || detailIndex !== null
    || (!myShelf.hidden && myShelfView === "list");
  // Phones have no top switch: tapping 书架 on the example shelf takes you
  // to your own room.
  if (!somethingOpen && activeSpace === "brooke" && isSignedIn() && hasSavedBooks()) {
    openUserSpace({ restoreFocus: false });
    return;
  }
  closeProfile({ immediate: true });
  closeQuotePanel({ immediate: true });
  closeReadingPanel({ immediate: true, returnToShelf: false });
  closeShelfHelp({ immediate: true });
  closeBookIndex({ restoreFocus: false, immediate: true });
  if (detailIndex !== null) closeBookDetail();
  if (!addBookPanel.hidden || (!myShelf.hidden && myShelfView === "list")) {
    openMyShelf({ view: "room", restoreFocus: false });
  }
}

profileClose?.addEventListener("click", () => closeProfile());
profileBody?.addEventListener("click", (event) => {
  const swatch = event.target instanceof Element ? event.target.closest("[data-theme-id]") : null;
  if (swatch) {
    setTheme(swatch.dataset.themeId);
    return;
  }
  const button = event.target instanceof Element ? event.target.closest("[data-profile-action]") : null;
  if (button) runProfileAction(button.dataset.profileAction);
});
tabBar?.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-tab]") : null;
  if (!button) return;
  if (button.dataset.tab === "shelf") goToShelf();
  else if (button.dataset.tab === "quote") {
    // Tapping 笔记 again from inside a book goes back to the list.
    if (!quotePanel.hidden && notes.view === "book") closeNotesBook();
    else openQuotePanel();
  }
  else if (button.dataset.tab === "reading") {
    closeProfile({ immediate: true });
    closeQuotePanel({ immediate: true });
    openReadingPanel();
  } else {
    closeQuotePanel({ immediate: true });
    openProfile();
  }
});
new MutationObserver(updateTabBar).observe(library, { attributes: true, attributeFilter: ["class"] });

// ---- Phones: shelf / list switch (top right) ----
// On the reference shelf, list = 全部书籍; in your own room, list = your
// books as a list. Hidden while a book, a tab page or a sheet is open.
const viewSwitch = document.querySelector("#viewSwitch");

function updateViewSwitch() {
  if (!viewSwitch) return;
  const covered = ["is-detail-open", "is-auth-gate-open", "is-reading-open", "is-profile-open", "is-quote-open"]
    .some((name) => library.classList.contains(name))
    || !addBookPanel.hidden || !shelfHelp.hidden;
  viewSwitch.hidden = covered;
  const list = !bookIndex.hidden || (!myShelf.hidden && myShelfView === "list");
  viewSwitch.querySelector('[data-view="shelf"]').setAttribute("aria-pressed", String(!list));
  viewSwitch.querySelector('[data-view="list"]').setAttribute("aria-pressed", String(list));
}

viewSwitch?.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-view]") : null;
  if (!button || button.getAttribute("aria-pressed") === "true") return;
  if (button.dataset.view === "list") {
    if (!myShelf.hidden) switchMyShelfView("list");
    else openBookIndex();
  } else if (!bookIndex.hidden) {
    closeBookIndex({ restoreFocus: false });
  } else if (!myShelf.hidden) {
    switchMyShelfView("room");
  }
  // The pressed state follows at once; the panels catch up.
  viewSwitch.querySelectorAll("[data-view]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
});

const viewSwitchObserver = new MutationObserver(updateViewSwitch);
[library, myShelf, bookIndex, addBookPanel, shelfHelp].forEach((element) => {
  viewSwitchObserver.observe(element, { attributes: true, attributeFilter: ["class", "hidden"] });
});
updateViewSwitch();

// Top-right menu (staggered-menu.js). Each entry reuses the same path as the
// matching toolbar button, after clearing whatever is open in front of it.
function setupSiteMenu() {
  if (typeof window.StaggeredMenu !== "function") return;

  // Just before the menu opens, match it to what is on screen: your room's
  // wash when you are in it, otherwise the page's.
  library.addEventListener("click", (event) => {
    if (!(event.target instanceof Element) || !event.target.closest(".sm-toggle")) return;
    const surface = !myShelf.hidden ? myShelf : library;
    const color = getComputedStyle(surface).backgroundColor;
    if (color && color !== "rgba(0, 0, 0, 0)") library.style.setProperty("--menu-bg", color);
  }, true);

  const runAfterDetail = (action) => {
    closeReadingPanel({ immediate: true, returnToShelf: false });
    if (detailIndex === null) {
      action();
      return;
    }
    closeBookDetail();
    const startedAt = performance.now();
    const wait = () => {
      if (detailIndex === null) action();
      else if (performance.now() - startedAt < 2000) requestAnimationFrame(wait);
    };
    requestAnimationFrame(wait);
  };

  window.StaggeredMenu(library, {
    title: "Reading Room / 目录",
    position: "right",
    toggleLabels: ["菜单", "关闭"],
    // The panel takes the colour of the page behind it (--menu-bg, set as
    // the menu opens); the sweep in front is a shade darker.
    colors: ["color-mix(in srgb, var(--menu-bg, #eeece8) 86%, #151515)", "#151515"],
    panelColor: "var(--menu-bg, #eeece8)",
    panelInk: "#151515",
    items: [
      {
        label: "参考空间",
        onSelect: () => runAfterDetail(() => {
          closeBookIndex({ restoreFocus: false, immediate: true });
          openBrookeSpace({ restoreFocus: false });
        }),
        isCurrent: () => activeSpace === "brooke" && bookIndex.hidden && myShelf.hidden && readingPanel.hidden,
      },
      {
        label: "我的空间",
        onSelect: () => runAfterDetail(() => requireAuth(() => openUserSpace({ restoreFocus: false }))),
        isCurrent: () => !myShelf.hidden && myShelfView === "room",
      },
      {
        label: "全部书目",
        onSelect: () => runAfterDetail(openBookIndex),
        isCurrent: () => !bookIndex.hidden,
      },
      {
        label: "我的书架",
        onSelect: () => runAfterDetail(() => requireAuth(() => openMyShelf({ view: "list" }))),
        isCurrent: () => !myShelf.hidden && myShelfView === "list",
      },
      {
        label: "增添书籍",
        onSelect: () => runAfterDetail(() => requireAuth(openAddBookPanel)),
        isCurrent: () => !addBookPanel.hidden,
      },
      {
        label: "阅读记录",
        onSelect: () => runAfterDetail(openReadingPanel),
        isCurrent: () => !readingPanel.hidden,
      },
      {
        label: "操作提示",
        onSelect: () => runAfterDetail(() => {
          if (shelfHelp.hidden) toggleShelfHelp();
        }),
        isCurrent: () => !shelfHelp.hidden,
      },
    ],
    footer: [
      {
        label: () => accountButton?.textContent || t("signIn"),
        isHidden: () => !accountButton || accountButton.hidden,
        onSelect: () => runAfterDetail(() => accountButton.click()),
      },
    ],
  });
}

setupSiteMenu();

const authReady = initializeSupabaseAuth()
  .then(() => {
    loadMissingCoverPalettes();
    loadMissingIntros();
    logVisit();
  })
  .catch((error) => console.warn("Auth start-up failed", error));
updateOnboarding();
notifyParentTheme();
Promise.all([
  new Promise((resolve) => window.setTimeout(resolve, 1250)),
  Promise.race([authReady, new Promise((resolve) => window.setTimeout(resolve, 3000))]),
]).then(() => {
  // Everyone opens on REFERENCE ROOM; your own room is one tap away.
  entryScreen?.classList.add("is-done");
});

// Bridge for shelf-carousel.js (prototype), which lives outside this scope.
window.BROOKE_SHELF_API = {
  books,
  bookElements,
  viewport,
  track,
  library,
  activeTitle,
  activeNumber,
  isReferenceBook,
  referencePosition,
  setShelfCaption,
  setAmbientColor,
  coverMarkup,
  cleanBookTitle,
  escapeHtml,
  openBookDetail,
  get detailIndex() { return detailIndex; },
  get detailSourceMode() { return detailSourceMode; },
  setActive(index) { activeIndex = index; pinnedIndex = index; },
  overlayOpen() {
    const open = (el) => Boolean(el && !el.hidden);
    return open(authGate) || open(bookIndex) || open(addBookPanel) || open(myShelf) ||
      open(shelfHelp) || open(readingPanel) || (quotePanel && open(quotePanel)) ||
      (profilePanel && open(profilePanel)) || Boolean(coverPickerState);
  },
};
document.dispatchEvent(new Event("brooke:shelf-ready"));
}).catch((error) => {
  console.error(error);
  const status = document.querySelector("#activeTitle");
  if (status) status.textContent = "书单加载失败，请检查 books.tsv";
});
