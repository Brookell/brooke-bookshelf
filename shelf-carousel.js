// Prototype: endless 3D carousel shelf for Brooke's Space.
//
// Each reference book is a box: the spine is its front, the cover its
// right-hand side. The book in the middle turns until its cover faces you
// straight on and comes forward; the rest stand spine-out and repeat
// endlessly on both sides. Wheel, drag, arrow keys, the toolbar arrows and
// clicks slide the shelf; clicking the middle cover (or Space / Enter)
// opens the existing detail page from that cover.
//
// It reads the globals app.js already defines (books, bookElements,
// openBookDetail, ...) and leaves the classic shelf in the DOM, hidden.
// Turn it off with ?shelf=classic.
(() => {
  if (new URLSearchParams(location.search).get("shelf") === "classic") return;
  if (window.BROOKE_SHELF_API) start(window.BROOKE_SHELF_API);
  else document.addEventListener("brooke:shelf-ready", () => start(window.BROOKE_SHELF_API), { once: true });
})();

function start(api) {
  const {
    books, bookElements, viewport, track, library, activeTitle, activeNumber,
    isReferenceBook, referencePosition, setShelfCaption, setAmbientColor,
    coverMarkup, cleanBookTitle, escapeHtml, openBookDetail,
  } = api;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COPIES = 3;
  const BASE_HEIGHT = 430;

  document.body.classList.add("cs-on");
  const host = document.createElement("div");
  host.className = "cs-shelf";
  const stage = document.createElement("div");
  stage.className = "cs-stage";
  host.append(stage);
  viewport.append(host);

  let refs = [];      // indexes into books[] of the reference books, in shelf order
  let tapes = [];     // one per virtual slot (COPIES × refs.length)
  let N = 0, V = 0;
  let maxH = 400, scale = 1, cum = [], loopLen = 1, maxCover = 300;
  let s = 0, T = 0, hover = -1, active = -1;
  let mx = innerWidth / 2, my = innerHeight / 2;
  let downX = null, T0 = 0, dragging = false, suppressClick = false;

  const mod = (a, n) => ((a % n) + n) % n;
  const sstep = (x) => x * x * (3 - 2 * x);
  const B = (r) => (Math.abs(r) < 1 ? (r + Math.sin(Math.PI * r) / Math.PI) / 2 : Math.sign(r) * 0.5);

  function measure() {
    const narrow = matchMedia("(max-width: 720px)").matches;
    const avail = viewport.clientHeight;
    maxH = narrow ? Math.max(190, Math.min(320, avail * 0.86)) : Math.max(260, Math.min(430, avail - 30));
    // Also keep the widest cover (288px in books.tsv) under ~48% of the
    // width, so on phones the turned-out book leaves its neighbours visible.
    scale = Math.min(maxH / BASE_HEIGHT, (viewport.clientWidth * 0.48) / 288);
    maxH = BASE_HEIGHT * scale;
    tapes.forEach(applySize);
    layoutTable();
  }

  const dims = (book) => ({
    sw: (Number(book.spineWidth) || 42) * scale,
    cw: (Number(book.width) || 272) * scale,
    h: maxH * (Number(book.height) || 0.92),
    gap: (Number(book.shelfGap) || 14) * scale,
  });

  // Closed-shelf centres: cum[j] is the centre of the j-th book, loopLen the
  // length of one full run of the shelf.
  function layoutTable() {
    cum = [0];
    maxCover = 0;
    for (let j = 0; j < N; j++) {
      const a = dims(books[refs[j]]);
      const b = dims(books[refs[(j + 1) % N]]);
      cum.push(cum[j] + a.sw / 2 + a.gap + b.sw / 2);
      maxCover = Math.max(maxCover, a.cw);
    }
    loopLen = cum[N] || 1;
  }

  const P = (k) => Math.floor(k / N) * loopLen + cum[mod(k, N)];
  const Pf = (x) => { const f = Math.floor(x); return P(f) + (P(f + 1) - P(f)) * (x - f); };
  const extra = (k) => { const d = dims(books[refs[mod(k, N)]]); return d.cw - d.sw + 1.6 * 14 * scale; };
  const extraF = (x) => { const f = Math.floor(x); return extra(f) + (extra(f + 1) - extra(f)) * (x - f); };

  function applySize(t) {
    const d = dims(books[t.index]);
    t.el.style.setProperty("--sw", `${d.sw}px`);
    t.el.style.setProperty("--cw", `${d.cw}px`);
    t.el.style.setProperty("--h", `${d.h}px`);
    t.h = d.h;
    t.cw = d.cw;
  }

  function applyColors(t) {
    const book = books[t.index];
    const src = bookElements[t.index];
    // Prefer the live values on the classic slot (colours are refined from
    // the cover after load), fall back to the catalogue values.
    const pick = (name, fallback) => (src && src.style.getPropertyValue(name)) || fallback;
    t.el.style.setProperty("--spine", pick("--spine", book.spine));
    t.el.style.setProperty("--spine-ink", pick("--spine-ink", book.spineInk));
    t.el.style.setProperty("--cover", pick("--cover", book.color));
    t.el.style.setProperty("--cover-ink", pick("--cover-ink", book.ink));
    t.el.style.setProperty("--art-opacity", String(book.opacity ?? 1));
    t.el.style.setProperty("--art-filter", book.filter ?? "none");
  }

  function build() {
    refs = books.map((book, index) => index).filter((index) => isReferenceBook(books[index]));
    N = refs.length;
    V = N * COPIES;
    stage.replaceChildren();
    tapes = [];
    if (!N) return;
    for (let v = 0; v < V; v++) {
      const index = refs[v % N];
      const book = books[index];
      const el = document.createElement("div");
      el.className = "cs-book";
      el.setAttribute("aria-hidden", "true");
      el.innerHTML = `
        <div class="cs-face cs-spine"><span class="spine-title">${escapeHtml(cleanBookTitle(book.title))}</span></div>
        <div class="cs-face cs-cover"><span class="book-cover${book.originalCover ? " has-original-cover" : ""}">${coverMarkup(book, index)}</span></div>`;
      const t = { el, v, index, spine: el.children[0], cover: el.children[1], lift: 0, r: 0, hidden: false, h: 0 };
      el.addEventListener("pointerenter", () => { hover = v; });
      el.addEventListener("pointerleave", () => { if (hover === v) hover = -1; });
      el.addEventListener("click", () => {
        if (suppressClick) { suppressClick = false; return; }
        if (Math.abs(t.r) < 0.5) openActive();
        else T = Math.round(T + t.r);
      });
      applySize(t);
      applyColors(t);
      stage.append(el);
      tapes.push(t);
    }
    layoutTable();
    if (s === 0 && T === 0) { s = T = N; } // start on the first book, middle copy
    active = -1;
  }

  // Keep in step with the classic shelf: books added, colours refined.
  let syncQueued = false;
  new MutationObserver(() => {
    if (syncQueued) return;
    syncQueued = true;
    requestAnimationFrame(() => {
      syncQueued = false;
      const next = books.map((book, index) => index).filter((index) => isReferenceBook(books[index]));
      if (next.join() !== refs.join()) { build(); measure(); }
      else tapes.forEach(applyColors);
    });
  }).observe(track, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });

  function setActive(i) {
    active = i;
    const index = refs[i];
    setShelfCaption(activeTitle, books[index], referencePosition(index));
    activeNumber.textContent = String(referencePosition(index)).padStart(2, "0");
    setAmbientColor(library, books[index]);
  }

  function centreTape() {
    let best = null;
    for (const t of tapes) if (!best || Math.abs(t.r) < Math.abs(best.r)) best = t;
    return best;
  }

  function openActive() {
    if (!N || api.detailIndex !== null) return;
    // Open the book that is in the middle now, even mid-glide.
    T = Math.round(s);
    s = T;
    const t = centreTape();
    if (!t) return;
    api.setActive(t.index);
    openBookDetail(t.index, { sourceElement: t.cover });
  }

  function step(dir) { T = Math.round(T) + dir; }

  // ---- input ----
  host.addEventListener("wheel", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (api.detailIndex !== null || !N) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    T += (delta / (14 * scale + 42 * scale)) * 0.5;
    clearTimeout(host._wheel);
    host._wheel = setTimeout(() => { T = Math.round(T); }, 160);
  }, { passive: false });

  host.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
    if (api.detailIndex !== null) return;
    downX = event.clientX;
    T0 = T;
    dragging = false;
    suppressClick = false;
  });
  addEventListener("pointermove", (event) => {
    mx = event.clientX;
    my = event.clientY;
    if (downX === null) return;
    const dx = event.clientX - downX;
    if (!dragging && Math.abs(dx) > 5) dragging = true;
    if (dragging) T = T0 - dx / (56 * scale);
  });
  addEventListener("pointerup", () => {
    if (downX === null) return;
    if (dragging) {
      T = Math.round(T);
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
    }
    downX = null;
    dragging = false;
  });

  // Toolbar arrows: take over before app.js's own handlers.
  addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest("#previousBook, #nextBook");
    if (!button || api.detailIndex !== null) return;
    event.stopImmediatePropagation();
    event.preventDefault();
    step(button.id === "nextBook" ? 1 : -1);
  }, true);

  addEventListener("keydown", (event) => {
    if (api.detailIndex !== null || !N) return;
    if (api.overlayOpen()) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest("input, textarea, select, [contenteditable]")) return;
    if (target?.closest("button") && !viewport.contains(target)) return;
    const isSpace = event.code === "Space" || event.key === " ";
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      event.stopImmediatePropagation();
      step(event.key === "ArrowRight" ? 1 : -1);
    } else if ((isSpace || event.key === "Enter") && !event.repeat) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openActive();
    }
  }, true);

  addEventListener("resize", measure);

  // ---- frame loop ----
  let last = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!N) return;

    // While the detail page is open (and stepping through books), keep the
    // shelf on that book so the cover flies back to the right place.
    const inDetail = api.detailIndex !== null && api.detailSourceMode === "shelf";
    if (inDetail) {
      const pos = refs.indexOf(api.detailIndex);
      if (pos >= 0 && mod(Math.round(T), N) !== pos) {
        let d = mod(pos - mod(Math.round(T), N), N);
        if (d > N / 2) d -= N;
        T = Math.round(T) + d;
        s = T;
      }
    }

    const k = dragging ? 18 : 5.2;
    s += (T - s) * (reduced ? 1 : 1 - Math.exp(-k * dt));
    if (Math.abs(T - s) < 1e-4) s = T;
    if (Math.abs(s) > 4 * V) { const shift = Math.round(s / V) * V; s -= shift; T -= shift; }

    const a = mod(Math.round(s), N);
    if (a !== active) setActive(a);

    const box = viewport.getBoundingClientRect();
    const cx = box.left + box.width / 2;
    const centreDims = dims(books[refs[a]]);
    const cy = box.bottom - 6 - centreDims.h / 2;
    const settled = Math.abs(T - s) < 0.3;
    const onCover = !inDetail && settled &&
      Math.abs(mx - cx) < 0.55 * centreDims.cw && Math.abs(my - cy) < 0.55 * centreDims.h;
    host.style.cursor = onCover ? "pointer" : "";

    const ps = Pf(s), es = extraF(s);
    const lim = box.width / 2 + maxCover;
    const le = reduced ? 1 : 1 - Math.exp(-12 * dt);
    for (const t of tapes) {
      const r = mod(t.v - s + V / 2, V) - V / 2;
      t.r = r;
      const x = P(Math.round(s + r)) - ps + es * B(r);
      const liftTarget = hover === t.v && Math.abs(r) > 0.5 && !inDetail ? 1 : 0;
      t.lift += (liftTarget - t.lift) * le;
      if (Math.abs(x) > lim) {
        if (!t.hidden) { t.el.style.visibility = "hidden"; t.hidden = true; }
        continue;
      }
      if (t.hidden) { t.el.style.visibility = ""; t.hidden = false; }
      // Books are deep boxes (the cover is ~0.7× the height), so they have
      // to clear the row before turning or they cut into their neighbours.
      // Closed books sit with their spines on one front plane (z = 0). The
      // middle one first slides straight out (pull), and only turns (o) once
      // it is well clear; fully out, its whole box is in front of the row.
      const near = Math.max(0, 1 - Math.abs(r));
      const pull = sstep(Math.min(1, near * 2));
      const o = sstep(Math.max(0, (near - 0.4) / 0.6));
      const y = -o * 0.02 * maxH - t.lift * 0.045 * maxH;
      const z = -t.cw / 2 + pull * (t.cw + 0.04 * maxH);
      t.el.style.transform =
        `translate3d(${x}px, ${y}px, ${z}px) rotateY(${-90 * o}deg)`;
      t.el.style.zIndex = String(Math.round(100 - Math.abs(r) * 4));
      t.spine.style.setProperty("--shade", (o * 0.55).toFixed(3));
      t.cover.style.setProperty("--shade", ((1 - o) * 0.5).toFixed(3));
      t.el.classList.toggle("is-source", inDetail && Math.abs(r) < 0.5);
    }
  }

  build();
  measure();
  requestAnimationFrame(frame);
}
