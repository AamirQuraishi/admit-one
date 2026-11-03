/* ==========================================================================
   K EXPLORE — effects & interaction layer
   Preloader, theme toggle (circular View Transition), custom cursor, scroll
   progress, reveal-on-scroll, magnetic buttons, card tilt, hero type swell,
   toasts and confetti. Everything degrades gracefully and respects
   prefers-reduced-motion.
   ========================================================================== */
(function (KX) {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  var fx = KX.fx = { reduced: reduced, finePointer: finePointer };

  /* ── Ready gate: reveal animations wait for the preloader ────────────── */
  var isReady = false, readyQueue = [];
  fx.onReady = function (fn) { isReady ? fn() : readyQueue.push(fn); };
  function markReady() {
    if (isReady) return;
    isReady = true;
    document.documentElement.classList.add('is-ready');
    readyQueue.forEach(function (fn) { fn(); });
    readyQueue = [];
  }

  /* ── Preloader ───────────────────────────────────────────────────────── */
  function preloader() {
    var el = $('#preloader');
    var seen = false;
    try { seen = sessionStorage.getItem('kx.seen') === '1'; } catch (e) {}
    if (!el || seen || reduced) {
      if (el) el.classList.add('gone');
      markReady();
      return;
    }
    var num = $('#preNum'), bar = $('#preBar'), start = null, dur = 1500;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / dur), v = Math.round((1 - Math.pow(1 - p, 3)) * 100);
      num.textContent = v; bar.style.width = v + '%';
      if (p < 1) return requestAnimationFrame(frame);
      try { sessionStorage.setItem('kx.seen', '1'); } catch (e) {}
      el.classList.add('done');
      setTimeout(markReady, 450);
      setTimeout(function () { el.classList.add('gone'); }, 1300);
    }
    requestAnimationFrame(frame);
    setTimeout(markReady, 4000); // safety net
  }

  /* ── Theme toggle with circular reveal ───────────────────────────────── */
  function theme() {
    var btn = $('#themeToggle'), root = document.documentElement;
    function apply(t) {
      root.setAttribute('data-theme', t);
      KX.store.setTheme(t);
      btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      var meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', t === 'dark' ? '#101014' : '#F2ECDD');
    }
    apply(root.getAttribute('data-theme') || 'light');

    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      if (!document.startViewTransition || reduced) { apply(next); return; }
      var r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      var radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      var vt = document.startViewTransition(function () { apply(next); });
      vt.ready.then(function () {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 750, easing: 'cubic-bezier(.7,0,.2,1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function () {});
    });
  }

  /* ── Mobile menu ─────────────────────────────────────────────────────── */
  function menu() {
    var btn = $('#menuBtn'), panel = $('#mobileMenu');
    function close() {
      btn.setAttribute('aria-expanded', 'false'); panel.classList.remove('open');
      document.body.classList.remove('lock-menu');
      setTimeout(function () { if (!panel.classList.contains('open')) panel.hidden = true; }, 600);
    }
    fx.closeMenu = close;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      if (open) return close();
      panel.hidden = false;
      requestAnimationFrame(function () { requestAnimationFrame(function () { panel.classList.add('open'); }); });
      btn.setAttribute('aria-expanded', 'true');
    });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') close(); });
  }

  /* ── Scroll progress + auto-hiding nav ───────────────────────────────── */
  function scrollFx() {
    var bar = $('#scrollProgress'), nav = $('#nav'), lastY = scrollY, ticking = false;
    function update() {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
      var y = scrollY;
      if (y > 220 && y > lastY + 4) nav.classList.add('hide');
      else if (y < lastY - 4 || y < 220) nav.classList.remove('hide');
      lastY = y; ticking = false;
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ── Reveal on scroll ────────────────────────────────────────────────── */
  var io = null;
  function setupReveal() {
    if (reduced || !('IntersectionObserver' in window)) return;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  }
  fx.reveal = function (root) {
    var els = $$('.reveal:not(.in)', root || document);
    if (!io) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    fx.onReady(function () { els.forEach(function (el) { io.observe(el); }); });
  };

  /* ── Custom cursor ───────────────────────────────────────────────────── */
  function cursor() {
    if (!finePointer || reduced) return;
    var c = $('#cursor'), label = $('#cursorLabel'), ring = $('.cursor-ring', c), dot = $('.cursor-dot', c);
    document.body.classList.add('has-cursor');
    c.style.opacity = 0;
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, shown = false;

    addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; c.style.opacity = 1; rx = mx; ry = my; }
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    }, { passive: true });
    document.addEventListener('pointerleave', function () { c.style.opacity = 0; shown = false; });
    document.addEventListener('pointerdown', function () { c.classList.add('is-down'); });
    document.addEventListener('pointerup', function () { c.classList.remove('is-down'); });

    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      label.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      requestAnimationFrame(loop);
    })();

    document.addEventListener('pointerover', function (e) {
      var t = e.target, view = t.closest && t.closest('[data-cursor]');
      c.classList.toggle('is-view', !!view);
      if (view) label.textContent = view.getAttribute('data-cursor');
      var text = t.closest && t.closest('input[type="search"],input[type="text"],input[type="email"],input[type="tel"]');
      c.classList.toggle('is-text', !!text);
      c.classList.toggle('is-link', !view && !text && !!(t.closest && t.closest('a,button,select,label,[role="button"]')));
    });
  }

  /* ── Magnetic buttons ────────────────────────────────────────────────── */
  fx.bindMagnetic = function (root) {
    if (!finePointer || reduced) return;
    $$('[data-magnetic]:not([data-mag-bound])', root || document).forEach(function (el) {
      el.setAttribute('data-mag-bound', '');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * 0.22, dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
        el.style.translate = dx.toFixed(1) + 'px ' + dy.toFixed(1) + 'px';
      });
      el.addEventListener('pointerleave', function () { el.style.translate = ''; });
    });
  };

  /* ── 3D tilt (cards, hero ticket) ────────────────────────────────────── */
  fx.bindTilt = function (el, max) {
    if (!finePointer || reduced) return;
    max = max || 6;
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', (px * max * 2).toFixed(2) + 'deg');
      el.style.setProperty('--rx', (-py * max * 2).toFixed(2) + 'deg');
    });
    el.addEventListener('pointerleave', function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  };

  /* ── Hero: letter-by-letter variable-width swell + parallax shapes ───── */
  function hero() {
    var title = $('#heroTitle'), heroEl = $('#hero');
    if (!title) return;

    $$('[data-split]', title).forEach(function (word) {
      var text = word.textContent.replace(/ /g, ' ');
      word.textContent = '';
      word.setAttribute('aria-hidden', 'true');
      text.split('').forEach(function (ch) {
        var s = document.createElement('span');
        s.className = 'ch'; s.textContent = ch === ' ' ? ' ' : ch;
        word.appendChild(s);
      });
    });

    if (!finePointer || reduced) return;
    var chars = $$('.ch', title), rects = [], pending = null;
    function measure() { rects = chars.map(function (c) { var r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); }
    title.addEventListener('pointerenter', measure);
    addEventListener('resize', measure);

    title.addEventListener('pointermove', function (e) {
      pending = e;
      if (pending._raf) return;
      requestAnimationFrame(function () {
        var ev = pending; pending = null;
        if (!rects.length) measure();
        chars.forEach(function (c, i) {
          var d = Math.hypot(ev.clientX - rects[i].x, ev.clientY - rects[i].y);
          var k = Math.max(0, 1 - d / 230); k = k * k;
          c.style.setProperty('--wd', (75 + 25 * k).toFixed(1));
          c.style.setProperty('--wg', Math.round(800 - 330 * k));
        });
      });
    });
    title.addEventListener('pointerleave', function () {
      chars.forEach(function (c) { c.style.removeProperty('--wd'); c.style.removeProperty('--wg'); });
    });

    // parallax shapes
    var shapes = $$('[data-depth]', heroEl);
    heroEl.addEventListener('pointermove', function (e) {
      var cx = innerWidth / 2, cy = innerHeight / 2;
      shapes.forEach(function (s) {
        var d = parseFloat(s.getAttribute('data-depth'));
        s.style.translate = ((e.clientX - cx) * d).toFixed(1) + 'px ' + ((e.clientY - cy) * d).toFixed(1) + 'px';
      });
    });
  }

  /* ── Toasts (re-parented into the open <dialog> so they show on top) ── */
  fx.placeToasts = function () {
    var c = $('#toasts'), open = document.querySelector('dialog[open]');
    if (open && c.parentNode !== open) open.appendChild(c);
    else if (!open && c.parentNode !== document.body) document.body.appendChild(c);
  };
  fx.toast = function (msg) {
    fx.placeToasts();
    var c = $('#toasts'), t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg; c.appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 320); }, 2800);
  };

  /* ── Confetti burst ──────────────────────────────────────────────────── */
  fx.confetti = function (ox, oy) {
    if (reduced) return;
    var host = document.querySelector('dialog[open]') || document.body;
    var cv = document.createElement('canvas'), ctx = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
    cv.className = 'confetti'; cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    host.appendChild(cv); ctx.scale(dpr, dpr);
    var colors = ['#FF4F1F', '#3047FF', '#FF8FCB', '#C6F432', '#FFCF2E', '#A57CFF', '#3EE0B0'];
    var ps = [];
    for (var i = 0; i < 150; i++) {
      var a = -Math.PI / 2 + (Math.random() - 0.5) * 1.9, sp = 9 + Math.random() * 13;
      ps.push({ x: ox, y: oy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, w: 7 + Math.random() * 9, h: 5 + Math.random() * 7,
                r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: colors[i % colors.length], round: Math.random() > 0.7 });
    }
    var t0 = performance.now();
    (function step(t) {
      var age = (t - t0) / 1000;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach(function (p) {
        p.vy += 0.42; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        ctx.globalAlpha = Math.max(0, 1 - Math.max(0, age - 1.4) / 0.9);
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2.4, 0, 6.3); ctx.fill(); } else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (age < 2.4) requestAnimationFrame(step); else cv.remove();
    })(t0);
  };

  /* ── Boot ────────────────────────────────────────────────────────────── */
  fx.init = function () {
    setupReveal();
    theme(); menu(); scrollFx(); cursor(); hero();
    fx.bindMagnetic();
    var ht = $('#heroTicket'); if (ht) fx.bindTilt(ht, 7);
    preloader();
  };

})(window.KX = window.KX || {});
