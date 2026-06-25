/* ============================================================
   KANAK AABHUSHAN — script.js  (PUBLIC WEBSITE)
   This file reads ONLY ka_live_* keys from localStorage.
   It never reads ka_draft_* keys — drafts are admin-only.
   If no live data exists, it falls back to built-in defaults.
   ============================================================ */
'use strict';

/* ── LIVE DATA KEYS (written by admin on Publish) ────────────── */
const LIVE = {
  PRODUCTS:     'ka_live_products',
  COLLECTIONS:  'ka_live_collections',
  RATES:        'ka_live_rates',
  TESTIMONIALS: 'ka_live_testimonials',
  HERO:         'ka_live_hero',
  ABOUT:        'ka_live_about',
  CONTACT:      'ka_live_contact',
};

function liveLoad(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

/* ── DEFAULT FALLBACK DATA (shown before first admin publish) ── */
const DEFAULT_PRODUCTS = [
  { id:1, name:'Royal Kundan Necklace',     cat:'necklace',    img:'', desc:'Handcrafted kundan necklace with polki stones and meenakari work.',   weight:'42 grams', purity:'22kt / 916' },
  { id:2, name:'Bridal Choker Set',          cat:'bridal',      img:'', desc:'Grand bridal choker with matching jhumkas and maang tikka.',          weight:'68 grams', purity:'22kt / 916' },
  { id:3, name:'Diamond-Cut Bangles (pair)', cat:'bangles',     img:'', desc:'Precision diamond-cut gold bangles, perfect for everyday elegance.',   weight:'24 grams', purity:'22kt / 916' },
  { id:4, name:'Temple Jhumka Earrings',     cat:'earrings',    img:'', desc:'Traditional south-Indian temple design jhumkas with ruby accents.',    weight:'9 grams',  purity:'22kt / 916' },
  { id:5, name:'Solitaire Engagement Ring',  cat:'rings',       img:'', desc:'Classic solitaire ring in 18kt white gold with certified diamond.',    weight:'4 grams',  purity:'18kt / 750' },
  { id:6, name:'Mangalsutra — Modern Slim',  cat:'mangalsutra', img:'', desc:'Contemporary slim mangalsutra with black bead and gold pendant.',      weight:'7 grams',  purity:'22kt / 916' },
  { id:7, name:"Men's Cuban Link Chain",     cat:'mens',        img:'', desc:'Bold Cuban link gold chain for the modern gentleman.',                  weight:'30 grams', purity:'22kt / 916' },
  { id:8, name:"Kids' Anklet Set",           cat:'kids',        img:'', desc:'Delicate gold anklets with tiny bells, safe for toddlers.',            weight:'5 grams',  purity:'22kt / 916' },
  { id:9, name:'Polki Bridal Haar',          cat:'bridal',      img:'', desc:'Elaborate bridal haar with uncut polki diamonds and enamel work.',     weight:'85 grams', purity:'22kt / 916' },
  { id:10,name:'Gold Coin Pendant',          cat:'gold',        img:'', desc:'Lakshmi gold coin pendant, auspicious and elegant.',                   weight:'8 grams',  purity:'24kt / 999' },
  { id:11,name:'Chandbali Earrings',         cat:'earrings',    img:'', desc:'Statement chandbali earrings with hanging pearl drops.',               weight:'13 grams', purity:'22kt / 916' },
  { id:12,name:'Three-Layer Chain Necklace', cat:'necklace',    img:'', desc:'Layered gold chain necklace — subtle yet striking for all occasions.', weight:'18 grams', purity:'22kt / 916' },
  { id:13,name:'Wedding Band Set (pair)',     cat:'rings',       img:'', desc:"His & hers wedding bands in plain polished gold.",                     weight:'11 grams', purity:'18kt / 750' },
  { id:14,name:'Traditional Kadas',          cat:'bangles',     img:'', desc:'Heavy traditional gold kadas with intricate carving.',                 weight:'55 grams', purity:'22kt / 916' },
  { id:15,name:"Men's Kada Bracelet",        cat:'mens',        img:'', desc:'Wide gold kada bracelet — symbol of strength and style.',              weight:'28 grams', purity:'22kt / 916' },
  { id:16,name:'Grand Bridal Maang Tikka',   cat:'bridal',      img:'', desc:'Elaborate maang tikka with kundan setting and pearl drops.',           weight:'12 grams', purity:'22kt / 916' },
];

const DEFAULT_COLLECTIONS = [
  {
    id: 1,
    name: 'Gold Jewellery',
    image: 'https://source.unsplash.com/600x600/?gold,jewellery',
    key: 'gold',
    desc: 'Classic & contemporary gold pieces for every occasion.'
  },
  {
    id: 2,
    name: 'Bridal Collection',
    image: 'https://source.unsplash.com/600x600/?bridal,jewellery',
    key: 'bridal',
    desc: 'Complete bridal sets crafted for your special day.'
  },
  {
    id: 3,
    name: 'Necklace Sets',
    image: 'https://source.unsplash.com/600x600/?gold,necklace',
    key: 'necklace',
    desc: 'Exquisite necklaces from delicate chains to grand haar sets.'
  },
  {
    id: 4,
    name: 'Earrings',
    image: 'https://source.unsplash.com/600x600/?gold,earrings',
    key: 'earrings',
    desc: 'Studs, jhumkas, drops & chandbalis for every face & mood.'
  },
  {
    id: 5,
    name: 'Rings',
    image: 'https://source.unsplash.com/600x600/?gold,ring',
    key: 'rings',
    desc: 'Engagement, wedding & fashion rings in stunning designs.'
  }
];

const DEFAULT_RATES = {
  gold24kt:7420, gold24ktChange:120, gold22kt:6800, gold22ktChange:110,
  gold18kt:5570, gold18ktChange:90,  silver:92,     silverChange:-3,
};

const DEFAULT_TESTIMONIALS = [
  { id:1, name:'Sunita Devi',  location:'Japla', stars:5, text:'"We purchased our daughter\'s entire bridal set from Kanak Aabhushan. The quality is extraordinary and the hallmark gives us complete peace of mind!"' },
  { id:2, name:'Rajesh Kumar', location:'Nabinagar',      stars:5, text:'"Incredible collection and very honest staff. My wife was overjoyed with her anniversary gift."' },
  { id:3, name:'Priya Singh',  location:'Patna',        stars:5, text:'"The 916 hallmark collection is simply stunning. We exchanged old jewellery at a fair price and the process was completely transparent."' },
  { id:4, name:'Amita Pandey', location:'Japla', stars:5, text:'"Three generations of our family have shopped here. The trust and quality Kanak Aabhushan offers is unmatched in the region."' },
  { id:5, name:'Vikram Sharma',location:'Japla',       stars:5, text:'"Bought my engagement ring and my fiancée\'s necklace set here. The craftsmen\'s attention to detail is visible in every piece."' },
];

const DEFAULT_HERO = {
  eyebrow:'— Est. 1990, Japla —',
  title:'Adorn Every', italic:'Precious Moment',
  desc:"Hallmark certified gold & bridal jewellery crafted with generations of artisan pride. Visit our showroom to discover collections that tell your story.",
  cta1:'Explore Collections', cta2:'Book a Visit',
};

const DEFAULT_ABOUT = {
  title:'Crafting Trust Since 1985',
  p1:'Kanak Aabhushan was founded by Santosh Kumar Soni in the heart of Japla with a single belief: every family deserves beautiful, genuine, and fairly priced gold jewellery. What started as a small workshop grew over four decades into one of the most trusted jewellery showrooms in palamu district.',
  p2:'Today, led by the second generation, we continue that legacy — blending traditional  craftsmanship with contemporary design sensibilities. Our hallmark-certified jewellery represents not just gold, but the aspirations and milestones of thousands of families.',
  mission:'To make pure, certified, beautifully crafted jewellery accessible to every family in Jharkhand.',
  vision:"To be Japla's most trusted jewellery brand — known for integrity, artistry, and lasting relationships.",
  year:'Est. 1990',
};

const DEFAULT_CONTACT = {
  address:'Main Market, Near Gandhi chowk, Japla, Hussianabad – 822116, Jharkhand',
  phone1:'+91 9304654835', phone2:'+91 91426269478',
  email:'info@kanakaabhushan.in', whatsapp:'9304654835',
  hours1:'Mon – Sat: 10:00 AM – 8:00 PM', hours2:'Sunday: 11:00 AM – 6:00 PM',
  mapUrl:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3629.729981736703!2d84.00059836110901!3d24.52942405328437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398c470065b49b27%3A0x891d4a3666cf78f3!2sKanak%20Aabhushan%20Gandhi%20chowk%2C%20japla!5e0!3m2!1sen!2sin!4v1782287496369!5m2!1sen!2sin', 
  };

/* ── LOAD LIVE DATA (published by admin, or use defaults) ────── */
const SITE = {
  get products()     { return liveLoad(LIVE.PRODUCTS,     DEFAULT_PRODUCTS);     },
  get collections()  { return liveLoad(LIVE.COLLECTIONS,  DEFAULT_COLLECTIONS);  },
  get rates()        { return liveLoad(LIVE.RATES,        DEFAULT_RATES);        },
  get testimonials() { return liveLoad(LIVE.TESTIMONIALS, DEFAULT_TESTIMONIALS); },
  get hero()         { return liveLoad(LIVE.HERO,         DEFAULT_HERO);         },
  get about()        { return liveLoad(LIVE.ABOUT,        DEFAULT_ABOUT);        },
  get contact()      { return liveLoad(LIVE.CONTACT,      DEFAULT_CONTACT);      },
};

/* ── INSTAGRAM PLACEHOLDERS ──────────────────────────────────── */
const INSTA_ITEMS = [
  { emoji:'💍', label:'Rings' }, { emoji:'📿', label:'Necklace' },
  { emoji:'👑', label:'Bridal' },{ emoji:'✨', label:'Earrings' },
  { emoji:'🔆', label:'Bangles'},{ emoji:'🌸', label:'Mangalsutra' },
  { emoji:'⚜',  label:'Gold' }, { emoji:'🛡',  label:"Men's" },
  { emoji:'🌟', label:'Kids' },
];

const CAT_EMOJIS = { gold:'⚜', bridal:'👑', necklace:'📿', earrings:'✨', rings:'💍', bangles:'🔆', mangalsutra:'🌸', mens:'🛡', kids:'🌟' };
const CAT_LABELS = { gold:'Gold', bridal:'Bridal', necklace:'Necklace', earrings:'Earrings', rings:'Rings', bangles:'Bangles', mangalsutra:'Mangalsutra', mens:"Men's", kids:"Kids'" };
function catEmoji(c) { return CAT_EMOJIS[c] || '⚜'; }
function catLabel(c) { return CAT_LABELS[c] || c;  }

/* ════════════════════════════════════════════════════════════════
   MODULES
════════════════════════════════════════════════════════════════ */

/* ── 1. LOADER ───────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  document.body.style.overflow = 'hidden';
  setTimeout(() => { loader.classList.add('hidden'); document.body.style.overflow = ''; }, 2200);
}

/* ── 2. THEME ────────────────────────────────────────────────── */
function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const body = document.body;
  applyTheme(localStorage.getItem('ka-theme') || 'light');
  btn && btn.addEventListener('click', () => {
    const next = body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(next); localStorage.setItem('ka-theme', next);
  });
}
function applyTheme(mode) {
  document.body.classList.toggle('dark-mode',  mode === 'dark');
  document.body.classList.toggle('light-mode', mode !== 'dark');
}

/* ── 3. HEADER ───────────────────────────────────────────────── */
function initHeader() {
  const header  = document.getElementById('header');
  const backTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header  && header.classList.toggle('scrolled', y > 60);
    backTop && backTop.classList.toggle('visible',  y > 400);
  }, { passive: true });
  backTop && backTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
}

/* ── 4. MOBILE NAV ───────────────────────────────────────────── */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });
}

/* ── 5. SCROLL REVEAL ────────────────────────────────────────── */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-up');
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), +(e.target.dataset.delay || 0));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  const parents = new Set(Array.from(items).map(i => i.parentElement));
  parents.forEach(p => { p.querySelectorAll(':scope > .reveal-up').forEach((c, i) => c.dataset.delay = i * 80); });
  items.forEach(i => obs.observe(i));
}

/* ── 6. COUNTERS ─────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.counter-num, .stat-num');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const start  = performance.now();
  const dur    = 1800;
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(e * target).toLocaleString('en-IN');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── 7. HERO (dynamic) ───────────────────────────────────────── */
function applyHeroContent() {
  const h = SITE.hero;
  const eyebrow = document.querySelector('.hero-eyebrow');
  const titleEl = document.querySelector('.hero-title');
  const descEl  = document.querySelector('.hero-desc');
  const cta1    = document.querySelector('.hero-cta .btn-primary');
  const cta2    = document.querySelector('.hero-cta .btn-outline');
  if (eyebrow) eyebrow.textContent = h.eyebrow;
  if (titleEl) titleEl.innerHTML   = `${h.title}<br/><em>${h.italic}</em>`;
  if (descEl)  descEl.textContent  = h.desc;
  if (cta1)    cta1.textContent    = h.cta1;
  if (cta2)    cta2.textContent    = h.cta2;
}

/* ── 8. COLLECTIONS (dynamic) ────────────────────────────────── */
function applyCollections() {
  const grid = document.querySelector('.collections-grid');
  if (!grid) return;
  grid.innerHTML = SITE.collections.map(c => `
    <div class="collection-card reveal-up${c.badge ? ' hallmark-card' : ''}" data-category="${c.key}" tabindex="0">
      <div class="collection-icon">${c.icon}</div>
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
      ${c.badge ? `<span class="hallmark-badge">${c.badge}</span>` : ''}
    </div>`).join('');
  initCollectionCardLinks();
}

/* ── 9. GALLERY ──────────────────────────────────────────────── */
function initGallery() {
  renderProducts(SITE.products);
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyGalleryFilters();
    });
  });
  const searchInput = document.getElementById('productSearch');
  searchInput && searchInput.addEventListener('input', debounce(applyGalleryFilters, 220));
}

function applyGalleryFilters() {
  const filter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  const query  = (document.getElementById('productSearch')?.value || '').toLowerCase().trim();
  const filtered = SITE.products.filter(p => {
    const matchCat  = filter === 'all' || p.cat === filter;
    const matchText = !query || p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
    return matchCat && matchText;
  });
  renderProducts(filtered);
  const noRes = document.getElementById('noResults');
  if (noRes) noRes.style.display = filtered.length ? 'none' : 'block';
}

function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="product-card" data-id="${p.id}" tabindex="0" aria-label="View ${p.name}">
      <div class="product-img">
        ${p.img
          ? `<img src="${p.img}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;"/>`
          : `<div class="product-emoji">${catEmoji(p.cat)}</div>`}
        <div class="product-overlay"><span>View Details</span></div>
      </div>
      <div class="product-info">
        <h4>${p.name}</h4>
        <p>${p.desc.slice(0,60)}…</p>
        <span class="product-cat">${catLabel(p.cat)}</span>
      </div>
    </div>`).join('');
  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click',    () => openModal(+card.dataset.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(+card.dataset.id); });
  });
}

/* ── 10. MODAL ───────────────────────────────────────────────── */
function openModal(id) {
  const p = SITE.products.find(p => p.id === id);
  if (!p) return;
  const overlay = document.getElementById('productModal');
  if (!overlay) return;
  document.getElementById('modalBadge').textContent  = catLabel(p.cat);
  document.getElementById('modalName').textContent   = p.name;
  document.getElementById('modalDesc').textContent   = p.desc;
  document.getElementById('modalWeight').textContent = `⚖ ${p.weight}`;
  document.getElementById('modalPurity').textContent = `✦ ${p.purity}`;
  const imgWrap = document.querySelector('.modal-img-wrap');
  imgWrap.innerHTML = `
   <img
  src="${p.img || 'https://via.placeholder.com/600x600?text=Jewellery'}"
  alt="${p.name}"
  loading="lazy"
  style="width:100%;height:100%;object-fit:cover;"
/>
`;
  const enquiryBtn = document.getElementById('modalEnquiry');
  if (enquiryBtn) {
    enquiryBtn.href = '#contact';
    enquiryBtn.addEventListener('click', () => {
      closeModal();
      const msgArea = document.getElementById('message');
      if (msgArea) msgArea.value = `I am interested in "${p.name}". Please share more details.`;
    }, { once: true });
  }
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('productModal')?.classList.remove('open');
  document.body.style.overflow = '';
}
function initModal() {
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('productModal')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ── 11. RATES (dynamic) ─────────────────────────────────────── */
function applyRates() {
  const r = SITE.rates;
  function fmt(v) { return `₹${(+v).toLocaleString('en-IN')}`; }
  function changeHtml(c) {
    const n = +c;
    if (n === 0) return '';
    return `<div class="rate-change ${n > 0 ? 'up' : 'down'}">${n > 0 ? '▲' : '▼'} ₹${Math.abs(n)} today</div>`;
  }
  function setRate(id, val, change) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `${fmt(val)} <span>/gram</span>`;
    const changeEl = el.nextElementSibling;
    if (changeEl && changeEl.classList.contains('rate-change')) changeEl.outerHTML = changeHtml(change);
  }
  setRate('rate24kt',   r.gold24kt, r.gold24ktChange);
  setRate('rate22kt',   r.gold22kt, r.gold22ktChange);
  setRate('rate18kt',   r.gold18kt, r.gold18ktChange);
  setRate('rateSilver', r.silver,   r.silverChange);
  const el = document.getElementById('rateUpdateTime');
  if (el) el.textContent = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

/* ── 12. TESTIMONIALS (dynamic) ──────────────────────────────── */
function initSlider() {
  const track = document.getElementById('testimonialTrack');
  if (!track) return;
  const testimonials = SITE.testimonials;
  // Render slides from live data
  track.innerHTML = testimonials.map(t => `
    <div class="testimonial-slide">
      <div class="stars">${'★'.repeat(t.stars)}${'☆'.repeat(5 - t.stars)}</div>
      <p class="testimonial-text">${t.text}</p>
      <div class="testimonial-author">
        <div class="author-avatar">${t.name.charAt(0)}</div>
        <div><strong>${t.name}</strong><span>${t.location || ''}</span></div>
      </div>
    </div>`).join('');

  const slides = track.querySelectorAll('.testimonial-slide');
  const dots   = document.getElementById('sliderDots');
  const prev   = document.getElementById('sliderPrev');
  const next   = document.getElementById('sliderNext');
  if (!slides.length) return;
  let current = 0, autoTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dots && dots.appendChild(dot);
  });

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots && dots.querySelectorAll('.dot')[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots && dots.querySelectorAll('.dot')[current]?.classList.add('active');
    clearInterval(autoTimer); autoTimer = setInterval(() => goTo(current + 1), 5500);
  }
  slides[0].classList.add('active');
  prev && prev.addEventListener('click', () => goTo(current - 1));
  next && next.addEventListener('click', () => goTo(current + 1));
  autoTimer = setInterval(() => goTo(current + 1), 5500);
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', () => { autoTimer = setInterval(() => goTo(current + 1), 5500); });
}

/* ── 13. ABOUT (dynamic) ─────────────────────────────────────── */
function applyAbout() {
  const a = SITE.about;
  const titleEl   = document.querySelector('.about-content .section-title');
  const p1El      = document.querySelector('.about-content p:nth-of-type(1)');
  const p2El      = document.querySelector('.about-content p:nth-of-type(2)');
  const frameYear = document.querySelector('.about-img-inner p:first-of-type');
  const missionEl = document.querySelector('.value-item:nth-child(1) p');
  const visionEl  = document.querySelector('.value-item:nth-child(2) p');
  if (titleEl)   titleEl.textContent   = a.title;
  if (p1El)      p1El.textContent      = a.p1;
  if (p2El)      p2El.textContent      = a.p2;
  if (frameYear) frameYear.textContent = a.year;
  if (missionEl) missionEl.textContent = a.mission;
  if (visionEl)  visionEl.textContent  = a.vision;
}

/* ── 14. CONTACT (dynamic) ───────────────────────────────────── */
function applyContact() {
  const c = SITE.contact;
  const addrEl  = document.querySelector('.contact-item:nth-child(1) p');
  const phone1El= document.querySelector('.contact-item:nth-child(2) a:nth-child(1)');
  const phone2El= document.querySelector('.contact-item:nth-child(2) a:nth-child(2)');
  const emailEl = document.querySelector('.contact-item:nth-child(3) a');
  const hours1El= document.querySelector('.contact-item:nth-child(4) p');
  const mapEl   = document.querySelector('.map-embed iframe');
  const waBtn   = document.querySelector('.whatsapp-btn');

  if (addrEl)  addrEl.innerHTML  = c.address.replace(/\n/g,'<br/>');
  if (phone1El){ phone1El.textContent = c.phone1; phone1El.href = `tel:${c.phone1.replace(/\s/g,'')}`; }
  if (phone2El){ phone2El.textContent = c.phone2; phone2El.href = `tel:${c.phone2.replace(/\s/g,'')}`; }
  if (emailEl) { emailEl.textContent = c.email;   emailEl.href  = `mailto:${c.email}`; }
  if (hours1El) hours1El.innerHTML = `${c.hours1}<br/>${c.hours2}`;
  if (mapEl && c.mapUrl) mapEl.src = c.mapUrl;
  if (waBtn && c.whatsapp) waBtn.href = `https://wa.me/${c.whatsapp}?text=Hello%20Kanak%20Aabhushan%2C%20I%20am%20interested%20in%20your%20jewellery%20collections.`;
}

/* ── 15. INSTAGRAM GRID ──────────────────────────────────────── */
function initInstaGrid() {
  const grid = document.getElementById('instaGrid');
  if (!grid) return;
  grid.innerHTML = INSTA_ITEMS.map(item => `
    <div class="insta-item" tabindex="0" aria-label="${item.label}">
      ${item.emoji}
      <div class="insta-overlay"><span>${item.label}</span></div>
    </div>`).join('');
}

/* ── 16. CONTACT FORM ────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    const name  = form.querySelector('#name');
    const phone = form.querySelector('#phone');
    const email = form.querySelector('#email');
    if (!name.value.trim() || name.value.trim().length < 2) { setErr('nameError','Enter your full name.'); ok = false; }
    const phoneClean = phone.value.replace(/\s/g,'');
    if (!phoneClean || !/^[6-9][0-9]{9}$/.test(phoneClean)) { setErr('phoneError','Enter a valid 10-digit mobile number.'); ok = false; }
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setErr('emailError','Enter a valid email address.'); ok = false; }
    if (!ok) return;
    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Sending…'; btn.disabled = true;
    setTimeout(() => {
      form.reset(); btn.textContent = 'Send Enquiry'; btn.disabled = false;
      const suc = document.getElementById('formSuccess');
      if (suc) { suc.style.display = 'block'; setTimeout(() => suc.style.display = 'none', 6000); }
    }, 1600);
  });
}
function setErr(id, msg) { const el = document.getElementById(id); if (el) el.textContent = msg; }

/* ── 17. COLLECTION CARD LINKS ───────────────────────────────── */
function initCollectionCardLinks() {
  document.querySelectorAll('.collection-card').forEach(card => {
    card.setAttribute('tabindex','0');
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      const filterBtn = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
      if (filterBtn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        filterBtn.classList.add('active');
        applyGalleryFilters();
      }
      const gallery = document.getElementById('gallery');
      if (gallery) {
        const top = gallery.getBoundingClientRect().top + window.scrollY - (document.getElementById('header')?.offsetHeight || 72);
        window.scrollTo({ top, behavior:'smooth' });
      }
    });
    card.addEventListener('keydown', e => { if (e.key === 'Enter') card.click(); });
  });
}

/* ── 18. VIDEO CARDS ─────────────────────────────────────────── */
function initVideoCards() {
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.closest('.video-card')?.querySelector('h4')?.textContent || 'Video';
      alert(`🎬 "${title}" — Video coming soon!\n\nVisit our showroom or call +91 98765 43210 to schedule a live showcase.`);
    });
  });
}

/* ── 19. SMOOTH SCROLL ───────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (document.getElementById('header')?.offsetHeight || 72);
      window.scrollTo({ top, behavior:'smooth' });
    });
  });
}

/* ── 20. LAZY LOAD ───────────────────────────────────────────── */
function initLazyLoad() {
  if ('loading' in HTMLImageElement.prototype) return;
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const obs  = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting && e.target.dataset.src) { e.target.src = e.target.dataset.src; obs.unobserve(e.target); } });
  });
  imgs.forEach(img => obs.observe(img));
}

/* ── 21. FOOTER YEAR ─────────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── DEBOUNCE ────────────────────────────────────────────────── */
function debounce(fn, wait) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

/* ════════════════════════════════════════════════════════════════
   BOOT — apply dynamic content then init interactions
════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Apply published content to DOM first
  applyHeroContent();

  // IMPORTANT:
  // Do NOT call applyCollections() because your collections
  // are already written in index.html with image tags.
  // applyCollections();

  applyRates();
  applyAbout();
  applyContact();

  // Then init all interactive modules
  initLoader();
  initTheme();
  initHeader();
  initMobileNav();
  initSmoothScroll();
  initScrollReveal();
  initCounters();

  // Keep collection cards clickable
  initCollectionCardLinks();

  initGallery();
  initModal();
  initSlider();
  initInstaGrid();
  initContactForm();
  initFooterYear();
  initLazyLoad();
  initVideoCards();
});