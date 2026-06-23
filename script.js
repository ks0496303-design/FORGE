/* ==========================================================================
   FORGE — Strength & Conditioning
   Main script — vanilla JS, no dependencies
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initThemeToggle();
  initBackToTop();
  initScrollReveal();
  initFaqAccordion();
  initEquipmentSearch();
  initExerciseFilter();
  initBmiCalculator();
  initContactForm();
  initMembershipForm();
  setActiveNavLink();
});

/* --------------------------------------------------------------------------
   Mobile hamburger menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
  });
}

/* --------------------------------------------------------------------------
   Dark / light theme toggle — persists choice in localStorage
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggle = document.querySelector('.theme-toggle');
  const root = document.documentElement;
  const STORAGE_KEY = 'forge-theme';

  const applyTheme = (theme) => {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
  };

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) applyTheme(saved);

  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });
}

/* --------------------------------------------------------------------------
   Back-to-top button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 480);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   Scroll-triggered reveal animations using IntersectionObserver
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((t) => observer.observe(t));
}

/* --------------------------------------------------------------------------
   FAQ accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other items (single-open accordion behavior)
      items.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Equipment search (equipment.html)
   -------------------------------------------------------------------------- */
function initEquipmentSearch() {
  const input = document.querySelector('#equipment-search');
  const cards = document.querySelectorAll('.equip-card');
  const noResults = document.querySelector('#equipment-no-results');
  if (!input || !cards.length) return;

  const filterCards = () => {
    const query = input.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const name = card.dataset.name?.toLowerCase() || '';
      const muscles = card.dataset.muscles?.toLowerCase() || '';
      const matches = name.includes(query) || muscles.includes(query);
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount += 1;
    });

    if (noResults) noResults.classList.toggle('is-visible', visibleCount === 0);
  };

  input.addEventListener('input', filterCards);
}

/* --------------------------------------------------------------------------
   Exercise filtering by muscle group (exercises.html)
   -------------------------------------------------------------------------- */
function initExerciseFilter() {
  const chips = document.querySelectorAll('.exercise-filter .chip');
  const categories = document.querySelectorAll('.exercise-category');
  const noResults = document.querySelector('#exercise-no-results');
  if (!chips.length || !categories.length) return;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      const target = chip.dataset.filter;
      let anyVisible = false;

      categories.forEach((cat) => {
        const matches = target === 'all' || cat.dataset.category === target;
        cat.style.display = matches ? '' : 'none';
        if (matches) anyVisible = true;
      });

      if (noResults) noResults.classList.toggle('is-visible', !anyVisible);
    });
  });
}

/* --------------------------------------------------------------------------
   BMI Calculator — supports metric (kg/cm) and imperial (lb/in)
   -------------------------------------------------------------------------- */
function initBmiCalculator() {
  const form = document.querySelector('#bmi-form');
  if (!form) return;

  const unitButtons = form.querySelectorAll('.unit-toggle button');
  const weightInput = form.querySelector('#bmi-weight');
  const heightInput = form.querySelector('#bmi-height');
  const weightLabel = form.querySelector('#bmi-weight-label');
  const heightLabel = form.querySelector('#bmi-height-label');
  const result = document.querySelector('#bmi-result');
  const resultNumber = result.querySelector('.bmi-number');
  const resultCategory = result.querySelector('.bmi-category');
  const resultAdvice = result.querySelector('.bmi-advice');
  const marker = result.querySelector('.marker');

  let unit = 'metric';

  unitButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      unitButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      unit = btn.dataset.unit;
      weightLabel.textContent = unit === 'metric' ? 'Weight (kg)' : 'Weight (lb)';
      heightLabel.textContent = unit === 'metric' ? 'Height (cm)' : 'Height (in)';
      weightInput.value = '';
      heightInput.value = '';
      result.classList.remove('is-visible');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);

    if (!weight || !height || weight <= 0 || height <= 0) {
      resultCategory.textContent = 'Please enter valid numbers';
      resultNumber.textContent = '--';
      resultAdvice.textContent = '';
      result.classList.add('is-visible');
      return;
    }

    let bmi;
    if (unit === 'metric') {
      // BMI = kg / (m^2)
      const heightM = height / 100;
      bmi = weight / (heightM * heightM);
    } else {
      // BMI = 703 * lb / (in^2)
      bmi = (703 * weight) / (height * height);
    }

    bmi = Math.round(bmi * 10) / 10;

    let category, advice;
    if (bmi < 18.5) {
      category = 'Underweight';
      advice = 'Consider a structured strength and nutrition plan to build healthy mass. Our Standard plan pairs you with personal guidance.';
    } else if (bmi < 25) {
      category = 'Healthy Range';
      advice = 'You\'re in a healthy range — keep training consistently. A mix of strength and cardio will maintain this.';
    } else if (bmi < 30) {
      category = 'Overweight';
      advice = 'A combined cardio and resistance program can help. Our Premium plan includes diet consultation to support this.';
    } else {
      category = 'Obese';
      advice = 'We recommend speaking with our trainers to build a sustainable, supervised plan. Book a consultation today.';
    }

    resultNumber.textContent = bmi.toFixed(1);
    resultCategory.textContent = category;
    resultAdvice.textContent = advice;
    result.classList.add('is-visible');

    // Position marker on the 15–40 BMI scale, clamped to 0–100%
    const clamped = Math.min(Math.max(bmi, 15), 40);
    const percent = ((clamped - 15) / (40 - 15)) * 100;
    marker.style.left = percent + '%';

    // Announce result to screen readers
    result.setAttribute('role', 'status');
  });
}

/* --------------------------------------------------------------------------
   Contact form — front-end validation + simulated submission
   (No backend included; replace handleSubmit with a real endpoint/Formspree/etc.)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const status = form.querySelector('.form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#contact-name').value.trim();
    const email = form.querySelector('#contact-email').value.trim();
    const message = form.querySelector('#contact-message').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      showStatus(status, 'Please fill in all required fields.', 'error');
      return;
    }
    if (!emailPattern.test(email)) {
      showStatus(status, 'Please enter a valid email address.', 'error');
      return;
    }

    // Simulated success — swap this block for a real fetch() to your backend or form service.
    showStatus(status, `Thanks, ${name}! Your message has been received. We'll reply to ${email} shortly.`, 'success');
    form.reset();
  });
}

/* --------------------------------------------------------------------------
   Membership inquiry form (used on membership.html)
   -------------------------------------------------------------------------- */
function initMembershipForm() {
  const form = document.querySelector('#membership-form');
  if (!form) return;

  const status = form.querySelector('.form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#mf-name').value.trim();
    const email = form.querySelector('#mf-email').value.trim();
    const plan = form.querySelector('#mf-plan').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !plan) {
      showStatus(status, 'Please complete all fields before submitting.', 'error');
      return;
    }
    if (!emailPattern.test(email)) {
      showStatus(status, 'Please enter a valid email address.', 'error');
      return;
    }

    showStatus(status, `Thanks, ${name}! Our team will contact you about the ${plan} plan within 24 hours.`, 'success');
    form.reset();
  });
}

/* --------------------------------------------------------------------------
   Shared helper — show a form status message
   -------------------------------------------------------------------------- */
function showStatus(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.classList.remove('success', 'error');
  el.classList.add(type, 'is-visible');
}

/* --------------------------------------------------------------------------
   Highlight the current page in nav links via aria-current
   (Belt-and-suspenders: also set directly in HTML, this covers edits.)
   -------------------------------------------------------------------------- */
function setActiveNavLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === current) {
      link.setAttribute('aria-current', 'page');
    }
  });
}
