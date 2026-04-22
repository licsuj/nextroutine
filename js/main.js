/* ============================================================
   NEXTROUTINE.COM — Main JavaScript
   All interactions, animations, pricing toggle, cookie consent
   ============================================================ */

'use strict';

/* ── Utility ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── Nav: Scroll behaviour + Mobile menu ── */
(function initNav() {
  const nav = $('.nav');
  if (!nav) return;

  // Scroll state
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  const hamburger = $('.hamburger');
  const mobileMenu = $('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  $$('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  // Close on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('nav-open');
    }
  });
})();

/* ── Scroll Animations (IntersectionObserver) ── */
(function initScrollAnimations() {
  const items = $$('.fade-in');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  items.forEach(el => observer.observe(el));
})();

/* ── Pricing Toggle ── */
(function initPricingToggle() {
  const toggleBtns = $$('.pricing-toggle-btn');
  const pricingSection = $('.pricing-section') || document.body;

  if (!toggleBtns.length) return;

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const isAnnual = btn.dataset.period === 'annual';
      pricingSection.classList.toggle('show-annual', isAnnual);
    });
  });
})();

/* ── FAQ Accordion ── */
(function initFAQ() {
  const items = $$('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      // Open clicked if was closed
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Initialize aria
    btn.setAttribute('aria-expanded', 'false');
  });

  // Open first by default
  if (items[0]) {
    items[0].classList.add('open');
    items[0].querySelector('.faq-question')?.setAttribute('aria-expanded', 'true');
  }
})();

/* ── Cookie Consent (GDPR) ── */
(function initCookieConsent() {
  const banner = $('#cookie-banner');
  if (!banner) return;

  const CONSENT_KEY = 'nr_cookie_consent';
  const consent = localStorage.getItem(CONSENT_KEY);

  // Show banner if no consent stored
  if (!consent) {
    banner.classList.remove('hidden');
  } else if (consent === 'accepted') {
    loadAnalytics();
  }

  const acceptBtn = $('#cookie-accept');
  const declineBtn = $('#cookie-decline');

  acceptBtn?.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    banner.classList.add('hidden');
    loadAnalytics();
  });

  declineBtn?.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    banner.classList.add('hidden');
  });
})();

function loadAnalytics() {
  // Only load GA if consent given
  // Replace G-XXXXXXXXXX with your actual GA4 Measurement ID
  const GA_ID = 'G-XXXXXXXXXX';
  if (GA_ID === 'G-XXXXXXXXXX') return; // placeholder guard

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

/* ── Email Form Handling ── */
(function initEmailForms() {
  const forms = $$('.email-form');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button[type="submit"]');
      const success = form.nextElementSibling;

      if (!input?.value || !input.value.includes('@')) {
        input?.focus();
        return;
      }

      // Loading state
      const originalText = btn.textContent;
      btn.textContent = 'Joining...';
      btn.disabled = true;

      try {
        // Replace with your ESP endpoint (ConvertKit, Mailchimp, etc.)
        // Example ConvertKit:
        // await fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ api_key: 'YOUR_API_KEY', email: input.value })
        // });

        // Simulate success for now
        await new Promise(r => setTimeout(r, 800));

        // Show success state
        form.style.display = 'none';
        if (success && success.classList.contains('form-success')) {
          success.classList.add('visible');
        } else {
          // Fallback inline success
          const msg = document.createElement('p');
          msg.style.cssText = 'color: var(--emerald-light); font-weight: 600; padding: 1rem 0;';
          msg.textContent = '🎉 You\'re in! Check your inbox for the 7-Day Phone Reset Plan.';
          form.parentNode.insertBefore(msg, form.nextSibling);
        }

      } catch (err) {
        btn.textContent = 'Try again';
        btn.disabled = false;
        console.error('Form submission error:', err);
      }
    });
  });
})();

/* ── Blog Category Filter ── */
(function initBlogFilter() {
  const filterBtns = $$('.filter-btn');
  const cards = $$('.blog-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category || 'all';

      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = '';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

/* ── Smooth Scroll for anchor links ── */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── Active nav link based on scroll position ── */
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link[href*="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href').includes(id));
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
})();

/* ── Animated counter for stat numbers ── */
(function initCounters() {
  const stats = $$('.stat-number[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1500;
      const start = performance.now();

      const animate = (time) => {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();

/* ── Pulse animation on primary CTA ── */
(function initCTAPulse() {
  const primaryBtns = $$('.btn-primary');
  primaryBtns.forEach(btn => {
    let pulseInterval;

    btn.addEventListener('mouseenter', () => {
      clearInterval(pulseInterval);
    });

    btn.addEventListener('mouseleave', () => {
      // Nothing needed — CSS handles hover
    });
  });
})();
