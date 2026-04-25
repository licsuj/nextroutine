/* ============================================================
   NEXTROUTINE v4 — main.js
   Nav · Hamburger · Scroll fade · Form validation ·
   Cookie consent · Stripe redirects · Smooth scroll
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     NAV — sticky scroll state
     ---------------------------------------------------------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y > 40) { nav.classList.add('scrolled'); }
      else { nav.classList.remove('scrolled'); }
      lastScroll = y;
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     HAMBURGER — mobile overlay
     ---------------------------------------------------------- */
  var hamburger = document.querySelector('.nav-hamburger');
  var overlay = document.getElementById('nav-overlay');
  var overlayClose = document.querySelector('.nav-overlay-close');

  function openMenu() {
    if (!overlay) return;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (overlayClose) overlayClose.addEventListener('click', closeMenu);
  if (overlay) {
    overlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ----------------------------------------------------------
     SCROLL FADE — IntersectionObserver with stagger
     ---------------------------------------------------------- */
  function initFadeIn() {
    var els = document.querySelectorAll('.fade-in');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute('data-delay');
          if (delay) {
            entry.target.style.transitionDelay = delay + 'ms';
          }
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------
     FORM VALIDATION — hero + final CTA
     ---------------------------------------------------------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function initForm(formId, errorId, successId) {
    var form = document.getElementById(formId);
    if (!form) return;
    var input = form.querySelector('input[type="email"]');
    var stageSelect = form.querySelector('select[name="stage"]');
    var errorEl = document.getElementById(errorId);
    var successEl = document.getElementById(successId);
    if (!input) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = input.value.trim();
      var stage = stageSelect ? stageSelect.value : '';

      // Clear previous state
      if (errorEl) errorEl.classList.remove('visible');
      input.style.borderColor = '';
      if (stageSelect) stageSelect.style.borderColor = '';

      // Validate stage
      if (stageSelect && !stage) {
        stageSelect.style.borderColor = '#e74c3c';
        if (errorEl) errorEl.classList.add('visible');
        stageSelect.focus();
        return;
      }

      // Validate email
      if (!email || !EMAIL_RE.test(email)) {
        input.style.borderColor = '#e74c3c';
        if (errorEl) errorEl.classList.add('visible');
        input.focus();
        return;
      }

      // Success — hide form, show success
      input.disabled = true;
      if (stageSelect) stageSelect.disabled = true;
      form.style.display = 'none';
      if (successEl) successEl.classList.add('visible');

      // Store subscribed state + stage (no PII)
      try {
        localStorage.setItem('nr_subscribed', 'true');
        if (stage) localStorage.setItem('nr_stage', stage);
      } catch (ex) {}

      // TODO: Uncomment and configure ESP endpoint
      // fetch('YOUR_ESP_ENDPOINT', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: email, stage: stage })
      // });
    });

    // Check if already subscribed
    try {
      if (localStorage.getItem('nr_subscribed') === 'true') {
        form.style.display = 'none';
        if (successEl) successEl.classList.add('visible');
      }
    } catch (ex) {}
  }

  /* ----------------------------------------------------------
     SMOOTH SCROLL — all anchors pointing to #free-signup
     ---------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href="#free-signup"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById('free-signup');
        if (target) {
          var offset = nav ? nav.offsetHeight + 20 : 88;
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
          // Focus the email input
          var inp = target.querySelector('input[type="email"]');
          if (inp) setTimeout(function () { inp.focus(); }, 500);
        }
      });
    });
  }

  /* ----------------------------------------------------------
     STRIPE REDIRECTS
     ---------------------------------------------------------- */
  function initStripe() {
    // Pro monthly button in hero + offer section
    document.querySelectorAll('[data-stripe="pro-monthly"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        // Replace with your Stripe payment link
        window.location.href = 'https://buy.stripe.com/REPLACE_PRO_MONTHLY';
      });
    });
    // Pro annual button in offer section
    document.querySelectorAll('[data-stripe="pro-annual"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'https://buy.stripe.com/REPLACE_PRO_ANNUAL';
      });
    });
  }

  /* ----------------------------------------------------------
     COOKIE CONSENT — GDPR
     ---------------------------------------------------------- */
  function initCookieConsent() {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;

    try {
      var consent = localStorage.getItem('nr_cookie_consent');
      if (consent) {
        if (consent === 'accepted') loadGA();
        return; // Already decided — don't show banner
      }
    } catch (ex) {}

    // Show banner
    banner.classList.add('visible');

    var acceptBtn = document.getElementById('cookie-accept');
    var declineBtn = document.getElementById('cookie-decline');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        try { localStorage.setItem('nr_cookie_consent', 'accepted'); } catch (ex) {}
        banner.classList.remove('visible');
        loadGA();
      });
    }
    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        try { localStorage.setItem('nr_cookie_consent', 'declined'); } catch (ex) {}
        banner.classList.remove('visible');
      });
    }
  }

  function loadGA() {
    var GA_ID = 'G-XXXXXXXXXX'; // Replace with your GA4 measurement ID
    if (GA_ID === 'G-XXXXXXXXXX') return; // Don't load placeholder

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  /* ----------------------------------------------------------
     FOOTER YEAR
     ---------------------------------------------------------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ----------------------------------------------------------
     INIT
     ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initFadeIn();
    initForm('hero-form', 'hero-error', 'hero-success');
    initForm('final-form', 'final-error', 'final-success');
    initSmoothScroll();
    initStripe();
    initCookieConsent();
    initYear();
  });

})();
