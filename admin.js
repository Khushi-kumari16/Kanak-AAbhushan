'use strict';
/* ============================================================
   KANAK AABHUSHAN — admin.js
   Architecture:
     ka_draft_*   = admin's unpublished work (only admin sees)
     ka_live_*    = published data (public website reads this)
     ka_auth      = hashed credentials
   Public website (script.js) reads ONLY ka_live_* keys.
   Nothing in ka_draft_* is ever read by index.html.
   ============================================================ */
   import { db } from './firebase.js';
window.editProduct = editProduct;
window.confirmDelete = confirmDelete;
window.switchTab = switchTab;
window.editCollection = editCollection;
window.editTestimonial = editTestimonial;
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
const CLOUD_NAME = "dvch8wwpr";
const UPLOAD_PRESET = "kanak_upload";

async function uploadToCloudinary(file) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    const data = await response.json();
    console.log(response.status);
    console.log(data);

    if (!data.secure_url) {
        throw new Error("Upload failed");
    }

    return data.secure_url;
}
async function loadProductsFromFirestore() {

    const snapshot = await getDocs(collection(db, "products"));

    DRAFT.products = snapshot.docs.map(doc => doc.data());

    renderProductsTable();

    updateDashboard();

}
async function loadHeroFromFirestore() {

    const snap = await getDoc(doc(db, "hero", "current"));

    if (snap.exists()) {

        DRAFT.hero = snap.data();

        populateHeroForm();

    }

}
async function loadRatesFromFirestore() {

    const snap = await getDoc(doc(db, "rates", "today"));

    if (snap.exists()) {

        DRAFT.rates = snap.data();

        populateRatesForm();

    }

}
/* ── STORAGE KEYS ────────────────────────────────────────────── */
const KEY = {
  AUTH:               'ka_auth',
  DRAFT_PRODUCTS:     'ka_draft_products',
  DRAFT_COLLECTIONS:  'ka_draft_collections',
  DRAFT_RATES:        'ka_draft_rates',
  DRAFT_TESTIMONIALS: 'ka_draft_testimonials',
  DRAFT_HERO:         'ka_draft_hero',
  DRAFT_ABOUT:        'ka_draft_about',
  DRAFT_CONTACT:      'ka_draft_contact',
  DRAFT_FLAGS:        'ka_draft_flags',   // which sections have unpublished changes
  // Live keys (read by public website)
  LIVE_PRODUCTS:      'ka_live_products',
  LIVE_COLLECTIONS:   'ka_live_collections',
  LIVE_RATES:         'ka_live_rates',
  LIVE_TESTIMONIALS:  'ka_live_testimonials',
  LIVE_HERO:          'ka_live_hero',
  LIVE_ABOUT:         'ka_live_about',
  LIVE_CONTACT:       'ka_live_contact',
};

/* ── DEFAULT DATA ────────────────────────────────────────────── */
const DEFAULTS = {
  products: [
    { id:1, name:'Royal Kundan Necklace',      cat:'necklace',    img:'', desc:'Handcrafted kundan necklace with polki stones and meenakari work.',   weight:'42 grams', purity:'22kt / 916' },
    { id:2, name:'Bridal Choker Set',           cat:'bridal',      img:'', desc:'Grand bridal choker with matching jhumkas and maang tikka.',          weight:'68 grams', purity:'22kt / 916' },
    { id:3, name:'Diamond-Cut Bangles (pair)',  cat:'bangles',     img:'', desc:'Precision diamond-cut gold bangles, perfect for everyday elegance.',   weight:'24 grams', purity:'22kt / 916' },
    { id:4, name:'Temple Jhumka Earrings',      cat:'earrings',    img:'', desc:'Traditional south-Indian temple design jhumkas with ruby accents.',    weight:'9 grams',  purity:'22kt / 916' },
    { id:5, name:'Solitaire Engagement Ring',   cat:'rings',       img:'', desc:'Classic solitaire ring in 18kt white gold with certified diamond.',    weight:'4 grams',  purity:'18kt / 750' },
    { id:6, name:'Mangalsutra — Modern Slim',   cat:'mangalsutra', img:'', desc:'Contemporary slim mangalsutra with black bead and gold pendant.',      weight:'7 grams',  purity:'22kt / 916' },
    { id:7, name:"Men's Cuban Link Chain",      cat:'mens',        img:'', desc:'Bold Cuban link gold chain for the modern gentleman.',                  weight:'30 grams', purity:'22kt / 916' },
    { id:8, name:"Kids' Anklet Set",            cat:'kids',        img:'', desc:'Delicate gold anklets with tiny bells, safe for toddlers.',            weight:'5 grams',  purity:'22kt / 916' },
  ],
  collections: [
    { id:1, name:'Gold Jewellery',   icon:'⚜',  key:'gold',         desc:'Classic & contemporary gold pieces for every occasion.',                badge:'' },
    { id:2, name:'Bridal Collection',icon:'👑',  key:'bridal',       desc:'Complete bridal sets crafted to make your special day unforgettable.',   badge:'' },
    { id:3, name:'Necklace Sets',    icon:'💎',  key:'necklace',     desc:'Exquisite necklaces from delicate chains to grand haar sets.',           badge:'' },
    { id:4, name:'Earrings',         icon:'✨',  key:'earrings',     desc:'Studs, jhumkas, drops & chandbalis for every face & mood.',              badge:'' },
    { id:5, name:'Rings',            icon:'💍',  key:'rings',        desc:'Engagement, wedding, & fashion rings in stunning designs.',              badge:'' },
    { id:6, name:'Bangles',          icon:'🔆',  key:'bangles',      desc:'Traditional kadas, churis, & designer bangles in pure gold.',            badge:'' },
    { id:7, name:'Mangalsutra',      icon:'🌸',  key:'mangalsutra',  desc:'Sacred & stylish mangalsutras for the modern bride.',                    badge:'' },
    { id:8, name:"Men's Jewellery",  icon:'🛡',  key:'mens',         desc:'Chains, bracelets & rings crafted for the modern gentleman.',            badge:'' },
    { id:9, name:"Kids' Jewellery",  icon:'🌟',  key:'kids',         desc:"Delicate & safe pieces for your little ones' precious moments.",         badge:'' },
    { id:10,name:'Hallmark 730',     icon:'🏅',  key:'hallmark730',  desc:'BIS certified 18kt gold — superior craftsmanship at every gram.',        badge:'BIS 730' },
    { id:11,name:'Hallmark 916',     icon:'🥇',  key:'hallmark916',  desc:"The purest 22kt gold collection — India's most trusted standard.",      badge:'BIS 916' },
  ],
  rates: {
    gold24kt: 7420, gold24ktChange: 120,
    gold22kt: 6800, gold22ktChange: 110,
    gold18kt: 5570, gold18ktChange: 90,
    silver:   92,   silverChange:   -3,
  },
  testimonials: [
    { id:1, name:'Sunita Devi',   location:'Bihar Sharif', stars:5, text:'"We purchased our daughter\'s entire bridal set from Kanak Aabhushan. The quality is extraordinary and the hallmark gives us complete peace of mind!"' },
    { id:2, name:'Rajesh Kumar',  location:'Nalanda',      stars:5, text:'"Incredible collection and very honest staff. My wife was overjoyed with her anniversary gift."' },
    { id:3, name:'Priya Singh',   location:'Patna',        stars:5, text:'"The 916 hallmark collection is simply stunning. We exchanged old jewellery at a fair price and the process was completely transparent."' },
  ],
  hero: {
    eyebrow: '— Est. 1985, Bihar Sharif —',
    title:   'Adorn Every',
    italic:  'Precious Moment',
    desc:    'Hallmark certified gold & bridal jewellery crafted with generations of artisan pride. Visit our showroom to discover collections that tell your story.',
    cta1:    'Explore Collections',
    cta2:    'Book a Visit',
  },
  about: {
    title:   'Crafting Trust Since 1985',
    p1:      'Kanak Aabhushan was founded by Shri Ram Prasad Soni in the heart of Bihar Sharif with a single belief: every family deserves beautiful, genuine, and fairly priced gold jewellery.',
    p2:      'Today, led by the second generation, we continue that legacy — blending traditional Bihari craftsmanship with contemporary design sensibilities.',
    mission: 'To make pure, certified, beautifully crafted jewellery accessible to every family in Bihar.',
    vision:  "To be Bihar's most trusted jewellery brand — known for integrity, artistry, and lasting relationships.",
    year:    'Est. 1985',
  },
  contact: {
    address:   'Main Market, Near Nalanda Collectorate, Bihar Sharif, Nalanda – 803101, Bihar',
    phone1:    '+91 98765 43210',
    phone2:    '+91 611 234 5678',
    email:     'info@kanakaabhushan.in',
    whatsapp:  '919876543210',
    hours1:    'Mon – Sat: 10:00 AM – 8:00 PM',
    hours2:    'Sunday: 11:00 AM – 6:00 PM',
    mapUrl:    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57817.19948963022!2d85.46891!3d25.19774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f2255e7c12bbcb%3A0x9a61ac4e54e46f31!2sBihar%20Sharif%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000',
  },
};

/* ── STORAGE HELPERS ─────────────────────────────────────────── */
function load(key, fallback = null) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}

/* ── DRAFT STATE ─────────────────────────────────────────────── */
// Draft is loaded once on init; edits mutate draft then save
let DRAFT = {
  products:     load(KEY.DRAFT_PRODUCTS,     DEFAULTS.products),
  collections:  load(KEY.DRAFT_COLLECTIONS,  DEFAULTS.collections),
  rates:        load(KEY.DRAFT_RATES,        DEFAULTS.rates),
  testimonials: load(KEY.DRAFT_TESTIMONIALS, DEFAULTS.testimonials),
  hero:         load(KEY.DRAFT_HERO,         DEFAULTS.hero),
  about:        load(KEY.DRAFT_ABOUT,        DEFAULTS.about),
  contact:      load(KEY.DRAFT_CONTACT,      DEFAULTS.contact),
  flags:        load(KEY.DRAFT_FLAGS,        {}),  // { products: true, rates: true, … }
};

function persistDraft(section) {
  save(KEY[`DRAFT_${section.toUpperCase()}`], DRAFT[section]);
  DRAFT.flags[section] = true;
  save(KEY.DRAFT_FLAGS, DRAFT.flags);
  updateDraftIndicator();
}

/* ── AUTH ────────────────────────────────────────────────────── */
function hashPass(p) {
  // Simple deterministic hash (adequate for localStorage-only security)
  let h = 5381;
  for (let i = 0; i < p.length; i++) h = ((h << 5) + h) ^ p.charCodeAt(i);
  return (h >>> 0).toString(36);
}

function getAuth() {
  return load(KEY.AUTH, { username: 'admin', hash: hashPass('admin123') });
}

function checkLogin(user, pass) {
  const auth = getAuth();
  return user === auth.username && hashPass(pass) === auth.hash;
}

/* ── LOGIN UI ────────────────────────────────────────────────── */
function initLogin() {
  const loginScreen = document.getElementById('loginScreen');
  const adminApp    = document.getElementById('adminApp');
  const loginBtn    = document.getElementById('loginBtn');
  const loginError  = document.getElementById('loginError');
  const pwToggle    = document.getElementById('pwToggle');
  const loginPass   = document.getElementById('loginPass');

  // Check if already logged in (session flag)
  if (sessionStorage.getItem('ka_admin_session') === '1') {
    loginScreen.style.display = 'none';
    adminApp.style.display    = 'flex';
    initDashboard();
    return;
  }

  // Toggle password visibility
  pwToggle && pwToggle.addEventListener('click', () => {
    loginPass.type = loginPass.type === 'password' ? 'text' : 'password';
    pwToggle.textContent = loginPass.type === 'password' ? '👁' : '🙈';
  });

  // Enter key on inputs
  [document.getElementById('loginUser'), loginPass].forEach(el => {
    el && el.addEventListener('keydown', e => { if (e.key === 'Enter') loginBtn.click(); });
  });

  loginBtn && loginBtn.addEventListener('click', () => {
    const user = document.getElementById('loginUser').value.trim();
    const pass = loginPass.value;
    loginError.textContent = '';

    if (!user || !pass) { loginError.textContent = 'Please enter username and password.'; return; }

    if (checkLogin(user, pass)) {
      sessionStorage.setItem('ka_admin_session', '1');
      loginScreen.style.display = 'none';
      adminApp.style.display    = 'flex';
      initDashboard();
    } else {
      loginError.textContent = 'Incorrect username or password.';
      loginPass.value = '';
      loginPass.focus();
    }
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem('ka_admin_session');
    location.reload();
  });
}

/* ── TAB NAVIGATION ──────────────────────────────────────────── */
function switchTab(name) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const tab = document.getElementById(`tab-${name}`);
  if (tab) tab.classList.add('active');
  const navBtn = document.querySelector(`.nav-item[data-tab="${name}"]`);
  if (navBtn) navBtn.classList.add('active');
  document.getElementById('topbarTitle').textContent =
    navBtn ? navBtn.textContent.trim().replace(/^.{2}/, '').trim() : name;
  // Refresh tab-specific data
  if (name === 'dashboard')    updateDashboard();
  if (name === 'products')     renderProductsTable();
  if (name === 'collections')  renderCollectionsGrid();
  if (name === 'rates')        populateRatesForm();
  if (name === 'testimonials') renderTestimonialsAdmin();
  if (name === 'hero')         populateHeroForm();
  if (name === 'about')        populateAboutForm();
  if (name === 'contact')      populateContactForm();
}

function initTabs() {
  document.querySelectorAll('.nav-item[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

/* ── SIDEBAR TOGGLE ──────────────────────────────────────────── */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main    = document.querySelector('.admin-main');
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      sidebar.classList.toggle('open');
    } else {
      sidebar.classList.toggle('collapsed');
      main.classList.toggle('expanded');
    }
  });
  // Close sidebar on nav click (mobile)
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth <= 900) sidebar.classList.remove('open');
    });
  });
}

/* ── TOAST ───────────────────────────────────────────────────── */
let toastTimer;
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = (type === 'success' ? '✅ ' : '❌ ') + msg;
  t.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

/* ── DRAFT INDICATOR ─────────────────────────────────────────── */
function updateDraftIndicator() {
  const flags  = DRAFT.flags;
  const count  = Object.values(flags).filter(Boolean).length;
  const dot    = document.querySelector('.draft-dot');
  const label  = document.getElementById('draftCount');
  const status = document.getElementById('publishStatus');
  const pubBtn = document.getElementById('publishBtn');

  if (dot)    dot.classList.toggle('active', count > 0);
  if (label)  label.textContent = count > 0 ? `${count} section${count > 1 ? 's' : ''} with unpublished changes` : 'All changes published';
  if (status) {
    status.innerHTML = count > 0
      ? '<span class="status-dot pending"></span> Unpublished changes'
      : '<span class="status-dot published"></span> Website up to date';
  }
  if (pubBtn) pubBtn.disabled = count === 0;
}

/* ── PUBLISH SYSTEM ──────────────────────────────────────────── */
function initPublish() {
  const publishBtn    = document.getElementById('publishBtn');
  const modal         = document.getElementById('publishModal');
  const confirmBtn    = document.getElementById('confirmPublish');
  const cancelBtn     = document.getElementById('cancelPublish');
  const changesList   = document.getElementById('modalChangesList');

  publishBtn && publishBtn.addEventListener('click', () => {
    // Build changes summary
    const flags = DRAFT.flags;
    const labels = {
      products: '💍 Products', collections: '✨ Collections',
      rates: '📈 Gold Rates', testimonials: '💬 Testimonials',
      hero: '🖼 Hero Banner', about: '📖 About Us', contact: '📞 Contact Info',
    };
    changesList.innerHTML = Object.entries(flags)
      .filter(([, v]) => v)
      .map(([k]) => `<div class="mc-item">${labels[k] || k}</div>`)
      .join('') || '<p class="muted">No pending changes.</p>';

    modal.classList.add('open');
  });

  cancelBtn  && cancelBtn.addEventListener('click',  () => modal.classList.remove('open'));
  modal      && modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

  confirmBtn && confirmBtn.addEventListener('click', () => {
    publishAll();
    modal.classList.remove('open');
  });
}

async function publishAll() {

  const flags = DRAFT.flags;

  // Local publish (keep this)
  if (flags.products)     save(KEY.LIVE_PRODUCTS, DRAFT.products);
  if (flags.collections)  save(KEY.LIVE_COLLECTIONS, DRAFT.collections);
  if (flags.rates)        save(KEY.LIVE_RATES, DRAFT.rates);
  if (flags.testimonials) save(KEY.LIVE_TESTIMONIALS, DRAFT.testimonials);
  if (flags.hero)         save(KEY.LIVE_HERO, DRAFT.hero);
  if (flags.about)        save(KEY.LIVE_ABOUT, DRAFT.about);
  if (flags.contact)      save(KEY.LIVE_CONTACT, DRAFT.contact);

  try {

    /* ===========================
       HERO
    =========================== */

    if (flags.hero) {

      await setDoc(doc(db, "hero", "current"), {

        eyebrow: DRAFT.hero.eyebrow,
        title: DRAFT.hero.title,
        italic: DRAFT.hero.italic,
        desc: DRAFT.hero.desc,
        cta1: DRAFT.hero.cta1,
        cta2: DRAFT.hero.cta2

      });

    }

    /* ===========================
       RATES
    =========================== */

    if (flags.rates) {

      await setDoc(doc(db, "rates", "today"), {

        gold24kt: Number(DRAFT.rates.gold24kt),
        gold24ktChange: Number(DRAFT.rates.gold24ktChange),

        gold22kt: Number(DRAFT.rates.gold22kt),
        gold22ktChange: Number(DRAFT.rates.gold22ktChange),

        gold18kt: Number(DRAFT.rates.gold18kt),
        gold18ktChange: Number(DRAFT.rates.gold18ktChange),

        silver: Number(DRAFT.rates.silver),
        silverChange: Number(DRAFT.rates.silverChange)

      });

    }

    /* ===========================
       PRODUCTS
    =========================== */

    if (flags.products) {

      for (const product of DRAFT.products) {

        await setDoc(
          doc(db, "products", String(product.id)),
          {
            id: product.id,
            name: product.name,
            cat: product.cat,
            desc: product.desc,
            weight: product.weight,
            purity: product.purity,
            img: product.img
          }
        );

      }

    }

    DRAFT.flags = {};

    save(KEY.DRAFT_FLAGS, {});

    updateDraftIndicator();

    updateDashboard();

    showToast("Published successfully!");

  } catch (err) {

    console.error(err);

    showToast("Publish failed!", "error");

  }

}
/* ── DASHBOARD ───────────────────────────────────────────────── */
function initDashboard() {
  updateDashboard();
  loadProductsFromFirestore();
loadHeroFromFirestore();
loadRatesFromFirestore();
  // Initialise all other sub-modules
  initTabs();
  initSidebar();
  initPublish();
  initProductsTab();
  initCollectionsTab();
  initRatesTab();
  initTestimonialsTab();
  initHeroTab();
  initAboutTab();
  initContactTab();
  initPasswordTab();
  updateDraftIndicator();
}

function updateDashboard() {
  setText('dashProducts',    DRAFT.products.length);
  setText('dashCollections', DRAFT.collections.length);
  setText('dashTestimonials',DRAFT.testimonials.length);
  setText('dashRate',        `₹${(DRAFT.rates.gold22kt || 0).toLocaleString('en-IN')}`);

  // Recent products
  const el = document.getElementById('dashRecentProducts');
  if (el) {
    const last5 = [...DRAFT.products].reverse().slice(0, 5);
    el.innerHTML = last5.length
      ? last5.map(p => `
          <div class="recent-product-row">
            <div class="rp-thumb">${p.img ? `<img src="${p.img}" alt="${p.name}"/>` : catEmoji(p.cat)}</div>
            <div><div class="rp-name">${p.name}</div><div class="rp-cat">${catLabel(p.cat)}</div></div>
          </div>`).join('')
      : '<p class="muted">No products yet.</p>';
  }

  // Diff table
  const dt = document.getElementById('diffTable');
  if (dt) {
    const flags = DRAFT.flags;
    const sections = { products:'Products', collections:'Collections', rates:'Gold Rates', testimonials:'Reviews', hero:'Hero Banner', about:'About Us', contact:'Contact' };
    const pending = Object.entries(sections).filter(([k]) => flags[k]);
    dt.innerHTML = pending.length
      ? pending.map(([,label]) => `<div class="diff-row"><span class="diff-section">${label}</span><span class="diff-count">Unpublished</span></div>`).join('')
      : '<p class="muted">No pending changes. All data is live.</p>';
  }

  // Update counts in tab badges
  setText('productCount',    DRAFT.products.length);
  setText('collectionCount', DRAFT.collections.length);
  setText('testimonialCount',DRAFT.testimonials.length);
}

/* ── PRODUCTS TAB ────────────────────────────────────────────── */
let pendingDeleteId   = null;
let pendingDeleteType = null;

function initProductsTab() {
  document.getElementById('openAddProduct')?.addEventListener('click', () => openProductForm());
  document.getElementById('saveProduct')?.addEventListener('click',   saveProduct);
  document.getElementById('cancelProduct')?.addEventListener('click', () => closeProductForm());
  document.getElementById('cancelProduct2')?.addEventListener('click',() => closeProductForm());

  // Image upload
  const area    = document.getElementById('imgUploadArea');
  const fileIn  = document.getElementById('pImg');
  const preview = document.getElementById('imgPreview');
  const ph      = document.getElementById('uploadPh');
  const remBtn  = document.getElementById('removeImg');

  area?.addEventListener('click',  e => { if (e.target !== remBtn) fileIn.click(); });
  area?.addEventListener('dragover', e => { e.preventDefault(); area.style.borderColor = 'var(--gold)'; });
  area?.addEventListener('dragleave',() => { area.style.borderColor = ''; });
  area?.addEventListener('drop',   e => { e.preventDefault(); area.style.borderColor = ''; handleImageFile(e.dataTransfer.files[0]); });
  fileIn?.addEventListener('change',() => handleImageFile(fileIn.files[0]));
  remBtn?.addEventListener('click', e => {
    e.stopPropagation();
    preview.src = ''; preview.style.display = 'none';
    ph.style.display = ''; remBtn.style.display = 'none';
    fileIn.value = '';
  });

  renderProductsTable();
  initDeleteModal();
}

function handleImageFile(file) {
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5 MB.', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById('imgPreview');
    const ph      = document.getElementById('uploadPh');
    const remBtn  = document.getElementById('removeImg');
    preview.src = e.target.result;
    preview.style.display = 'block';
    ph.style.display      = 'none';
    remBtn.style.display  = 'inline-block';
  };
  reader.readAsDataURL(file);
}

function openProductForm(product = null) {
  const panel = document.getElementById('productFormPanel');
  document.getElementById('productFormTitle').textContent = product ? 'Edit Product' : 'Add New Product';
  document.getElementById('pEditId').value = product ? product.id : '';
  document.getElementById('pName').value   = product?.name   || '';
  document.getElementById('pCat').value    = product?.cat    || '';
  document.getElementById('pWeight').value = product?.weight || '';
  document.getElementById('pPurity').value = product?.purity || '';
  document.getElementById('pDesc').value   = product?.desc   || '';

  const preview = document.getElementById('imgPreview');
  const ph      = document.getElementById('uploadPh');
  const remBtn  = document.getElementById('removeImg');
  if (product?.img) {
    preview.src = product.img; preview.style.display = 'block';
    ph.style.display = 'none'; remBtn.style.display = 'inline-block';
  } else {
    preview.src = ''; preview.style.display = 'none';
    ph.style.display = ''; remBtn.style.display = 'none';
  }
  document.getElementById('pImg').value = '';
  clearFormErrors(['pNameErr','pCatErr','pDescErr']);
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeProductForm() {
  document.getElementById('productFormPanel').style.display = 'none';
}

async function  saveProduct() {
  const name   = val('pName').trim();
  const cat    = val('pCat');
  const desc   = val('pDesc').trim();
  const weight = val('pWeight').trim();
  const purity = val('pPurity').trim();
  const editId = val('pEditId');
 const file = document.getElementById('pImg').files[0];

  let ok = true;
  if (!name)  { setFerr('pNameErr','Product name is required.'); ok = false; }
  if (!cat)   { setFerr('pCatErr', 'Please select a category.'); ok = false; }
  if (!desc)  { setFerr('pDescErr','Description is required.');  ok = false; }
  if (!ok) return;
let imageUrl = '';

if (file) {
    showToast('Uploading image...');

    try {
        imageUrl = await uploadToCloudinary(file);
    } catch (err) {
        showToast('Image upload failed', 'error');
        return;
    }
}
if (editId) {

    const product = {
        id: +editId,
        name,
        cat,
        desc,
        weight,
        purity,
        img: imageUrl || DRAFT.products.find(p => p.id == editId).img
    };

    const idx = DRAFT.products.findIndex(p => p.id == editId);

    DRAFT.products[idx] = product;

    await setDoc(
        doc(db, "products", String(editId)),
        product
    );

} else {
    const newId = Date.now();
    DRAFT.products.push({
    id: newId,
    name,
    cat,
    desc,
    weight,
    purity,
   img: imageUrl 
});
  }

  persistDraft('products');
  closeProductForm();
  renderProductsTable();
  updateDashboard();
  showToast(editId ? 'Product updated in draft.' : 'Product added to draft.');
}

function renderProductsTable() {
  const tbody = document.getElementById('productsTbody');
  const empty = document.getElementById('productsEmpty');
  if (!tbody) return;
  if (!DRAFT.products.length) {
    tbody.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  tbody.innerHTML = DRAFT.products.map(p => `
    <tr>
      <td><div class="thumb-cell">${p.img ? `<img src="${p.img}" alt="${p.name}"/>` : catEmoji(p.cat)}</div></td>
      <td><strong>${p.name}</strong></td>
      <td><span class="cat-pill">${catLabel(p.cat)}</span></td>
      <td>${p.weight || '—'}</td>
      <td>${p.purity || '—'}</td>
      <td>
        <div class="action-btns">
          <button class="action-btn edit" onclick="editProduct(${p.id})">✏ Edit</button>
          <button class="action-btn del"  onclick="confirmDelete('product',${p.id},'${escHtml(p.name)}')">🗑</button>
        </div>
      </td>
    </tr>`).join('');
  setText('productCount', DRAFT.products.length);
}

function editProduct(id) {
  const p = DRAFT.products.find(p => p.id === id);
  if (p) openProductForm(p);
}

/* ── COLLECTIONS TAB ─────────────────────────────────────────── */
function initCollectionsTab() {
  document.getElementById('openAddCollection')?.addEventListener('click', () => openCollectionForm());
  document.getElementById('saveCollection')?.addEventListener('click',   saveCollection);
  document.getElementById('cancelCollection')?.addEventListener('click',  () => closeCollectionForm());
  document.getElementById('cancelCollection2')?.addEventListener('click', () => closeCollectionForm());
  renderCollectionsGrid();
}

function openCollectionForm(col = null) {
  const panel = document.getElementById('collectionFormPanel');
  document.getElementById('collectionFormTitle').textContent = col ? 'Edit Collection' : 'Add Collection';
  document.getElementById('cEditId').value = col ? col.id : '';
  document.getElementById('cName').value  = col?.name  || '';
  document.getElementById('cIcon').value  = col?.icon  || '';
  document.getElementById('cKey').value   = col?.key   || '';
  document.getElementById('cDesc').value  = col?.desc  || '';
  document.getElementById('cBadge').value = col?.badge || '';
  clearFormErrors(['cNameErr','cKeyErr','cDescErr']);
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function closeCollectionForm() { document.getElementById('collectionFormPanel').style.display = 'none'; }

function saveCollection() {
  const name  = val('cName').trim();
  const key   = val('cKey').trim().toLowerCase().replace(/\s+/g,'');
  const desc  = val('cDesc').trim();
  const icon  = val('cIcon').trim() || '⚜';
  const badge = val('cBadge');
  const editId= val('cEditId');
  let ok = true;
  if (!name) { setFerr('cNameErr','Name is required.'); ok = false; }
  if (!key)  { setFerr('cKeyErr', 'Category key is required.'); ok = false; }
  if (!desc) { setFerr('cDescErr','Description is required.'); ok = false; }
  if (!ok) return;

  if (editId) {
    const idx = DRAFT.collections.findIndex(c => c.id == editId);
    if (idx !== -1) DRAFT.collections[idx] = { id: +editId, name, icon, key, desc, badge };
  } else {
    DRAFT.collections.push({ id: Date.now(), name, icon, key, desc, badge });
  }
  persistDraft('collections');
  closeCollectionForm();
  renderCollectionsGrid();
  updateDashboard();
  showToast(editId ? 'Collection updated in draft.' : 'Collection added to draft.');
}

function renderCollectionsGrid() {
  const grid  = document.getElementById('collectionsAdminGrid');
  const empty = document.getElementById('collectionsEmpty');
  if (!grid) return;
  if (!DRAFT.collections.length) { grid.innerHTML = ''; if(empty) empty.style.display='block'; return; }
  if (empty) empty.style.display = 'none';
  grid.innerHTML = DRAFT.collections.map(c => `
    <div class="ca-card">
      <div class="ca-card-head">
        <span class="ca-icon">${c.icon}</span>
        <div class="action-btns">
          <button class="action-btn edit" onclick="editCollection(${c.id})">✏</button>
          <button class="action-btn del"  onclick="confirmDelete('collection',${c.id},'${escHtml(c.name)}')">🗑</button>
        </div>
      </div>
      <h4>${c.name}</h4>
      <p>${c.desc}</p>
      ${c.badge ? `<span class="ca-badge">${c.badge}</span>` : ''}
    </div>`).join('');
  setText('collectionCount', DRAFT.collections.length);
}
function editCollection(id) { openCollectionForm(DRAFT.collections.find(c => c.id === id)); }

/* ── RATES TAB ───────────────────────────────────────────────── */
function initRatesTab() {
  document.getElementById('saveRates')?.addEventListener('click', saveRates);
  populateRatesForm();
}
function populateRatesForm() {
  const r = DRAFT.rates;
  setVal('r24kt',        r.gold24kt       || '');
  setVal('r24ktChange',  r.gold24ktChange  || '');
  setVal('r22kt',        r.gold22kt       || '');
  setVal('r22ktChange',  r.gold22ktChange  || '');
  setVal('r18kt',        r.gold18kt       || '');
  setVal('r18ktChange',  r.gold18ktChange  || '');
  setVal('rSilver',      r.silver         || '');
  setVal('rSilverChange',r.silverChange    || '');
}
function saveRates() {
  console.log("saveRates called");
  DRAFT.rates = {
    gold24kt:       +val('r24kt')        || DRAFT.rates.gold24kt,
    gold24ktChange: +val('r24ktChange')   || 0,
    gold22kt:       +val('r22kt')        || DRAFT.rates.gold22kt,
    gold22ktChange: +val('r22ktChange')   || 0,
    gold18kt:       +val('r18kt')        || DRAFT.rates.gold18kt,
    gold18ktChange: +val('r18ktChange')   || 0,
    silver:         +val('rSilver')      || DRAFT.rates.silver,
    silverChange:   +val('rSilverChange') || 0,
  };
  console.log(DRAFT.rates);
  persistDraft('rates');
  updateDashboard();
  showToast('Rates saved to draft. Click Publish to go live.');
}

/* ── TESTIMONIALS TAB ────────────────────────────────────────── */
function initTestimonialsTab() {
  document.getElementById('openAddTestimonial')?.addEventListener('click', () => openTestimonialForm());
  document.getElementById('saveTestimonial')?.addEventListener('click',   saveTestimonial);
  document.getElementById('cancelTestimonial')?.addEventListener('click',  () => closeTestimonialForm());
  document.getElementById('cancelTestimonial2')?.addEventListener('click', () => closeTestimonialForm());
  renderTestimonialsAdmin();
}
function openTestimonialForm(t = null) {
  const panel = document.getElementById('testimonialFormPanel');
  document.getElementById('testimonialFormTitle').textContent = t ? 'Edit Review' : 'Add Review';
  document.getElementById('tEditId').value   = t ? t.id : '';
  document.getElementById('tName').value     = t?.name     || '';
  document.getElementById('tLocation').value = t?.location || '';
  document.getElementById('tStars').value    = t?.stars    || 5;
  document.getElementById('tText').value     = t?.text     || '';
  clearFormErrors(['tNameErr','tTextErr']);
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function closeTestimonialForm() { document.getElementById('testimonialFormPanel').style.display = 'none'; }

function saveTestimonial() {
  const name     = val('tName').trim();
  const location = val('tLocation').trim();
  const stars    = +val('tStars') || 5;
  const text     = val('tText').trim();
  const editId   = val('tEditId');
  let ok = true;
  if (!name) { setFerr('tNameErr','Customer name is required.'); ok = false; }
  if (!text) { setFerr('tTextErr','Review text is required.');   ok = false; }
  if (!ok) return;

  if (editId) {
    const idx = DRAFT.testimonials.findIndex(t => t.id == editId);
    if (idx !== -1) DRAFT.testimonials[idx] = { id: +editId, name, location, stars, text };
  } else {
    DRAFT.testimonials.push({ id: Date.now(), name, location, stars, text });
  }
  persistDraft('testimonials');
  closeTestimonialForm();
  renderTestimonialsAdmin();
  updateDashboard();
  showToast(editId ? 'Review updated in draft.' : 'Review added to draft.');
}

function renderTestimonialsAdmin() {
  const list  = document.getElementById('testimonialsAdminList');
  const empty = document.getElementById('testimonialsEmpty');
  if (!list) return;
  if (!DRAFT.testimonials.length) { list.innerHTML = ''; if(empty) empty.style.display='block'; return; }
  if (empty) empty.style.display = 'none';
  list.innerHTML = DRAFT.testimonials.map(t => `
    <div class="t-admin-card">
      <div class="t-content">
        <div class="t-stars">${'★'.repeat(t.stars)}${'☆'.repeat(5-t.stars)}</div>
        <div class="t-text">${t.text.slice(0, 120)}${t.text.length > 120 ? '…' : ''}</div>
        <div class="t-author">${t.name} <span class="t-location">— ${t.location || ''}</span></div>
      </div>
      <div class="action-btns" style="flex-direction:column;">
        <button class="action-btn edit" onclick="editTestimonial(${t.id})">✏ Edit</button>
        <button class="action-btn del"  onclick="confirmDelete('testimonial',${t.id},'${escHtml(t.name)}')">🗑</button>
      </div>
    </div>`).join('');
  setText('testimonialCount', DRAFT.testimonials.length);
}
function editTestimonial(id) { openTestimonialForm(DRAFT.testimonials.find(t => t.id === id)); }

/* ── HERO TAB ────────────────────────────────────────────────── */
function initHeroTab() {
  document.getElementById('saveHero')?.addEventListener('click', saveHero);
  document.getElementById('resetHero')?.addEventListener('click', () => {
    DRAFT.hero = { ...DEFAULTS.hero };
    populateHeroForm();
    persistDraft('hero');
    showToast('Hero banner reset to default.');
  });
  populateHeroForm();
}
function populateHeroForm() {
  const h = DRAFT.hero;
  setVal('heroEyebrow', h.eyebrow || '');
  setVal('heroTitle',   h.title   || '');
  setVal('heroItalic',  h.italic  || '');
  setVal('heroDesc',    h.desc    || '');
  setVal('heroCta1',    h.cta1    || '');
  setVal('heroCta2',    h.cta2    || '');
}
function saveHero() {
  DRAFT.hero = {
    eyebrow: val('heroEyebrow'),
    title:   val('heroTitle'),
    italic:  val('heroItalic'),
    desc:    val('heroDesc'),
    cta1:    val('heroCta1'),
    cta2:    val('heroCta2'),
  };
  persistDraft('hero');
  showToast('Hero banner saved to draft.');
}

/* ── ABOUT TAB ───────────────────────────────────────────────── */
function initAboutTab() {
  document.getElementById('saveAbout')?.addEventListener('click', saveAbout);
  document.getElementById('resetAbout')?.addEventListener('click', () => {
    DRAFT.about = { ...DEFAULTS.about };
    populateAboutForm();
    persistDraft('about');
    showToast('About Us reset to default.');
  });
  populateAboutForm();
}
function populateAboutForm() {
  const a = DRAFT.about;
  setVal('aboutTitle',   a.title   || '');
  setVal('aboutP1',      a.p1      || '');
  setVal('aboutP2',      a.p2      || '');
  setVal('aboutMission', a.mission || '');
  setVal('aboutVision',  a.vision  || '');
  setVal('aboutYear',    a.year    || '');
}
function saveAbout() {
  DRAFT.about = {
    title:   val('aboutTitle'),
    p1:      val('aboutP1'),
    p2:      val('aboutP2'),
    mission: val('aboutMission'),
    vision:  val('aboutVision'),
    year:    val('aboutYear'),
  };
  persistDraft('about');
  showToast('About Us saved to draft.');
}

/* ── CONTACT TAB ─────────────────────────────────────────────── */
function initContactTab() {
  document.getElementById('saveContact')?.addEventListener('click', saveContact);
  document.getElementById('resetContact')?.addEventListener('click', () => {
    DRAFT.contact = { ...DEFAULTS.contact };
    populateContactForm();
    persistDraft('contact');
    showToast('Contact info reset to default.');
  });
  populateContactForm();
}
function populateContactForm() {
  const c = DRAFT.contact;
  setVal('contactAddress',  c.address  || '');
  setVal('contactPhone1',   c.phone1   || '');
  setVal('contactPhone2',   c.phone2   || '');
  setVal('contactEmail',    c.email    || '');
  setVal('contactWhatsapp', c.whatsapp || '');
  setVal('contactHours1',   c.hours1   || '');
  setVal('contactHours2',   c.hours2   || '');
  setVal('contactMapUrl',   c.mapUrl   || '');
}
function saveContact() {
  DRAFT.contact = {
    address:  val('contactAddress'),
    phone1:   val('contactPhone1'),
    phone2:   val('contactPhone2'),
    email:    val('contactEmail'),
    whatsapp: val('contactWhatsapp'),
    hours1:   val('contactHours1'),
    hours2:   val('contactHours2'),
    mapUrl:   val('contactMapUrl'),
  };
  persistDraft('contact');
  showToast('Contact info saved to draft.');
}

/* ── PASSWORD TAB ────────────────────────────────────────────── */
function initPasswordTab() {
  document.getElementById('savePassword')?.addEventListener('click', () => {
    const current  = document.getElementById('pwCurrent').value;
    const newPass  = document.getElementById('pwNew').value;
    const confirm  = document.getElementById('pwConfirm').value;
    const errEl    = document.getElementById('pwError');
    errEl.textContent = '';

    const auth = getAuth();
    if (hashPass(current) !== auth.hash) { errEl.textContent = 'Current password is incorrect.'; return; }
    if (newPass.length < 6)              { errEl.textContent = 'New password must be at least 6 characters.'; return; }
    if (newPass !== confirm)             { errEl.textContent = 'Passwords do not match.'; return; }

    save(KEY.AUTH, { username: auth.username, hash: hashPass(newPass) });
    document.getElementById('pwCurrent').value = '';
    document.getElementById('pwNew').value     = '';
    document.getElementById('pwConfirm').value = '';
    showToast('Password updated successfully.');
  });
}

/* ── DELETE MODAL ────────────────────────────────────────────── */
function initDeleteModal() {
  const modal     = document.getElementById('deleteModal');
  const confirmEl = document.getElementById('confirmDelete');
  const cancelEl  = document.getElementById('cancelDelete');
  cancelEl  && cancelEl.addEventListener('click',  () => modal.classList.remove('open'));
  modal     && modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
  confirmEl && confirmEl.addEventListener('click',async() => {
    if (pendingDeleteType === 'product') {

  try {

    // Delete from Firestore
    await deleteDoc(doc(db, "products", String(pendingDeleteId)));

    // Delete from draft
    DRAFT.products = DRAFT.products.filter(
      p => p.id !== pendingDeleteId
    );

    persistDraft('products');

    renderProductsTable();

    showToast("Product deleted successfully.");

  } catch (error) {

    console.error(error);

    showToast("Failed to delete product.", "error");

  }

} else if (pendingDeleteType === 'collection') {
      DRAFT.collections = DRAFT.collections.filter(c => c.id !== pendingDeleteId);
      persistDraft('collections');
      renderCollectionsGrid();
    } else if (pendingDeleteType === 'testimonial') {
      DRAFT.testimonials = DRAFT.testimonials.filter(t => t.id !== pendingDeleteId);
      persistDraft('testimonials');
      renderTestimonialsAdmin();
    }
    updateDashboard();
    modal.classList.remove('open');
    showToast('Item deleted from draft.');
    pendingDeleteId = null; pendingDeleteType = null;
  });
}

function confirmDelete(type, id, name) {
  pendingDeleteId   = id;
  pendingDeleteType = type;
  document.getElementById('deleteModalMsg').textContent = `Delete "${name}" from your draft? This cannot be undone.`;
  document.getElementById('deleteModal').classList.add('open');
}

/* ── SMALL HELPERS ───────────────────────────────────────────── */
function val(id)         { return (document.getElementById(id)?.value || ''); }
function setVal(id, v)   { const el = document.getElementById(id); if (el) el.value = v; }
function setText(id, v)  { const el = document.getElementById(id); if (el) el.textContent = v; }
function setFerr(id, m)  { const el = document.getElementById(id); if (el) el.textContent = m; }
function clearFormErrors(ids) { ids.forEach(id => setFerr(id, '')); }
function escHtml(s)      { return String(s).replace(/'/g, "\\'").replace(/"/g, '&quot;'); }

const CAT_EMOJIS = { gold:'⚜', bridal:'👑', necklace:'📿', earrings:'✨', rings:'💍', bangles:'🔆', mangalsutra:'🌸', mens:'🛡', kids:'🌟' };
const CAT_LABELS = { gold:'Gold', bridal:'Bridal', necklace:'Necklace', earrings:'Earrings', rings:'Rings', bangles:'Bangles', mangalsutra:'Mangalsutra', mens:"Men's", kids:"Kids'" };
function catEmoji(c) { return CAT_EMOJIS[c] || '⚜'; }
function catLabel(c) { return CAT_LABELS[c] || c; }

/* ── BOOT ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
});
