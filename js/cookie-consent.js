/* ============================================================
   NEXTROUTINE — cookie-consent.js
   GDPR-compliant cookie consent with preferences modal.
   GA4 blocked by default — only fires on Accept/Analytics toggle.
   ============================================================ */
(function () {
  'use strict';
  var STORAGE_KEY = 'nr_cookie_consent';
  var CONSENT_EXPIRY_DAYS = 180;
  var GA_ID = 'G-BS9N5GBYXK';

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (data.timestamp) {
        var age = Date.now() - data.timestamp;
        if (age > CONSENT_EXPIRY_DAYS * 864e5) { localStorage.removeItem(STORAGE_KEY); return null; }
      }
      return data;
    } catch (e) { return null; }
  }
  function setConsent(p) {
    try { p.timestamp = Date.now(); localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (e) {}
  }

  var gaLoaded = false;
  function loadGA4() {
    if (gaLoaded) return;
    gaLoaded = true;
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date()); gtag('config', GA_ID, { anonymize_ip: true });
  }
  function removeGA4() { window['ga-disable-' + GA_ID] = true; }

  function createUI() {
    var d = document.createElement('div');
    d.innerHTML =
      '<div class="cc-banner" id="cc-banner" role="dialog" aria-label="Cookie consent">' +
        '<div class="cc-banner-inner">' +
          '<div class="cc-banner-text">' +
            '<strong>We value your privacy</strong>' +
            '<p>We use cookies to understand how fathers find us. Analytics are off by default. <a href="/privacy.html#cookies">Learn more</a></p>' +
          '</div>' +
          '<div class="cc-banner-actions">' +
            '<button class="cc-btn cc-btn-accept" id="cc-accept-all">Accept All</button>' +
            '<button class="cc-btn-link" id="cc-reject">Reject Non-Essential</button>' +
            '<button class="cc-btn-link" id="cc-manage">Manage Preferences</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="cc-modal-overlay" id="cc-modal" aria-hidden="true">' +
        '<div class="cc-modal" role="dialog" aria-label="Cookie preferences">' +
          '<div class="cc-modal-header"><h3>Cookie Preferences</h3><button class="cc-modal-close" id="cc-modal-close" aria-label="Close">✕</button></div>' +
          '<div class="cc-modal-body">' +
            '<div class="cc-pref-row"><div class="cc-pref-info"><div class="cc-pref-label">Essential</div><p>Required for the site to function. Cannot be disabled.</p></div><div class="cc-toggle cc-toggle-locked"><input type="checkbox" checked disabled><span class="cc-slider"></span></div></div>' +
            '<div class="cc-pref-row"><div class="cc-pref-info"><div class="cc-pref-label">Analytics</div><p>Google Analytics 4. Anonymised usage data to improve content.</p></div><div class="cc-toggle"><input type="checkbox" id="cc-toggle-analytics"><span class="cc-slider"></span></div></div>' +
            '<div class="cc-pref-row"><div class="cc-pref-info"><div class="cc-pref-label">Marketing</div><p>Affiliate tracking cookies set by product merchants.</p></div><div class="cc-toggle"><input type="checkbox" id="cc-toggle-marketing"><span class="cc-slider"></span></div></div>' +
          '</div>' +
          '<div class="cc-modal-footer"><button class="cc-btn cc-btn-accept" id="cc-save-prefs">Save Preferences</button></div>' +
        '</div>' +
      '</div>';
    while (d.firstChild) document.body.appendChild(d.firstChild);
  }

  function init() {
    createUI();
    var banner = document.getElementById('cc-banner');
    var modal = document.getElementById('cc-modal');
    var tA = document.getElementById('cc-toggle-analytics');
    var tM = document.getElementById('cc-toggle-marketing');
    var consent = getConsent();
    if (consent) { if (consent.analytics) loadGA4(); return; }
    banner.classList.add('visible');

    document.getElementById('cc-accept-all').addEventListener('click', function () {
      setConsent({ essential: true, analytics: true, marketing: true });
      banner.classList.remove('visible'); loadGA4();
    });
    document.getElementById('cc-reject').addEventListener('click', function () {
      setConsent({ essential: true, analytics: false, marketing: false });
      banner.classList.remove('visible'); removeGA4();
    });
    document.getElementById('cc-manage').addEventListener('click', function () {
      banner.classList.remove('visible');
      if (tA) tA.checked = false; if (tM) tM.checked = false;
      modal.classList.add('visible'); modal.setAttribute('aria-hidden', 'false');
    });
    document.getElementById('cc-modal-close').addEventListener('click', function () {
      modal.classList.remove('visible'); modal.setAttribute('aria-hidden', 'true');
      if (!getConsent()) banner.classList.add('visible');
    });
    document.getElementById('cc-save-prefs').addEventListener('click', function () {
      var a = tA ? tA.checked : false, m = tM ? tM.checked : false;
      setConsent({ essential: true, analytics: a, marketing: m });
      modal.classList.remove('visible'); modal.setAttribute('aria-hidden', 'true');
      if (a) loadGA4(); else removeGA4();
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.classList.remove('visible'); modal.setAttribute('aria-hidden', 'true');
        if (!getConsent()) banner.classList.add('visible');
      }
    });
    document.querySelectorAll('[data-cc-open]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var c = getConsent();
        if (tA) tA.checked = c ? c.analytics : false;
        if (tM) tM.checked = c ? c.marketing : false;
        modal.classList.add('visible'); modal.setAttribute('aria-hidden', 'false');
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
