/* ==========================================================================
   K EXPLORE — persistence (Local Storage)
   Tickets and the theme survive reloads. Every access is wrapped in try/catch
   because storage can be blocked (private mode, strict browser settings).
   ========================================================================== */
(function (KX) {
  'use strict';

  var KEYS = { tickets: 'kx.tickets.v1', theme: 'kx.theme' };
  var memory = {}; // fallback when storage is unavailable

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) { return key in memory ? memory[key] : fallback; }
  }
  function write(key, value) {
    memory[key] = value;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }

  function makeId() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', out = 'KX-';
    for (var i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  KX.store = {
    getTheme: function () { return read(KEYS.theme, null); },
    setTheme: function (t) { write(KEYS.theme, t); },

    tickets: function () { return read(KEYS.tickets, []); },

    /* Seats already taken = seeded demo number + tickets booked in this browser */
    seatsTaken: function (event) {
      var mine = this.tickets().filter(function (t) { return t.eventId === event.id; }).length;
      return event.registered + mine;
    },
    seatsLeft: function (event) { return Math.max(0, event.capacity - this.seatsTaken(event)); },

    hasTicket: function (eventId, email) {
      email = email.trim().toLowerCase();
      return this.tickets().some(function (t) { return t.eventId === eventId && t.email === email; });
    },

    add: function (data) {
      var list = this.tickets();
      var ticket = {
        id: makeId(),
        eventId: data.eventId,
        name: data.name.trim().replace(/\s+/g, ' '),
        email: data.email.trim().toLowerCase(),
        phone: data.phone,
        createdAt: Date.now()
      };
      list.unshift(ticket);
      write(KEYS.tickets, list);
      return ticket;
    },

    remove: function (id) {
      write(KEYS.tickets, this.tickets().filter(function (t) { return t.id !== id; }));
    }
  };

})(window.KX = window.KX || {});
