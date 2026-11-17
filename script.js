/* ══════════════════════════════════════════════
   LUXE — Complete JS: Search, Cart, Animations
══════════════════════════════════════════════ */

// ── PRODUCT CATALOG (matches HTML cards) ─────────────────────────────────
const PRODUCTS = [
  { id:1, name:'Obsidian Wool Blazer',      price:289.00, img:'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&auto=format&fit=crop&q=60', cat:"Men's Tailoring" },
  { id:2, name:'Ivory Silk Midi Dress',     price:199.00, img:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=200&auto=format&fit=crop&q=60', cat:"Women's Couture" },
  { id:3, name:'Camel Cashmere Trench',     price:399.00, img:'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&auto=format&fit=crop&q=60', cat:'Unisex Outerwear' },
  { id:4, name:'Midnight Linen Co-ord Set', price:175.00, img:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&auto=format&fit=crop&q=60', cat:"Women's Casual" },
  { id:5, name:'Shadow Leather Jacket',     price:349.00, img:'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&auto=format&fit=crop&q=60', cat:"Unisex" },
  { id:6, name:'Sorbet Floral Sundress',    price:145.00, img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&auto=format&fit=crop&q=60', cat:"Women's Summer" },
  { id:7, name:'Slate Grey 2-Piece Suit',   price:520.00, img:'https://images.unsplash.com/photo-1594938298603-c8148c4b4f9c?w=200&auto=format&fit=crop&q=60', cat:"Men's Formal" },
  { id:8, name:'Venetian Leather Tote',     price:229.00, img:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&auto=format&fit=crop&q=60', cat:'Accessories' },
  { id:9, name:"Men's Essentials Collection", price:189.00, img:'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&auto=format&fit=crop&q=60', cat:"Men's Line" },
  { id:10, name:"Women's Couture Collection", price:249.00, img:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&auto=format&fit=crop&q=60', cat:"Women's Line" },
  { id:11, name:'Luxury Accessories Set',   price:159.00, img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&auto=format&fit=crop&q=60', cat:'Accessories' },
  { id:12, name:'Limited Edition Drop',     price:450.00, img:'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&auto=format&fit=crop&q=60', cat:'Limited Edition' },
];

// ── CART STATE ────────────────────────────────────────────────────────────
let cart = [];

// ── TOAST ─────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ══════════════════════════════════════════════
//  SEARCH
// ══════════════════════════════════════════════
const searchBtn   = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

function openSearch() {
  searchModal.classList.add('open');
  setTimeout(() => searchInput.focus(), 100);
}
function closeSearch() {
  searchModal.classList.remove('open');
  searchInput.value = '';
  searchResults.innerHTML = '';
}

searchBtn.addEventListener('click', openSearch);
searchClose.addEventListener('click', closeSearch);
searchModal.addEventListener('click', (e) => {
  if (e.target === searchModal) closeSearch();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSearch();
});

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (q.length < 2) { searchResults.innerHTML = ''; return; }

  const hits = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
  );

  if (hits.length === 0) {
    searchResults.innerHTML = '<p class="search-no-results">No results found for "' + searchInput.value + '"</p>';
    return;
  }

  searchResults.innerHTML = hits.map(p => `
    <div class="search-result-item" onclick="searchAddToCart(${p.id})">
      <img src="${p.img}" alt="${p.name}" onerror="this.src='https://picsum.photos/50/50?random=${p.id}'"/>
      <div>
        <div class="res-name">${p.name}</div>
        <div class="res-price">$${p.price.toFixed(2)} · ${p.cat}</div>
      </div>
      <button class="btn btn-gold" style="padding:.4rem 1rem;font-size:.7rem;flex-shrink:0">Add to Cart</button>
    </div>
  `).join('');
});

function searchAddToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (product) {
    addProductToCart(product);
    closeSearch();
  }
}

// ══════════════════════════════════════════════
//  CART
// ══════════════════════════════════════════════
const cartBtn     = document.getElementById('cartBtn');
const cartDrawer  = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose   = document.getElementById('cartClose');
const cartBadge   = document.getElementById('cartBadge');
const cartItemsEl = document.getElementById('cartItems');
const cartFooter  = document.getElementById('cartFooter');
const cartTotal   = document.getElementById('cartTotal');
const cartItemCount = document.getElementById('cartItemCount');

function openCart()  { cartDrawer.classList.add('open'); cartOverlay.classList.add('open'); }
function closeCart() { cartDrawer.classList.remove('open'); cartOverlay.classList.remove('open'); }

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function addProductToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
  updateCartBadge();
  showToast('🛒 ' + product.name + ' added to cart!');
  openCart();
}

// Called from product card buttons via onclick
function addToCart(btn) {
  const card = btn.closest('.prod-card');
  const name  = card.dataset.name;
  const price = parseFloat(card.dataset.price);
  const img   = card.dataset.img;
  const id    = Array.from(document.querySelectorAll('.prod-card')).indexOf(card) + 1;
  addProductToCart({ id, name, price, img, cat: '' });
}

function toggleWish(btn) {
  btn.classList.toggle('active');
  if (btn.classList.contains('active')) {
    btn.textContent = '♥';
    showToast('❤️ Added to wishlist!');
  } else {
    btn.textContent = '♡';
    showToast('Removed from wishlist');
  }
}

function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  cartBadge.textContent = total;
  cartBadge.style.transform = 'scale(1.4)';
  setTimeout(() => { cartBadge.style.transform = 'scale(1)'; }, 200);
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p>Your cart is empty</p>
        <a href="#featured" class="btn btn-gold" onclick="closeCart()">Start Shopping</a>
      </div>`;
    cartFooter.style.display = 'none';
    cartItemCount.textContent = '(0 items)';
    return;
  }

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalAmt = cart.reduce((s, i) => s + i.price * i.qty, 0);

  cartItemsEl.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <img class="cart-item-img"
           src="${item.img}"
           alt="${item.name}"
           onerror="this.src='https://picsum.photos/80/80?random=${item.id}'"/>
      <div class="cart-item-info">
        <h5>${item.name}</h5>
        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
          <button class="cart-remove" onclick="removeItem(${idx})">✕ Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  cartItemCount.textContent = `(${totalQty} item${totalQty !== 1 ? 's' : ''})`;
  cartTotal.textContent = '$' + totalAmt.toFixed(2);
  cartFooter.style.display = 'block';
}

function changeQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCart();
  updateCartBadge();
}

function removeItem(idx) {
  const name = cart[idx].name;
  cart.splice(idx, 1);
  renderCart();
  updateCartBadge();
  showToast('🗑️ ' + name + ' removed');
}

// ══════════════════════════════════════════════
//  NAVBAR SCROLL
// ══════════════════════════════════════════════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
});

// ══════════════════════════════════════════════
//  SCROLL REVEAL
// ══════════════════════════════════════════════
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      setTimeout(() => el.classList.add('visible'), parseInt(el.dataset.delay || 0));
      revealObs.unobserve(el);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
  .forEach(el => revealObs.observe(el));

// ══════════════════════════════════════════════
//  STAT COUNTERS
// ══════════════════════════════════════════════
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.target);
    const isDecimal = target % 1 !== 0;
    const dur = 1800;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = eased * target;
      el.textContent = isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.count-num').forEach(el => countObs.observe(el));

// ══════════════════════════════════════════════
//  SMOOTH SCROLL
// ══════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ══════════════════════════════════════════════
//  CARD ZOOM ON HOVER (subtle tilt)
// ══════════════════════════════════════════════
document.querySelectorAll('.prod-card, .col-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-7px) rotateY(${x * 5}deg) rotateX(${-y * 3}deg)`;
    card.style.transition = 'transform .1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .5s ease, box-shadow .5s ease';
  });
});

// ══════════════════════════════════════════════
//  FORMS
// ══════════════════════════════════════════════
function handleSubscribe(e) {
  e.preventDefault();
  showToast('✨ Welcome to the LUXE Circle!');
  e.target.reset();
}
function handleContact(e) {
  e.preventDefault();
  showToast("📩 Message sent! We'll reply within 24 hours.");
  e.target.reset();
}

// ══════════════════════════════════════════════
//  PAGE LOAD — animate hero
// ══════════════════════════════════════════════
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal-up, .hero .reveal-left, .hero .reveal-right')
    .forEach((el, i) => setTimeout(() => el.classList.add('visible'), 200 + i * 160));
});
