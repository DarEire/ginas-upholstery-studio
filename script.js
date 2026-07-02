/* Gina's Upholstery Studio
   Hero canvas adapted from forever-ai-components (isas1/forever-ai-components):
   - infinite/morris/03-growing-vine.html
   Zero dependencies. Preserves the original's reduced-motion guard,
   visibilitychange pause/start and DPR-aware canvas fitting. */

(function () {
  "use strict";

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function fitCanvas(c) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = c.getBoundingClientRect();
    var w = Math.max(2, r.width), h = Math.max(2, r.height);
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    var ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h, dpr: dpr };
  }

  /* Runs a draw loop that pauses when the tab is hidden or the canvas
     scrolls out of view, and draws a single static frame under
     prefers-reduced-motion. */
  function runLoop(canvas, draw) {
    var raf = 0, running = false, inView = true, last = performance.now();

    function loop() {
      if (!running) return;
      var now = performance.now();
      draw(Math.min(0.05, (now - last) / 1000), now);
      last = now;
      raf = requestAnimationFrame(loop);
    }
    function start() {
      if (running || REDUCED || !inView || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) start(); else stop();
      }, { threshold: 0.02 }).observe(canvas);
    }
    if (REDUCED) draw(0, performance.now()); else start();
    return { start: start, stop: stop };
  }

  /* ============================================================
     Hero — The Growing Vine (after morris/03)
     ============================================================ */
  (function () {
    var cv = document.getElementById("vineCanvas");
    if (!cv) return;
    var PAL = { ground: "#16283d", olive: "#6b7233", madder: "#a8392b", sage: "#7d9b6a", gold: "#c2a14a", ink: "#23301f" };
    var S = fitCanvas(cv);
    var grow = 0, dir = 1;

    function vine(ctx, x, y, ang, len, depth, prog) {
      if (depth <= 0 || len < 6) return;
      var local = Math.max(0, Math.min(1, prog * depth * 0.55));
      if (local <= 0) return;
      var ex = x + Math.cos(ang) * len * local, ey = y + Math.sin(ang) * len * local;
      ctx.beginPath();
      ctx.moveTo(x, y);
      var mx = x + Math.cos(ang) * len * local * 0.5 + Math.cos(ang + 1.5) * len * 0.12;
      var my = y + Math.sin(ang) * len * local * 0.5 + Math.sin(ang + 1.5) * len * 0.12;
      ctx.quadraticCurveTo(mx, my, ex, ey);
      ctx.strokeStyle = PAL.sage;
      ctx.lineWidth = Math.max(1.2, depth * 0.9);
      ctx.lineCap = "round";
      ctx.stroke();
      if (local > 0.6) {
        ctx.save(); ctx.translate(ex, ey); ctx.rotate(ang + 1.3);
        var ls = (local - 0.6) / 0.4 * (5 + depth * 2);
        ctx.scale(ls / 9, ls / 9);
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.bezierCurveTo(7, -4, 9, -13, 3, -20);
        ctx.bezierCurveTo(1, -15, -2, -17, -7, -11);
        ctx.bezierCurveTo(-4, -6, -5, -3, 0, 0);
        ctx.closePath();
        ctx.fillStyle = PAL.olive; ctx.fill();
        ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.4; ctx.stroke();
        ctx.restore();
      }
      if (local >= 1) {
        var nl = len * 0.74, spread = 0.55 + 0.08 * depth;
        vine(ctx, ex, ey, ang - spread, nl, depth - 1, prog);
        vine(ctx, ex, ey, ang + spread, nl, depth - 1, prog);
        if (depth <= 2) {
          ctx.save(); ctx.translate(ex, ey);
          for (var i = 0; i < 5; i++) {
            ctx.rotate(Math.PI * 2 / 5);
            ctx.beginPath(); ctx.ellipse(0, -6, 3, 5, 0, 0, 7);
            ctx.fillStyle = PAL.madder; ctx.fill();
            ctx.strokeStyle = PAL.ink; ctx.lineWidth = 0.8; ctx.stroke();
          }
          ctx.beginPath(); ctx.arc(0, 0, 3, 0, 7);
          ctx.fillStyle = PAL.gold; ctx.fill();
          ctx.restore();
        }
      }
    }

    function draw(dt) {
      if (!REDUCED) {
        grow += dt * 0.22 * dir;
        if (grow >= 1.3) { grow = 1.3; dir = -1; }
        if (grow <= 0) { grow = 0; dir = 1; }
      } else {
        grow = 1;
      }
      var ctx = S.ctx;
      ctx.fillStyle = PAL.ground;
      ctx.fillRect(0, 0, S.w, S.h);
      ctx.strokeStyle = "rgba(125,155,106,.08)";
      ctx.lineWidth = 1;
      for (var gx = 0; gx < S.w; gx += 40) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, S.h); ctx.stroke();
      }
      var baseY = S.h - 8, prog = Math.min(1, grow);
      vine(ctx, S.w * 0.5, baseY, -Math.PI / 2, S.h * 0.34, 5, prog);
      vine(ctx, S.w * 0.5, baseY, -Math.PI / 2 - 0.0001, S.h * 0.34, 5, prog * 0.96);
    }

    runLoop(cv, draw);
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { S = fitCanvas(cv); if (REDUCED) draw(0); }, 150);
    }, { passive: true });
  })();

  /* ============================================================
     Restoration reveal — before/after chair with draggable tack.
     The (invisible) range input drives --pos for the divider line
     and the clip rect that unveils the restored layer.
     ============================================================ */
  (function () {
    var stage = document.getElementById("revealStage");
    var range = document.getElementById("revealRange");
    var clipRect = document.getElementById("revealClipRect");
    var clipBefore = document.getElementById("revealClipBeforeRect");
    if (!stage || !range || !clipRect || !clipBefore) return;
    var VB = 600; /* svg viewBox width */

    function setPos(v) {
      stage.style.setProperty("--pos", v + "%");
      var x = v / 100 * VB;
      clipRect.setAttribute("x", x);
      clipRect.setAttribute("width", Math.max(0, VB - x));
      clipBefore.setAttribute("width", x);
    }
    range.addEventListener("input", function () { setPos(+range.value); });
    setPos(+range.value);

    /* one gentle sweep when first scrolled into view, to hint at the drag */
    if (!REDUCED && "IntersectionObserver" in window) {
      var played = false;
      new IntersectionObserver(function (entries, io) {
        if (!entries[0].isIntersecting || played) return;
        played = true;
        io.disconnect();
        var from = +range.value, t0 = null;
        function step(ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min(1, (ts - t0) / 1600);
          var v = from - 30 * Math.sin(p * Math.PI); /* out and back */
          range.value = v;
          setPos(v);
          if (p < 1 && !stage.matches(":focus-within")) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }, { threshold: 0.5 }).observe(stage);
    }
  })();

  /* ============================================================
     Mobile navigation
     ============================================================ */
  (function () {
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  })();

  /* ============================================================
     Reveal on scroll
     ============================================================ */
  (function () {
    var items = document.querySelectorAll(".reveal");
    if (REDUCED || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ============================================================
     Enquiry form — static-site friendly: opens the visitor's
     email client with the enquiry pre-filled. Swap the mailto
     for a Formspree/Basin endpoint when one is set up (README).
     ============================================================ */
  (function () {
    var form = document.getElementById("enquiryForm");
    var note = document.getElementById("formNote");
    if (!form || !note) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        note.textContent = "Please fill in your name, email, service and message.";
        note.classList.add("is-error");
        form.reportValidity();
        return;
      }
      var d = new FormData(form);
      var subject = "Enquiry: " + d.get("service") + " — " + d.get("name");
      var body = "Name: " + d.get("name") +
        "\nEmail: " + d.get("email") +
        "\nPhone: " + (d.get("phone") || "—") +
        "\nService: " + d.get("service") +
        "\n\n" + d.get("message");
      window.location.href = "mailto:hello@ginasupholstery.ie?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      note.classList.remove("is-error");
      note.textContent = "Opening your email app… or call us on 087 466 6974.";
    });
  })();

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
