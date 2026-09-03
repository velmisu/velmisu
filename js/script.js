/* =============================================
   Velmisu — Product Cards, Cart & Orders
   Edit products below (name, description, images, prices)
   ============================================= */

const WHATSAPP_NUMBER = '212650527938';
const CART_STORAGE_KEY = 'velmisu_cart';

// ── FORMAT LABELS ─────────────────────────────
const sizes = [
  { id: 'small', name: 'Petit' },
  { id: 'medium', name: 'Moyen' },
  { id: 'large', name: 'Grand' },
  { id: 'xlarge', name: 'Extra Large' },
];

// ── PRODUCTS ──────────────────────────────────
// Edit name, description, images, and prices here
const products = [
  {
    id: 'cocoa',
    name: 'Cacao Classique',
    description: 'La recette originale italienne — mascarpone crémeux, espresso intense et cacao amer.',
    tag: 'Best-seller',
    available: true,
    images: ['IMG_6004.JPG', 'IMG_6003.jpg', 'img_7097.jpg'],
    sizes: {
      small:  { price: 30,  available: true },
      medium: { price: 45,  available: true },
      large:  { price: 65,  available: true },
      xlarge: { price: 95,  available: true },
    },
  },
  {
    id: 'lotus',
    name: 'Lotus',
    description: 'Biscuits Lotus caramélisés, crème vanillée et touche de spéculoos maison.',
    tag: 'Gourmand',
    available: true,
    images: ['IMG_6004.JPG', 'images/lotus-medium.jpg', 'design-logo.png'],
    sizes: {
      small:  { price: 35,  available: true },
      medium: { price: 48,  available: true },
      large:  { price: 68,  available: true },
      xlarge: { price: 98,  available: true },
    },
  },
  {
    id: 'lemon',
    name: 'Citron',
    description: 'Crème mascarpone légèrement acidulée, zeste de citron frais et biscuit imbibé au limoncello.',
    tag: 'Fraîcheur',
    available: true,
    images: ['IMG_6003.jpg', 'images/lemon-medium.jpg', 'design-logo.png'],
    sizes: {
      small:  { price: 35,  available: true },
      medium: { price: 48,  available: true },
      large:  { price: 68,  available: true },
      xlarge: { price: 98,  available: true },
    },
  },
  {
    id: 'lemon-cocoa',
    name: 'Citron & Cacao',
    description: 'L\'équilibre parfait entre la fraîcheur du citron et l\'intensité du cacao — une création unique Velmisu.',
    tag: 'Signature',
    available: true,
    images: ['IMG_6003.jpg', 'IMG_6004.JPG', 'design-logo.png'],
    sizes: {
      small:  { price: 35,  available: true },
      medium: { price: 48,  available: true },
      large:  { price: 68,  available: true },
      xlarge: { price: 98,  available: true },
    },
  },
  {
    id: 'chocolate',
    name: 'Chocolat',
    description: 'Chocolat noir 70%, ganache onctueuse et double dose de cacao pour les amateurs.',
    tag: 'Intense',
    available: true,
    images: ['IMG_7097.JPG', 'images/chocolate-medium.jpg', 'design-logo.png'],
    sizes: {
      small:  { price: 35,  available: true },
      medium: { price: 200, available: true },
      large:  { price: 400, available: true },
      xlarge: { price: 500, available: true },
    },
  },
];

// ── Catalog Helpers ─────────────────────────────
function makeVariantId(productId, sizeId) {
  return `${productId}-${sizeId}`;
}

function parseVariantId(variantId) {
  for (const size of sizes) {
    const suffix = `-${size.id}`;
    if (variantId.endsWith(suffix)) {
      return { productId: variantId.slice(0, -suffix.length), sizeId: size.id };
    }
  }
  const parts = variantId.split('-');
  return { productId: parts[0], sizeId: parts.slice(1).join('-') };
}

function getProduct(productId) {
  return products.find((p) => p.id === productId);
}

function getSize(sizeId) {
  return sizes.find((s) => s.id === sizeId);
}

function getSizeData(productId, sizeId) {
  return getProduct(productId)?.sizes?.[sizeId] ?? null;
}

function getProductImage(productId) {
  const product = getProduct(productId);
  return product?.images?.[0] || 'design-logo.png';
}

function isVariantAvailable(productId, sizeId) {
  const product = getProduct(productId);
  const size = getSize(sizeId);
  const data = getSizeData(productId, sizeId);
  return Boolean(product?.available && size && data?.available);
}

function buildVariant(variantId) {
  const { productId, sizeId } = parseVariantId(variantId);
  const product = getProduct(productId);
  const size = getSize(sizeId);
  const data = getSizeData(productId, sizeId);
  if (!product || !size || !data) return null;

  return {
    id: variantId,
    flavorId: productId,
    sizeId,
    name: `${product.name} — ${size.name}`,
    flavorName: product.name,
    sizeName: size.name,
    description: product.description,
    tag: product.tag,
    price: data.price,
    image: getProductImage(productId),
    available: isVariantAvailable(productId, sizeId),
  };
}

function getVariantById(variantId) {
  return buildVariant(variantId);
}

function getDefaultSizeId(productId) {
  const product = getProduct(productId);
  if (!product) return 'medium';
  const preferred = sizes.find((s) => isVariantAvailable(productId, s.id));
  return preferred?.id || 'medium';
}

// ── DOM Elements ──────────────────────────────
const orderModal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');
const modalClose = document.getElementById('modalClose');
const modalProductPrice = document.getElementById('modalProductPrice');
const modalCartSummary = document.getElementById('modalCartSummary');
const orderProductId = document.getElementById('orderProductId');
const orderMode = document.getElementById('orderMode');
const orderQty = document.getElementById('orderQty');
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');
const qtyFormGroup = orderQty.closest('.form-group');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const ctaBtn = document.getElementById('ctaBtn');
const header = document.getElementById('header');
const cartBtn = document.getElementById('cartBtn');
const cartBadge = document.getElementById('cartBadge');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');
const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
const cartBrowseBtn = document.getElementById('cartBrowseBtn');
const productsGrid = document.getElementById('productsGrid');
const customOrderBtn = document.getElementById('customOrderBtn');
const customOrderModal = document.getElementById('customOrderModal');
const customOrderModalClose = document.getElementById('customOrderModalClose');
const customOrderForm = document.getElementById('customOrderForm');
const customOrderOccasion = document.getElementById('customOrderOccasion');
const customOrderBirthdayError = document.getElementById('customOrderBirthdayError');
const customOrderImage = document.getElementById('customOrderImage');

let selectedProduct = null;
let cart = loadCart();

// ── Cart Storage ──────────────────────────────
function loadCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return parsed.filter((item) => getVariantById(item.id));
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => {
    const variant = getVariantById(item.id);
    return variant ? sum + variant.price * item.quantity : sum;
  }, 0);
}

function addToCart(variantId) {
  const variant = getVariantById(variantId);
  if (!variant || !variant.available) return;

  const existing = cart.find((item) => item.id === variantId);
  if (existing) {
    existing.quantity = Math.min(20, existing.quantity + 1);
  } else {
    cart.push({ id: variantId, quantity: 1 });
  }
  saveCart();
  updateCartUI();
  bumpCartBadge();
}

function updateCartQuantity(variantId, delta) {
  const item = cart.find((i) => i.id === variantId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter((i) => i.id !== variantId);
  } else {
    item.quantity = Math.min(20, item.quantity);
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(variantId) {
  cart = cart.filter((item) => item.id !== variantId);
  saveCart();
  updateCartUI();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

// ── Product Cards ─────────────────────────────
function renderProductCard(product) {
  const defaultSizeId = getDefaultSizeId(product.id);
  const defaultPrice = product.sizes[defaultSizeId]?.price ?? '—';

  const gallerySlides = product.images.map((src, i) => `
    <div class="product-gallery-slide">
      <img src="${src}" alt="${product.name} — photo ${i + 1}" loading="lazy"
        onerror="this.src='design-logo.png'">
    </div>
  `).join('');

  const galleryDots = product.images.map((_, i) => `
    <button type="button" class="gallery-dot${i === 0 ? ' active' : ''}" data-slide="${i}"
      aria-label="Photo ${i + 1}"></button>
  `).join('');

  const formatButtons = sizes.map((size) => {
    const available = isVariantAvailable(product.id, size.id);
    const active = size.id === defaultSizeId;
    return `
      <button type="button" class="format-btn${active ? ' active' : ''}"
        data-size="${size.id}" ${available ? '' : 'disabled'}>${size.name}</button>
    `;
  }).join('');

  const tagHtml = product.tag
    ? `<span class="product-tag">${product.tag}</span>`
    : '';

  return `
    <article class="product-card" data-product-id="${product.id}" data-size="${defaultSizeId}" data-slide="0">
      <div class="product-gallery">
        <div class="product-gallery-viewport">
          <div class="product-gallery-track">
            ${gallerySlides}
          </div>
        </div>
        <button type="button" class="gallery-nav gallery-prev" aria-label="Photo précédente">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button type="button" class="gallery-nav gallery-next" aria-label="Photo suivante">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <div class="gallery-dots">${galleryDots}</div>
      </div>
      <div class="product-card-body">
        ${tagHtml}
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <p class="product-format-label">Choisir le format</p>
        <div class="format-selector" role="radiogroup" aria-label="Format pour ${product.name}">
          ${formatButtons}
        </div>
        <p class="product-price" data-price>${defaultPrice} <span>DH</span></p>
        <div class="product-card-actions">
          <button type="button" class="btn btn-primary btn-full product-add-cart">Ajouter au panier</button>
        </div>
      </div>
    </article>
  `;
}

function updateCardPrice(card) {
  const productId = card.dataset.productId;
  const sizeId = card.dataset.size;
  const priceEl = card.querySelector('[data-price]');
  const addBtn = card.querySelector('.product-add-cart');
  const data = getSizeData(productId, sizeId);
  const available = isVariantAvailable(productId, sizeId);

  if (priceEl) {
    priceEl.innerHTML = data ? `${data.price} <span>DH</span>` : '— <span>DH</span>';
  }
  if (addBtn) addBtn.disabled = !available;
}

function setGallerySlide(card, index) {
  const product = getProduct(card.dataset.productId);
  if (!product) return;

  const total = product.images.length;
  const slide = ((index % total) + total) % total;
  card.dataset.slide = slide;

  const track = card.querySelector('.product-gallery-track');
  if (track) track.style.transform = `translateX(-${slide * 100}%)`;

  card.querySelectorAll('.gallery-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === slide);
  });
}

function initProductGallery(card) {
  const gallery = card.querySelector('.product-gallery');
  if (!gallery) return;

  let touchStartX = 0;
  let touchDeltaX = 0;

  gallery.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchDeltaX = 0;
  }, { passive: true });

  gallery.addEventListener('touchmove', (e) => {
    touchDeltaX = e.changedTouches[0].screenX - touchStartX;
  }, { passive: true });

  gallery.addEventListener('touchend', () => {
    if (Math.abs(touchDeltaX) < 40) return;
    const current = Number(card.dataset.slide) || 0;
    setGallerySlide(card, touchDeltaX < 0 ? current + 1 : current - 1);
  }, { passive: true });
}

function initProductCards() {
  if (!productsGrid) return;

  productsGrid.innerHTML = products.map(renderProductCard).join('');
  productsGrid.querySelectorAll('.product-card').forEach((card) => {
    initProductGallery(card);
    updateCardPrice(card);
  });

  productsGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;

    const sizeBtn = e.target.closest('.format-btn');
    if (sizeBtn && !sizeBtn.disabled) {
      card.dataset.size = sizeBtn.dataset.size;
      card.querySelectorAll('.format-btn').forEach((btn) => {
        btn.classList.toggle('active', btn === sizeBtn);
      });
      updateCardPrice(card);
      return;
    }

    if (e.target.closest('.gallery-prev')) {
      setGallerySlide(card, Number(card.dataset.slide) - 1);
      return;
    }

    if (e.target.closest('.gallery-next')) {
      setGallerySlide(card, Number(card.dataset.slide) + 1);
      return;
    }

    const dot = e.target.closest('.gallery-dot');
    if (dot) {
      setGallerySlide(card, Number(dot.dataset.slide));
      return;
    }

    if (e.target.closest('.product-add-cart')) {
      const variantId = makeVariantId(card.dataset.productId, card.dataset.size);
      addToCart(variantId);
    }
  });
}

// ── Custom Order ──────────────────────────────
const BIRTHDAY_PATTERN = /\b(birthday|birthdays|birth\s*day|bday|anniversaire|anniversaires)\b/i;

function isBirthdayOccasion(value) {
  return BIRTHDAY_PATTERN.test(value.trim());
}

function openCustomOrderModal() {
  customOrderForm.reset();
  customOrderBirthdayError.hidden = true;
  customOrderModal.classList.add('active');
  customOrderModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCustomOrderModal() {
  customOrderModal.classList.remove('active');
  customOrderModal.setAttribute('aria-hidden', 'true');
  if (!orderModal.classList.contains('active') && !cartOverlay.classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

function formatCustomOrderDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function buildCustomOrderMessage(data) {
  const lines = [
    'Commande sur mesure Velmisu',
    '━━━━━━━━━━━━━━━━',
    '',
    `Nom: ${data.name}`,
    `Occasion: ${data.occasion}`,
    `Date de l'événement: ${data.eventDate}`,
    '',
    'Demande personnalisée:',
    data.details,
    '',
    `Contact (${data.contactMethod}): ${data.contact}`,
  ];

  if (data.imageName) {
    lines.push('', `Image d'inspiration: ${data.imageName} (à joindre dans WhatsApp)`);
  }

  lines.push('', '━━━━━━━━━━━━━━━━');
  return lines.join('\n');
}

function initCustomOrder() {
  customOrderBtn.addEventListener('click', openCustomOrderModal);
  customOrderModalClose.addEventListener('click', closeCustomOrderModal);

  customOrderModal.addEventListener('click', (e) => {
    if (e.target === customOrderModal) closeCustomOrderModal();
  });

  customOrderOccasion.addEventListener('input', () => {
    if (!isBirthdayOccasion(customOrderOccasion.value)) {
      customOrderBirthdayError.hidden = true;
    }
  });

  customOrderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('customOrderName').value.trim();
    const occasion = customOrderOccasion.value.trim();
    const eventDate = formatCustomOrderDate(document.getElementById('customOrderDate').value);
    const details = document.getElementById('customOrderDetails').value.trim();
    const contactMethod = document.getElementById('customOrderContactMethod').value;
    const contact = document.getElementById('customOrderContact').value.trim();
    const imageName = customOrderImage.files[0]?.name || '';

    if (isBirthdayOccasion(occasion)) {
      customOrderBirthdayError.hidden = false;
      customOrderOccasion.focus();
      return;
    }

    const message = buildCustomOrderMessage({
      name,
      occasion,
      eventDate,
      details,
      contactMethod,
      contact,
      imageName,
    });

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    closeCustomOrderModal();
  });
}

// ── Cart UI ───────────────────────────────────
function bumpCartBadge() {
  cartBadge.classList.add('bump');
  setTimeout(() => cartBadge.classList.remove('bump'), 200);
}

function updateCartBadge() {
  const count = getCartItemCount();
  cartBadge.textContent = count;
  cartBadge.dataset.count = count;
}

function renderCartItems() {
  if (cart.length === 0) {
    cartEmpty.style.display = 'flex';
    cartItems.innerHTML = '';
    cartFooter.classList.remove('visible');
    return;
  }

  cartEmpty.style.display = 'none';
  cartFooter.classList.add('visible');

  cartItems.innerHTML = cart.map((item) => {
    const variant = getVariantById(item.id);
    if (!variant) return '';

    const lineTotal = variant.price * item.quantity;
    return `
      <li class="cart-item" data-cart-id="${variant.id}">
        <img
          src="${variant.image}"
          alt="${variant.name}"
          class="cart-item-image"
          loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
        <div class="cart-item-image-fallback" style="display:none;">V</div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">${variant.name}</h3>
          <p class="cart-item-price">${variant.price} DH × ${item.quantity} = ${lineTotal} DH</p>
          <div class="cart-item-controls">
            <div class="cart-qty-control">
              <button type="button" class="cart-qty-btn" data-action="decrease" data-id="${variant.id}" aria-label="Diminuer">−</button>
              <span class="cart-qty-value">${item.quantity}</span>
              <button type="button" class="cart-qty-btn" data-action="increase" data-id="${variant.id}" aria-label="Augmenter">+</button>
            </div>
            <button type="button" class="cart-item-remove" data-action="remove" data-id="${variant.id}">Supprimer</button>
          </div>
        </div>
      </li>
    `;
  }).join('');

  cartTotal.textContent = `${getCartSubtotal()} DH`;
}

function updateCartUI() {
  updateCartBadge();
  renderCartItems();
}

function openCart() {
  cartOverlay.classList.add('active');
  cartOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay.classList.remove('active');
  cartOverlay.setAttribute('aria-hidden', 'true');
  if (!orderModal.classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', (e) => {
  if (e.target === cartOverlay) closeCart();
});

cartBrowseBtn.addEventListener('click', () => {
  closeCart();
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
});

cartItems.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const variantId = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === 'increase') updateCartQuantity(variantId, 1);
  else if (action === 'decrease') updateCartQuantity(variantId, -1);
  else if (action === 'remove') removeFromCart(variantId);
});

cartCheckoutBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  closeCart();
  openCartOrderModal();
});

// ── Order Modal ───────────────────────────────
function setModalMode(mode) {
  orderMode.value = mode;
  const isCart = mode === 'cart';
  const modalTitle = document.getElementById('modalTitle');

  if (isCart) {
    modalTitle.textContent = 'Valider votre commande';
    modalProductPrice.style.display = 'none';
  } else {
    modalTitle.innerHTML = 'Tlab <span id="modalProductName"></span>';
    modalProductPrice.style.display = '';
  }

  modalCartSummary.hidden = !isCart;
  qtyFormGroup.classList.toggle('hidden', isCart);
}

function openOrderModal(variantId) {
  selectedProduct = getVariantById(variantId);
  if (!selectedProduct || !selectedProduct.available) return;

  setModalMode('single');
  const nameEl = document.getElementById('modalProductName');
  orderProductId.value = selectedProduct.id;
  if (nameEl) nameEl.textContent = selectedProduct.name;
  modalProductPrice.textContent = `${selectedProduct.price} DH / unité`;
  orderQty.value = 1;
  orderForm.reset();
  orderProductId.value = selectedProduct.id;
  orderQty.value = 1;

  orderModal.classList.add('active');
  orderModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function openCartOrderModal() {
  selectedProduct = null;
  setModalMode('cart');

  modalCartSummary.innerHTML = `
    ${cart.map((item) => {
      const variant = getVariantById(item.id);
      if (!variant) return '';
      return `<div class="cart-line"><span>${variant.name} × ${item.quantity}</span><span>${variant.price * item.quantity} DH</span></div>`;
    }).join('')}
    <div class="cart-line cart-line-total"><span>Total</span><span>${getCartSubtotal()} DH</span></div>
  `;

  orderForm.reset();
  orderModal.classList.add('active');
  orderModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  orderModal.classList.remove('active');
  orderModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  selectedProduct = null;
}

modalClose.addEventListener('click', closeOrderModal);

orderModal.addEventListener('click', (e) => {
  if (e.target === orderModal) closeOrderModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (orderModal.classList.contains('active')) closeOrderModal();
    else if (customOrderModal.classList.contains('active')) closeCustomOrderModal();
    else if (cartOverlay.classList.contains('active')) closeCart();
  }
});

qtyMinus.addEventListener('click', () => {
  orderQty.value = Math.max(1, Number(orderQty.value) - 1);
});

qtyPlus.addEventListener('click', () => {
  orderQty.value = Math.min(20, Number(orderQty.value) + 1);
});

// ── WhatsApp Order ────────────────────────────
function buildWhatsAppMessage(variant, quantity, name, address, phone) {
  const total = variant.price * quantity;

  return [
    'Commande Velmisu',
    '━━━━━━━━━━━━━━━━',
    '',
    `Produit: ${variant.name}`,
    `Saveur: ${variant.flavorName}`,
    `Format: ${variant.sizeName}`,
    `Quantité: ${quantity}`,
    `Prix unitaire: ${variant.price} DH`,
    `Total: ${total} DH`,
    '',
    '━━━━━━━━━━━━━━━━',
    'Informations client',
    '',
    `nom: ${name}`,
    `adresse: ${address}`,
    `num telephone: ${phone}`,
    '',
    '━━━━━━━━━━━━━━━━',
    'Merci pour votre commande!',
  ].join('\n');
}

function buildCartWhatsAppMessage(name, address, phone) {
  const lines = cart.map((item) => {
    const variant = getVariantById(item.id);
    if (!variant) return null;
    return `${variant.name} × ${item.quantity} — ${variant.price * item.quantity} DH`;
  }).filter(Boolean);

  return [
    'Commande Velmisu (Panier)',
    '━━━━━━━━━━━━━━━━',
    '',
    ...lines,
    '',
    `Total: ${getCartSubtotal()} DH`,
    '',
    '━━━━━━━━━━━━━━━━',
    'Informations client',
    '',
    `nom: ${name}`,
    `adresse: ${address}`,
    `num telephone: ${phone}`,
    '',
    '━━━━━━━━━━━━━━━━',
    'Merci pour votre commande!',
  ].join('\n');
}

orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('orderName').value.trim();
  const address = document.getElementById('orderAddress').value.trim();
  const phone = document.getElementById('orderPhone').value.trim();

  let message;

  if (orderMode.value === 'cart') {
    if (cart.length === 0) return;
    message = buildCartWhatsAppMessage(name, address, phone);
  } else {
    const variant = getVariantById(orderProductId.value);
    if (!variant) return;
    message = buildWhatsAppMessage(variant, Number(orderQty.value), name, address, phone);
  }

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

  if (orderMode.value === 'cart') clearCart();
  closeOrderModal();
});

// ── Navigation ────────────────────────────────
menuBtn.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuBtn.classList.toggle('active', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

ctaBtn.addEventListener('click', () => {
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Init ──────────────────────────────────────
initCustomOrder();
initProductCards();
updateCartUI();
