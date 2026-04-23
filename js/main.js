/* ============================================================
   NEXTROUTINE v4 — main.js
   Sticky nav · Mobile overlay · Scroll animations · 
   Email forms · Cookie consent · Pricing toggle · 
   Content gates · Counter animation · FAQ accordion
   ============================================================ */

(function () {
  'use strict';

  /* ── UTILITY ── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ── 1. STICKY NAV ── */
  function initNav() {
    const nav = $('.nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 2. MOBILE HAMBURGER OVERLAY ── */
  function initMobileNav() {
    const hamburger = $('.nav-hamburger');
    const overlay   = $('.nav-overlay');
    if (!hamburger || !overlay) return;

    const toggle = (open) => {
      hamburger.classList.toggle('open', open);
      overlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', String(open));
    };

    hamburger.addEventListener('click', () => toggle(!hamburger.classList.contains('open')));
    $$('.nav-overlay-link', overlay).forEach(link => link.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) toggle(false);
    });
  }

  /* ── 3. SCROLL FADE-IN ANIMATIONS ── */
  function initScrollAnimations() {
    const els = $$('.fade-in');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => observer.observe(el));
  }

  /* ── 4. COUNTER ANIMATION ── */
  function initCounters() {
    const counters = $$('[data-count]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target   = parseFloat(el.dataset.count);
      const suffix   = el.dataset.suffix || '';
      const prefix   = el.dataset.prefix || '';
      const duration = 1600;
      const start    = performance.now();
      const isFloat  = target % 1 !== 0;

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = target * eased;
        el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateCounter(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  /* ── 5. STICKY MOBILE CTA BAR ── */
  function initStickyCTA() {
    const bar  = $('.sticky-cta');
    const hero = $('.hero');
    if (!bar || !hero) return;

    const observer = new IntersectionObserver((entries) => {
      bar.style.display = entries[0].isIntersecting ? 'none' : 'flex';
    }, { threshold: 0 });
    observer.observe(hero);
  }

  /* ── 6. EMAIL FORM HANDLING ── */
  function initEmailForms() {
    const isSubscribed = localStorage.getItem('nr_subscribed') === 'true';

    $$('form').forEach(form => {
      const input = form.querySelector('input[type="email"]');
      if (!input) return;
      const btn   = form.querySelector('button[type="submit"]');
      const micro = form.closest('[data-form-wrap]')?.querySelector('.form-micro') ||
                    form.parentElement?.querySelector('.form-micro');

      if (isSubscribed && input) {
        input.value   = localStorage.getItem('nr_email') || '';
        input.disabled = true;
        if (btn) { btn.textContent = '✓ You\'re subscribed'; btn.disabled = true; }
      }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = input.value.trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          input.style.borderColor = '#EF4444';
          input.focus();
          setTimeout(() => { input.style.borderColor = ''; }, 2000);
          return;
        }

        const originalText = btn ? btn.textContent : '';
        if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

        try {
          // TODO: Replace with real ESP endpoint before deploy
          // await fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ api_key: 'YOUR_API_KEY', email })
          // });
          await new Promise(r => setTimeout(r, 800));

          localStorage.setItem('nr_subscribed', 'true');
          localStorage.setItem('nr_email', email);
          input.disabled = true;

          if (btn) { btn.textContent = '✓ Check your inbox'; btn.style.background = 'var(--green)'; }
          if (micro) micro.textContent = 'Starter pack on its way. Check your inbox.';

          if (typeof gtag !== 'undefined') {
            gtag('event', 'email_signup', { form_id: form.id || 'unnamed' });
          }

        } catch (err) {
          if (btn) { btn.textContent = originalText; btn.disabled = false; }
        }
      });
    });
  }

  /* ── 7. COOKIE CONSENT ── */
  function initCookieConsent() {
    const COOKIE_KEY = 'nr_cookie_consent';
    const banner     = $('.cookie-banner');
    if (!banner) return;

    const consent = localStorage.getItem(COOKIE_KEY);
    if (consent === 'accepted') { loadAnalytics(); return; }
    if (!consent) banner.classList.add('visible');

    const acceptBtn = banner.querySelector('.cookie-accept');
    const rejectBtn = banner.querySelector('.cookie-reject');

    if (acceptBtn) acceptBtn.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'accepted');
      banner.classList.remove('visible');
      loadAnalytics();
    });

    if (rejectBtn) rejectBtn.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'rejected');
      banner.classList.remove('visible');
    });

    $$('.cookie-settings-trigger').forEach(link => {
      link.addEventListener('click', (e) => { e.preventDefault(); banner.classList.add('visible'); });
    });
  }

  function loadAnalytics() {
    const GA_ID = 'G-XXXXXXXXXX'; // ← Replace before deploy
    if (GA_ID === 'G-XXXXXXXXXX' || document.querySelector(`script[src*="${GA_ID}"]`)) return;
    const s = document.createElement('script');
    s.src   = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  /* ── 8. PRICING TOGGLE ── */
  const STRIPE_LINKS = {
    proMonthly:     'https://buy.stripe.com/REPLACE_PRO_MONTHLY',
    proAnnual:      'https://buy.stripe.com/REPLACE_PRO_ANNUAL',
    proPlusMonthly: 'https://buy.stripe.com/REPLACE_PROPLUS_MONTHLY',
    proPlusAnnual:  'https://buy.stripe.com/REPLACE_PROPLUS_ANNUAL',
  };

  function initPricingToggle() {
    const toggle = $('.toggle-switch');
    if (!toggle) return;
    let isAnnual = false;

    const update = () => {
      toggle.classList.toggle('active', isAnnual);
      $$('.price-monthly').forEach(el => el.style.display = isAnnual ? 'none' : '');
      $$('.price-annual').forEach(el  => el.style.display = isAnnual ? ''     : 'none');
      $$('[data-stripe="pro"]').forEach(btn     => { btn.href = isAnnual ? STRIPE_LINKS.proAnnual     : STRIPE_LINKS.proMonthly; });
      $$('[data-stripe="proplus"]').forEach(btn => { btn.href = isAnnual ? STRIPE_LINKS.proPlusAnnual : STRIPE_LINKS.proPlusMonthly; });
    };

    toggle.addEventListener('click', () => { isAnnual = !isAnnual; update(); });
    update();
  }

  /* ── 9. CONTENT GATE ── */
  function initContentGate() {
    $$('.template-unlock-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.querySelector('[data-email-capture]') ||
                       document.querySelector('#newsletter-cta') ||
                       document.querySelector('.final-form');
        if (!target) return;

        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          target.style.transition = 'box-shadow 0.3s ease';
          target.style.boxShadow  = '0 0 0 4px rgba(45,106,79,0.4)';
          setTimeout(() => { target.style.boxShadow = ''; }, 1200);
          const input = target.querySelector('input[type="email"]');
          if (input && !input.disabled) input.focus();
        }, 600);
      });
    });
  }

  /* ── 10. FAQ ACCORDION ── */
  function initFAQ() {
    const items = $$('.faq-item');
    if (!items.length) return;
    if (items[0]) items[0].classList.add('open');

    items.forEach(item => {
      const btn = item.querySelector('.faq-question');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ── 11. BLOG FILTER ── */
  function initBlogFilter() {
    const filters = $$('.filter-btn');
    const cards   = $$('.blog-card[data-category]');
    if (!filters.length) return;

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        cards.forEach(card => {
          card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
        });
      });
    });
  }

  /* ── 12. SMOOTH SCROLL ── */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ── 13. YEAR ── */
  function initYear() {
    $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  }

  /* ── 14. PERSONALISE CTAs FROM STORED TRACK ── */
  function personaliseCTAs() {
    const track = localStorage.getItem('nr_quiz_track');
    if (!track) return;
    const labels = { sleep: 'Sleep Better', morning: 'Morning Routine', screen: 'Screen Time Reset', dad: 'New Dad', midlife: 'Midlife Reset' };
    const label = labels[track];
    if (!label) return;
    $$('[data-personalise-cta]').forEach(el => { el.textContent = `Get My Free ${label} Plan →`; });
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initMobileNav();
    initScrollAnimations();
    initCounters();
    initStickyCTA();
    initEmailForms();
    initCookieConsent();
    initPricingToggle();
    initContentGate();
    initFAQ();
    initBlogFilter();
    initSmoothScroll();
    initYear();
    personaliseCTAs();
  });

})();
