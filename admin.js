(() => {
  const $ = (id) => document.getElementById(id);
  const panels = ["loadingPanel", "signInPanel", "deniedPanel", "dashboard"];

  let data = null;
  let sortKey = "created_at";
  let sortDir = "desc";

  function show(id) {
    panels.forEach((panel) => { $(panel).hidden = panel !== id; });
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  const pad = (n) => String(n).padStart(2, "0");

  function formatDate(value, withTime = true) {
    if (!value) return "—";
    const date = new Date(value);
    const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    return withTime ? `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}` : day;
  }

  function relative(value) {
    if (!value) return "";
    const days = Math.floor((Date.now() - new Date(value).getTime()) / 86400000);
    if (days <= 0) return "今天";
    if (days === 1) return "昨天";
    return `${days} 天前`;
  }

  const number = (value) => Number(value || 0).toLocaleString("zh-CN");

  // WeRead covers come in sizes by prefix; ask for the large one.
  function sharpCover(url) {
    const value = String(url || "");
    if (!/^https?:\/\/[^/]*(weread\.qq\.com|myqcloud\.com)\//.test(value)) return value;
    return value.replace(/\/(s|t[0-8])_([^/]+)$/, "/t9_$2").replace(/^http:/, "https:");
  }

  const TOKEN_KEY = "brooke-bookshelf:admin-token";

  function readToken() {
    try { return window.localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; }
  }

  function writeToken(token) {
    try {
      if (token) window.localStorage.setItem(TOKEN_KEY, token);
      else window.localStorage.removeItem(TOKEN_KEY);
    } catch {}
  }

  function functionsUrl() {
    const url = String(window.BROOKE_SUPABASE_URL || "").replace(/\/+$/, "");
    return url ? `${url}/functions/v1/admin-passcode` : "";
  }

  async function callAdmin(payload) {
    const response = await fetch(functionsUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: String(window.BROOKE_SUPABASE_ANON_KEY || "") },
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(new Error(body.error || `admin-passcode ${response.status}`), { code: body.error });
    return body;
  }

  function setGreeting() {
    const now = new Date();
    const hour = now.getHours();
    $("greeting").textContent = `${hour < 11 ? "早上好" : hour < 18 ? "下午好" : "晚上好"} 👋`;
    $("today").textContent = now.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  }

  function showDashboard(overview) {
    data = overview;
    $("headerActions").hidden = false;
    $("signedInAs").textContent = "管理员";
    show("dashboard");
    render();
    renderTraffic();
    window.dispatchEvent(new Event("resize"));
  }

  async function load() {
    const token = readToken();
    if (!token) {
      $("headerActions").hidden = true;
      show("signInPanel");
      $("signInPasscode").focus();
      return;
    }
    show("loadingPanel");
    try {
      showDashboard((await callAdmin({ token })).data);
    } catch (error) {
      if (error.code === "signed_out") {
        writeToken("");
        return load();
      }
      $("deniedText").textContent = `加载失败：${error.message}`;
      show("deniedPanel");
    }
  }

  // ---- Rendering ----

  function render() {
    const t = data.totals || {};
    const conversion = t.visitors_30d ? Math.round((t.new_30d / t.visitors_30d) * 1000) / 10 : null;
    const kpis = [
      ["visit", "今日访客", t.visitors_today, `${number(t.visits_today)} 次访问`],
      ["week", "近 7 天访客", t.visitors_7d, `${number(t.visits_7d)} 次访问`],
      ["users", "注册用户", t.users, `近 7 天新增 ${number(t.new_7d)}`],
      ["rate", "注册转化率", conversion === null ? "—" : `${conversion}%`, "30 天新注册 ÷ 访客"],
    ];
    $("overview").innerHTML = kpis.map(([icon, label, value, note]) => `
      <div class="kpi kpi-${icon}">
        <span class="kpi-icon" aria-hidden="true">${ICONS[icon]}</span>
        <div>
          <small>${label}</small>
          <strong>${typeof value === "number" ? number(value) : escapeHtml(value)}</strong>
          <em>${escapeHtml(note)}</em>
        </div>
      </div>`).join("");

    renderTraffic();
    renderUsage();
    renderUsers();
    renderRank("searchList", (data.top_searches || []).map((row) => [row.query, `${row.times} 次`]), "还没有搜索记录");
    renderRank("referrerList", (data.referrers || []).map((row) => [row.source, `${row.visits} 次`]), "还没有访问记录");
    renderBooks();
    $("generatedAt").textContent = `数据时间：${formatDate(data.generated_at)}${t.first_visit ? ` · 访问统计从 ${formatDate(t.first_visit, false)} 开始` : ""}`;
  }

  const ICONS = {
    visit: '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
    week: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    users: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c1.9.8 3.1 2.5 3.5 5.2"/></svg>',
    rate: '<svg viewBox="0 0 24 24"><path d="M4 19 10 12l4 4 6-8"/><path d="M15 8h5v5"/></svg>',
  };

  function renderTraffic() {
    const days = data.daily || [];
    const max = Math.max(1, ...days.map((d) => Math.max(d.visitors, d.signups)));
    // Draw at the card's real pixel size so labels stay readable, and fill
    // the card's height (it stretches to match the usage card beside it).
    const box = $("trafficChart");
    box.innerHTML = "";
    const width = Math.max(300, Math.round(box.clientWidth || 720));
    const card = box.parentElement.getBoundingClientRect();
    const total = days.reduce((sum, d) => sum + d.visitors, 0);
    const room = Math.round(card.bottom - box.getBoundingClientRect().top - 22 - (total ? 0 : 28));
    const height = window.matchMedia("(max-width: 1180px)").matches ? 240 : Math.max(220, Math.min(420, room));
    const top = 16;
    const bottom = 28;
    const slot = width / Math.max(days.length, 1);
    const barWidth = Math.max(4, Math.min(12, slot * 0.34));
    const y = (value) => height - bottom - ((height - top - bottom) * value) / max;
    const bars = days.map((d, i) => {
      const x = i * slot + (slot - barWidth) / 2;
      const barTop = y(d.visitors);
      return `<rect class="bar-visitors${i === days.length - 1 ? " is-today" : ""}" x="${x.toFixed(1)}" y="${barTop.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${Math.max(0, height - bottom - barTop).toFixed(1)}" rx="${(barWidth / 2).toFixed(1)}"><title>${d.day}：访客 ${d.visitors}，访问 ${d.visits}，注册 ${d.signups}</title></rect>`;
    }).join("");
    // Join neighbouring days only where someone signed up, so the line
    // doesn't run along the baseline and hide the bars.
    const cx = (i) => (i * slot + slot / 2).toFixed(1);
    const segments = days.slice(1).map((d, i) => (d.signups || days[i].signups
      ? `M${cx(i)},${y(days[i].signups).toFixed(1)}L${cx(i + 1)},${y(d.signups).toFixed(1)}`
      : "")).join("");
    const dots = days.map((d, i) => (d.signups
      ? `<circle class="dot-signups" cx="${(i * slot + slot / 2).toFixed(1)}" cy="${y(d.signups).toFixed(1)}" r="4"><title>${d.day}：注册 ${d.signups}</title></circle>`
      : "")).join("");
    const step = width < 520 ? 7 : 5;
    const labels = days.map((d, i) => ((i % step === 0 && days.length - 1 - i >= step / 2) || i === days.length - 1
      ? `<text x="${(i * slot + slot / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle">${d.day.slice(5).replace("-", "/")}</text>`
      : "")).join("");
    const grid = [...new Set([0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f)))].filter(Boolean).map((value) => {
      return `<line x1="0" x2="${width}" y1="${y(value).toFixed(1)}" y2="${y(value).toFixed(1)}"/><text class="axis" x="0" y="${(y(value) - 4).toFixed(1)}">${value}</text>`;
    }).join("");
    $("trafficChart").innerHTML = total || days.some((d) => d.signups)
      ? `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="最近 30 天每天的访客和注册">
          <g class="grid">${grid}</g>
          ${bars}
          <path class="line-signups" d="${segments}" />
          ${dots}
          <g class="labels">${labels}</g>
        </svg>${total ? "" : '<p class="chart-note">访问统计刚开启，之后有人打开网站就会出现柱子。</p>'}`
      : `<p class="empty">访问统计刚刚开启，还没有数据。网站有人访问后这里就会出现。</p>`;
  }

  function renderUsage() {
    const t = data.totals || {};
    const share = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0);
    const rows = [
      ["近 7 天活跃用户", t.active_7d, share(t.active_7d, t.users)],
      ["近 30 天活跃用户", t.active_30d, share(t.active_30d, t.users)],
      ["房间里有书的用户", t.users_with_books, share(t.users_with_books, t.users)],
      ["连接了微信读书", t.weread_connected, share(t.weread_connected, t.users)],
    ];
    $("usageList").innerHTML = rows.map(([label, value, percent]) => `
      <li>
        <div class="usage-row"><span>${label}</span><b>${number(value)}</b></div>
        <div class="meter"><i style="width:${percent}%"></i></div>
        <small>占注册用户 ${percent}%</small>
      </li>`).join("") + `
      <li class="usage-pair">
        <div><small>书架上的书</small><b>${number(t.books)}</b></div>
        <div><small>近 7 天搜索</small><b>${number(t.searches_7d)}</b></div>
      </li>`;
  }

  function filteredUsers() {
    const q = $("userFilter").value.trim().toLowerCase();
    const users = (data?.users || []).filter((u) => !q
      || String(u.email || "").toLowerCase().includes(q)
      || String(u.room_name || "").toLowerCase().includes(q));
    const dir = sortDir === "asc" ? 1 : -1;
    return users.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" || typeof av === "boolean") return (Number(av) - Number(bv)) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }

  function renderUsers() {
    const users = filteredUsers();
    $("userCount").textContent = `${users.length} / ${(data.users || []).length}`;
    document.querySelectorAll("#userTable th[data-sort]").forEach((th) => {
      th.tabIndex = 0;
      if (th.dataset.sort === sortKey) th.setAttribute("aria-sort", sortDir === "asc" ? "ascending" : "descending");
      else th.removeAttribute("aria-sort");
    });
    const body = $("userTable").querySelector("tbody");
    if (!users.length) {
      body.innerHTML = `<tr><td colspan="5" class="empty">${(data.users || []).length ? "没有匹配的用户" : "还没有用户注册"}</td></tr>`;
      return;
    }
    body.innerHTML = users.map((u) => `
      <tr>
        <td>
          <span class="avatar" aria-hidden="true">${escapeHtml(String(u.email || "?").slice(0, 1).toUpperCase())}</span>
          <span class="who"><b>${escapeHtml(u.email)}</b>${u.room_name ? `<small>${escapeHtml(u.room_name)}</small>` : ""}</span>
        </td>
        <td title="${escapeHtml(u.created_at)}">${formatDate(u.created_at, false)}</td>
        <td title="${escapeHtml(u.last_sign_in_at)}">${u.last_sign_in_at ? relative(u.last_sign_in_at) : "—"}</td>
        <td class="num">${u.books}</td>
        <td>${u.weread_connected ? '<span class="pill pill-on">已连接</span>' : '<span class="pill">未连接</span>'}</td>
      </tr>`).join("");
  }

  function renderRank(id, rows, emptyText) {
    const max = Math.max(1, ...rows.map(([, value]) => parseInt(value, 10) || 0));
    $(id).innerHTML = rows.length
      ? rows.map(([label, value]) => `
        <li>
          <span class="rank-label">${escapeHtml(label)}</span>
          <span class="rank-value">${escapeHtml(value)}</span>
          <i style="width:${((parseInt(value, 10) || 0) / max) * 100}%"></i>
        </li>`).join("")
      : `<li class="empty">${emptyText}</li>`;
  }

  function renderBooks() {
    const books = data.top_books || [];
    $("bookList").innerHTML = books.length
      ? books.map((b) => `
        <li>
          <span class="cover">${b.cover ? `<img src="${escapeHtml(sharpCover(b.cover))}" alt="" loading="lazy" />` : `<span>${escapeHtml(String(b.title).slice(0, 2))}</span>`}</span>
          <b>${escapeHtml(b.title)}</b>
          <small>${escapeHtml(b.author || "")}</small>
          <em>${b.savers} 人收藏</em>
        </li>`).join("")
      : '<li class="empty">还没有人收藏书</li>';
  }

  // ---- CSV ----

  function downloadCsv(filename, header, rows) {
    const cell = (v) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = "﻿" + [header, ...rows].map((r) => r.map(cell).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  // ---- Sign-in ----

  let passcodeSlots = null;
  let signingIn = false;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function signIn(passcode) {
    if (signingIn) return;
    signingIn = true;
    const input = $("signInPasscode");
    input.readOnly = true;
    $("signInNote").textContent = "正在验证…";
    let result = null;
    try {
      result = await callAdmin({ passcode });
    } catch (error) {
      passcodeSlots.setStatus("error");
      $("signInNote").textContent = error.code === "wrong_passcode"
        ? "密码不对。"
        : error.code === "locked"
          ? "错误次数太多，请一小时后再试。"
          : `登录失败：${error.message}`;
      // Let the shake play, then empty the slots for another try.
      await wait(700);
      if (passcodeSlots.status === "error") {
        passcodeSlots.clear();
        passcodeSlots.focus();
      }
      input.readOnly = false;
      signingIn = false;
      return;
    }
    writeToken(result.token);
    $("signInNote").textContent = "";
    passcodeSlots.setStatus("success");
    await wait(500);
    passcodeSlots.clear();
    passcodeSlots.setStatus("idle");
    input.readOnly = false;
    signingIn = false;
    showDashboard(result.data);
  }

  // ---- Events ----

  function bindEvents() {
    passcodeSlots = window.CodeSlots($("signInPasscode"), {
      length: Number(window.BROOKE_ADMIN_PASSCODE_LENGTH) || 6,
      onChange: () => {
        passcodeSlots.setStatus("idle");
        $("signInNote").textContent = "";
      },
      onComplete: signIn,
      // Page palette: ink slots on a white card, lime digits once accepted.
      accentColor: "#100e19",
      inkColor: "#100e19",
      slotColor: "#f3f3f5",
      digitColor: "#d8f275",
      dangerColor: "#ff3b30",
      slotSize: 44,
      gap: 8,
      radius: 12,
      bounce: 0.2,
      settle: 0.3,
      rise: 8,
      cascade: 20,
    });

    $("signInForm").addEventListener("submit", (event) => {
      event.preventDefault();
      if (passcodeSlots.value.length === Number(window.BROOKE_ADMIN_PASSCODE_LENGTH || 6)) signIn(passcodeSlots.value);
    });

    $("refreshButton").addEventListener("click", load);
    $("signOutButton").addEventListener("click", () => { writeToken(""); load(); });
    $("userFilter").addEventListener("input", renderUsers);

    document.querySelectorAll("#userTable th[data-sort]").forEach((th) => {
      const sort = () => {
        const key = th.dataset.sort;
        if (sortKey === key) sortDir = sortDir === "asc" ? "desc" : "asc";
        else { sortKey = key; sortDir = key === "email" ? "asc" : "desc"; }
        renderUsers();
      };
      th.addEventListener("click", sort);
      th.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sort(); } });
    });

    $("exportUsers").addEventListener("click", () => downloadCsv(
      `reading-room-users-${formatDate(new Date(), false)}.csv`,
      ["email", "confirmed", "room_name", "created_at", "last_sign_in_at", "books", "from_weread", "weread_connected"],
      filteredUsers().map((u) => [u.email, u.confirmed, u.room_name, u.created_at, u.last_sign_in_at, u.books, u.from_weread, u.weread_connected]),
    ));

    $("exportBooks").addEventListener("click", () => downloadCsv(
      `reading-room-top-books-${formatDate(new Date(), false)}.csv`,
      ["title", "author", "savers"],
      (data?.top_books || []).map((b) => [b.title, b.author, b.savers]),
    ));

    // Highlight the sidebar link for the section in view.
    const links = [...document.querySelectorAll(".nav a")];
    const sections = ["overview", "traffic", "users", "content"];
    // The right-hand pane scrolls on wide screens, the page on phones.
    const main = document.querySelector(".main");
    const highlight = () => {
      let current = sections[0];
      const paneScrolls = main.scrollHeight > main.clientHeight + 1 && getComputedStyle(main).overflowY !== "visible";
      const atBottom = paneScrolls
        ? main.scrollTop + main.clientHeight >= main.scrollHeight - 4
        : window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      const top = paneScrolls ? main.getBoundingClientRect().top : 0;
      const line = top + (paneScrolls ? main.clientHeight : window.innerHeight) * 0.35;
      sections.forEach((id) => { if ($(id).getBoundingClientRect().top < line) current = id; });
      if ((paneScrolls ? main.scrollTop : window.scrollY) < 40) current = sections[0];
      if (atBottom) current = sections[sections.length - 1];
      if ($("dashboard").hidden) current = sections[0];
      links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`));
    };
    window.addEventListener("scroll", highlight, { passive: true });
    main.addEventListener("scroll", highlight, { passive: true });
    window.addEventListener("resize", highlight);
    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if (data && !$("dashboard").hidden) renderTraffic(); }, 150);
    });
    highlight();
  }

  document.addEventListener("DOMContentLoaded", () => {
    setGreeting();
    if (!functionsUrl()) {
      $("deniedText").textContent = "没有找到 Supabase 配置（config.js）。";
      show("deniedPanel");
      return;
    }
    bindEvents();
    load();
  });
})();
