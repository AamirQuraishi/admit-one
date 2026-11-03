/* Admit One – application logic (vanilla JS, no build step) */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');

  const CATS = {
    tech:     { label: 'Tech',     color: '--blue',   on: '#ffffff' },
    music:    { label: 'Music',    color: '--pink',   on: '#15123A' },
    culture:  { label: 'Culture',  color: '--orange', on: '#15123A' },
    sports:   { label: 'Sports',   color: '--teal',   on: '#15123A' },
    workshop: { label: 'Workshop', color: '--yellow', on: '#15123A' }
  };
  const INKS = ['--blue', '--pink', '--yellow', '--orange', '--teal'];

  const storage = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode: keep going in memory */ } }
  };

  /* ---------- data ---------- */
  const now = new Date();
  const EVENTS = window.KX_EVENTS.map((e) => {
    const [h, m] = e.time.split(':').map(Number);
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + e.days, h, m, 0);
    return Object.assign({}, e, { start });
  });
  const byId = (id) => EVENTS.find((e) => e.id === id);
  let regs = storage.get('ao.regs', []);

  const seatsLeft = (e) => Math.max(0, e.capacity - e.taken - regs.filter((r) => r.eventId === e.id).length);
  const fillPct = (e) => Math.min(100, Math.round(((e.capacity - seatsLeft(e)) / e.capacity) * 100));
  const seatText = (e) => {
    const n = seatsLeft(e);
    return n === 0 ? 'Sold out' : n <= 15 ? `Only ${n} seats left` : `${n} seats left`;
  };
  const seatClass = (e) => { const n = seatsLeft(e); return n === 0 ? 'is-out' : n <= 15 ? 'is-low' : ''; };

  const fmtDay = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtLong = (d) => d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const fmtTime = (d) => d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).replace(/\s/g, ' ').toLowerCase();

  /* ---------- generated riso posters (no image files needed) ---------- */
  function rng(seed) {
    let s = 0;
    for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
    return () => {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let uid = 0;
  function poster(e) {
    const W = 400, H = 300, r = rng(e.id), id = 'p' + (uid++);
    const base = CATS[e.cat].color;
    const pool = INKS.filter((x) => x !== base);
    const a = `var(${pool.splice(Math.floor(r() * pool.length), 1)[0]})`;
    const b = `var(${pool.splice(Math.floor(r() * pool.length), 1)[0]})`;
    const c = `var(${pool[Math.floor(r() * pool.length)]})`;
    /* overprint on light inks; blue is too dark to multiply into, so shapes stay flat there */
    const mb = base === '--blue' ? '' : 'style="mix-blend-mode:multiply"';
    let g = '';
    const rnd = (min, max) => min + r() * (max - min);

    if (e.cat === 'tech') {
      for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) {
        if (r() > 0.5) { const s = r() > 0.72 ? 44 : 20; g += `<rect x="${i * 50 + 3}" y="${j * 50 + 3}" width="${s}" height="${s}" fill="${r() > 0.5 ? a : b}" ${mb}/>`; }
      }
      g += `<circle cx="${rnd(220, 330)}" cy="${rnd(90, 200)}" r="${rnd(70, 100)}" fill="${c}" ${mb}/>`;
    } else if (e.cat === 'music') {
      const cx = rnd(150, 260), cy = rnd(110, 170);
      for (let k = 6; k >= 1; k--) g += `<circle cx="${cx}" cy="${cy}" r="${k * 30}" fill="none" stroke="${k % 2 ? a : b}" stroke-width="9" ${mb}/>`;
      g += `<circle cx="${cx}" cy="${cy}" r="34" fill="${c}" ${mb}/>`;
      for (let i = 0; i < 16; i++) { const h = rnd(30, 120); g += `<rect x="${i * 25 + 5}" y="${H - h}" width="14" height="${h}" fill="${i % 3 ? b : a}" ${mb}/>`; }
    } else if (e.cat === 'culture') {
      g += `<circle cx="${rnd(90, 150)}" cy="${rnd(200, 260)}" r="${rnd(110, 140)}" fill="${a}" ${mb}/>`;
      g += `<circle cx="${rnd(240, 320)}" cy="${rnd(210, 270)}" r="${rnd(100, 135)}" fill="${b}" ${mb}/>`;
      g += `<circle cx="${rnd(160, 240)}" cy="${rnd(60, 100)}" r="${rnd(50, 70)}" fill="${c}" ${mb}/>`;
      for (let k = 1; k <= 3; k++) g += `<path d="M ${-20} ${H} Q ${200} ${H - k * 70} ${W + 20} ${H}" fill="none" stroke="#15123A" stroke-width="3" opacity=".55"/>`;
    } else if (e.cat === 'sports') {
      g += `<g transform="rotate(-24 200 150)">`;
      for (let i = -2; i < 12; i++) g += `<rect x="${i * 48}" y="-100" width="22" height="520" fill="${i % 2 ? a : b}" ${mb}/>`;
      g += `</g>`;
      g += `<circle cx="${rnd(170, 250)}" cy="${rnd(110, 180)}" r="${rnd(62, 82)}" fill="${c}" ${mb}/>`;
      for (let i = 0; i < 4; i++) g += `<rect x="${rnd(10, 60)}" y="${40 + i * 62}" width="${rnd(60, 130)}" height="7" rx="3.5" fill="#15123A" opacity=".75"/>`;
    } else {
      for (let i = 0; i < 14; i++) for (let j = 0; j < 10; j++) g += `<circle cx="${i * 30 + 12}" cy="${j * 30 + 12}" r="5" fill="${a}" ${mb}/>`;
      g += `<path d="M${rnd(40, 120)} ${H - 20} L${rnd(180, 230)} ${rnd(30, 80)} L${rnd(300, 380)} ${H - 20}Z" fill="${b}" ${mb}/>`;
      g += `<circle cx="${rnd(250, 340)}" cy="${rnd(60, 110)}" r="${rnd(40, 58)}" fill="${c}" ${mb}/>`;
      for (let i = 0; i < 5; i++) g += `<path d="M${rnd(20, 380)} ${rnd(20, 280)}h14M${0} 0" stroke="#15123A" stroke-width="4" stroke-linecap="round" opacity=".6"/>`;
    }

    return `<svg class="poster" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="${id}h" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.5" fill="#15123A"/></pattern>
        <linearGradient id="${id}g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#000"/></linearGradient>
        <mask id="${id}m"><rect width="${W}" height="${H}" fill="url(#${id}g)"/></mask>
      </defs>
      <rect width="${W}" height="${H}" fill="var(${base})"/>
      ${g}
      <rect width="${W}" height="${H}" fill="url(#${id}h)" mask="url(#${id}m)" opacity=".35"/>
    </svg>`;
  }

  function barcode(seed) {
    const r = rng(seed); let x = 0, bars = '';
    while (x < 130) { const w = 1 + Math.floor(r() * 4); if (r() > 0.4) bars += `<rect x="${x}" y="0" width="${w}" height="44" fill="#15123A"/>`; x += w + 1.5; }
    return `<svg viewBox="0 0 130 44" aria-hidden="true">${bars}</svg>`;
  }

  /* ---------- icons ---------- */
  const PIN = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="10" r="2.5" fill="currentColor"/></svg>';
  const X = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>';

  /* ---------- ticket card ---------- */
  function ticketHTML(e, i) {
    const c = CATS[e.cat];
    return `<article class="ticket" style="--cat:var(${c.color});--on:${c.on};--i:${i || 0}">
      <div class="ticket__art">
        ${poster(e)}
        <span class="ticket__cat">${c.label}</span>
        <span class="ticket__day"><b>${e.start.getDate()}</b><span>${e.start.toLocaleDateString('en-IN', { month: 'short' })}</span></span>
      </div>
      <div class="ticket__body">
        <p class="ticket__time">${e.start.toLocaleDateString('en-IN', { weekday: 'long' })}, ${fmtTime(e.start)}</p>
        <h3 class="ticket__title"><button type="button" class="ticket__open" data-open="${e.id}">${esc(e.title)}</button></h3>
        <p class="ticket__venue">${PIN}${esc(e.venue)}</p>
        <p class="ticket__blurb">${esc(e.blurb)}</p>
      </div>
      <div class="ticket__stub">
        <div class="meter" role="img" aria-label="${fillPct(e)} percent booked"><span style="width:${fillPct(e)}%"></span></div>
        <p class="ticket__seats ${seatClass(e)}">${seatText(e)}</p>
      </div>
    </article>`;
  }

  /* ---------- state + rendering of lists ---------- */
  const state = { q: '', cat: 'all', sort: 'soon' };
  const grid = $('#grid'), emptyEl = $('#empty'), resultsEl = $('#results');
  let firstRender = true;

  function filtered() {
    const q = state.q.trim().toLowerCase();
    let list = EVENTS.filter((e) => {
      if (state.cat !== 'all' && e.cat !== state.cat) return false;
      if (!q) return true;
      return [e.title, e.venue, e.blurb, e.host, CATS[e.cat].label].join(' ').toLowerCase().includes(q);
    });
    if (state.sort === 'soon') list.sort((a, b) => a.start - b.start);
    if (state.sort === 'seats') list.sort((a, b) => (seatsLeft(a) || 1e9) - (seatsLeft(b) || 1e9));
    if (state.sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }

  function renderGrid(animate) {
    const list = filtered();
    grid.classList.toggle('is-filtering', !!animate);
    grid.innerHTML = list.map((e, i) => ticketHTML(e, i)).join('');
    emptyEl.hidden = list.length > 0;
    const scope = state.cat === 'all' ? '' : ` in ${CATS[state.cat].label}`;
    resultsEl.textContent = list.length ? `Showing ${list.length} of ${EVENTS.length} events${scope}.` : '';
    firstRender = false;
  }

  function renderWall() {
    $('#wall').innerHTML = EVENTS.filter((e) => e.featured).sort((a, b) => a.start - b.start).map((e) => ticketHTML(e)).join('');
  }

  function renderChips() {
    const items = [['all', 'All']].concat(Object.entries(CATS).map(([k, v]) => [k, v.label]));
    $('#chips').innerHTML = items.map(([k, label]) => {
      const c = CATS[k];
      return `<button type="button" class="chip" data-cat="${k}" aria-pressed="${state.cat === k}" ${c ? `style="--cat:var(${c.color});--on:${c.on}"` : ''}>${label}</button>`;
    }).join('');
  }

  function renderMarquee() {
    const words = ['Hackathons', 'Open mics', 'Cup finals', 'Workshops', 'Folk nights', 'Robot fights', 'Fun runs', 'Pitch nights'];
    const one = words.map((w) => `<span class="marquee__item">${w}<i></i><i></i></span>`).join('');
    $('#marquee').innerHTML = one + one;
  }

  function refreshAll() {
    renderGrid(false);
    renderWall();
    $('#ticketCount').textContent = regs.length;
  }

  /* ---------- countdowns ---------- */
  function parts(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
  }
  function tick() {
    $$('[data-cd]').forEach((el) => {
      const ms = new Date(el.dataset.cd) - Date.now();
      if (el.dataset.mode === 'text') {
        if (ms <= 0) { el.textContent = 'Happening now'; return; }
        const p = parts(ms);
        el.textContent = `${p.d}d ${pad(p.h)}h ${pad(p.m)}m ${pad(p.s)}s`;
      } else {
        const p = parts(ms);
        ['d', 'h', 'm', 's'].forEach((u) => { const n = $(`[data-u="${u}"]`, el); if (n) n.textContent = pad(p[u]); });
      }
    });
  }

  /* ---------- hero ---------- */
  function setupHero() {
    const next = EVENTS.slice().sort((a, b) => a.start - b.start)[0];
    $('#nextTitle').textContent = next.title;
    $('#nextTime').textContent = `${fmtDay(next.start)}, ${fmtTime(next.start)}`;
    const cd = $('#nextCd'); cd.dataset.cd = next.start.toISOString();
    $('#nextSticker').dataset.open = next.id;
    $('#heroCount').textContent = `${EVENTS.length} events in the next ${Math.max(...EVENTS.map((e) => e.days))} days. All free for students.`;

    const hero = $('.hero'), t = $('.riso');
    hero.addEventListener('pointermove', (ev) => {
      const b = hero.getBoundingClientRect();
      const px = (ev.clientX - b.left) / b.width - 0.5, py = (ev.clientY - b.top) / b.height - 0.5;
      t.style.setProperty('--dx', `${(px * 34).toFixed(1)}px`);
      t.style.setProperty('--dy', `${(py * 22).toFixed(1)}px`);
    });
    hero.addEventListener('pointerleave', () => { t.style.removeProperty('--dx'); t.style.removeProperty('--dy'); });
  }

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('is-on'), 2800);
  }

  /* ---------- event dialog ---------- */
  const dlg = $('#eventDialog');
  let current = null;
  let draft = { name: '', email: '', phone: '', id: false };

  function artPanel(e) {
    const c = CATS[e.cat];
    return `<div class="ev__art" style="--cat:var(${c.color})">${poster(e)}
      <div class="ev__tag"><b>${esc(e.title)}</b><span>${fmtLong(e.start)}</span></div></div>`;
  }

  function detailsView(e) {
    const c = CATS[e.cat], out = seatsLeft(e) === 0;
    return `<div class="ev__main">
      <button class="x" type="button" data-close aria-label="Close">${X}</button>
      <div class="chipline"><span class="tag" style="background:var(${c.color});color:${c.on}">${c.label}</span><span class="tag tag--free">Free for students</span></div>
      <h2 id="dlgTitle">${esc(e.title)}</h2>
      <p class="about">${esc(e.about)}</p>
      <dl class="facts">
        <div><dt>Date</dt><dd>${fmtLong(e.start)}</dd></div>
        <div><dt>Starts</dt><dd>${fmtTime(e.start)}</dd></div>
        <div><dt>Venue</dt><dd>${esc(e.venue)}</dd></div>
        <div><dt>Hosted by</dt><dd>${esc(e.host)}</dd></div>
      </dl>
      <div>
        <p class="cd-label">Starts in</p>
        <div class="cd" data-cd="${e.start.toISOString()}" data-mode="boxes">
          <div><b data-u="d">00</b><span>days</span></div><div><b data-u="h">00</b><span>hours</span></div>
          <div><b data-u="m">00</b><span>minutes</span></div><div><b data-u="s">00</b><span>seconds</span></div>
        </div>
      </div>
      <div>
        <h3 class="ev__h">Schedule</h3>
        <ol class="timeline">${e.schedule.map(([t, what]) => `<li><time>${t}</time><span>${esc(what)}</span></li>`).join('')}</ol>
      </div>
      <div class="seatline" style="--cat:var(${c.color})">
        <div class="meter"><span style="width:${fillPct(e)}%"></span></div>
        <p class="${seatClass(e)}">${seatText(e)} out of ${e.capacity}</p>
      </div>
      <div class="ev__cta">
        <button class="btn btn--primary" type="button" data-go="form" ${out ? 'disabled' : ''}>${out ? 'Sold out' : 'Register for this event'}</button>
        <button class="btn btn--text" type="button" data-close>Back to events</button>
      </div>
    </div>`;
  }

  function formView(e) {
    const opts = EVENTS.slice().sort((a, b) => a.start - b.start).map((x) =>
      `<option value="${x.id}" ${x.id === e.id ? 'selected' : ''} ${seatsLeft(x) === 0 ? 'disabled' : ''}>${esc(x.title)}, ${fmtDay(x.start)}${seatsLeft(x) === 0 ? ' (sold out)' : ''}</option>`).join('');
    return `<div class="ev__main">
      <button class="x" type="button" data-close aria-label="Close">${X}</button>
      <button class="btn btn--text" type="button" data-go="details" style="align-self:flex-start;margin-left:-.25rem">Back to details</button>
      <h2 id="dlgTitle">Register for ${esc(e.title)}</h2>
      <p>${fmtLong(e.start)}, ${fmtTime(e.start)} at ${esc(e.venue)}. ${seatText(e)}.</p>
      <form class="form" id="regForm" novalidate>
        <div class="field">
          <label for="f-name">Full name</label>
          <input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="e-name" value="${esc(draft.name)}">
          <p class="err" id="e-name"></p>
        </div>
        <div class="field">
          <label for="f-email">Email address</label>
          <input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="e-email" value="${esc(draft.email)}">
          <p class="err" id="e-email"></p>
        </div>
        <div class="field">
          <label for="f-phone">Phone number</label>
          <input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required aria-describedby="e-phone" value="${esc(draft.phone)}" placeholder="10-digit mobile number">
          <p class="err" id="e-phone"></p>
        </div>
        <div class="field">
          <label for="f-event">Event</label>
          <select id="f-event" name="event" required aria-describedby="e-event">${opts}</select>
          <p class="err" id="e-event"></p>
        </div>
        <div class="field">
          <label class="check"><input id="f-id" name="idcard" type="checkbox" ${draft.id ? 'checked' : ''} aria-describedby="e-idcard"><span>I will carry my college ID to the venue.</span></label>
          <p class="err" id="e-idcard"></p>
        </div>
        <div class="ev__cta">
          <button class="btn btn--primary" type="submit">Get my ticket</button>
        </div>
        <p class="form__note">We only use these details to hold your seat. They are saved in this browser, not sent anywhere.</p>
      </form>
    </div>`;
  }

  function doneView(reg) {
    const e = byId(reg.eventId);
    return `<div class="ev__main done">
      <button class="x" type="button" data-close aria-label="Close">${X}</button>
      <h2 id="dlgTitle" tabindex="-1">You&rsquo;re in, ${esc(reg.name.split(' ')[0])}.</h2>
      <p>Your seat for <strong>${esc(e.title)}</strong> is booked. Show this ticket at the gate.</p>
      <div class="pass">
        <b>${esc(e.title)}</b>
        <p>${fmtLong(e.start)}, ${fmtTime(e.start)}</p>
        <p>${esc(e.venue)}</p>
        <p class="pass__who">${esc(reg.name)}</p>
        <div class="pass__cut"><span class="pass__id">${reg.ticketId}</span>${barcode(reg.ticketId)}</div>
      </div>
      <div class="ev__cta">
        <button class="btn btn--primary" type="button" data-close>Back to events</button>
        <button class="btn" type="button" data-sheet>See my tickets</button>
      </div>
    </div>`;
  }

  function renderDialog(view, reg) {
    const body = view === 'form' ? formView(current) : view === 'done' ? doneView(reg) : detailsView(current);
    dlg.innerHTML = `<div class="ev">${artPanel(current)}${body}</div>`;
    dlg.dataset.view = view;
    tick();
    if (view === 'form') bindForm();
    if (view === 'done') $('#dlgTitle').focus();
    $('.ev__main', dlg).scrollTop = 0;
  }

  function openEvent(id, view) {
    const e = byId(id); if (!e) return;
    current = e;
    renderDialog(view || 'details');
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
    try { history.replaceState(null, '', `#event=${id}`); } catch (err) { /* file:// */ }
  }
  function closeDialog() { if (dlg.open) dlg.close(); }
  dlg.addEventListener('close', () => {
    try { history.replaceState(null, '', location.pathname + location.search); } catch (err) { /* ignore */ }
    refreshAll();
  });
  dlg.addEventListener('click', (ev) => {
    if (ev.target === dlg) return closeDialog();               // backdrop
    if (ev.target.closest('[data-close]')) return closeDialog();
    const go = ev.target.closest('[data-go]');
    if (go) return renderDialog(go.dataset.go);
    if (ev.target.closest('[data-sheet]')) { closeDialog(); openSheet(); }
  });

  /* ---------- validation ---------- */
  const rules = {
    name(v) {
      v = v.trim();
      if (!v) return 'Enter your full name.';
      if (!/^[\p{L}][\p{L} .'-]{1,59}$/u.test(v)) return 'Use letters only, between 2 and 60 characters.';
      return '';
    },
    email(v) {
      v = v.trim();
      if (!v) return 'Enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email, like name@college.edu.';
      return '';
    },
    phone(v) {
      if (!v.trim()) return 'Enter your phone number.';
      const d = v.replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');
      if (!/^[6-9]\d{9}$/.test(d)) return 'Enter a 10-digit mobile number that starts with 6, 7, 8 or 9.';
      return '';
    },
    event(v) {
      if (!v) return 'Pick an event.';
      const e = byId(v);
      if (!e) return 'Pick an event from the list.';
      if (seatsLeft(e) === 0) return 'That event is sold out. Pick another one.';
      return '';
    },
    idcard(_v, el) { return el.checked ? '' : 'Tick this box to confirm you will bring your ID.'; }
  };

  function showError(input, msg) {
    const err = $('#e-' + input.name);
    err.textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    (input.closest('.field') || input.parentElement).classList.toggle('has-error', !!msg);
  }
  function check(input) { const msg = rules[input.name](input.value, input); showError(input, msg); return !msg; }

  function bindForm() {
    const form = $('#regForm'), f = form.elements, inputs = $$('input, select', form);
    inputs.forEach((i) => {
      i.addEventListener('blur', () => { if (i.name === 'name' && !i.value) return; check(i); });
      i.addEventListener('input', () => { if (i.getAttribute('aria-invalid') === 'true') check(i); });
    });
    $('#f-event').addEventListener('change', (ev) => {
      draft = { name: f.name.value, email: f.email.value, phone: f.phone.value, id: f.idcard.checked };
      current = byId(ev.target.value);
      renderDialog('form');
      $('#f-event').focus();
    });
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      let firstBad = null;
      inputs.forEach((i) => { if (!check(i) && !firstBad) firstBad = i; });
      if (firstBad) { firstBad.focus(); return; }

      const email = f.email.value.trim().toLowerCase();
      if (regs.some((r) => r.eventId === current.id && r.email === email)) {
        showError(f.email, 'This email already has a ticket for this event. Check My tickets.');
        f.email.focus(); return;
      }
      const reg = {
        ticketId: 'AO-' +Math.random().toString(36).slice(2, 7).toUpperCase(),
        eventId: current.id,
        name: f.name.value.trim().replace(/\s+/g, ' '),
        email,
        phone: f.phone.value.trim(),
        at: Date.now()
      };
      regs.push(reg); storage.set('ao.regs', regs);
      draft = { name: '', email: '', phone: '', id: false };
      $('#ticketCount').textContent = regs.length;
      renderDialog('done', reg);
    });
  }

  /* ---------- my tickets sheet ---------- */
  const sheet = $('#sheet');
  function renderSheet() {
    const list = regs.slice().sort((a, b) => byId(a.eventId).start - byId(b.eventId).start);
    sheet.innerHTML = `<div class="sheet__in">
      <div class="sheet__top"><h2 id="sheetTitle">My tickets</h2><button class="x" style="position:static" type="button" data-close aria-label="Close my tickets">${X}</button></div>
      ${list.length ? list.map((r) => {
        const e = byId(r.eventId), c = CATS[e.cat];
        return `<article class="mini" style="--cat:var(${c.color})">
          <b>${esc(e.title)}</b>
          <p>${fmtLong(e.start)}, ${fmtTime(e.start)}</p>
          <p>${esc(e.venue)}. Booked for ${esc(r.name)}.</p>
          <div class="mini__row"><span class="mini__id">${r.ticketId}</span>
            <button class="btn btn--text" type="button" data-cancel="${r.ticketId}">Cancel ticket</button></div>
        </article>`;
      }).join('') : `<div class="empty" style="padding:2rem 0;justify-items:start;text-align:left">
          <p class="empty__big">No tickets yet.</p>
          <p>Pick an event and your tickets will show up here.</p>
          <button class="btn btn--primary" type="button" data-close data-jump>Browse events</button></div>`}
    </div>`;
  }
  function openSheet() { renderSheet(); if (!sheet.open) sheet.showModal(); }
  sheet.addEventListener('click', (ev) => {
    if (ev.target === sheet) return sheet.close();
    if (ev.target.closest('[data-jump]')) { sheet.close(); location.hash = '#events'; return; }
    if (ev.target.closest('[data-close]')) return sheet.close();
    const c = ev.target.closest('[data-cancel]');
    if (c) {
      if (!c.dataset.sure) {
        c.dataset.sure = '1'; c.textContent = 'Tap again to cancel';
        setTimeout(() => { if (c.isConnected) { delete c.dataset.sure; c.textContent = 'Cancel ticket'; } }, 3500);
        return;
      }
      regs = regs.filter((r) => r.ticketId !== c.dataset.cancel);
      storage.set('ao.regs', regs);
      renderSheet(); refreshAll(); toast('Ticket cancelled. Your seat is back in the pool.');
    }
  });

  /* ---------- global listeners ---------- */
  document.addEventListener('click', (ev) => {
    const open = ev.target.closest('[data-open]');
    if (open && !ev.target.closest('dialog')) return openEvent(open.dataset.open);
    if (ev.target.closest('[data-sheet]') && !ev.target.closest('dialog')) openSheet();
  });
  $('#ticketsBtn').addEventListener('click', openSheet);

  $('#q').addEventListener('input', (ev) => { state.q = ev.target.value; renderGrid(true); });
  $('#sort').addEventListener('change', (ev) => { state.sort = ev.target.value; renderGrid(true); });
  $('#chips').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-cat]'); if (!b) return;
    state.cat = b.dataset.cat; renderChips(); renderGrid(true);
  });
  $('#resetBtn').addEventListener('click', () => {
    state.q = ''; state.cat = 'all'; $('#q').value = ''; renderChips(); renderGrid(true); $('#q').focus();
  });

  /* theme */
  const themeBtn = $('#themeBtn');
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    const m = $('meta[name="theme-color"]'); if (m) m.content = t === 'dark' ? '#0E0C29' : '#2736F0';
  }
  themeBtn.addEventListener('click', () => {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(t); storage.set('ao.theme', t);
  });

  /* ---------- boot ---------- */
  applyTheme(document.documentElement.dataset.theme || 'light');
  renderMarquee(); renderChips(); setupHero(); renderWall(); renderGrid(false);
  $('#ticketCount').textContent = regs.length;
  tick(); setInterval(tick, 1000);

  const m = location.hash.match(/^#event=([\w-]+)/);
  if (m && byId(m[1])) openEvent(m[1]);
})();
