/* =============================================
   Velmisu — Catalog, Configurator, Cart & Orders
   Edit flavors, sizes, and variants below
   ============================================= */

const WHATSAPP_NUMBER = '212650527938';
const CART_STORAGE_KEY = 'velmisu_cart';

// ── FLAVORS ───────────────────────────────────
// Edit names, descriptions, tags, and availability here
const flavors = [
  {
    id: 'cocoa',
    name: 'Cacao Classique',
    description: 'La recette originale italienne — mascarpone crémeux, espresso intense et cacao amer.',
    tag: 'Best-seller',
    available: true,
  },
  {
    id: 'lemon',
    name: 'Citron',
    description: 'Crème mascarpone légèrement acidulée, zeste de citron frais et biscuit imbibé au limoncello.',
    tag: 'Fraîcheur',
    available: true,
  },
  {
    id: 'lotus',
    name: 'Lotus',
    description: 'Biscuits Lotus caramélisés, crème vanillée et touche de spéculoos maison.',
    tag: 'Gourmand',
    available: true,
  },
  {
    id: 'chocolate',
    name: 'Chocolat',
    description: 'Chocolat noir 70%, ganache onctueuse et double dose de cacao pour les amateurs.',
    tag: 'Intense',
    available: true,
  },
];

// ── SIZES / FORMATS ───────────────────────────
// Each size has a different physical presentation
const sizes = [
  {
    id: 'small',
    name: 'Petit',
    subtitle: 'Portion individuelle',
    available: true,
  },
  {
    id: 'medium',
    name: 'Moyen',
    subtitle: 'Format classique',
    available: true,
  },
  {
    id: 'large',
    name: 'Grand',
    subtitle: 'Pour partager',
    available: true,
  },
  {
    id: 'xlarge',
    name: 'Extra Large',
    subtitle: 'Événement & fêtes',
    available: true,
  },
];

// ── VARIANTS (flavor × size) ──────────────────
// Each combination has its own price, image, and availability
// Image path pattern: images/{flavor}-{size}.jpg
const variants = {
  cocoa: {
    small:  { price: 30, image: 'images/cocoa-small.jpg',  available: true },
    medium: { price: 45, image: 'img_7097.jpg', available: true },
    large:  { price: 65, image: 'IMG_6003.jpg',  available: true },
    xlarge: { price: 95, image: 'images/cocoa-xlarge.jpg', available: true },
  },
  lemon: {
    small:  { price: 35, image: 'images/lemon-small.jpg',  available: true },
    medium: { price: 48, image: 'images/lemon-medium.jpg', available: true },
    large:  { price: 68, image: 'images/lemon-large.jpg',  available: true },
    xlarge: { price: 98, image: 'images/lemon-xlarge.jpg', available: true },
  },
  lotus: {
    small:  { price: 35, image: 'images/lotus-small.jpg',  available: true },
    medium: { price: 48, image: 'images/lotus-medium.jpg', available: true },
    large:  { price: 68, image: 'images/lotus-large.jpg',  available: true },
    xlarge: { price: 98, image: 'images/lotus-xlarge.jpg', available: true },
  },
  chocolate: {
    small:  { price: 35, image: 'images/chocolate-small.jpg',  available: true },
    medium: { price: 200, image: 'images/chocolate-medium.jpg', available: true },
    large:  { price: 400, image: 'images/chocolate-large.jpg',  available: true },
    xlarge: { price: 500, image: 'images/chocolate-xlarge.jpg', available: true },
  },
};

// Fallback images while unique photos are being added
const fallbackImages = {
  cocoa: 'IMG_6004.JPG',
  lemon: 'IMG_6003.jpg',
  lotus: 'IMG_6004.JPG',
  chocolate: 'IMG_7097.JPG',
};

// ── Catalog Helpers ─────────────────────────────
function makeVariantId(flavorId, sizeId) {
  return `${flavorId}-${sizeId}`;
}

function parseVariantId(variantId) {
  for (const size of sizes) {
    const suffix = `-${size.id}`;
    if (variantId.endsWith(suffix)) {
      return { flavorId: variantId.slice(0, -suffix.length), sizeId: size.id };
    }
  }
  const parts = variantId.split('-');
  return { flavorId: parts[0], sizeId: parts.slice(1).join('-') };
}

function getFlavor(flavorId) {
  return flavors.find((f) => f.id === flavorId);
}

function getSize(sizeId) {
  return sizes.find((s) => s.id === sizeId);
}

function getVariantData(flavorId, sizeId) {
  return variants[flavorId]?.[sizeId] ?? null;
}

function getVariantImage(flavorId, sizeId) {
  const data = getVariantData(flavorId, sizeId);
  return data?.image || fallbackImages[flavorId] || 'design-logo.png';
}

function isVariantAvailable(flavorId, sizeId) {
  const flavor = getFlavor(flavorId);
  const size = getSize(sizeId);
  const data = getVariantData(flavorId, sizeId);
  return Boolean(flavor?.available && size?.available && data?.available);
}

function buildVariant(variantId) {
  const { flavorId, sizeId } = parseVariantId(variantId);
  const flavor = getFlavor(flavorId);
  const size = getSize(sizeId);
  const data = getVariantData(flavorId, sizeId);
  if (!flavor || !size || !data) return null;

  return {
    id: variantId,
    flavorId,
    sizeId,
    name: `${flavor.name} — ${size.name}`,
    flavorName: flavor.name,
    sizeName: size.name,
    description: flavor.description,
    tag: flavor.tag,
    price: data.price,
    image: getVariantImage(flavorId, sizeId),
    available: isVariantAvailable(flavorId, sizeId),
  };
}

function getVariantById(variantId) {
  return buildVariant(variantId);
}

function getMinPriceForFlavor(flavorId) {
  const sizePrices = Object.values(variants[flavorId] || {})
    .filter((v) => v.available)
    .map((v) => v.price);
  return sizePrices.length ? Math.min(...sizePrices) : null;
}

function getFirstAvailableCombination() {
  for (const flavor of flavors) {
    if (!flavor.available) continue;
    for (const size of sizes) {
      if (isVariantAvailable(flavor.id, size.id)) {
        return { flavorId: flavor.id, sizeId: size.id };
      }
    }
  }
  return { flavorId: flavors[0].id, sizeId: sizes[0].id };
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

const sizeSelector = document.getElementById('sizeSelector');
const flavorSelector = document.getElementById('flavorSelector');
const flavorsGrid = document.getElementById('flavorsGrid');
const configuratorImage = document.getElementById('configuratorImage');
const configuratorFallback = document.getElementById('configuratorFallback');
const configuratorTag = document.getElementById('configuratorTag');
const configuratorTitle = document.getElementById('configuratorTitle');
const configuratorDesc = document.getElementById('configuratorDesc');
const configuratorUnavailable = document.getElementById('configuratorUnavailable');
const configuratorPrice = document.getElementById('configuratorPrice');
const configuratorAddCart = document.getElementById('configuratorAddCart');
const configuratorOrder = document.getElementById('configuratorOrder');

const defaults = getFirstAvailableCombination();
let selectedFlavorId = defaults.flavorId;
let selectedSizeId = defaults.sizeId;
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

function getCurrentVariantId() {
  return makeVariantId(selectedFlavorId, selectedSizeId);
}

// ── Configurator ──────────────────────────────
function renderSizeSelector() {
  sizeSelector.innerHTML = sizes.map((size) => {
    const thumb = getVariantImage(selectedFlavorId, size.id);
    const available = isVariantAvailable(selectedFlavorId, size.id);
    const active = selectedSizeId === size.id;

    return `
      <button
        type="button"
        class="size-option${active ? ' active' : ''}"
        data-size="${size.id}"
        role="radio"
        aria-checked="${active}"
        aria-label="${size.name}"
        ${available ? '' : 'disabled'}
      >
        <img src="${thumb}" alt="${size.name}" class="size-option-thumb" loading="lazy"
          onerror="this.src='${fallbackImages[selectedFlavorId] || 'design-logo.png'}'">
        <span class="size-option-name">${size.name}</span>
      </button>
    `;
  }).join('');
}

function renderFlavorSelector() {
  flavorSelector.innerHTML = flavors.map((flavor) => {
    const available = sizes.some((size) => isVariantAvailable(flavor.id, size.id));
    const active = selectedFlavorId === flavor.id;

    return `
      <button
        type="button"
        class="flavor-option${active ? ' active' : ''}"
        data-flavor="${flavor.id}"
        role="radio"
        aria-checked="${active}"
        ${available ? '' : 'disabled'}
      >${flavor.name}</button>
    `;
  }).join('');
}

function renderFlavorsOverview() {
  flavorsGrid.innerHTML = flavors.map((flavor) => {
    const minPrice = getMinPriceForFlavor(flavor.id);
    const active = selectedFlavorId === flavor.id;

    return `
      <article class="flavor-card${active ? ' active' : ''}" data-flavor-card="${flavor.id}" tabindex="0">
        ${flavor.tag ? `<span class="flavor-card-tag">${flavor.tag}</span>` : ''}
        <h4 class="flavor-card-name">${flavor.name}</h4>
        <p class="flavor-card-desc">${flavor.description}</p>
        ${minPrice ? `<p class="flavor-card-from">À partir de ${minPrice} DH</p>` : ''}
      </article>
    `;
  }).join('');
}

function updateConfiguratorDisplay() {
  const flavor = getFlavor(selectedFlavorId);
  const size = getSize(selectedSizeId);
  const data = getVariantData(selectedFlavorId, selectedSizeId);
  const available = isVariantAvailable(selectedFlavorId, selectedSizeId);
  const variantId = getCurrentVariantId();

  configuratorImage.classList.add('is-changing');
  const imgSrc = getVariantImage(selectedFlavorId, selectedSizeId);
  configuratorImage.onload = () => configuratorImage.classList.remove('is-changing');
  configuratorImage.onerror = () => {
    configuratorImage.src = fallbackImages[selectedFlavorId] || 'design-logo.png';
    configuratorImage.classList.remove('is-changing');
  };
  configuratorImage.src = imgSrc;
  configuratorImage.alt = `${flavor?.name} — ${size?.name}`;

  if (flavor?.tag) {
    configuratorTag.textContent = flavor.tag;
    configuratorTag.hidden = false;
  } else {
    configuratorTag.hidden = true;
  }

  configuratorTitle.textContent = `${flavor?.name || ''} — ${size?.name || ''}`;
  configuratorDesc.textContent = flavor?.description || '';
  configuratorUnavailable.hidden = available;
  configuratorPrice.innerHTML = available
    ? `${data.price} <span>DH</span>`
    : '— <span>DH</span>';

  configuratorAddCart.disabled = !available;
  configuratorOrder.disabled = !available;
  configuratorAddCart.dataset.variantId = variantId;
  configuratorOrder.dataset.variantId = variantId;

  renderSizeSelector();
  renderFlavorSelector();
  renderFlavorsOverview();
}

function selectSize(sizeId) {
  if (!getSize(sizeId)) return;
  selectedSizeId = sizeId;
  updateConfiguratorDisplay();
}

function selectFlavor(flavorId) {
  if (!getFlavor(flavorId)) return;
  selectedFlavorId = flavorId;
  if (!isVariantAvailable(selectedFlavorId, selectedSizeId)) {
    const fallbackSize = sizes.find((s) => isVariantAvailable(flavorId, s.id));
    if (fallbackSize) selectedSizeId = fallbackSize.id;
  }
  updateConfiguratorDisplay();
}

function initConfigurator() {
  renderSizeSelector();
  renderFlavorSelector();
  renderFlavorsOverview();
  updateConfiguratorDisplay();

  sizeSelector.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-size]');
    if (!btn || btn.disabled) return;
    selectSize(btn.dataset.size);
  });

  flavorSelector.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-flavor]');
    if (!btn || btn.disabled) return;
    selectFlavor(btn.dataset.flavor);
  });

  flavorsGrid.addEventListener('click', (e) => {
    const card = e.target.closest('[data-flavor-card]');
    if (!card) return;
    selectFlavor(card.dataset.flavorCard);
    document.getElementById('productConfigurator').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  flavorsGrid.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('[data-flavor-card]');
    if (!card) return;
    e.preventDefault();
    selectFlavor(card.dataset.flavorCard);
  });

  configuratorAddCart.addEventListener('click', () => {
    addToCart(getCurrentVariantId());
  });

  configuratorOrder.addEventListener('click', () => {
    openOrderModal(getCurrentVariantId());
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
initConfigurator();
updateCartUI();
