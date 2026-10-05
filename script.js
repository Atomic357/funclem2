/**
 * WHATSAPP STORE — SCRIPT
 * Pure Vanilla JavaScript implementation
 */

// ==========================================================================
// 1. PRODUCTS DATA WITH REALISTIC PHOTOGRAPHY
// ==========================================================================
const PRODUCTS = [
  {
    id: 'thermal-flask-750',
    name: 'Insulated Day Flask (750ml)',
    category: 'Drinkware & Coffee',
    price: 28500,
    tagline: 'Keeps water ice-cold for 24 hours in traffic or hot tea warm all morning.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85',
    featured: true,
    benefits: [
      { title: 'Zero condensation in your bag', detail: 'Double-wall vacuum insulation stops exterior moisture from sweating on laptops or paperwork.' },
      { title: 'Fits standard car cupholders', detail: 'Tapered base slides cleanly into vehicle cupholders and backpack side pouches.' },
      { title: 'Pure taste with every sip', detail: 'Electropolished 18/8 food-grade stainless steel never holds coffee scents after rinsing.' }
    ]
  },
  {
    id: 'cordless-brass-lamp',
    name: 'Cordless Brass & Oak Desk Lamp',
    category: 'Workspace',
    price: 46000,
    tagline: 'Warm, glare-free reading light that keeps working for 18 hours when power goes out.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85',
    featured: true,
    benefits: [
      { title: 'Works through power cuts', detail: 'High-density internal battery runs up to 18 hours on low and 8 hours on full reading brightness.' },
      { title: 'Easy on tired eyes', detail: 'Diffused warm-to-neutral LED ring eliminates screen glare and harsh blue flicker at night.' },
      { title: 'Recharges with your phone cable', detail: 'Uses a standard USB-C port at the base—no proprietary adapter to lose.' }
    ]
  },
  {
    id: 'slim-power-bank-10k',
    name: 'Slim Anodized Power Bank (10,000mAh)',
    category: 'Power & Tech',
    price: 34000,
    tagline: 'Two full phone charges in an aluminum body thinner than a notebook.',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1000&q=85',
    featured: true,
    benefits: [
      { title: 'Fast 30-minute recovery charge', detail: 'Brings a dead smartphone back to 55% in under 30 minutes using 30W USB-C Power Delivery.' },
      { title: 'Runs cool and safe in warm weather', detail: 'Machined aluminum shell dissipates heat naturally instead of trapping it inside thick plastic.' },
      { title: 'Clear percentage readout', detail: 'Know exactly how much backup power remains before stepping out the door.' }
    ]
  },
  {
    id: 'borosilicate-pour-over',
    name: 'Borosilicate Pour-Over Coffee Carafe',
    category: 'Drinkware & Coffee',
    price: 32000,
    tagline: 'Brew rich, clean coffee in 3 minutes without paper filters or electricity.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
    featured: true,
    benefits: [
      { title: 'Never buy paper filters again', detail: 'Fine dual-layer stainless steel mesh lets natural coffee oils through while catching all grounds.' },
      { title: 'Safe with boiling kettle water', detail: 'Lab-grade borosilicate glass handles sudden temperature changes without cracking.' },
      { title: 'Rinses clean in 20 seconds', detail: 'Wide mouth and removable collar make emptying grounds and rinsing under the tap effortless.' }
    ]
  },
  {
    id: 'everyday-desk-bundle',
    name: 'The Calm Desk Starter Set',
    category: 'Home & Living',
    price: 78000,
    tagline: 'Our ceramic pour-over set, insulated flask, and solid oak tray paired at a bundle savings.',
    image: 'https://images.unsplash.com/photo-1600086827875-a63b01f1335c?auto=format&fit=crop&w=1000&q=85',
    featured: true,
    benefits: [
      { title: 'Saves ₦11,500 compared to buying separately', detail: 'Bundled pricing gives you our three most-requested daily essentials at a direct discount.' },
      { title: 'Keeps workspace surfaces tidy', detail: 'The milled oak catch-all tray corrals keys, pens, earbuds, and charging cables in one spot.' },
      { title: 'Gift-ready protective presentation', detail: 'Arrives in a heavy recycled presentation box ready to unbox or gift immediately.' }
    ]
  },
  {
    id: 'travel-power-kit',
    name: 'All-Day Commuter Power & Hydration Kit',
    category: 'Power & Tech',
    price: 58000,
    tagline: 'Pair the 10,000mAh aluminum power bank with our 750ml insulated flask for long days out.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
    featured: false,
    benefits: [
      { title: 'Solves the two biggest daily headaches', detail: 'Cold water and reliable phone battery in one lightweight carry setup.' },
      { title: 'Built to survive daily knocks', detail: 'Scratch-resistant anodized aluminum and powder-coated stainless steel look sharp for years.' },
      { title: '1-year direct replacement warranty', detail: 'If anything fails under normal use, message us on WhatsApp for a hassle-free swap.' }
    ]
  }
];

const CATEGORIES = [
  'All Products',
  'Drinkware & Coffee',
  'Power & Tech',
  'Workspace',
  'Home & Living'
];

const WHATSAPP_NUMBER = '2348091234567';

// Format Naira currency
function formatNaira(amount) {
  return '₦' + Number(amount).toLocaleString('en-NG');
}

// ==========================================================================
// 2. STATE MANAGEMENT
// ==========================================================================
let currentCategory = 'All Products';
let currentSearch = '';
let currentSort = 'default';
let modalProduct = null;
let modalQty = 1;

let cart = [];
try {
  const savedCart = localStorage.getItem('whatsapp_store_cart');
  if (savedCart) cart = JSON.parse(savedCart);
} catch (e) {
  cart = [];
}

function saveCart() {
  try {
    localStorage.setItem('whatsapp_store_cart', JSON.stringify(cart));
  } catch (e) {}
  updateCartUI();
}

// ==========================================================================
// 3. COLOR PALETTE THEME SWITCHER
// ==========================================================================
const THEMES = {
  emerald: { name: 'Emerald', color: '#10B981' },
  nordic: { name: 'Nordic', color: '#2563EB' },
  terracotta: { name: 'Terracotta', color: '#C25934' },
  midnight: { name: 'Midnight', color: '#2DD4BF' }
};

let currentTheme = localStorage.getItem('whatsapp_store_theme') || 'emerald';

function applyTheme(themeName) {
  if (!THEMES[themeName]) themeName = 'emerald';
  currentTheme = themeName;
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('whatsapp_store_theme', themeName);

  const dot = document.getElementById('themeDot');
  const label = document.getElementById('themeLabel');
  if (dot) dot.style.backgroundColor = THEMES[themeName].color;
  if (label) label.textContent = THEMES[themeName].name;
}

// ==========================================================================
// 4. TOAST NOTIFICATIONS
// ==========================================================================
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

// ==========================================================================
// 5. RENDER CATEGORIES
// ==========================================================================
function renderCategories() {
  const categoryList = document.getElementById('categoryList');
  if (!categoryList) return;

  categoryList.innerHTML = CATEGORIES.map(cat => {
    const isAll = cat === 'All Products';
    const count = isAll
      ? PRODUCTS.length
      : PRODUCTS.filter(p => p.category === cat).length;
    const isActive = cat === currentCategory;

    return `
      <button class="category-btn ${isActive ? 'active' : ''}" data-category="${cat}">
        <span>${cat}</span>
        <span class="cat-count">${count}</span>
      </button>
    `;
  }).join('');

  categoryList.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.getAttribute('data-category');
      renderCategories();
      renderProducts();
    });
  });
}

// ==========================================================================
// 6. RENDER PRODUCTS
// ==========================================================================
function getFilteredProducts() {
  let list = PRODUCTS.filter(p => {
    const matchesCategory = currentCategory === 'All Products' || p.category === currentCategory;
    if (!matchesCategory) return false;

    if (!currentSearch) return true;
    const q = currentSearch.toLowerCase();
    const inName = p.name.toLowerCase().includes(q);
    const inTagline = p.tagline.toLowerCase().includes(q);
    const inCategory = p.category.toLowerCase().includes(q);
    const inBenefits = p.benefits.some(b => b.title.toLowerCase().includes(q) || b.detail.toLowerCase().includes(q));
    return inName || inTagline || inCategory || inBenefits;
  });

  if (currentSort === 'low') {
    list.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'high') {
    list.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
}

function renderProducts() {
  const productsGrid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  const activeFilter = document.getElementById('activeFilter');
  if (!productsGrid) return;

  const items = getFilteredProducts();

  // Active filter indicator
  if (currentCategory !== 'All Products' || currentSearch !== '') {
    activeFilter.classList.add('active');
    let summary = `Showing <strong>${items.length}</strong> items`;
    if (currentCategory !== 'All Products') summary += ` in <strong>${currentCategory}</strong>`;
    if (currentSearch) summary += ` matching "<strong>${currentSearch}</strong>"`;
    activeFilter.innerHTML = `
      <span>${summary}</span>
      <button id="resetFilters">Reset filters</button>
    `;
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'All Products';
        currentSearch = '';
        const searchInput = document.getElementById('searchInput');
        const desktopSearch = document.getElementById('desktopSearch');
        if (searchInput) searchInput.value = '';
        if (desktopSearch) desktopSearch.value = '';
        renderCategories();
        renderProducts();
      });
    }
  } else {
    activeFilter.classList.remove('active');
  }

  if (items.length === 0) {
    productsGrid.innerHTML = '';
    noResults.classList.add('active');
    return;
  }

  noResults.classList.remove('active');

  productsGrid.innerHTML = items.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div>
        <div class="product-card-image">
          <img src="${p.image}" alt="${p.name}" loading="lazy" referrerpolicy="no-referrer">
        </div>
        <div class="product-card-content">
          <div class="product-card-meta">
            <span>${p.category}</span>
            <span>·</span>
            <span class="stock-tag">In Stock</span>
          </div>
          <h3 class="product-card-title">${p.name}</h3>
          <p class="product-card-tagline">${p.tagline}</p>
        </div>
      </div>
      <div class="product-card-footer">
        <span class="product-card-price">${formatNaira(p.price)}</span>
        <div class="product-card-actions">
          <button class="button button-outline" style="padding:6px 12px; font-size:12px;" data-view="${p.id}">Specs</button>
          <button class="btn-card-add" data-add="${p.id}">+ Add</button>
        </div>
      </div>
    </article>
  `).join('');

  // Attach card event listeners
  productsGrid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-add]');
      if (addBtn) {
        e.stopPropagation();
        const id = addBtn.getAttribute('data-add');
        addToCart(id, 1);
        return;
      }
      const id = card.getAttribute('data-id');
      openProductModal(id);
    });
  });
}

// ==========================================================================
// 7. PRODUCT MODAL
// ==========================================================================
function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  modalProduct = product;
  modalQty = 1;

  document.getElementById('modalImage').src = product.image;
  document.getElementById('modalCategory').textContent = product.category;
  document.getElementById('modalName').textContent = product.name;
  document.getElementById('modalTagline').textContent = product.tagline;
  document.getElementById('modalPrice').textContent = formatNaira(product.price);
  document.getElementById('modalQuantity').textContent = modalQty;

  const benefitsEl = document.getElementById('modalBenefits');
  benefitsEl.innerHTML = product.benefits.map(b => `
    <div class="benefit-item">
      <span class="check-icon">✓</span>
      <div>
        <strong>${b.title}</strong>
        <p style="color:var(--color-text-muted); font-size:11px; margin-top:2px;">${b.detail}</p>
      </div>
    </div>
  `).join('');

  document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  modalProduct = null;
}

// ==========================================================================
// 8. CART DRAWER & WHATSAPP CHECKOUT
// ==========================================================================
function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }

  saveCart();
  showToast(`Added ${product.name} to cart`);
}

function updateCartUI() {
  const cartCountEl = document.getElementById('cartCount');
  const cartItemsEl = document.getElementById('cartItems');
  const emptyCartEl = document.getElementById('emptyCart');
  const cartFooterEl = document.getElementById('cartFooter');
  const cartTotalEl = document.getElementById('cartTotal');

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountEl) cartCountEl.textContent = totalCount;

  if (cart.length === 0) {
    if (emptyCartEl) emptyCartEl.classList.add('active');
    if (cartItemsEl) cartItemsEl.innerHTML = '';
    if (cartFooterEl) cartFooterEl.style.display = 'none';
    return;
  }

  if (emptyCartEl) emptyCartEl.classList.remove('active');
  if (cartFooterEl) cartFooterEl.style.display = 'block';

  let totalNaira = 0;

  if (cartItemsEl) {
    cartItemsEl.innerHTML = cart.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return '';
      const lineTotal = product.price * item.quantity;
      totalNaira += lineTotal;

      return `
        <div class="cart-item">
          <img class="cart-item-img" src="${product.image}" alt="${product.name}" referrerpolicy="no-referrer">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${product.name}</h4>
            <div class="cart-item-row">
              <div class="cart-qty-controls">
                <button type="button" class="btn-qty-minus" data-id="${product.id}">−</button>
                <span>${item.quantity}</span>
                <button type="button" class="btn-qty-plus" data-id="${product.id}">+</button>
              </div>
              <span class="cart-item-price">${formatNaira(lineTotal)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach cart item quantity buttons
    cartItemsEl.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        if (item) {
          item.quantity -= 1;
          if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
          }
          saveCart();
        }
      });
    });

    cartItemsEl.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        if (item) {
          item.quantity += 1;
          saveCart();
        }
      });
    });
  }

  if (cartTotalEl) cartTotalEl.textContent = formatNaira(totalNaira);
}

function openCart() {
  document.getElementById('overlay').classList.add('active');
  document.getElementById('cartDrawer').classList.add('active');
}

function closeCart() {
  document.getElementById('overlay').classList.remove('active');
  document.getElementById('cartDrawer').classList.remove('active');
}

function checkoutWhatsApp() {
  if (cart.length === 0) return;

  let totalNaira = 0;
  const itemsText = cart.map((item, index) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return '';
    const lineTotal = product.price * item.quantity;
    totalNaira += lineTotal;
    return `${index + 1}. ${product.name} × ${item.quantity} — ${formatNaira(lineTotal)}`;
  }).filter(Boolean).join('\n');

  const message = [
    'Hello Store, I would like to place an order:',
    '',
    itemsText,
    '',
    `Estimated Total: ${formatNaira(totalNaira)}`,
    '',
    'Please confirm delivery details and payment options. Thank you!'
  ].join('\n');

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

// ==========================================================================
// 9. INITIALIZATION & EVENT LISTENERS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme
  applyTheme(currentTheme);

  // Theme dropdown toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeDropdown = document.getElementById('themeDropdown');
  if (themeToggle && themeDropdown) {
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('open');
    });

    themeDropdown.querySelectorAll('.theme-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const t = opt.getAttribute('data-theme');
        applyTheme(t);
        themeDropdown.classList.remove('open');
        showToast(`Theme changed to ${THEMES[t].name}`);
      });
    });

    document.addEventListener('click', () => {
      themeDropdown.classList.remove('open');
    });
  }

  // Render initial components
  renderCategories();
  renderProducts();
  updateCartUI();

  // Search toggles
  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  const closeSearch = document.getElementById('closeSearch');
  const searchInput = document.getElementById('searchInput');
  const desktopSearch = document.getElementById('desktopSearch');
  const sortProducts = document.getElementById('sortProducts');

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', () => {
      searchPanel.classList.toggle('active');
      if (searchPanel.classList.contains('active') && searchInput) {
        searchInput.focus();
      }
    });
  }

  if (closeSearch && searchPanel) {
    closeSearch.addEventListener('click', () => {
      searchPanel.classList.remove('active');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      if (desktopSearch) desktopSearch.value = currentSearch;
      renderProducts();
    });
  }

  if (desktopSearch) {
    desktopSearch.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      if (searchInput) searchInput.value = currentSearch;
      renderProducts();
    });
  }

  if (sortProducts) {
    sortProducts.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  // Mobile menu toggle
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNav = document.getElementById('mobileNav');
  if (mobileMenu && mobileNav) {
    mobileMenu.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
      });
    });
  }

  // Cart open/close triggers
  const cartButton = document.getElementById('cartButton');
  const closeCartBtn = document.getElementById('closeCart');
  const overlay = document.getElementById('overlay');
  const startShopping = document.getElementById('startShopping');
  const whatsappOrder = document.getElementById('whatsappOrder');

  if (cartButton) cartButton.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (overlay) {
    overlay.addEventListener('click', () => {
      closeCart();
      closeProductModal();
    });
  }
  if (startShopping) startShopping.addEventListener('click', closeCart);
  if (whatsappOrder) whatsappOrder.addEventListener('click', checkoutWhatsApp);

  // Hero card click opens modal for featured set
  const heroCard = document.getElementById('heroCard');
  if (heroCard) {
    heroCard.addEventListener('click', () => {
      openProductModal('everyday-desk-bundle');
    });
  }

  // Product Modal Controls
  const modalClose = document.getElementById('modalClose');
  const modalMinus = document.getElementById('modalMinus');
  const modalPlus = document.getElementById('modalPlus');
  const modalAdd = document.getElementById('modalAdd');
  const modalQuantity = document.getElementById('modalQuantity');

  if (modalClose) modalClose.addEventListener('click', closeProductModal);

  if (modalMinus) {
    modalMinus.addEventListener('click', () => {
      if (modalQty > 1) {
        modalQty -= 1;
        modalQuantity.textContent = modalQty;
      }
    });
  }

  if (modalPlus) {
    modalPlus.addEventListener('click', () => {
      modalQty += 1;
      modalQuantity.textContent = modalQty;
    });
  }

  if (modalAdd) {
    modalAdd.addEventListener('click', () => {
      if (modalProduct) {
        addToCart(modalProduct.id, modalQty);
        closeProductModal();
      }
    });
  }

  // Global ESC key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (searchPanel) searchPanel.classList.remove('active');
      closeCart();
      closeProductModal();
    }
  });
});
