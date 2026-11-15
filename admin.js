(() => {
  const $ = (id) => document.getElementById(id);
  const panels = ["loadingPanel", "signInPanel", "deniedPanel", "dashboard"];
  const STATUS_LABELS = { want_to_read: "想读", reading: "在读", finished: "读完" };
  const SOURCE_LABELS = { weread: "微信读书", manual: "搜索添加", brooke: "Brooke 书架" };

  let client = null;
  let data = null;
  let sortKey = "created_at";
  let sortDir = "desc";

  function show(id) {
    panels.forEach((panel) => { $(panel).hidden = panel !== id; });
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function formatDate(value, withTime = true) {
    if (!value) return "—";
    const date = new Date(value);
    const pad = (n) => String(n).padStart(2, "0");
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

  function createClient() {
    const url = String(window.BROOKE_SUPABASE_URL || "").replace(/\/+$/, "");
    const key = String(window.BROOKE_SUPABASE_ANON_KEY || "").trim();
    if (!url || !key || !window.supabase?.createClient) return null;
    return window.supabase.createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }

  async function load() {
    show("loadingPanel");
    const { data: sessionData } = await client.auth.getSession();
    const session = sessionData?.session;
    if (!session) {
      $("headerActions").hidden = true;
      show("signInPanel");
      return;
    }
    $("headerActions").hidden = false;
    $("signedInAs").textContent = session.user.email || "";

    const { data: overview, error } = await client.rpc("admin_overview");
    if (error) {
      $("deniedText").textContent = error.code === "42501"
        ? `${session.user.email} 不是管理员账号。`
        : `加载失败：${error.message}`;
      show("deniedPanel");
      return;
    }
    data = overview;
    render();
    show("dashboard");
  }

  function render() {
    const t = data.totals;
    const pct = (part, whole) => (whole ? `${Math.round((part / whole) * 100)}%` : "—");
    const tiles = [
      ["总用户", t.users, `已验证邮箱 ${t.confirmed_users}`],
      ["近 7 天新增", t.new_7d, ""],
      ["近 7 天活跃", t.active_7d, `占 ${pct(t.active_7d, t.users)}`],
      ["近 30 天活跃", t.active_30d, `占 ${pct(t.active_30d, t.users)}`],
      ["有书的用户", t.users_with_books, `占 ${pct(t.users_with_books, t.users)}`],
      ["书架上的书", t.books, t.users_with_books ? `人均 ${(t.books / t.users_with_books).toFixed(1)} 本` : ""],
    ];
    $("stats").innerHTML = tiles.map(([label, value, sub]) => `
      <div class="stat">
        <div class="stat-label">${label}</div>
        <div class="stat-value">${Number(value || 0).toLocaleString()}</div>
        <div class="stat-sub">${sub || "&nbsp;"}</div>
      </div>`).join("");

    renderChart();
    renderUsers();
    renderBooks();
    renderBars("sourceList", (data.sources || []).map((s) => [SOURCE_LABELS[s.source] || s.source, s.books]));
    renderBars("statusList", Object.keys(STATUS_LABELS).map((k) => [STATUS_LABELS[k], t[k] || 0]));
    $("generatedAt").textContent = `数据时间：${formatDate(data.generated_at)}`;
  }

  function renderChart() {
    const days = data.signups_daily || [];
    const total = days.reduce((sum, d) => sum + d.signups, 0);
    $("trendSummary").textContent = `共 ${total} 人注册`;
    const max = Math.max(1, ...days.map((d) => d.signups));
    const w = 900;
    const h = 140;
    const top = 18;
    const bottom = 1;
    const slot = w / Math.max(days.length, 1);
    const barW = Math.max(1, slot - 2);
    const bars = days.map((d, i) => {
      const bh = ((h - top - bottom) * d.signups) / max;
      const y = h - bottom - bh;
      return `<rect class="bar" x="${(i * slot + 1).toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(bh, d.signups ? 1 : 0).toFixed(1)}"><title>${d.day}：${d.signups} 人</title></rect>`;
    }).join("");
    const marks = days.filter((d, i) => i % 15 === 0 || i === days.length - 1);
    $("signupChart").innerHTML = `
      <div class="chart-max">${max}</div>
      <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="最近 90 天每日注册人数">
        <line class="baseline" x1="0" x2="${w}" y1="${h - bottom}" y2="${h - bottom}" vector-effect="non-scaling-stroke" />
        ${bars}
      </svg>
      <div class="chart-axis">${marks.map((d) => `<span>${d.day.slice(5)}</span>`).join("")}</div>`;
  }

  function filteredUsers() {
    const q = $("userFilter").value.trim().toLowerCase();
    const users = (data.users || []).filter((u) => !q
      || String(u.email || "").toLowerCase().includes(q)
      || String(u.room_name || "").toLowerCase().includes(q));
    const dir = sortDir === "asc" ? 1 : -1;
    return users.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return (typeof av === "number" ? av - bv : String(av).localeCompare(String(bv))) * dir;
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
      body.innerHTML = `<tr><td colspan="9" class="empty">${(data.users || []).length ? "没有匹配的用户" : "还没有用户注册"}</td></tr>`;
      return;
    }
    body.innerHTML = users.map((u) => `
      <tr>
        <td>${escapeHtml(u.email)}${u.confirmed ? "" : '<span class="badge">未验证</span>'}</td>
        <td>${escapeHtml(u.room_name || "—")}</td>
        <td title="${escapeHtml(u.created_at)}">${formatDate(u.created_at)}</td>
        <td title="${escapeHtml(u.last_sign_in_at)}">${formatDate(u.last_sign_in_at)} <span class="muted">${relative(u.last_sign_in_at)}</span></td>
        <td class="num">${u.books}</td>
        <td class="num">${u.want_to_read}</td>
        <td class="num">${u.reading}</td>
        <td class="num">${u.finished}</td>
        <td class="num">${u.from_weread}</td>
      </tr>`).join("");
  }

  function renderBooks() {
    const books = data.top_books || [];
    const body = $("bookTable").querySelector("tbody");
    body.innerHTML = books.length
      ? books.map((b) => `
        <tr>
          <td>${escapeHtml(b.title)}</td>
          <td>${escapeHtml(b.author || "—")}</td>
          <td class="num">${b.savers}</td>
          <td class="num">${b.finished}</td>
        </tr>`).join("")
      : '<tr><td colspan="4" class="empty">还没有人收藏书</td></tr>';
  }

  function renderBars(id, rows) {
    const max = Math.max(1, ...rows.map(([, v]) => v));
    $(id).innerHTML = rows.length
      ? rows.map(([label, value]) => `
        <div class="bar-row">
          <span>${escapeHtml(label)}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${(value / max) * 100}%"></div></div>
          <span class="bar-value">${value}</span>
        </div>`).join("")
      : '<p class="muted">暂无数据</p>';
  }

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

  function stamp() {
    return formatDate(new Date(), false);
  }

  function bindEvents() {
    $("signInForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = event.target.querySelector("button");
      button.disabled = true;
      $("signInNote").textContent = "正在发送…";
      const { error } = await client.auth.signInWithOtp({
        email: $("signInEmail").value.trim(),
        options: { emailRedirectTo: window.location.href.split("#")[0], shouldCreateUser: false },
      });
      button.disabled = false;
      if (!error) $("signInNote").textContent = "登录链接已发送，请在这台设备上打开邮件里的链接。";
      else if (/signups? not allowed/i.test(error.message)) $("signInNote").textContent = "这个邮箱还没有账号。请先在主页注册登录一次，再回来这里。";
      else $("signInNote").textContent = `发送失败：${error.message}`;
    });

    $("refreshButton").addEventListener("click", load);
    $("signOutButton").addEventListener("click", async () => {
      await client.auth.signOut();
    });
    $("userFilter").addEventListener("input", renderUsers);

    document.querySelectorAll("#userTable th[data-sort]").forEach((th) => {
      const sort = () => {
        const key = th.dataset.sort;
        if (sortKey === key) sortDir = sortDir === "asc" ? "desc" : "asc";
        else { sortKey = key; sortDir = ["email", "room_name"].includes(key) ? "asc" : "desc"; }
        renderUsers();
      };
      th.addEventListener("click", sort);
      th.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sort(); } });
    });

    $("exportUsers").addEventListener("click", () => downloadCsv(
      `reading-room-users-${stamp()}.csv`,
      ["email", "confirmed", "room_name", "created_at", "last_sign_in_at", "books", "want_to_read", "reading", "finished", "from_weread", "last_shelf_update"],
      filteredUsers().map((u) => [u.email, u.confirmed, u.room_name, u.created_at, u.last_sign_in_at, u.books, u.want_to_read, u.reading, u.finished, u.from_weread, u.last_shelf_update]),
    ));

    $("exportBooks").addEventListener("click", () => downloadCsv(
      `reading-room-top-books-${stamp()}.csv`,
      ["title", "author", "savers", "finished"],
      (data.top_books || []).map((b) => [b.title, b.author, b.savers, b.finished]),
    ));
  }

  document.addEventListener("DOMContentLoaded", () => {
    client = createClient();
    if (!client) {
      $("deniedText").textContent = "没有找到 Supabase 配置（config.js）。";
      show("deniedPanel");
      return;
    }
    bindEvents();
    client.auth.onAuthStateChange((event) => {
      if (["INITIAL_SESSION", "SIGNED_IN", "SIGNED_OUT"].includes(event)) setTimeout(load, 0);
    });
  });
})();
