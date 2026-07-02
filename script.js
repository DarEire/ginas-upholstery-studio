/* Gina's Upholstery Studio
   Canvas components adapted from forever-ai-components (isas1/forever-ai-components):
   - infinite/morris/03-growing-vine.html
   - infinite/morris/04-colour-way-switcher.html
   Zero dependencies. Both preserve reduced-motion guards, visibilitychange
   pause/start and DPR-aware canvas fitting from the originals. */

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
     Fabrics — Colour-Way Switcher (after morris/04),
     driven by the swatch buttons instead of an auto timer.
     ============================================================ */
  (function () {
    var cv = document.getElementById("wayCanvas");
    if (!cv) return;
    var INK = "#23301f";
    var S = fitCanvas(cv);

    var colourways = [
      { stem: "#3a6a55", leaf: "#2c4a6e", flower: "#c2a14a", berry: "#7d9b6a", ground: "#dfe6e4" }, /* indigo */
      { stem: "#6b7233", leaf: "#a8392b", flower: "#c2a14a", berry: "#2c4a6e", ground: "#f0e2d4" }, /* madder */
      { stem: "#4a5a2a", leaf: "#7d9b6a", flower: "#a8392b", berry: "#6b7233", ground: "#e9ecda" }, /* sage   */
      { stem: "#6b7233", leaf: "#c2a14a", flower: "#a8392b", berry: "#2c4a6e", ground: "#f1e9cf" }, /* gold   */
      { stem: "#3a4a33", leaf: "#23301f", flower: "#a8392b", berry: "#6b7233", ground: "#e6dcc0" }  /* ink    */
    ];
    function hex(c) { return parseInt(c.slice(1), 16); }
    function mixColor(a, b, t) {
      var pa = hex(a), pb = hex(b);
      var ar = pa >> 16, ag = (pa >> 8) & 255, ab = pa & 255;
      var br = pb >> 16, bg = (pb >> 8) & 255, bb = pb & 255;
      return "rgb(" + Math.round(ar + (br - ar) * t) + "," + Math.round(ag + (bg - ag) * t) + "," + Math.round(ab + (bb - ab) * t) + ")";
    }
    function mixWay(a, b, t) {
      return {
        stem: mixColor(a.stem, b.stem, t), leaf: mixColor(a.leaf, b.leaf, t),
        flower: mixColor(a.flower, b.flower, t), berry: mixColor(a.berry, b.berry, t),
        ground: mixColor(a.ground, b.ground, t)
      };
    }

    var cur = 0, want = 0, blend = 1;

    var tileCv, tileSize = 120;
    function buildTile(w) {
      var c = tileCv || (tileCv = document.createElement("canvas"));
      c.width = c.height = tileSize;
      var x = c.getContext("2d"), u = tileSize;
      x.clearRect(0, 0, u, u);
      x.lineCap = "round"; x.lineJoin = "round";
      x.strokeStyle = w.stem; x.lineWidth = 5;
      x.beginPath(); x.moveTo(u * 0.5, 0);
      x.bezierCurveTo(u * 0.9, u * 0.25, u * 0.1, u * 0.5, u * 0.5, u * 0.75);
      x.bezierCurveTo(u * 0.9, u * 0.9, u * 0.5, u, u * 0.5, u); x.stroke();
      x.beginPath(); x.moveTo(0, u * 0.5);
      x.bezierCurveTo(u * 0.25, u * 0.1, u * 0.5, u * 0.9, u * 0.75, u * 0.5);
      x.bezierCurveTo(u * 0.9, u * 0.5, u, u * 0.5, u, u * 0.5); x.stroke();
      function lf(px, py, rot, sc) {
        x.save(); x.translate(px, py); x.rotate(rot); x.scale(sc, sc);
        x.beginPath(); x.moveTo(0, 0);
        x.bezierCurveTo(14, -8, 18, -26, 6, -40);
        x.bezierCurveTo(2, -30, -4, -34, -14, -22);
        x.bezierCurveTo(-8, -12, -10, -6, 0, 0);
        x.closePath();
        x.fillStyle = w.leaf; x.fill();
        x.strokeStyle = INK; x.lineWidth = 1.4; x.stroke();
        x.restore();
      }
      lf(u * 0.5, u * 0.5, 0.5, 1);
      lf(u * 0.5, u * 0.5, Math.PI + 0.5, 0.8);
      x.save(); x.translate(u * 0.5, u * 0.5);
      for (var i = 0; i < 6; i++) {
        x.rotate(Math.PI / 3);
        x.beginPath(); x.ellipse(0, -10, 5, 9, 0, 0, 7);
        x.fillStyle = w.flower; x.fill();
        x.strokeStyle = INK; x.lineWidth = 1; x.stroke();
      }
      x.beginPath(); x.arc(0, 0, 5, 0, 7);
      x.fillStyle = w.berry; x.fill();
      x.strokeStyle = INK; x.lineWidth = 1; x.stroke();
      x.restore();
      [[6, 6], [u - 6, 6], [6, u - 6], [u - 6, u - 6]].forEach(function (p) {
        x.beginPath(); x.arc(p[0], p[1], 4, 0, 7);
        x.fillStyle = w.berry; x.fill();
        x.strokeStyle = INK; x.lineWidth = 1; x.stroke();
      });
      return c;
    }

    var off = 0;
    function draw(dt) {
      if (!REDUCED && blend < 1) {
        blend = Math.min(1, blend + dt * 1.6);
        if (blend >= 1) cur = want;
      }
      var w = (blend < 1) ? mixWay(colourways[cur], colourways[want], blend) : colourways[cur];
      var ctx = S.ctx;
      ctx.fillStyle = w.ground;
      ctx.fillRect(0, 0, S.w, S.h);
      var tile = buildTile(w);
      if (!REDUCED) off = (off + dt * 6) % tileSize;
      var pat = ctx.createPattern(tile, "repeat");
      ctx.save();
      ctx.translate(0, -off);
      ctx.fillStyle = pat;
      ctx.fillRect(0, -tileSize, S.w, S.h + tileSize * 2);
      ctx.restore();
    }

    runLoop(cv, draw);
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { S = fitCanvas(cv); if (REDUCED) draw(0); }, 150);
    }, { passive: true });

    var swatches = document.querySelectorAll(".swatch");
    swatches.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.dataset.way, 10);
        if (idx === want) return;
        if (blend < 1) cur = want; /* commit any in-flight blend */
        want = idx;
        blend = REDUCED ? 1 : 0;
        if (REDUCED) { cur = idx; draw(0); }
        swatches.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      });
    });
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
