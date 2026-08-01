/**
 * script.js – Sabeetha R Portfolio
 * ===================================================
 * Handles:
 *  1. Preloader
 *  2. Dark / Light theme toggle (localStorage persistence)
 *  3. Sticky navbar + active link highlighting
 *  4. Hamburger menu (mobile)
 *  5. Typing / typewriter animation
 *  6. Animated counter (hero stats)
 *  7. Scroll-reveal animations (AOS-lite, no library)
 *  8. Animated skill & education progress bars
 *  9. Floating particles (hero background)
 * 10. Back-to-Top button
 * 11. Contact form validation + submission simulation
 * 12. Toast notification utility
 * 13. Footer current year
 * ===================================================
 */

/* ──────────────────────────────────────────────────
   UTILS
────────────────────────────────────────────────── */

/**
 * Show a toast notification
 * @param {string} msg - Message to display
 * @param {number} [duration=3000] - Duration in ms
 */
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ──────────────────────────────────────────────────
   1. PRELOADER
────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  // Slight delay to show the loader for at least 800ms
  setTimeout(() => {
    preloader.classList.add('hidden');
    // Remove from DOM after transition ends
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
  }, 800);
});

/* ──────────────────────────────────────────────────
   2. DARK / LIGHT THEME TOGGLE
────────────────────────────────────────────────── */
(function initTheme() {
  const html      = document.documentElement;
  const toggle    = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  // Load saved preference (default: dark)
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateThemeIcon(saved);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
      updateThemeIcon(next);
      showToast(next === 'light' ? '☀️ Light mode on' : '🌙 Dark mode on');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
})();

/* ──────────────────────────────────────────────────
   3. STICKY NAVBAR + ACTIVE LINK HIGHLIGHTING
────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll handler: scrolled class + active link
  function onScroll() {
    if (!navbar) return;

    // Add / remove "scrolled" class
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Determine which section is currently in view
    let currentSection = '';
    sections.forEach(sec => {
      const sectionTop    = sec.offsetTop - 100;
      const sectionHeight = sec.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Close mobile menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navList = document.getElementById('navLinks');
      const hamburger = document.getElementById('hamburger');
      if (navList) navList.classList.remove('open');
      if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();

/* ──────────────────────────────────────────────────
   4. HAMBURGER MENU (MOBILE)
────────────────────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
})();

/* ──────────────────────────────────────────────────
   5. TYPING / TYPEWRITER ANIMATION
────────────────────────────────────────────────── */
(function initTypingAnimation() {
  const typedEl = document.getElementById('typedText');
  if (!typedEl) return;

  const phrases = [
    'Computer Science Student',
    'Full Stack Developer',
    'Java Programmer',
    'Web Developer',
    'Problem Solver',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  let pauseTimeout = null;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      // Remove one character
      typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add one character
      typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    // Typing speeds
    let speed = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Finished typing – pause before deleting
      speed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting – move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }

    pauseTimeout = setTimeout(type, speed);
  }

  // Start after a short delay
  setTimeout(type, 600);
})();

/* ──────────────────────────────────────────────────
   6. ANIMATED COUNTERS (hero stats)
────────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      let current  = 0;
      const step   = Math.max(1, Math.ceil(target / 40));

      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 40);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();

/* ──────────────────────────────────────────────────
   7. SCROLL-REVEAL ANIMATIONS (AOS-lite)
────────────────────────────────────────────────── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);

      setTimeout(() => {
        el.classList.add('aos-animated');
      }, delay);

      observer.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ──────────────────────────────────────────────────
   8. ANIMATED PROGRESS BARS (skills + education)
────────────────────────────────────────────────── */
(function initProgressBars() {
  // Skill bars (.skill-bar) and education bars (.progress-bar)
  const bars = document.querySelectorAll('.skill-bar[data-width], .progress-bar[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar   = entry.target;
      const width = bar.getAttribute('data-width') || '0';
      // Slight delay for visual polish
      setTimeout(() => {
        bar.style.width = `${width}%`;
      }, 200);
      observer.unobserve(bar);
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ──────────────────────────────────────────────────
   9. FLOATING PARTICLES (Hero Background)
────────────────────────────────────────────────── */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const COUNT  = 25;
  const COLORS = ['#7c3aed', '#06b6d4', '#f59e0b', '#10b981'];
  const SIZES  = [4, 6, 8, 10, 12];

  for (let i = 0; i < COUNT; i++) {
    const particle = document.createElement('span');
    particle.classList.add('particle');

    // Random properties
    const size     = SIZES[Math.floor(Math.random() * SIZES.length)];
    const color    = COLORS[Math.floor(Math.random() * COLORS.length)];
    const left     = Math.random() * 100;        // vw %
    const duration = 8 + Math.random() * 12;    // seconds
    const delay    = Math.random() * -15;        // negative = already in motion

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: ${0.05 + Math.random() * 0.15};
    `;

    container.appendChild(particle);
  }
})();

/* ──────────────────────────────────────────────────
   10. BACK-TO-TOP BUTTON
────────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ──────────────────────────────────────────────────
   11. CONTACT FORM – VALIDATION + SUBMISSION
────────────────────────────────────────────────── */
(function initContactForm() {
  const form        = document.getElementById('contactForm');
  if (!form) return;

  const nameInput    = document.getElementById('contactName');
  const emailInput   = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const msgInput     = document.getElementById('contactMessage');
  const submitBtn    = document.getElementById('submitBtn');
  const btnText      = submitBtn?.querySelector('.btn-text');
  const btnLoading   = submitBtn?.querySelector('.btn-loading');
  const successDiv   = document.getElementById('formSuccess');

  /** Validate a single field and return error string or '' */
  function validateField(input, errorId) {
    const errorEl = document.getElementById(errorId);
    const val     = input ? input.value.trim() : '';

    // Clear previous state
    if (input)   input.classList.remove('error-field');
    if (errorEl) errorEl.textContent = '';

    if (!input) return '';

    if (!val) {
      const label = input.labels?.[0]?.textContent || 'This field';
      setError(input, errorEl, `${label} is required.`);
      return `${label} is required.`;
    }

    // Email format check
    if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        setError(input, errorEl, 'Please enter a valid email address.');
        return 'Invalid email.';
      }
    }

    // Minimum length checks
    if (input.id === 'contactName' && val.length < 2) {
      setError(input, errorEl, 'Name must be at least 2 characters.');
      return 'Name too short.';
    }
    if (input.id === 'contactSubject' && val.length < 3) {
      setError(input, errorEl, 'Subject must be at least 3 characters.');
      return 'Subject too short.';
    }
    if (input.id === 'contactMessage' && val.length < 10) {
      setError(input, errorEl, 'Message must be at least 10 characters.');
      return 'Message too short.';
    }

    return ''; // no error
  }

  function setError(input, errorEl, msg) {
    if (input)   input.classList.add('error-field');
    if (errorEl) errorEl.textContent = msg;
  }

  // Real-time validation on blur
  if (nameInput)    nameInput.addEventListener('blur',    () => validateField(nameInput,    'nameError'));
  if (emailInput)   emailInput.addEventListener('blur',   () => validateField(emailInput,   'emailError'));
  if (subjectInput) subjectInput.addEventListener('blur', () => validateField(subjectInput, 'subjectError'));
  if (msgInput)     msgInput.addEventListener('blur',     () => validateField(msgInput,     'messageError'));

  // Clear error styling on input
  [nameInput, emailInput, subjectInput, msgInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('error-field');
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    const errors = [
      validateField(nameInput,    'nameError'),
      validateField(emailInput,   'emailError'),
      validateField(subjectInput, 'subjectError'),
      validateField(msgInput,     'messageError'),
    ].filter(Boolean);

    if (errors.length > 0) {
      showToast('⚠️ Please fix the errors before submitting.');
      return;
    }

    // Show loading state
    if (submitBtn)   submitBtn.disabled = true;
    if (btnText)     btnText.style.display    = 'none';
    if (btnLoading)  btnLoading.style.display = 'flex';

    // Simulate async API call (2 seconds)
    setTimeout(() => {
      // Reset button
      if (submitBtn)   submitBtn.disabled = false;
      if (btnText)     btnText.style.display    = 'inline-flex';
      if (btnLoading)  btnLoading.style.display = 'none';

      // Show success message
      if (successDiv) {
        successDiv.style.display = 'flex';
        setTimeout(() => { successDiv.style.display = 'none'; }, 5000);
      }

      // Reset form
      form.reset();

      showToast('✅ Message sent successfully!', 4000);
    }, 2000);
  });
})();

/* ──────────────────────────────────────────────────
   12. SMOOTH SCROLLING for anchor links
────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '70',
      10
    );
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ──────────────────────────────────────────────────
   13. FOOTER – CURRENT YEAR
────────────────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ──────────────────────────────────────────────────
   14. PROJECT CARD – tilt effect on mouse move
────────────────────────────────────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card, .cert-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;   // max ±6deg
      const rotateY = ((x - cx) / cx) *  6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ──────────────────────────────────────────────────
   15. ACTIVE NAV on direct page load (hash in URL)
────────────────────────────────────────────────── */
(function setInitialActiveNav() {
  const hash = window.location.hash;
  if (!hash) return;
  const link = document.querySelector(`.nav-link[href="${hash}"]`);
  if (link) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  }
})();

/* ──────────────────────────────────────────────────
   DONE ✓  All features initialized.
────────────────────────────────────────────────── */
console.log('%c🚀 Sabeetha R Portfolio – Loaded Successfully!', 
  'background: linear-gradient(135deg,#7c3aed,#06b6d4); color:#fff; padding:6px 14px; border-radius:50px; font-weight:700;'
);
