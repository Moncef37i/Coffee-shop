// ===== HERO BUTTON PULSE =====
const btn = document.querySelector('.hero-btn');
if (btn) {
  setInterval(() => {
    btn.style.transform = 'scale(1.05)';
    setTimeout(() => btn.style.transform = 'scale(1)', 300);
  }, 2000);
}

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.statement-section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });
revealEls.forEach(el => observer.observe(el));

// ===== MENU FILTER TABS =====
const tabs = document.querySelectorAll('.tab');
const menuCards = document.querySelectorAll('.menu-card');

if (tabs.length > 0) {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      menuCards.forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter)
          ? 'block'
          : 'none';
      });
    });
  });
}

// ===== CART SYSTEM =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartIcon     = document.getElementById('cartIcon');
const cartSidebar  = document.getElementById('cartSidebar');
const cartClose    = document.getElementById('cartClose');
const cartOverlay  = document.getElementById('cartOverlay');
const cartItemsEl  = document.getElementById('cartItems');
const cartCountEl  = document.getElementById('cartCount');
const cartTotalEl  = document.getElementById('cartTotal');
const checkoutBtn  = document.getElementById('checkoutBtn');
const successPopup   = document.getElementById('successPopup');
const successSummary = document.getElementById('successSummary');
const successClose   = document.getElementById('successClose');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function openCart() {
  if (cartSidebar) cartSidebar.classList.add('open');
  if (cartOverlay) cartOverlay.classList.add('show');
}

function closeCart() {
  if (cartSidebar) cartSidebar.classList.remove('open');
  if (cartOverlay) cartOverlay.classList.remove('show');
}

function updateCart() {
  if (!cartCountEl || !cartTotalEl || !cartItemsEl) return;

  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCountEl.textContent = totalQty;

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cartTotalEl.textContent = '$' + total.toFixed(2);

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Votre panier est vide ☕</p>';
    saveCart();
    return;
  }

  cartItemsEl.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
      </div>
    </div>
  `).join('');

  saveCart();
}

window.changeQty = function(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCart();
};

function addToCart(name, price, img) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price: parseFloat(price), img, qty: 1 });
  }
  updateCart();
  openCart();
}

// Hover overlay buttons
document.querySelectorAll('.flavor-add-btn').forEach(b => {
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = b.closest('[data-name]');
    addToCart(card.dataset.name, card.dataset.price, card.dataset.img);
    b.textContent = '✓ Ajouté!';
    setTimeout(() => b.textContent = '🛒 Ajouter au Panier', 1200);
  });
});

// Bottom add-to-cart buttons
document.querySelectorAll('.add-to-cart-btn').forEach(b => {
  b.addEventListener('click', () => {
    addToCart(b.dataset.name, b.dataset.price, b.dataset.img);
    b.textContent = '✓ Ajouté!';
    b.style.background = '#2d7a2d';
    setTimeout(() => {
      b.textContent = '+ Ajouter';
      b.style.background = '';
    }, 1200);
  });
});

if (cartIcon)    cartIcon.addEventListener('click', openCart);
if (cartClose)   cartClose.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    successSummary.innerHTML = cart.map(i =>
      `<strong>${i.qty}x ${i.name}</strong> — $${(i.price * i.qty).toFixed(2)}<br>`
    ).join('') + `<br><strong>Total : $${total.toFixed(2)}</strong>`;
    closeCart();
    successPopup.classList.add('show');
    cart = [];
    updateCart();
  });
}

if (successClose) {
  successClose.addEventListener('click', () => {
    successPopup.classList.remove('show');
  });
}

// Init
updateCart();

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.style.display = 'none';
    formSuccess.classList.add('show');
  });
}

// ===== OPENING HOURS =====
const hoursOpen = document.querySelector('.hours-open');
if (hoursOpen) {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  let isOpen = false;
  if (day >= 1 && day <= 5) isOpen = hour >= 7 && hour < 20;
  else if (day === 6)        isOpen = hour >= 8 && hour < 21;
  else if (day === 0)        isOpen = hour >= 9 && hour < 18;
  if (!isOpen) {
    hoursOpen.textContent = '● Fermé maintenant';
    hoursOpen.style.color = '#c0392b';
  }
}