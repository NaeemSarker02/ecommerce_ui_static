const STORAGE_KEY = "northstar-cart";
const PROMO_STORAGE_KEY = "northstar-promo";

function readCart() {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    const parsed = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(nextCart) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCart));
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: nextCart }));
}

function readPromoCode() {
  try {
    const rawValue = window.localStorage.getItem(PROMO_STORAGE_KEY);
    return rawValue ? String(rawValue).trim().toUpperCase() : "";
  } catch {
    return "";
  }
}

function writePromoCode(nextCode) {
  if (nextCode) {
    window.localStorage.setItem(PROMO_STORAGE_KEY, nextCode);
  } else {
    window.localStorage.removeItem(PROMO_STORAGE_KEY);
  }

  window.dispatchEvent(new CustomEvent("promo:updated", { detail: nextCode }));
}

export function getCart() {
  return readCart();
}

export function getCartCount() {
  return readCart().reduce((total, item) => total + item.quantity, 0);
}

export function getAppliedPromoCode() {
  return readPromoCode();
}

export function setAppliedPromoCode(code) {
  writePromoCode(String(code ?? "").trim().toUpperCase());
}

export function clearAppliedPromoCode() {
  writePromoCode("");
}

export function addToCart(product, quantity = 1) {
  const cart = readCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: product.price,
      theme: product.theme,
      quantity
    });
  }

  writeCart(cart);
}

export function updateCartQuantity(productId, quantity) {
  const cart = readCart()
    .map((item) => (item.id === productId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);

  writeCart(cart);
}

export function removeFromCart(productId) {
  writeCart(readCart().filter((item) => item.id !== productId));
}

export function clearCart() {
  writeCart([]);
  writePromoCode("");
}