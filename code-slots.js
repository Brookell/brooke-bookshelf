// CodeSlots: turns a text/password <input> into a row of digit slots.
// Vanilla port of code-slots/CodeSlots.jsx for pages without React.
//
//   const slots = CodeSlots(inputEl, { length: 6, onChange, onComplete, ... });
//   slots.setStatus("idle" | "success" | "error");
//   slots.clear(); slots.focus(); slots.value;
//
// The original <input> stays in the DOM (invisible, on top of the slots), so
// typing, pasting, one-time-code autofill and password managers all keep working.
(() => {
  const STYLE = `
.cs-root{position:relative;display:inline-flex;cursor:text;-webkit-tap-highlight-color:transparent;max-width:100%}
.cs-root>.cs-input{position:absolute;inset:0;width:100%;height:100%;opacity:0;border:0;padding:0;margin:0;
  font-size:16px;color:transparent;caret-color:transparent;background:transparent;outline:none;z-index:1;border-radius:0}
.cs-root>.cs-input:disabled{cursor:default}
.cs-row{display:flex}
.cs-slot{position:relative;display:grid;place-items:center;box-sizing:border-box;flex:0 1 auto;
  font:600 calc(var(--cs-size) * .45)/1 ui-monospace,SFMono-Regular,Menlo,monospace;
  font-variant-numeric:tabular-nums;user-select:none;
  transition:background-color .22s ease,border-color .18s ease,color .22s ease,box-shadow .18s ease}
.cs-digit{display:block;will-change:transform,opacity}
.cs-dot{width:calc(var(--cs-size) * .22);height:calc(var(--cs-size) * .22);border-radius:50%;background:currentColor}
.cs-caret{position:absolute;width:2px;height:40%;border-radius:1px;animation:cs-blink 1.05s steps(1) infinite}
@keyframes cs-blink{0%,55%{opacity:1}56%,100%{opacity:0}}
@media (prefers-reduced-motion: reduce){.cs-caret{animation:none}}
`;

  function injectStyle() {
    if (document.getElementById("cs-style")) return;
    const style = document.createElement("style");
    style.id = "cs-style";
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  // A CSS linear() easing sampled from a damped spring that settles by t = 1.
  function springEasing(bounce) {
    if (!(window.CSS && CSS.supports && CSS.supports("transition-timing-function", "linear(0, 1)"))) {
      return "cubic-bezier(.2,.9,.3,1.15)";
    }
    const zeta = 1 - Math.min(Math.max(bounce, 0), 0.9);
    const omega = 8 / zeta;
    const points = [];
    for (let i = 0; i <= 48; i += 1) {
      const t = i / 48;
      let x;
      if (zeta >= 1) {
        x = 1 - (1 + omega * t) * Math.exp(-omega * t);
      } else {
        const wd = omega * Math.sqrt(1 - zeta * zeta);
        x = 1 - Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + ((zeta * omega) / wd) * Math.sin(wd * t));
      }
      points.push(i === 48 ? 1 : +x.toFixed(4));
    }
    return `linear(${points.join(", ")})`;
  }

  const reducedMotion = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function CodeSlots(input, options = {}) {
    const o = {
      length: 6,
      mask: input.type === "password",
      accentColor: "#f5f5f5",
      inkColor: "#f5f5f5",
      slotColor: "#27272a",
      digitColor: "#18181b",
      dangerColor: "#ff3b30",
      slotSize: 44,
      gap: 8,
      radius: 12,
      bounce: 0.2,
      settle: 0.3,
      rise: 8,
      cascade: 20,
      onChange: null,
      onComplete: null,
      ...options,
    };
    injectStyle();

    const easing = springEasing(o.bounce);
    const duration = Math.max(o.settle, 0) * 1000;

    const root = document.createElement("div");
    root.className = "cs-root";
    root.style.setProperty("--cs-size", `${o.slotSize}px`);
    input.parentNode.insertBefore(root, input);
    root.appendChild(input);
    input.classList.add("cs-input");
    input.maxLength = o.length;
    input.inputMode = "numeric";
    input.setAttribute("pattern", "\\d*");
    if (!input.getAttribute("aria-label") && !input.labels?.length) {
      input.setAttribute("aria-label", `${o.length} 位数字`);
    }

    const row = document.createElement("div");
    row.className = "cs-row";
    row.style.gap = `${o.gap}px`;
    row.setAttribute("aria-hidden", "true");
    root.appendChild(row);

    const slots = Array.from({ length: o.length }, () => {
      const slot = document.createElement("div");
      slot.className = "cs-slot";
      Object.assign(slot.style, { width: `${o.slotSize}px`, height: `${o.slotSize}px`, borderRadius: `${o.radius}px` });
      row.appendChild(slot);
      return slot;
    });

    let value = "";
    let shown = [];
    let status = "idle";
    let focused = false;

    function render(animateFrom = Infinity) {
      const locked = input.disabled;
      const active = focused && !locked ? Math.min(value.length, o.length - 1) : -1;
      slots.forEach((slot, i) => {
        const ch = value[i] || "";
        const isActive = i === active;
        let border = "transparent";
        if (status === "error") border = o.dangerColor;
        else if (isActive) border = o.accentColor;
        Object.assign(slot.style, {
          border: `1.5px solid ${border}`,
          background: status === "success" ? o.accentColor : o.slotColor,
          color: status === "success" ? o.digitColor : o.inkColor,
          boxShadow: isActive && status !== "error" ? `0 0 0 3px ${o.accentColor}26` : "none",
          transitionDelay: status === "idle" ? "0ms" : `${i * o.cascade}ms`,
        });

        const key = ch ? `d${ch}` : isActive ? "caret" : "";
        if (shown[i] === key) return;
        shown[i] = key;
        slot.textContent = "";
        if (ch) {
          const digit = document.createElement("span");
          digit.className = o.mask ? "cs-digit cs-dot" : "cs-digit";
          if (!o.mask) digit.textContent = ch;
          slot.appendChild(digit);
          if (i >= animateFrom && !reducedMotion()) {
            digit.animate(
              [{ transform: `translateY(${o.rise}px)`, opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
              { duration, easing, delay: (i - animateFrom) * o.cascade, fill: "backwards" },
            );
          }
        } else if (isActive) {
          const caret = document.createElement("span");
          caret.className = "cs-caret";
          caret.style.background = o.accentColor;
          slot.appendChild(caret);
        }
      });
    }

    function commit() {
      const next = input.value.replace(/\D/g, "").slice(0, o.length);
      if (input.value !== next) input.value = next;
      if (next === value) return;
      const prev = value;
      let start = 0;
      while (start < prev.length && prev[start] === next[start]) start += 1;
      // A changed digit at `start` must be redrawn even if the slot looked filled.
      for (let i = start; i < o.length; i += 1) shown[i] = undefined;
      value = next;
      render(start);
      o.onChange?.(next);
      if (next.length === o.length && prev.length !== o.length) o.onComplete?.(next);
    }

    // Keep the caret at the end so typing always appends.
    function pinCaret() {
      const end = input.value.length;
      try {
        if (input.selectionStart !== end || input.selectionEnd !== end) input.setSelectionRange(end, end);
      } catch {}
    }

    input.addEventListener("input", commit);
    input.addEventListener("focus", () => { focused = true; pinCaret(); render(); });
    input.addEventListener("blur", () => { focused = false; render(); });
    input.addEventListener("select", pinCaret);
    root.addEventListener("mousedown", (event) => {
      if (event.target !== input) {
        event.preventDefault();
        input.focus();
      }
    });

    function setStatus(next) {
      if (next === status) return;
      status = next;
      if (status === "success") {
        input.disabled = true;
        input.blur();
      } else {
        input.disabled = false;
      }
      render();
      if (reducedMotion()) return;
      if (status === "success") {
        slots.forEach((slot, i) => slot.animate(
          [{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }],
          { duration: duration + 120, easing: "ease-out", delay: i * o.cascade },
        ));
      } else if (status === "error") {
        const d = Math.max(4, o.gap);
        row.animate(
          [0, -d, d, -d * 0.6, d * 0.6, -d * 0.25, 0].map((x) => ({ transform: `translateX(${x}px)` })),
          { duration: 360, easing: "ease-out" },
        );
      }
    }

    // Reading `value` before the first input event still reflects autofill.
    input.value && commit();
    render();

    return {
      root,
      get value() { return value; },
      get status() { return status; },
      setStatus,
      clear() {
        input.value = "";
        value = "";
        shown = [];
        render();
      },
      focus() { input.focus(); },
    };
  }

  window.CodeSlots = CodeSlots;
})();
