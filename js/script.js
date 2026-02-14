/**
 * learnwithForhad — Main JavaScript
 * Minimal vanilla JS for theme toggle, mobile nav, tabs, and scroll effects.
 */

(function () {
  'use strict';

  // ───────────────────────────────────────
  // DOM References
  // ───────────────────────────────────────
  const body             = document.body;
  const themeToggle      = document.getElementById('themeToggle');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mainNav          = document.getElementById('mainNav');
  const header           = document.getElementById('header');
  const contactForm      = document.getElementById('contactForm');
  const navLinks         = document.querySelectorAll('.nav-link');
  const tabButtons       = document.querySelectorAll('.tab-btn');
  const coursePanels     = document.querySelectorAll('.course-panel');


  // ───────────────────────────────────────
  // Dark Mode Toggle
  // ───────────────────────────────────────
  const THEME_KEY = 'lwf-theme';

  function setTheme(mode) {
    if (mode === 'dark') {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, mode);
  }

  // Initialize theme from localStorage or system preference
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      setTheme(saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }

  themeToggle.addEventListener('click', function () {
    const isDark = body.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  });

  initTheme();


  // ───────────────────────────────────────
  // Mobile Menu
  // ───────────────────────────────────────
  mobileMenuToggle.addEventListener('click', function () {
    const isOpen = mainNav.classList.toggle('open');
    mobileMenuToggle.setAttribute('aria-expanded', isOpen);
    mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');

    // Prevent body scroll when menu is open
    body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on nav link click
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    });
  });


  // ───────────────────────────────────────
  // Course Tabs
  // ───────────────────────────────────────
  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = this.getAttribute('data-tab');

      // Update active tab button
      tabButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      // Show target panel
      coursePanels.forEach(function (panel) {
        panel.classList.remove('active');
      });
      document.getElementById(target).classList.add('active');
    });
  });


  // ───────────────────────────────────────
  // Header Scroll Effect
  // ───────────────────────────────────────
  let lastScrollY = 0;

  function onScroll() {
    const scrollY = window.scrollY;

    // Add shadow on scroll
    if (scrollY > 10) {
      header.style.boxShadow = 'var(--shadow-md)';
    } else {
      header.style.boxShadow = 'none';
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  // ───────────────────────────────────────
  // Active Nav Link Highlight
  // ───────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });


  // ───────────────────────────────────────
  // Scroll Reveal Animation
  // ───────────────────────────────────────
  function initReveal() {
    const revealTargets = document.querySelectorAll(
      '.expertise-card, .course-card, .blog-card, .about-content, .about-aside, .contact-info, .contact-form'
    );

    revealTargets.forEach(function (el) {
      el.classList.add('reveal');
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  initReveal();


  // ───────────────────────────────────────
  // Contact Form (Front-end Only)
  // ───────────────────────────────────────
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Simple front-end validation feedback
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Message Sent ✓';
    btn.disabled = true;
    btn.style.background = '#059669';
    btn.style.borderColor = '#059669';

    // Log to console (replace with actual form handler)
    console.log('Contact form submitted:', data);

    // Reset after 3 seconds
    setTimeout(function () {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.borderColor = '';
      contactForm.reset();
    }, 3000);
  });


  // ───────────────────────────────────────
  // Smooth scroll for anchor links (fallback)
  // ───────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 20;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth',
        });
      }
    });
  });

})();
