// ---------- Loader ----------
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('done'), 500);
});

// ---------- Hero video autoplay fallback (iOS Low Power Mode / Data Saver etc.) ----------
(() => {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  const tryPlay = () => {
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  tryPlay();
  video.addEventListener('loadeddata', tryPlay);

  const resumeOnInteraction = () => {
    if (video.paused) tryPlay();
  };
  ['touchstart', 'click', 'scroll'].forEach(evt => {
    window.addEventListener(evt, resumeOnInteraction, { once: true, passive: true });
  });
})();

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Nav scroll state ----------
const nav = document.getElementById('nav');
const onScrollNav = () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
};
onScrollNav();
window.addEventListener('scroll', onScrollNav, { passive: true });

// ---------- Mobile menu ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---------- Scroll reveal (IntersectionObserver) ----------
const animatedEls = document.querySelectorAll('[data-animate]');
animatedEls.forEach((el, i) => {
  el.classList.add('stagger');
  el.style.setProperty('--d', (i % 4) * 0.12 + 's');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

animatedEls.forEach(el => revealObserver.observe(el));

// ---------- Hero video parallax + about image parallax ----------
const heroVideo = document.getElementById('heroVideo');
const aboutMedia = document.querySelector('[data-parallax]');
let ticking = false;

function updateParallax() {
  const y = window.scrollY;

  if (heroVideo) {
    const heroHeight = window.innerHeight;
    const progress = Math.min(y / heroHeight, 1);
    heroVideo.style.transform = `scale(${1.08 + progress * 0.12}) translateY(${progress * 40}px)`;
  }

  document.querySelectorAll('[data-parallax]').forEach(el => {
    const rect = el.getBoundingClientRect();
    const winH = window.innerHeight;
    if (rect.top < winH && rect.bottom > 0) {
      const speed = 0.15;
      const offset = (rect.top - winH / 2) * speed;
      const img = el.querySelector('img');
      if (img) img.style.transform = `scale(1.15) translateY(${offset * -0.3}px)`;
    }
  });

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });

// ---------- Lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('[data-lightbox]').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// ---------- Contact form (demo — no backend) ----------
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    const original = btn.textContent;
    btn.textContent = 'Ďakujeme, ozveme sa čoskoro';
    btn.disabled = true;
    setTimeout(() => {
      contactForm.reset();
      btn.textContent = original;
      btn.disabled = false;
    }, 2600);
  });
}
