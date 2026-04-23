'use strict';
/* ============================================================
   NEXTROUTINE.COM — main.js v3.0
   Quiz, content gates, pricing toggle, scroll animations,
   cookie consent, sticky CTA, form handling, nav behaviour
   ============================================================ */

/* ── Utilities ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── Nav scroll behaviour ── */
(function initNav() {
  const nav = $('.nav');
  if (!nav) return;

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  const hamburger = $('.hamburger');
  const mobileMenu = $('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  $$('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('nav-open');
    }
  });
})();

/* ── Scroll animations (IntersectionObserver) ── */
(function initScrollAnimations() {
  const items = $$('.fade-in');
  if (!items.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => obs.observe(el));
})();

/* ── Sticky mobile CTA ── */
(function initStickyCTA() {
  const bar = $('#sticky-cta');
  if (!bar) return;

  const hero = $('.hero') || $('#hero');
  if (!hero) return;

  if (window.innerWidth <= 768) {
    document.body.classList.add('has-sticky-cta');
  }

  const obs = new IntersectionObserver((entries) => {
    bar.classList.toggle('visible', !entries[0].isIntersecting);
  }, { threshold: 0.05 });

  obs.observe(hero);

  // Hide when form submitted
  $$('.email-form, .hero-form, .final-form').forEach(form => {
    form.addEventListener('submit', () => {
      bar.classList.remove('visible');
      document.body.classList.remove('has-sticky-cta');
    });
  });
})();

/* ── QUIZ ── */
(function initQuiz() {
  const quizWrapper = $('#quiz');
  if (!quizWrapper) return;

  /* Quiz data */
  const TRACKS = {
    sleep: {
      name: 'Sleep Reset',
      color: '#2EC4B6',
      bg: 'rgba(46,196,182,0.1)',
      emoji: '😴',
      tagline: "You're not lazy — your sleep is broken. And it's probably your phone.",
      cta: 'Get My Free Sleep Reset Plan →',
      ctaClass: 'btn-teal',
      href: '/sleep-better.html'
    },
    morning: {
      name: 'Morning Routine Builder',
      color: '#FF6B35',
      bg: 'rgba(255,107,53,0.1)',
      emoji: '🌅',
      tagline: "Your mornings are disappearing. A 23-minute protocol will fix that.",
      cta: 'Get My Free Morning Plan →',
      ctaClass: 'btn-primary',
      href: '/morning-routine.html'
    },
    screen: {
      name: 'Screen Time Reset',
      color: '#7C3AED',
      bg: 'rgba(124,58,237,0.1)',
      emoji: '📵',
      tagline: "You're not addicted to your phone. You're under-stimulated everywhere else. Let's fix that.",
      cta: 'Get My Free Detox Plan →',
      ctaClass: 'btn-purple',
      href: '/screen-time.html'
    },
    dad: {
      name: 'Dad Track',
      color: '#FFD166',
      bg: 'rgba(255,209,102,0.12)',
      emoji: '👨‍👶',
      tagline: "You're about to become a father. Nobody's preparing you. We are.",
      cta: 'Get the Dad Track Plan →',
      ctaClass: 'btn-yellow',
      href: '/dad-track.html'
    },
    midlife: {
      name: 'Midlife Reset',
      color: '#1E3A5F',
      bg: 'rgba(30,58,95,0.08)',
      emoji: '🎯',
      tagline: "You know what to do. You're not doing it. The problem is the system, not the motivation.",
      cta: 'Get My Free Reset Plan →',
      ctaClass: 'btn-navy',
      href: '#newsletter-cta'
    }
  };

  const Q2_BRANCHES = {
    A: { // Exhausted sleep
      question: 'What time do you usually wake up?',
      options: [
        { letter: 'A', text: 'Before 6am — I have to be up early', value: 'sleep' },
        { letter: 'B', text: '6–7:30am — standard schedule', value: 'sleep' },
        { letter: 'C', text: 'After 7:30am when I can', value: 'sleep' },
        { letter: 'D', text: 'It varies — I have no real schedule', value: 'sleep' }
      ]
    },
    B: { // Morning disappears
      question: 'What kills your morning first?',
      options: [
        { letter: 'A', text: 'I check my phone before I\'m even out of bed', value: 'morning' },
        { letter: 'B', text: 'I have no routine so I just react to things', value: 'morning' },
        { letter: 'C', text: 'I run out of time before I do anything intentional', value: 'morning' },
        { letter: 'D', text: 'Poor sleep means I start the day behind', value: 'sleep' }
      ]
    },
    C: { // Screen time
      question: 'When is your worst scrolling habit?',
      options: [
        { letter: 'A', text: 'First thing in the morning — before I even get up', value: 'screen' },
        { letter: 'B', text: 'During the day — when I should be focused', value: 'screen' },
        { letter: 'C', text: 'At night in bed — I can\'t stop', value: 'screen' },
        { letter: 'D', text: 'All day honestly — I lose track of time', value: 'screen' }
      ]
    },
    D: { // Dad track
      question: 'Where are you in the journey?',
      options: [
        { letter: 'A', text: 'Just found out — we\'re expecting', value: 'dad' },
        { letter: 'B', text: 'Baby is on the way — partner is pregnant now', value: 'dad' },
        { letter: 'C', text: 'Baby is already here (0–12 months)', value: 'dad' },
        { letter: 'D', text: 'Toddler stage — 1 to 3 years old', value: 'dad' }
      ]
    },
    E: { // Midlife
      question: 'What area feels most stuck right now?',
      options: [
        { letter: 'A', text: 'Career and ambition — I\'m coasting and I hate it', value: 'midlife' },
        { letter: 'B', text: 'Health and energy — I\'ve let myself go', value: 'midlife' },
        { letter: 'C', text: 'Relationships and purpose — something\'s missing', value: 'midlife' },
        { letter: 'D', text: 'All of it honestly — I just feel stuck', value: 'midlife' }
      ]
    }
  };

  let q1Answer = null;
  let q2Answer = null;
  let quizTrack = null;

  const steps = {
    q1: $('#quiz-step-1'),
    q2: $('#quiz-step-2'),
    q3: $('#quiz-step-3'),
    result: $('#quiz-result')
  };

  const progressBars = $$('.quiz-progress-bar');

  function updateProgress(step) {
    progressBars.forEach((bar, i) => {
      bar.classList.remove('complete', 'active');
      if (i < step - 1) bar.classList.add('complete');
      else if (i === step - 1) bar.classList.add('active');
      const fill = bar.querySelector('.quiz-progress-fill');
      if (fill) {
        if (i < step - 1) fill.style.width = '100%';
        else if (i === step - 1) fill.style.width = '50%';
        else fill.style.width = '0%';
      }
    });
  }

  function showStep(step) {
    Object.values(steps).forEach(el => { if (el) el.classList.remove('active'); });
    if (steps[step]) steps[step].classList.add('active');
  }

  function buildQ2(q1Key) {
    const branch = Q2_BRANCHES[q1Key];
    if (!branch || !steps.q2) return;

    const questionEl = steps.q2.querySelector('.quiz-question');
    const optionsEl  = steps.q2.querySelector('.quiz-options');
    if (!questionEl || !optionsEl) return;

    questionEl.textContent = branch.question;
    optionsEl.innerHTML = branch.options.map(opt => `
      <button class="quiz-option" data-value="${opt.value}" type="button">
        <span class="quiz-option-letter">${opt.letter}</span>
        <span class="quiz-option-text">${opt.text}</span>
      </button>
    `).join('');

    // Wire up Q2 options
    $$('.quiz-option', optionsEl).forEach(btn => {
      btn.addEventListener('click', () => {
        q2Answer = btn.dataset.value;
        updateProgress(3);
        showStep('q3');
      });
    });
  }

  // Q1 options
  $$('.quiz-option', steps.q1).forEach(btn => {
    btn.addEventListener('click', () => {
      q1Answer = btn.dataset.value;
      buildQ2(q1Answer);
      updateProgress(2);
      showStep('q2');
    });
  });

  // Q3 options
  if (steps.q3) {
    $$('.quiz-option', steps.q3).forEach(btn => {
      btn.addEventListener('click', () => {
        const timeAnswer = btn.dataset.value;
        // Determine final track
        quizTrack = q2Answer || mapQ1ToTrack(q1Answer);
        showResult(quizTrack, timeAnswer);
      });
    });
  }

  function mapQ1ToTrack(q1Key) {
    const map = { A: 'sleep', B: 'morning', C: 'screen', D: 'dad', E: 'midlife' };
    return map[q1Key] || 'morning';
  }

  function showResult(trackKey, timeValue) {
    const track = TRACKS[trackKey] || TRACKS.morning;
    updateProgress(4);

    if (!steps.result) return;

    const trackLabel = steps.result.querySelector('.quiz-result-track');
    const headline   = steps.result.querySelector('.quiz-result-headline');
    const tagline    = steps.result.querySelector('.quiz-result-tagline');
    const ctaBtn     = steps.result.querySelector('.quiz-result-cta-btn');

    if (trackLabel) {
      trackLabel.textContent = `${track.emoji} ${track.name}`;
      trackLabel.style.background = track.bg;
      trackLabel.style.color = track.color;
    }
    if (headline) headline.textContent = `Your track: ${track.name}`;
    if (tagline)  tagline.textContent  = track.tagline;
    if (ctaBtn) {
      ctaBtn.textContent = track.cta;
      ctaBtn.className   = `btn ${track.ctaClass} quiz-result-cta-btn`;
      ctaBtn.href        = track.href;
    }

    // Personalise page email CTA based on quiz result
    localStorage.setItem('nr_quiz_track', trackKey);
    personaliseEmailCTAs(trackKey);

    // Progress all bars to complete
    progressBars.forEach(bar => {
      bar.classList.add('complete');
      const fill = bar.querySelector('.quiz-progress-fill');
      if (fill) fill.style.width = '100%';
    });

    showStep('result');
  }

  // Restart
  const restartBtn = $('#quiz-restart');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      q1Answer = q2Answer = quizTrack = null;
      updateProgress(1);
      showStep('q1');
    });
  }

  // Init
  updateProgress(1);
  showStep('q1');
})();

/* ── Personalise email CTAs from stored quiz result ── */
function personaliseEmailCTAs(trackKey) {
  const trackLabels = {
    sleep: 'Get My Free Sleep Reset Plan →',
    morning: 'Get My Free Morning Plan →',
    screen: 'Get My Free Detox Plan →',
    dad: 'Get the Dad Track Plan →',
    midlife: 'Get My Free Reset Plan →'
  };

  const label = trackLabels[trackKey];
  if (!label) return;

  $$('.hero-form-btn, .final-form-btn').forEach(btn => {
    btn.textContent = label;
  });
}

/* On load — restore quiz result if exists */
(function restoreQuizPersonalisation() {
  const stored = localStorage.getItem('nr_quiz_track');
  if (stored) personaliseEmailCTAs(stored);
})();

/* ── Content Gate (template unlock) ── */
(function initContentGate() {
  $$('.template-unlock-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = $('#newsletter-cta') || $('[data-email-capture]');
      if (!target) return;

      target.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Pulse the form
      setTimeout(() => {
        const form = target.querySelector('form, .email-box, .final-form');
        if (form) {
          form.classList.add('pulse');
          setTimeout(() => form.classList.remove('pulse'), 2000);
        }
        const input = target.querySelector('input[type="email"]');
        if (input) input.focus();
      }, 600);
    });
  });

  // Also handle lock overlay clicks
  $$('.template-lock-overlay').forEach(overlay => {
    overlay.style.cursor = 'pointer';
    overlay.addEventListener('click', () => {
      overlay.closest('.template-card')?.querySelector('.template-unlock-btn')?.click();
    });
  });
})();

/* ── Pricing Toggle ── */
(function initPricingToggle() {
  const btns = $$('.pricing-toggle-btn');
  if (!btns.length) return;

  const section = $('.pricing-section') || document.body;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      const annual = btn.dataset.period === 'annual';
      section.classList.toggle('show-annual', annual);
    });
  });

  // Show/hide price variants
  function updatePrices() {
    const isAnnual = section.classList.contains('show-annual');
    $$('.price-monthly').forEach(el => el.style.display = isAnnual ? 'none' : '');
    $$('.price-annual').forEach(el  => el.style.display = isAnnual ? '' : 'none');
    $$('.pricing-annual-note').forEach(el => el.style.display = isAnnual ? '' : 'none');
  }

  // MutationObserver to watch class changes
  const obs = new MutationObserver(updatePrices);
  obs.observe(section, { attributes: true, attributeFilter: ['class'] });
  updatePrices();
})();

/* ── FAQ Accordion ── */
(function initFAQ() {
  $$('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      $$('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    btn.setAttribute('aria-expanded', 'false');
  });

  // Open first by default
  const first = $('.faq-item');
  if (first) {
    first.classList.add('open');
    first.querySelector('.faq-question')?.setAttribute('aria-expanded', 'true');
  }
})();

/* ── Email Form Handling ── */
(function initEmailForms() {
  // Collect all email form types
  const formSelectors = [
    '.hero-form',
    '.final-form',
    '.email-form-inline',
    '.lead-form',
    '.newsletter-form'
  ];

  formSelectors.forEach(sel => {
    $$(sel).forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const btn   = form.querySelector('button[type="submit"], .hero-form-btn, .final-form-btn');
        const successEl = form.nextElementSibling;

        if (!input?.value || !input.value.includes('@')) {
          input?.focus();
          input?.classList.add('error');
          setTimeout(() => input?.classList.remove('error'), 2000);
          return;
        }

        if (btn) {
          btn.textContent = 'Sending…';
          btn.disabled = true;
          btn.style.opacity = '0.75';
        }

        try {
          /* ── REPLACE THIS BLOCK with your ESP endpoint ──
             Example ConvertKit:
             await fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                 api_key: 'YOUR_CONVERTKIT_API_KEY',
                 email: input.value,
                 tags: [getTrackTag()]
               })
             });
             ─────────────────────────────────────────────── */

          // Simulate for now
          await new Promise(r => setTimeout(r, 900));

          // Success state
          form.style.display = 'none';
          if (successEl && (successEl.classList.contains('form-success') || successEl.classList.contains('form-success-msg'))) {
            successEl.classList.add('visible');
          } else {
            const msg = document.createElement('div');
            msg.className = 'form-success visible';
            msg.innerHTML = '🎉 <strong>You\'re in!</strong> Check your inbox — your free plan is on the way.';
            form.parentNode.insertBefore(msg, form.nextSibling);
          }

          // Store email submitted flag
          localStorage.setItem('nr_email_submitted', '1');

          // GTM / GA4 event
          if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', {
              event_category: 'newsletter',
              track: localStorage.getItem('nr_quiz_track') || 'general'
            });
          }

        } catch (err) {
          if (btn) {
            btn.textContent = 'Try again';
            btn.disabled = false;
            btn.style.opacity = '';
          }
          console.error('Form error:', err);
        }
      });
    });
  });

  function getTrackTag() {
    const map = {
      sleep: 'sleep-reset',
      morning: 'morning-routine',
      screen: 'screen-time',
      dad: 'dad-track',
      midlife: 'midlife-reset'
    };
    return map[localStorage.getItem('nr_quiz_track')] || 'general';
  }
})();

/* ── Blog Category Filter ── */
(function initBlogFilter() {
  const filterBtns = $$('.filter-btn');
  const cards      = $$('.blog-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const cat = btn.dataset.category || 'all';
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.style.animation = 'none';
          requestAnimationFrame(() => { card.style.animation = ''; });
        }
      });
    });
  });
})();

/* ── Smooth scroll anchor links ── */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── Cookie Consent ── */
(function initCookieConsent() {
  const banner = $('#cookie-banner');
  if (!banner) return;

  const KEY = 'nr_cookie_consent';
  const consent = localStorage.getItem(KEY);

  if (!consent) {
    // Show after 2 seconds
    setTimeout(() => banner.classList.remove('hidden'), 2000);
  } else if (consent === 'accepted') {
    loadAnalytics();
  }

  $('#cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem(KEY, 'accepted');
    banner.classList.add('hidden');
    loadAnalytics();
  });

  $('#cookie-decline')?.addEventListener('click', () => {
    localStorage.setItem(KEY, 'declined');
    banner.classList.add('hidden');
  });
})();

function loadAnalytics() {
  const GA_ID = 'G-XXXXXXXXXX'; // Replace with real ID
  if (GA_ID === 'G-XXXXXXXXXX') return;

  if (document.querySelector(`script[src*="${GA_ID}"]`)) return;

  const s = document.createElement('script');
  s.src   = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s.async = true;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });
}

/* ── Animated Stat Counters ── */
(function initCounters() {
  const stats = $$('[data-count]');
  if (!stats.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur    = 1400;
      const start  = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const pct     = Math.min(elapsed / dur, 1);
        const eased   = 1 - Math.pow(1 - pct, 3);
        const val     = target * eased;
        el.textContent = prefix + (Number.isInteger(target) ? Math.floor(val) : val.toFixed(1)) + suffix;
        if (pct < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });

  stats.forEach(el => obs.observe(el));
})();

/* ── Set current year ── */
$$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
$('#year')?.textContent && ($('#year').textContent = new Date().getFullYear());

/* ── Highlight active nav link ── */
(function initActiveNav() {
  const currentPath = window.location.pathname;
  $$('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace('.html', '').replace('/index', ''))) {
      link.classList.add('active');
    }
  });

  if (currentPath === '/' || currentPath.includes('index')) {
    $$('.nav-link').forEach(l => l.classList.remove('active'));
  }
})();
