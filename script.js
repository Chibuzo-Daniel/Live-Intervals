(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.getElementById("liNavToggle");
  var navPanel = document.getElementById("liNavMobilePanel");
  navToggle.addEventListener("click", function () {
    var isOpen = document.body.classList.toggle("li-menu-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  navPanel.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      document.body.classList.remove("li-menu-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---- Nav background swap between hero (dark) and rest of page (light) ---- */
  var nav = document.getElementById("liNav");
  var hero = document.getElementById("liHero");
  var navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          nav.classList.add("li-nav--on-dark");
        } else {
          nav.classList.remove("li-nav--on-dark");
        }
      });
    },
    { rootMargin: "-73px 0px 0px 0px", threshold: 0 },
  );
  navObserver.observe(hero);

  /* ---- Hero network canvas animation ---- */
  var canvas = document.getElementById("liHeroCanvas");
  var ctx = canvas.getContext("2d");
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  var nodes = [];
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    var rect = hero.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initNodes(rect.width, rect.height);
  }

  function initNodes(w, h) {
    var count = w < 700 ? 16 : 30;
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.6 + 0.6,
      });
    }
  }

  function drawFrame() {
    var w = canvas.width / dpr,
      h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (!prefersReducedMotion) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
    }
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i],
          b = nodes[j];
        var dx = a.x - b.x,
          dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var maxDist = w < 700 ? 160 : 220;
        if (dist < maxDist) {
          ctx.strokeStyle =
            "rgba(47,214,106," + 0.16 * (1 - dist / maxDist) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(47,214,106,0.9)";
      ctx.fill();
    }
    if (!prefersReducedMotion) {
      requestAnimationFrame(drawFrame);
    }
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  drawFrame();

  /* ---- Partner form: char count + fake submit ---- */
  var form = document.getElementById("liPartnerForm");
  var messageField = document.getElementById("liMessage");
  var messageCount = document.getElementById("liMessageCount");
  var submitBtn = document.getElementById("liFormSubmit");
  var successMsg = document.getElementById("liFormSuccess");

  messageField.addEventListener("input", function () {
    messageCount.textContent = messageField.value.length;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    setTimeout(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = "Request API Access";
      successMsg.classList.add("li-is-visible");
      form.reset();
      messageCount.textContent = "0";
    }, 900);
  });
})();
