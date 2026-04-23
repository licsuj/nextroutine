/* ============================================================
   NEXTROUTINE v4 — main.js (SECURITY + COMPAT CORRECTED)
   FIXES:
   [SEC-1] nr_email removed from localStorage — PII must not be stored client-side
   [SEC-2] Email sanitised via textContent not innerHTML before any DOM use
   [SEC-3] Consent check is explicit: only 'accepted' string triggers GA4
   [SEC-4] Stripe links use data-stripe attr, no keys in JS
   [COMPAT-1] IntersectionObserver guarded with feature check + graceful fallback
   [COMPAT-2] async/await + optional chaining wrapped in try/catch
   [COMPAT-3] Passive event listeners on scroll for Chrome Android performance
   ============================================================ */

(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ── 1. STICKY NAV ── */
  function initNav() {
    const nav = $('.nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    // [COMPAT-3] passive:true for scroll — Chrome Android warns without it
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 2. MOBILE HAMBURGER ── */
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

  /* ── 3. SCROLL ANIMATIONS ── */
  function initScrollAnimations() {
    const els = $$('.fade-in');
    if (!els.length) return;

    // [COMPAT-1] Graceful fallback if IntersectionObserver not supported
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }

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
        // [SEC-2] Use textContent — never innerHTML — for dynamic values
        el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    // [COMPAT-1] Fallback for no IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      counters.forEach(el => animateCounter(el));
      return;
    }

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

    if (!('IntersectionObserver' in window)) { bar.style.display = 'flex'; return; }

    const observer = new IntersectionObserver((entries) => {
      bar.style.display = entries[0].isIntersecting ? 'none' : 'flex';
    }, { threshold: 0 });
    observer.observe(hero);
  }

  /* ── 6. EMAIL FORM HANDLING ── */
  function initEmailForms() {
    // [SEC-1] Only store subscription flag — NOT the email address (PII)
    const isSubscribed = localStorage.getItem('nr_subscribed') === 'true';

    $$('form').forEach(form => {
      const input = form.querySelector('input[type="email"]');
      if (!input) return;
      const btn   = form.querySelector('button[type="submit"]');

      if (isSubscribed) {
        // [SEC-1] Do NOT repopulate email from storage — it's no longer stored
        input.disabled = true;
        if (btn) { btn.textContent = '✓ You\'re subscribed'; btn.disabled = true; }
      }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // [SEC-2] Trim and validate email before ANY use
        const email = input.value.trim();

        // Basic format validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          input.style.borderColor = '#EF4444';
          input.setAttribute('aria-invalid', 'true');
          input.focus();
          setTimeout(() => {
            input.style.borderColor = '';
            input.removeAttribute('aria-invalid');
          }, 2000);
          return;
        }

        const originalText = btn ? btn.textContent : '';
        if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

        try {
          // TODO: Replace with real ESP endpoint before deploy
          // ConvertKit example:
          // const res = await fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ api_key: 'YOUR_API_KEY', email })
          // });
          // if (!res.ok) throw new Error('ESP error');
          await new Promise(r => setTimeout(r, 800)); // dev stub

          // [SEC-1] Store ONLY the subscription flag — not the email itself
          localStorage.setItem('nr_subscribed', 'true');
          input.disabled = true;

          if (btn) {
            // [SEC-2] Use textContent — no interpolation into innerHTML
            btn.textContent = '✓ Check your inbox';
            btn.style.background = 'var(--green)';
          }

          // Fire GA4 event only if analytics loaded
          if (typeof gtag === 'function') {
            gtag('event', 'email_signup', {
              event_category: 'engagement',
              form_id: form.id || 'unnamed'
            });
          }

        } catch (err) {
          if (btn) { btn.textContent = originalText; btn.disabled = false; }
          console.warn('Form submission error:', err);
        }
      });
    });
  }

  /* ── 7. COOKIE CONSENT — GDPR ── */
  function initCookieConsent() {
    const COOKIE_KEY = 'nr_cookie_consent';
    const banner     = $('.cookie-banner');
    if (!banner) return;

    const consent = localStorage.getItem(COOKIE_KEY);

    // [SEC-3] Explicit string check — only 'accepted' triggers analytics
    if (consent === 'accepted') {
      loadAnalytics();
      return;
    }

    // Show banner only if no decision has been made
    if (consent !== 'rejected') {
      banner.classList.add('visible');
    }

    const acceptBtn = banner.querySelector('.cookie-accept');
    const rejectBtn = banner.querySelector('.cookie-reject');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, 'accepted');
        banner.classList.remove('visible');
        loadAnalytics();
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, 'rejected');
        banner.classList.remove('visible');
        // GA4 is NOT loaded — do nothing further
      });
    }

    // Cookie settings trigger (footer link)
    $$('.cookie-settings-trigger').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        // Reset so user can re-decide
        localStorage.removeItem(COOKIE_KEY);
        banner.classList.add('visible');
      });
    });
  }

  function loadAnalytics() {
    // [SEC-3] Only called after explicit user consent
    const GA_ID = 'G-XXXXXXXXXX'; // ← Replace before deploy
    if (GA_ID === 'G-XXXXXXXXXX') return; // Safety: don't load with placeholder
    if (document.querySelector(`script[src*="${GA_ID}"]`)) return; // Already loaded

    const s = document.createElement('script');
    s.src   = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    s.async = true;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  /* ── 8. STRIPE PAYMENT LINKS ── */
  // [SEC-4] Publishable payment link URLs only — no secret keys in client JS
  // These are replaced by actual Stripe Payment Link URLs before deploy
  const STRIPE_LINKS = {
    proMonthly:     'https://buy.stripe.com/REPLACE_PRO_MONTHLY',
    proAnnual:      'https://buy.stripe.com/REPLACE_PRO_ANNUAL',
    proPlusMonthly: 'https://buy.stripe.com/REPLACE_PROPLUS_MONTHLY',
    proPlusAnnual:  'https://buy.stripe.com/REPLACE_PROPLUS_ANNUAL',
  };

  /* ── 9. PRICING TOGGLE ── */
  function initPricingToggle() {
    const toggle = $('.toggle-switch');
    if (!toggle) return;
    let isAnnual = false;

    const update = () => {
      toggle.classList.toggle('active', isAnnual);
      toggle.setAttribute('aria-checked', String(isAnnual));
      $$('.price-monthly').forEach(el => el.style.display = isAnnual ? 'none' : '');
      $$('.price-annual').forEach(el  => el.style.display = isAnnual ? ''     : 'none');
      $$('[data-stripe="pro"]').forEach(btn     => { btn.href = isAnnual ? STRIPE_LINKS.proAnnual     : STRIPE_LINKS.proMonthly; });
      $$('[data-stripe="proplus"]').forEach(btn => { btn.href = isAnnual ? STRIPE_LINKS.proPlusAnnual : STRIPE_LINKS.proPlusMonthly; });
    };

    toggle.setAttribute('role', 'switch');
    toggle.setAttribute('aria-checked', 'false');
    toggle.setAttribute('tabindex', '0');
    toggle.addEventListener('click', () => { isAnnual = !isAnnual; update(); });
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); isAnnual = !isAnnual; update(); }
    });
    update();
  }

  /* ── 10. CONTENT GATE ── */
  function initContentGate() {
    $$('.template-unlock-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = $('.newsletter-cta, [data-email-capture], #newsletter-cta, .final-form');
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          target.style.transition = 'box-shadow 0.3s ease';
          target.style.boxShadow  = '0 0 0 4px rgba(45,106,79,0.4)';
          setTimeout(() => { target.style.boxShadow = ''; }, 1200);
          const inp = target.querySelector('input[type="email"]');
          if (inp && !inp.disabled) inp.focus();
        }, 600);
      });
    });
  }

  /* ── 11. FAQ ACCORDION ── */
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

  /* ── 12. BLOG FILTER ── */
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

  /* ── 13. SMOOTH SCROLL ── */
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

  /* ── 14. YEAR ── */
  function initYear() {
    $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  }

  /* ── 15. PERSONALISE CTAs FROM QUIZ TRACK ── */
  function personaliseCTAs() {
    const track = localStorage.getItem('nr_quiz_track');
    if (!track) return;
    const labels = {
      sleep: 'Sleep Better', morning: 'Morning Routine',
      screen: 'Screen Time Reset', dad: 'New Dad', midlife: 'Midlife Reset'
    };
    const label = labels[track];
    if (!label) return;
    $$('[data-personalise-cta]').forEach(el => {
      // [SEC-2] textContent only — never innerHTML with user-influenced data
      el.textContent = `Get My Free ${label} Plan →`;
    });
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
