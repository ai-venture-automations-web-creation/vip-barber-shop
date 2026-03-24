/* =============================================
   VIP BARBER SHOP — JAVASCRIPT
   ============================================= */

'use strict';

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initIntersectionAnimations();
  initCounterAnimations();
  initGalleryHover();
  initParticles();
  initBackToTop();
  setFooterYear();
});

// ===== NAVBAR: SCROLL BEHAVIOR =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const toggleMenu = (forceClose = false) => {
    const isOpen = navLinks.classList.contains('open');
    if (forceClose || isOpen) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      navLinks.classList.add('open');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  };

  hamburger.addEventListener('click', () => toggleMenu());

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      toggleMenu(true);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu(true);
      hamburger.focus();
    }
  });

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 900) {
      toggleMenu(true);
    }
  }, { passive: true });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });
  });
}

// ===== INTERSECTION OBSERVER: ANIMATIONS =====
function initIntersectionAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay, 10) || 0;

          setTimeout(() => {
            el.classList.add('is-visible');
          }, delay);

          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}

// ===== COUNTER ANIMATIONS =====
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count], [data-count-decimal]');
  if (!counters.length) return;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const isDecimal = el.hasAttribute('data-count-decimal');
    const target = isDecimal
      ? parseFloat(el.getAttribute('data-count-decimal'))
      : parseInt(el.getAttribute('data-count'), 10);

    const duration = 1800;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = isDecimal
        ? (eased * target).toFixed(1)
        : Math.round(eased * target);

      el.textContent = isDecimal ? current : current + (target > 10 ? '+' : '');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = isDecimal ? target.toFixed(1) : target + '+';
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

// ===== GALLERY: KEYBOARD ACCESSIBILITY =====
function initGalleryHover() {
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    // Add tabindex for keyboard navigation
    item.setAttribute('tabindex', '0');

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.toggle('focused');
      }
    });

    item.addEventListener('blur', () => {
      item.classList.remove('focused');
    });
  });
}

// ===== FLOATING PARTICLES =====
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const count = window.innerWidth < 600 ? 12 : 22;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 3 + 1.5;
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 8;
    const delay = Math.random() * 10;
    const opacity = Math.random() * 0.5 + 0.2;

    particle.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      --dur: ${duration}s;
      --delay: ${delay}s;
      opacity: ${opacity};
    `;

    container.appendChild(particle);
  }
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const handleScroll = () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== FOOTER YEAR =====
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

// ===== NAVBAR: ACTIVE SECTION HIGHLIGHT =====
(function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  sections.forEach(section => observer.observe(section));
})();

// ===== SERVICE CARDS: STAGGER ON SCROLL =====
(function initServiceCardStagger() {
  const cards = document.querySelectorAll('.service-card[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Already handled by main animation init; just add gold border pulse
          entry.target.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, opacity 0.65s ease';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach(card => observer.observe(card));
})();

// ===== HERO PARALLAX (Subtle) =====
(function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroH = hero.offsetHeight;

        if (scrollY <= heroH) {
          const offset = scrollY * 0.3;
          hero.style.backgroundPositionY = `calc(50% + ${offset}px)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ===== ACTIVE NAV LINK STYLE =====
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
  .nav-link.active {
    color: var(--gold) !important;
    background: rgba(255, 215, 0, 0.08);
  }
`;
document.head.appendChild(activeNavStyle);
