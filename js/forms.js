// js/forms.js
// Submits NextRoutine signup forms (newsletter + waitlist) to /api/subscribe.
// Replaces inline form handlers on every page that includes this script.

(function () {
  'use strict';

  // Selectors:
  // Newsletter forms: have both a <select name="stage"> and <input type="email">
  // Waitlist forms: have only <input type="email"> (no select)
  // Each form has matching #<id>-error and #<id>-success siblings outside the form

  function init() {
    var forms = document.querySelectorAll('form.hero-form, form.final-cta-form, form[data-nr-form]');
    forms.forEach(wireForm);
  }

  function wireForm(form) {
    if (form.dataset.wired === 'true') return;
    form.dataset.wired = 'true';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleSubmit(form);
    });
  }

  function handleSubmit(form) {
    var emailInput = form.querySelector('input[type="email"]');
    var stageInput = form.querySelector('select[name="stage"]');
    var submitBtn = form.querySelector('button[type="submit"]');

    var formId = form.id || '';
    var errorEl = document.getElementById(formId + '-error') || form.parentElement.querySelector('.form-error');
    var successEl = document.getElementById(formId + '-success') || form.parentElement.querySelector('.form-success');

    var email = emailInput ? emailInput.value.trim() : '';
    var stage = stageInput ? stageInput.value : '';
    var hasStage = !!stageInput;
    var type = hasStage ? 'newsletter' : 'waitlist';

    // Client-side validation
    if (!email || !isValidEmail(email)) {
      showError(errorEl, successEl, 'Please enter a valid email.');
      return;
    }
    if (hasStage && !stage) {
      showError(errorEl, successEl, 'Please select your stage.');
      return;
    }

    // Submit
    setLoading(submitBtn, true);
    hideMessages(errorEl, successEl);

    var payload = { email: email, type: type };
    if (hasStage) payload.stage = stage;

    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { status: response.status, data: data };
        });
      })
      .then(function (result) {
        setLoading(submitBtn, false);
        if (result.data && result.data.ok) {
          showSuccess(errorEl, successEl);
          form.style.display = 'none';
          // Optional: track conversion in GA if loaded
          if (typeof gtag === 'function') {
            gtag('event', 'sign_up', { method: type });
          }
        } else {
          var msg = (result.data && result.data.error) || 'Something went wrong. Please try again.';
          showError(errorEl, successEl, msg);
        }
      })
      .catch(function (err) {
        setLoading(submitBtn, false);
        showError(errorEl, successEl, 'Network error. Please try again.');
        console.error('Subscribe error:', err);
      });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setLoading(btn, isLoading) {
    if (!btn) return;
    if (isLoading) {
      btn.dataset.originalText = btn.innerHTML;
      btn.innerHTML = 'Subscribing…';
      btn.disabled = true;
    } else {
      if (btn.dataset.originalText) btn.innerHTML = btn.dataset.originalText;
      btn.disabled = false;
    }
  }

  function showError(errorEl, successEl, message) {
    if (errorEl) {
      if (message) errorEl.textContent = message;
      errorEl.classList.add('show');
    }
    if (successEl) successEl.classList.remove('show');
  }

  function showSuccess(errorEl, successEl) {
    if (errorEl) errorEl.classList.remove('show');
    if (successEl) successEl.classList.add('show');
  }

  function hideMessages(errorEl, successEl) {
    if (errorEl) errorEl.classList.remove('show');
    if (successEl) successEl.classList.remove('show');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
