/* ============================================================
   YAYASAN TRANSFORMASI — script.js
   Language toggle, scroll effects, counters, gallery lightbox
============================================================ */

// =====================
// NAVBAR: Scroll Effect
// =====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  // Active nav link based on scroll position
  updateActiveNav();
});

function updateActiveNav() {
  const sections = ['about', 'berita', 'ekskul', 'gallery', 'instagram', 'partnership'];
  const navLinks = document.querySelectorAll('.nav-links a');
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

// =====================
// HAMBURGER MENU
// =====================
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const ham = document.getElementById('hamburger');
  menu.classList.toggle('open');
  ham.classList.toggle('open');
}
// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu');
  const ham = document.getElementById('hamburger');
  if (!navbar.contains(e.target)) {
    menu.classList.remove('open');
    ham.classList.remove('open');
  }
});

// =====================
// LANGUAGE TOGGLE
// =====================
let currentLang = localStorage.getItem('transformasi_lang') || 'id';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('transformasi_lang', lang);

  // Update all data-id / data-en elements
  document.querySelectorAll('[data-id],[data-en]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text !== null) {
      // If the text contains HTML, use innerHTML
      if (text.includes('<')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    }
  });

  // Update active lang button
  document.getElementById('langID').classList.toggle('active', lang === 'id');
  document.getElementById('langEN').classList.toggle('active', lang === 'en');

  // Update html lang attribute
  document.documentElement.lang = lang;
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);
});

// =====================
// SCROLL REVEAL ANIMATIONS
// =====================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// =====================
// ANIMATED COUNTERS
// =====================
let countersStarted = false;
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      startCounters();
    }
  });
}, { threshold: 0.4 });

const statsSection = document.getElementById('stats');
if (statsSection) counterObserver.observe(statsSection);

function startCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let count = 0;
    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        count = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(count).toLocaleString('id-ID');
    }, 16);
  });
}

// =====================
// GALLERY FILTER + LIGHTBOX
// =====================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    galleryItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-cat') === filter) {
        item.style.display = 'block';
        item.style.opacity = '0';
        setTimeout(() => { item.style.opacity = '1'; item.style.transition = 'opacity 0.4s ease'; }, 10);
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lightboxImg.src = img.src.replace('w=400', 'w=1200');
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

// =====================
// SMOOTH SCROLL for anchor links
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// =====================
// GALLERY — staggered reveal delay
// =====================
document.querySelectorAll('.gallery-item').forEach((el, i) => {
  el.style.animationDelay = (i * 0.07) + 's';
});

// =====================
// EKSKUL CARDS — stagger
// =====================
document.querySelectorAll('.ekskul-card.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.06) + 's';
});

// =====================
// HERO VIDEO — quality load fallback
// =====================
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
  heroVideo.addEventListener('error', () => {
    // If video fails, show a gradient background instead
    document.getElementById('hero').style.background =
      'linear-gradient(135deg, #6900ef 0%, #0a0014 50%, #3d00a0 100%)';
  });

  // Try to load a better placeholder video if the default fails
  heroVideo.addEventListener('loadeddata', () => {
    console.log('Hero video loaded successfully');
  });
}

// =====================
// PARTNER LOGO hover pause marquee
// =====================
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

// =====================
// Instagram: Replace placeholder with live Behold.so embed
// HOW TO USE:
// 1. Go to https://behold.so and create a free account
// 2. Connect your @transformasi.id Instagram account
// 3. Copy the <div> embed code and replace the contents of #instaGrid
// Example: <div id="YOUR_BEHOLD_ID"></div><script src="https://w.behold.so/widget.js" ...></script>
// =====================

// =====================
// Scroll-based navbar link highlighting
// =====================
window.addEventListener('load', () => {
  updateActiveNav();
  setLang(currentLang); // re-apply language on load
});

// =====================
// Keyboard accessibility for gallery
// =====================
galleryItems.forEach(item => {
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      item.click();
    }
  });
});

console.log('%c🎓 Yayasan Transformasi Website', 'color:#6900ef;font-size:18px;font-weight:800');
console.log('%cSD Transformasi & TK Transformasi', 'color:#ffe310;font-size:14px');

// =====================
// GURU TAB & CAROUSEL
// =====================
function switchGuruTab(tab, btn) {
  document.querySelectorAll('.guru-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.guru-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  btn.classList.add('active');
}

function initInfiniteCarousel(trackId) {
  const track = document.getElementById(trackId);
  if (!track) return;

  // Duplicate 4x biar loop panjang dan mulus
  const original = track.innerHTML;
  track.innerHTML = original + original + original + original;

  // Hitung lebar 1 set original
  const cards = track.querySelectorAll('.guru-card');
  const totalOriginal = cards.length / 4;
  const cardWidth = 220; // 200px lebar kartu + 20px gap (fixed, tidak tergantung display)
  const loopWidth = cardWidth * totalOriginal;

  // Inject CSS animation dinamis
  const styleId = 'carousel-style-' + trackId;
  const existing = document.getElementById(styleId);
  if (existing) existing.remove();

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    #${trackId} {
      animation: scroll-${trackId} ${totalOriginal * 3}s linear infinite;
    }
    @keyframes scroll-${trackId} {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-${loopWidth}px); }
    }
    #${trackId}:hover {
      animation-play-state: paused;
    }
  `;
  document.head.appendChild(style);
}

window.addEventListener('load', () => {
  initInfiniteCarousel('track-sd');
  initInfiniteCarousel('track-tk');
});