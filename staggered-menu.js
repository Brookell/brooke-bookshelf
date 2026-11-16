// StaggeredMenu: a side menu that opens behind a cascade of coloured layers,
// then lifts its items into place one by one.
// Vanilla port of staggered-menu/StaggeredMenu.jsx for pages without React.
//
//   const menu = StaggeredMenu(hostEl, {
//     items: [{ label, ariaLabel, onSelect, isCurrent, isHidden }],   // label may be a function
//     footer: [{ label, onSelect, isHidden }],               // small links at the bottom
//     title, position: "right" | "left", colors, panelColor, displayItemNumbering,
//     toggleLabels: ["菜单", "关闭"], closeOnClickAway, onMenuOpen, onMenuClose,
//   });
//   menu.open(); menu.close(); menu.toggle(); menu.refresh(); menu.isOpen;
//
// Motion is all CSS transitions; prefers-reduced-motion turns it off.
(() => {
  const STYLE = `
.sm-root{position:absolute;inset:0;z-index:150;pointer-events:none;overflow:hidden;--sm-ease-in:cubic-bezier(.22,1,.36,1);--sm-ease-out:cubic-bezier(.65,0,.35,1)}
.sm-root *,.sm-root *::before,.sm-root *::after{box-sizing:border-box}
.sm-toggle{position:absolute;z-index:3;top:max(28px,env(safe-area-inset-top));display:inline-flex;align-items:center;gap:8px;
  min-height:28px;padding:0 0 4px;border:0;background:none;cursor:pointer;pointer-events:auto;
  font:600 11px/1 Arial,Helvetica,"Songti SC","STSong",serif;-webkit-tap-highlight-color:transparent;
  transition:color .3s ease}
.sm-root[data-position="right"] .sm-toggle{right:max(24px,env(safe-area-inset-right))}
.sm-root[data-position="left"] .sm-toggle{left:max(24px,env(safe-area-inset-left))}
.sm-toggle-text{display:block;height:1em;overflow:hidden}
.sm-toggle-lines{display:flex;flex-direction:column;transition:transform .5s var(--sm-ease-in)}
.sm-toggle-lines span{display:block;height:1em}
.sm-root.is-open .sm-toggle-lines{transform:translateY(-50%)}
.sm-icon{position:relative;width:10px;height:10px;transition:transform .35s ease}
.sm-root.is-open .sm-icon{transform:rotate(225deg);transition:transform .8s var(--sm-ease-in)}
.sm-icon i{position:absolute;top:50%;left:0;width:100%;height:1px;background:currentColor}
.sm-icon i:last-child{transform:rotate(90deg)}
.sm-layer,.sm-panel{position:absolute;top:0;bottom:0;width:clamp(300px,36vw,440px);visibility:hidden;
  will-change:transform;backface-visibility:hidden;contain:layout paint;
  transition:transform .46s var(--sm-ease-out) calc(var(--d,0) * 1ms),visibility 0s calc(460ms + var(--d,0) * 1ms)}
.sm-root[data-position="right"] .sm-layer,.sm-root[data-position="right"] .sm-panel{right:0;transform:translate3d(100%,0,0)}
.sm-root[data-position="left"] .sm-layer,.sm-root[data-position="left"] .sm-panel{left:0;transform:translate3d(-100%,0,0)}
.sm-root.is-open .sm-layer,.sm-root.is-open .sm-panel{visibility:visible;transform:translate3d(0,0,0);
  transition:transform .78s var(--sm-ease-in) calc(var(--o,0) * 1ms),visibility 0s}
.sm-layer{z-index:1}
.sm-panel{z-index:2;display:flex;flex-direction:column;overflow-y:auto;pointer-events:auto;
  padding:max(88px,calc(env(safe-area-inset-top) + 72px)) clamp(28px,4vw,48px) max(32px,env(safe-area-inset-bottom))}
@media (max-width:640px){.sm-layer,.sm-panel{width:100%}}
.sm-title{margin:0 0 28px;font:10px/1 "Courier New",monospace;text-transform:uppercase;opacity:.6}
.sm-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.sm-list li{overflow:hidden;padding-bottom:.08em}
.sm-item{position:relative;display:inline-flex;align-items:flex-start;gap:10px;padding:0;border:0;background:none;color:inherit;
  cursor:pointer;text-align:left}
.sm-item-label{display:block;transform:translate3d(0,120%,0) rotate(6deg);transform-origin:0 50%;will-change:transform;
  font:600 clamp(20px,2vw,24px)/1.5 "Songti SC","STSong","Noto Serif CJK SC",serif;letter-spacing:.06em;
  transition:transform 0s .5s,opacity .2s ease}
.sm-root.is-open .sm-item-label{transform:translate3d(0,0,0);transition:transform .9s var(--sm-ease-in) calc(var(--o,0) * 1ms),opacity .2s ease}
.sm-item-num{margin-top:.5em;font:10px/1 "Courier New",monospace;opacity:0;transition:opacity 0s .5s}
.sm-root.is-open .sm-item-num{opacity:.55;transition:opacity .6s ease calc(var(--o,0) * 1ms + 100ms)}
.sm-list:hover .sm-item-label{opacity:.35}
.sm-list .sm-item:hover .sm-item-label,.sm-list .sm-item:focus-visible .sm-item-label{opacity:1}
.sm-item[aria-current="true"] .sm-item-label{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:.18em}
.sm-item[aria-current="true"] .sm-item-num{opacity:1}
.sm-item:focus-visible{outline:2px solid #1657d8;outline-offset:4px}
.sm-footer{margin-top:auto;padding-top:40px;display:flex;flex-wrap:wrap;gap:20px;opacity:0;transform:translateY(16px);
  transition:opacity 0s .5s,transform 0s .5s}
.sm-root.is-open .sm-footer{opacity:1;transform:none;transition:opacity .5s ease calc(var(--o,0) * 1ms),transform .55s var(--sm-ease-in) calc(var(--o,0) * 1ms)}
.sm-footer button{padding:0 0 4px;border:0;border-bottom:1px solid transparent;background:none;color:inherit;cursor:pointer;
  font:600 12px/1 Arial,Helvetica,"Songti SC","STSong",serif;transition:border-color .18s ease}
.sm-footer button:hover,.sm-footer button:focus-visible{border-bottom-color:currentColor}
@media (prefers-reduced-motion:reduce){.sm-root *{transition-duration:0s!important;transition-delay:0s!important}}
`;

  function injectStyle() {
    if (document.getElementById("sm-style")) return;
    const style = document.createElement("style");
    style.id = "sm-style";
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  const read = (value) => (typeof value === "function" ? value() : value);

  function StaggeredMenu(host, options = {}) {
    const {
      items = [],
      footer = [],
      title = "",
      position = "right",
      colors = ["#d9d5ce", "#151515"],
      panelColor = "#eeece8",
      panelInk = "#151515",
      displayItemNumbering = true,
      toggleLabels = ["Menu", "Close"],
      closeOnClickAway = true,
      onMenuOpen,
      onMenuClose,
    } = options;
    injectStyle();

    const root = document.createElement("div");
    root.className = "sm-root";
    root.dataset.position = position;

    const panelId = `sm-panel-${Math.random().toString(36).slice(2, 8)}`;
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "sm-toggle";
    toggle.setAttribute("aria-controls", panelId);
    toggle.innerHTML =
      '<span class="sm-toggle-text" aria-hidden="true"><span class="sm-toggle-lines"><span></span><span></span></span></span>' +
      '<span class="sm-icon" aria-hidden="true"><i></i><i></i></span>';
    const [openText, closeText] = toggle.querySelectorAll(".sm-toggle-lines span");
    openText.textContent = toggleLabels[0];
    closeText.textContent = toggleLabels[1];

    // Timing, in ms: layers sweep in 70ms apart, the panel follows, items rise 90ms apart.
    const layerGap = 90;
    const panelAt = colors.length * layerGap + 40;
    colors.forEach((color, i) => {
      const layer = document.createElement("div");
      layer.className = "sm-layer";
      layer.setAttribute("aria-hidden", "true");
      layer.style.background = color;
      layer.style.setProperty("--o", i * layerGap);
      layer.style.setProperty("--d", (colors.length - i) * 40); // closing: front layers leave first
      root.appendChild(layer);
    });

    const panel = document.createElement("nav");
    panel.className = "sm-panel";
    panel.id = panelId;
    panel.setAttribute("aria-label", title || toggleLabels[0]);
    panel.style.background = panelColor;
    panel.style.color = panelInk;
    panel.style.setProperty("--o", panelAt);
    panel.style.setProperty("--d", 0);

    if (title) {
      const heading = document.createElement("p");
      heading.className = "sm-title";
      heading.textContent = title;
      panel.appendChild(heading);
    }

    const list = document.createElement("ul");
    list.className = "sm-list";
    const itemButtons = items.map((item, i) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sm-item";
      button.style.setProperty("--o", panelAt + 180 + i * 60);
      const label = document.createElement("span");
      label.className = "sm-item-label";
      button.appendChild(label);
      if (displayItemNumbering) {
        const num = document.createElement("span");
        num.className = "sm-item-num";
        num.setAttribute("aria-hidden", "true");
        num.textContent = String(i + 1).padStart(2, "0");
        button.appendChild(num);
      }
      button.addEventListener("click", () => select(item));
      li.appendChild(button);
      list.appendChild(li);
      return { item, button, label, li };
    });
    panel.appendChild(list);

    let footerButtons = [];
    if (footer.length) {
      const foot = document.createElement("div");
      foot.className = "sm-footer";
      foot.style.setProperty("--o", panelAt + 300 + items.length * 60);
      footerButtons = footer.map((entry) => {
        const button = document.createElement("button");
        button.type = "button";
        button.addEventListener("click", () => select(entry));
        foot.appendChild(button);
        return { item: entry, button };
      });
      panel.appendChild(foot);
    }

    root.append(toggle, panel);
    host.appendChild(root);

    let isOpen = false;

    function refresh() {
      itemButtons.forEach(({ item, button, label, li }) => {
        li.hidden = Boolean(read(item.isHidden));
        const text = read(item.label);
        label.textContent = text;
        button.setAttribute("aria-label", read(item.ariaLabel) || text);
        if (read(item.isCurrent)) button.setAttribute("aria-current", "true");
        else button.removeAttribute("aria-current");
      });
      footerButtons.forEach(({ item, button }) => {
        button.textContent = read(item.label);
        button.hidden = Boolean(read(item.isHidden));
      });
    }

    function setOpen(next, { focus = false } = {}) {
      if (next === isOpen) return;
      isOpen = next;
      if (isOpen) refresh();
      // Lay out the refreshed text first, so the first frames of the slide are not spent on layout.
      void root.offsetWidth;
      root.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? toggleLabels[1] : toggleLabels[0]);
      panel.inert = !isOpen;
      panel.setAttribute("aria-hidden", String(!isOpen));
      if (isOpen && focus) {
        // Wait for the panel to be visible before moving focus into it.
        window.setTimeout(() => itemButtons.find(({ li }) => !li.hidden)?.button.focus({ preventScroll: true }), 60);
      }
      (isOpen ? onMenuOpen : onMenuClose)?.();
    }

    function select(item) {
      setOpen(false);
      item.onSelect?.();
    }

    toggle.addEventListener("click", (event) => setOpen(!isOpen, { focus: event.detail === 0 }));

    // While open the menu owns the keyboard: Escape closes it, and no other
    // key reaches the page's own shortcuts (arrow keys, Space on the shelf).
    window.addEventListener("keydown", (event) => {
      if (!isOpen) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggle.focus({ preventScroll: true });
      }
      if (event.key !== "Tab") event.stopPropagation();
    }, true);

    document.addEventListener("pointerdown", (event) => {
      if (!isOpen || !closeOnClickAway) return;
      if (panel.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });

    panel.inert = true;
    panel.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", toggleLabels[0]);
    refresh();

    return {
      el: root,
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen(!isOpen),
      refresh,
      get isOpen() {
        return isOpen;
      },
    };
  }

  window.StaggeredMenu = StaggeredMenu;
})();
