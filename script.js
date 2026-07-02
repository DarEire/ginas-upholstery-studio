/* Gina's Upholstery Studio — zero dependencies. */

(function () {
  "use strict";

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
