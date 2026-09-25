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
  //tya kajung
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
  anchor.addEventListener('click', function (e) {
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
// INSTAGRAM & TIKTOK — LAZY LOAD EMBEDS
// Ini yang menghentikan tab "muter/reload" terus-menerus.
// Sebelumnya setiap kartu punya <script src="embed.js"> sendiri (7x),
// jadi browser nembak banyak request berat ke server luar begitu
// halaman dibuka. Sekarang script cuma di-load SATU KALI, dan baru
// ditembak saat user benar-benar scroll sampai section #instagram.
//
// PENTING: pastikan tag <script src="//www.instagram.com/embed.js">
// dan <script src="https://www.tiktok.com/embed.js"> yang lama di
// dalam setiap .insta-post-card di HTML SUDAH DIHAPUS, karena
// sekarang di-handle otomatis dari sini.
// =====================
(function () {
  const instaSection = document.getElementById('instagram');
  if (!instaSection) return;

  let embedsLoaded = false;

  function loadScriptOnce(src) {
    return new Promise((resolve) => {
      // Kalau sudah pernah dimuat, jangan dimuat ulang
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = resolve; // tetap lanjut meski gagal, jangan sampai macet
      document.body.appendChild(s);
    });
  }

  async function loadEmbeds() {
    if (embedsLoaded) return;
    embedsLoaded = true;

    await Promise.all([
      loadScriptOnce('https://www.instagram.com/embed.js'),
      loadScriptOnce('https://www.tiktok.com/embed.js')
    ]);

    // Proses ulang blockquote Instagram jadi post asli
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
    // TikTok embed.js otomatis scan blockquote.tiktok-embed saat load,
    // tapi kalau section baru muncul belakangan, panggil ulang lib-nya kalau ada
    if (window.tiktokEmbed && typeof window.tiktokEmbed.lib?.render === 'function') {
      window.tiktokEmbed.lib.render(document.querySelectorAll('.tiktok-embed'));
    }
  }

  const embedObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadEmbeds();
        embedObserver.disconnect();
      }
    });
  }, { rootMargin: '300px' });

  embedObserver.observe(instaSection);
})();

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

  // re-ukur & re-init carousel begitu tab-nya BENERAN kelihatan
  requestAnimationFrame(() => {
    initInfiniteCarousel('track-' + tab, true); // true = paksa re-init
  });
}

// Simpan track mana yang SUDAH BERHASIL di-init dengan ukuran valid.
const initializedCarousels = new Set();
// Simpan HTML asli (belum diduplikasi) tiap track, diambil sekali saja.
const originalTrackHTML = new Map();

function initInfiniteCarousel(trackId, force = false) {
  const track = document.getElementById(trackId);
  if (!track) return;

  // Kalau sudah pernah sukses di-init dan bukan force-refresh, skip.
  if (initializedCarousels.has(trackId) && !force) return;

  // Track masih tersembunyi (tab belum aktif) -> width akan 0, jangan init dulu.
  // Tandai belum initialized supaya nanti bisa dicoba lagi saat tab dibuka.
  const isVisible = track.offsetParent !== null && track.getBoundingClientRect().width > 0;
  if (!isVisible) {
    initializedCarousels.delete(trackId);
    return;
  }

  // Simpan HTML asli sekali saja (sebelum diduplikasi pertama kali).
  if (!originalTrackHTML.has(trackId)) {
    originalTrackHTML.set(trackId, track.innerHTML);
  }

  // Selalu mulai ulang dari HTML asli biar tidak dobel-dobel tiap re-init.
  const original = originalTrackHTML.get(trackId);
  track.innerHTML = original;

  const cards = track.querySelectorAll('.guru-card');
  if (!cards.length) return;

  const trackStyle = window.getComputedStyle(track);
  const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || '20') || 20;
  const firstCardRect = cards[0].getBoundingClientRect();
  const cardWidth = firstCardRect.width + gap;

  // Guard tambahan: kalau lebar masih 0 (misal font/gambar belum layout), coba lagi frame berikutnya.
  if (cardWidth <= gap) {
    track.innerHTML = original; // pastikan tidak nyangkut dalam kondisi aneh
    requestAnimationFrame(() => initInfiniteCarousel(trackId, true));
    return;
  }

  const totalOriginal = cards.length;
  track.innerHTML = original + original + original + original;

  const loopWidth = cardWidth * totalOriginal;

  const styleId = 'carousel-style-' + trackId;
  const existing = document.getElementById(styleId);
  if (existing) existing.remove();

  const PX_PER_SECOND = 50; // <-- angka ini yang atur cepat/lambat, naikin kalau masih pengen lebih cepet
  const duration = loopWidth / PX_PER_SECOND;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    #${trackId} {
      display: flex;
      will-change: transform;
      animation: scroll-${trackId} ${duration}s linear infinite;
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

  initializedCarousels.add(trackId);
}

document.addEventListener('DOMContentLoaded', () => {
  initInfiniteCarousel('track-sd'); // akan di-skip kalau tab ini belum aktif, tidak masalah
  initInfiniteCarousel('track-tk');
});