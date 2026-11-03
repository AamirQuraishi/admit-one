/* ==========================================================================
   K EXPLORE — generative poster art
   Every event gets a unique poster drawn as SVG from its id + category colour.
   Six visual "styles" keep the grid varied without needing any image files.
   ========================================================================== */
(function (KX) {
  'use strict';

  var INK = '#121212', CREAM = '#F6F0E0';
  var ACCENTS = ['#FF4F1F', '#3047FF', '#FF8FCB', '#C6F432', '#FFCF2E', '#A57CFF', '#3EE0B0'];

  /* Seeded RNG so a given event always renders the same poster */
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var W = 400, H = 500;

  var styles = [
    /* 0 — sunset: big sun sliced by stripes over a horizon */
    function (c, r) {
      var s = '<circle cx="200" cy="215" r="130" fill="' + c.b + '"/>';
      for (var i = 0; i < 6; i++) {
        s += '<rect x="60" y="' + (240 + i * 20) + '" width="280" height="' + (4 + i * 2.5) + '" fill="' + c.base + '"/>';
      }
      s += '<rect y="370" width="' + W + '" height="130" fill="' + c.ink + '"/>';
      s += '<rect y="370" width="' + W + '" height="10" fill="' + c.a + '"/>';
      for (var k = 0; k < 5; k++) {
        s += '<rect x="' + (30 + k * 80) + '" y="' + (395 + (k % 2) * 25) + '" width="46" height="8" rx="4" fill="' + c.base + '" opacity=".9"/>';
      }
      return s;
    },
    /* 1 — halftone: dots that swell toward a focal point */
    function (c, r) {
      var s = '', fx = 120 + r() * 160, fy = 140 + r() * 140;
      for (var y = 20; y < H; y += 26) {
        for (var x = 20; x < W; x += 26) {
          var d = Math.hypot(x - fx, y - fy), rad = Math.max(1.5, 13 - d / 22);
          s += '<circle cx="' + x + '" cy="' + y + '" r="' + rad.toFixed(1) + '" fill="' + c.ink + '"/>';
        }
      }
      s += '<circle cx="' + fx + '" cy="' + fy + '" r="70" fill="' + c.a + '" stroke="' + c.ink + '" stroke-width="6"/>';
      s += '<rect x="250" y="360" width="110" height="70" fill="' + c.b + '" stroke="' + c.ink + '" stroke-width="6" transform="rotate(-8 305 395)"/>';
      return s;
    },
    /* 2 — arches: stacked rainbows */
    function (c, r) {
      var cols = [c.ink, c.a, c.cream, c.b, c.ink, c.cream], s = '';
      for (var i = 0; i < 6; i++) {
        var rad = 190 - i * 28;
        s += '<path d="M' + (200 - rad) + ' 440 A' + rad + ' ' + rad + ' 0 0 1 ' + (200 + rad) + ' 440 Z" fill="' + cols[i] + '"/>';
      }
      s += '<rect y="440" width="' + W + '" height="60" fill="' + c.ink + '"/>';
      s += '<circle cx="' + (60 + r() * 280) + '" cy="' + (60 + r() * 40) + '" r="22" fill="' + c.cream + '" stroke="' + c.ink + '" stroke-width="5"/>';
      return s;
    },
    /* 3 — checker: chequerboard corner, big disc, tiny star */
    function (c, r) {
      var s = '';
      for (var y = 0; y < 8; y++) for (var x = 0; x < 8; x++) {
        if ((x + y) % 2 === 0) s += '<rect x="' + (x * 50) + '" y="' + (y * 50 + 100) + '" width="50" height="50" fill="' + c.ink + '" opacity=".92"/>';
      }
      s += '<circle cx="230" cy="250" r="115" fill="' + c.a + '" stroke="' + c.ink + '" stroke-width="7"/>';
      s += '<circle cx="230" cy="250" r="55" fill="' + c.cream + '" stroke="' + c.ink + '" stroke-width="7"/>';
      s += '<path d="M80 80 L90 110 L122 112 L97 132 L106 163 L80 145 L54 163 L63 132 L38 112 L70 110Z" fill="' + c.b + '" stroke="' + c.ink + '" stroke-width="5" stroke-linejoin="round"/>';
      return s;
    },
    /* 4 — waves: layered sine bands */
    function (c, r) {
      var cols = [c.a, c.ink, c.cream, c.b, c.ink], s = '', amp = 22 + r() * 16;
      for (var i = 0; i < 5; i++) {
        var y0 = 120 + i * 70, d = 'M0 ' + y0;
        for (var x = 0; x <= W; x += 20) d += ' L' + x + ' ' + (y0 + Math.sin((x / W) * Math.PI * 3 + i) * amp).toFixed(1);
        d += ' L' + W + ' ' + H + ' L0 ' + H + 'Z';
        s += '<path d="' + d + '" fill="' + cols[i] + '"/>';
      }
      s += '<circle cx="300" cy="90" r="46" fill="' + c.cream + '" stroke="' + c.ink + '" stroke-width="6"/>';
      return s;
    },
    /* 5 — burst: radial rays */
    function (c, r) {
      var s = '', n = 18, cx = 200, cy = 230;
      for (var i = 0; i < n; i++) {
        if (i % 2) continue;
        var a1 = (i / n) * Math.PI * 2, a2 = ((i + 1) / n) * Math.PI * 2, R = 420;
        s += '<path d="M' + cx + ' ' + cy + ' L' + (cx + Math.cos(a1) * R).toFixed(1) + ' ' + (cy + Math.sin(a1) * R).toFixed(1) +
             ' L' + (cx + Math.cos(a2) * R).toFixed(1) + ' ' + (cy + Math.sin(a2) * R).toFixed(1) + 'Z" fill="' + c.a + '"/>';
      }
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="82" fill="' + c.ink + '"/>';
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="60" fill="' + c.cream + '"/>';
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="30" fill="' + c.b + '"/>';
      return s;
    }
  ];

  /* Public: returns an SVG string (fills its container, cropped to cover) */
  KX.poster = function (event, opts) {
    opts = opts || {};
    var cat = KX.categories[event.cat];
    var h = hash(event.id), r = rng(h);
    var pool = ACCENTS.filter(function (x) { return x !== cat.color; });
    var a = pool[Math.floor(r() * pool.length)];
    var b = pool[Math.floor(r() * pool.length)];
    if (b === a) b = pool[(pool.indexOf(a) + 3) % pool.length];
    var palette = { base: cat.color, ink: INK, cream: CREAM, a: a, b: b };
    var idx = opts.style != null ? opts.style : (event.index + (h % 3)) % styles.length;
    var body = styles[idx](palette, r);
    return '<svg class="poster" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" ' +
           'role="img" aria-label="Generated artwork for ' + event.title.replace(/"/g, '') + '" xmlns="http://www.w3.org/2000/svg">' +
           '<rect width="' + W + '" height="' + H + '" fill="' + cat.color + '"/>' + body + '</svg>';
  };

  /* Deterministic barcode bars for the ticket (derived from ticket id) */
  KX.barcode = function (id) {
    var h = hash(id), r = rng(h), x = 0, s = '';
    while (x < 236) {
      var w = 1 + Math.floor(r() * 4);
      if (r() > 0.38) s += '<rect x="' + x + '" y="0" width="' + w + '" height="46"/>';
      x += w + 1 + Math.floor(r() * 2);
    }
    return '<svg class="barcode" viewBox="0 0 240 46" preserveAspectRatio="none" aria-hidden="true" fill="currentColor">' + s + '</svg>';
  };

})(window.KX = window.KX || {});
