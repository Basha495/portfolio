/* ================================================================
   PORTFOLIO — script.js
   Author: Shaik Basheer Ahmed Basha
   ================================================================

   TABLE OF CONTENTS
   1.  Custom Cursor
   2.  Navbar — Scroll + Active Link
   3.  Mobile Menu (Hamburger)
   4.  Dark/Light Theme Toggle
   5.  Hero Typewriter Effect
   6.  Scroll-Reveal Animations
   7.  Skill Bar Animations
   8.  Scroll-to-Top Button
   9.  Contact Form (demo handler)
   10. Init on DOMContentLoaded
================================================================ */


/* ================================================================
   1. CUSTOM CURSOR
   Moves two layered elements to follow the mouse
================================================================ */
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  // Bail out on touch devices
  if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot follows instantly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with slight lag
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Enlarge ring on hoverable elements
  const hoverTargets = 'a, button, .project-card, .cert-card, .stat-card, .skill-category';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}


/* ================================================================
   2. NAVBAR — Scroll behaviour + Active Section Highlight
================================================================ */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Add .scrolled class when page scrolled beyond 50px
  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveLink();
  }

  // Highlight link for the currently visible section
  function highlightActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load
}


/* ================================================================
   3. MOBILE MENU (HAMBURGER)
================================================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}


/* ================================================================
   4. DARK / LIGHT THEME TOGGLE
   Persists preference to localStorage
================================================================ */
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const html   = document.documentElement;

  // Load saved preference (default: dark)
  const saved = localStorage.getItem('theme') ?? 'dark';
  html.setAttribute('data-theme', saved);

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}


/* ================================================================
   5. HERO TYPEWRITER EFFECT
   Edit the `words` array to change what gets typed
================================================================ */
function initTypewriter() {
  const el = document.getElementById('typedText');
  if (!el) return;

  // ---- EDIT THESE WORDS ----
  const words = [
    'Aspiring Developer',
    'Problem Solver',
    'Data Enthusiast',
    'AI Explorer',
    'CSE Student',
  ];

  let wordIndex   = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  const typeSpeed = 90;
  const delSpeed  = 50;
  const pauseTime = 1800;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? delSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 300;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 800);
}


/* ================================================================
   6. SCROLL-REVEAL ANIMATIONS
   Uses IntersectionObserver to add .visible class to elements
================================================================ */
function initScrollReveal() {
  // Hero .animate-in elements — triggered once on load
  const heroElements = document.querySelectorAll('.animate-in');
  heroElements.forEach(el => {
    // Small timeout so CSS transition fires
    setTimeout(() => el.classList.add('visible'), 100);
  });

  // All other .reveal elements — triggered when they enter viewport
  const revealElements = document.querySelectorAll(
    '.section-header, .about-grid, .skill-category, .project-card, ' +
    '.cert-card, .edu-item, .activity-card, .contact-grid, .stat-card'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay for grid children
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          let delay = 0;
          siblings.forEach((sib, idx) => {
            if (sib === entry.target) delay = idx * 80;
          });
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => observer.observe(el));
}


/* ================================================================
   7. SKILL BAR ANIMATIONS
   Animates width of .skill-fill elements when they enter viewport
================================================================ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetWidth = entry.target.getAttribute('data-width');
          entry.target.style.width = targetWidth + '%';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach(fill => observer.observe(fill));
}


/* ================================================================
   8. SCROLL-TO-TOP BUTTON
================================================================ */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ================================================================
   9b. CLICKABLE PROJECT CARDS
   Makes the entire card navigate to the project link when clicked.
   The individual icon links still work independently via stopPropagation.
================================================================ */
function initProjectCards() {
  document.querySelectorAll('.project-card').forEach(card => {
    const viewBtn = card.querySelector('.btn-view-project');
    if (!viewBtn) return;

    const url = viewBtn.getAttribute('href');

    card.addEventListener('click', (e) => {
      // Don't fire if user clicked a link/button inside the card
      if (e.target.closest('a') || e.target.closest('button')) return;
      window.open(url, '_blank', 'noopener');
    });
  });
}


/* ================================================================
   9. CONTACT FORM — DEMO HANDLER
   Replace this with Formspree / EmailJS / Netlify Forms as needed.

   To use Formspree:
     1. Go to https://formspree.io and create a form
     2. Add action="https://formspree.io/f/YOUR_ID" to the <form>
     3. Remove the preventDefault below and let it submit normally
        OR keep it and use fetch() for AJAX submission

   To use EmailJS:
     1. npm install @emailjs/browser OR add CDN script
     2. Replace the submit handler body with EmailJS.sendForm(...)
================================================================ */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather values
    const name    = document.getElementById('formName').value.trim();
    const email   = document.getElementById('formEmail').value.trim();
    const message = document.getElementById('formMsg').value.trim();

    if (!name || !email || !message) return;

    // -----------------------------------------------------------
    // DEMO: simulate sending — replace with real API call
    // -----------------------------------------------------------
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.innerHTML = '<iconify-icon icon="ph:paper-plane-tilt-bold"></iconify-icon> Send Message';
      btn.disabled  = false;
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1200);
    // -----------------------------------------------------------
  });
}

/* ================================================================
   ANIMATED BACKGROUND — Stars (dark) / Bubbles (light)
   Draws on a full-screen canvas behind everything
================================================================ */
/* ================================================================
   ANIMATED BACKGROUND — Stars + Dragon (dark) / Bubbles (light)
================================================================ */
/* ================================================================
PORTFOLIO — CLEAN BACKGROUND (NO DRAGON)
================================================================ */

function initBackground() {
const canvas = document.getElementById('bgCanvas');
if (!canvas) return;
const ctx = canvas.getContext('2d');

let particles = [];
let animFrame;

function resize() {
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); buildParticles(); });

/* ================================================================
PARTICLES — Stars or Bubbles
================================================================ */
function buildParticles() {
particles = [];
const theme = document.documentElement.getAttribute('data-theme') || 'dark';


if (theme === 'dark') {
  const count = Math.floor((canvas.width * canvas.height) / 4000);

  for (let i = 0; i < count; i++) {
    const type = Math.random() < 0.7 ? 'small' : Math.random() < 0.8 ? 'medium' : 'large';

    particles.push({
      type,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: type === 'small' ? Math.random() * 1 + 0.3
       : type === 'medium' ? Math.random() * 1.8 + 1
       : Math.random() * 3 + 2,
      alpha:  Math.random() * 0.7 + 0.3,
      speed:  Math.random() * 0.008 + 0.002,
      offset: Math.random() * Math.PI * 2,
    });
  }

  // Shooting stars
  for (let i = 0; i < 3; i++) {
    particles.push({
      type: 'shoot',
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      vx: Math.random() * 6 + 4,
      vy: Math.random() * 3 + 2,
      alpha: 0,
      active: false,
      timer: Math.random() * 300,
    });
  }

} else {
  // Bubbles
  for (let i = 0; i < 28; i++) {
    const big = Math.random() < 0.2;

    particles.push({
      type:  'bubble',
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     big ? Math.random() * 60 + 40 : Math.random() * 25 + 8,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    -(Math.random() * 0.4 + 0.1),
      alpha: big ? Math.random() * 0.06 + 0.02 : Math.random() * 0.12 + 0.04,
      color: Math.random() < 0.5 ? '0,102,255' : '0,229,204',
    });
  }
}

}

/* ================================================================
MAIN DRAW LOOP
================================================================ */
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

const theme = document.documentElement.getAttribute('data-theme') || 'dark';
const t = Date.now() / 1000;

if (theme === 'dark') {
  // Nebula glow
  const blobs = [
    { x: canvas.width * 0.15, y: canvas.height * 0.2,  r: 280, c: '10,40,120' },
    { x: canvas.width * 0.8,  y: canvas.height * 0.15, r: 220, c: '0,60,140'  },
    { x: canvas.width * 0.5,  y: canvas.height * 0.7,  r: 260, c: '5,20,80'   },
  ];

  blobs.forEach(b => {
    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    grad.addColorStop(0,   `rgba(${b.c},0.18)`);
    grad.addColorStop(0.5, `rgba(${b.c},0.07)`);
    grad.addColorStop(1,   `rgba(${b.c},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Stars
  particles.forEach(p => {
    if (p.type === 'shoot') {
      p.timer--;
      if (p.timer <= 0 && !p.active) {
        p.active = true;
        p.x = Math.random() * canvas.width * 0.7;
        p.y = Math.random() * canvas.height * 0.4;
        p.alpha = 1;
        p.timer = Math.random() * 400 + 200;
      }

      if (p.active) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.018;

        if (p.alpha <= 0) p.active = false;

        ctx.save();
        ctx.strokeStyle = `rgba(200,230,255,${Math.max(0,p.alpha)})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(150,210,255,0.8)';
        ctx.shadowBlur  = 6;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 12, p.y - p.vy * 12);
        ctx.stroke();

        ctx.restore();
      }
      return;
    }

    const twinkle = Math.sin(t * p.speed * 60 + p.offset) * 0.4 + 0.6;
    const a = p.alpha * twinkle;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220,240,255,${a})`;
    ctx.fill();
  });

} else {
  // Bubbles
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.y + p.r < 0) {
      p.y = canvas.height + p.r;
      p.x = Math.random() * canvas.width;
    }

    const grad = ctx.createRadialGradient(
      p.x - p.r*0.3, p.y - p.r*0.3,
      p.r*0.1,
      p.x, p.y,
      p.r
    );

    grad.addColorStop(0,   `rgba(${p.color},${p.alpha*2})`);
    grad.addColorStop(0.6, `rgba(${p.color},${p.alpha})`);
    grad.addColorStop(1,   `rgba(${p.color},0)`);

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  });
}

animFrame = requestAnimationFrame(draw);


}

const observer = new MutationObserver(() => buildParticles());
observer.observe(document.documentElement, {
attributes: true,
attributeFilter: ['data-theme']
});

buildParticles();
draw();
}



/* ================================================================
   10. INIT — Run everything after DOM is ready
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initMobileMenu();
  initTheme();
  initTypewriter();
  initScrollReveal();
  initSkillBars();
  initScrollTop();
  initContactForm();
  initProjectCards();
  initBackground(); 

  // Smooth scroll for all anchor links (fallback for older browsers)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

