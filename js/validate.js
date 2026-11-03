/* ==========================================================================
   K EXPLORE — form validation
   Each rule returns an error string, or '' when the value is fine.
   Phone rules follow Indian mobile numbers (10 digits, starts 6–9, optional +91).
   ========================================================================== */
(function (KX) {
  'use strict';

  var rules = {
    name: function (v) {
      v = v.trim().replace(/\s+/g, ' ');
      if (!v) return 'Tell us your name so we can print it on the ticket.';
      if (v.length < 2) return 'That looks too short — at least 2 characters.';
      if (v.length > 60) return 'Keep it under 60 characters.';
      if (!/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ .'\-]*$/.test(v)) return 'Names can only use letters, spaces, dots, hyphens and apostrophes.';
      return '';
    },

    email: function (v) {
      v = v.trim();
      if (!v) return 'We need an email to send your ticket details.';
      if (/\s/.test(v)) return 'Emails cannot contain spaces.';
      if (!/^[^\s@.][^\s@]*@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/.test(v) || /\.\./.test(v)) {
        return 'That email doesn’t look right — try name@example.com.';
      }
      return '';
    },

    phone: function (v) {
      var digits = v.replace(/[\s\-()]/g, '');
      if (!digits) return 'Add a phone number so organisers can reach you.';
      if (/[^\d+]/.test(digits)) return 'Phone numbers can only contain digits, spaces and a leading +.';
      digits = digits.replace(/^(\+91|91|0)(?=\d{10}$)/, '');
      if (!/^\d{10}$/.test(digits)) return 'Enter a 10-digit mobile number (with or without +91).';
      if (!/^[6-9]/.test(digits)) return 'Mobile numbers start with 6, 7, 8 or 9.';
      return '';
    },

    event: function (v) {
      if (!v) return 'Pick the event you want a seat at.';
      if (!KX.byId[v]) return 'That event doesn’t exist — pick one from the list.';
      if (KX.store.seatsLeft(KX.byId[v]) <= 0) return 'Sold out! Pick another event.';
      return '';
    },

    promise: function (checked) {
      return checked ? '' : 'Go on, promise. Empty seats make organisers sad.';
    }
  };

  /* Normalise a phone number for storage, e.g. +91 98765 43210 */
  function formatPhone(v) {
    var d = v.replace(/[\s\-()+]/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
    return '+91 ' + d.slice(0, 5) + ' ' + d.slice(5);
  }

  KX.validate = { rules: rules, formatPhone: formatPhone };

})(window.KX = window.KX || {});
