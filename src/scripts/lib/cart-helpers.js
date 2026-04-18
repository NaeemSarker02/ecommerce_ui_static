import { products, commerceMeta } from "@/data/site";
import { getCart } from "@/scripts/state/cart-state";

export function getDetailedCartItems() {
  const lookup = new Map(products.map((product) => [product.id, product]));

  return getCart()
    .map((item) => {
      const product = lookup.get(item.id);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter(Boolean);
}

export function getShippingZone(zoneId) {
  return commerceMeta.shippingZones.find((zone) => zone.id === zoneId) ?? commerceMeta.shippingZones[0];
}

export function getPromoDefinition(code) {
  const normalizedCode = String(code ?? "").trim().toUpperCase();
  return commerceMeta.promoCodes.find((promo) => promo.code === normalizedCode) ?? null;
}

export function resolvePromo(code, subtotal, shipping) {
  const promo = getPromoDefinition(code);
  if (!promo) {
    return {
      promo: null,
      discount: 0,
      message: "",
      isEligible: false
    };
  }

  if (subtotal < promo.minimumSubtotal) {
    return {
      promo,
      discount: 0,
      isEligible: false,
      message: `Add ${promo.minimumSubtotal - subtotal} BDT more to unlock ${promo.label.toLowerCase()}.`
    };
  }

  const discount = promo.type === "percent"
    ? Math.round((subtotal * promo.value) / 100)
    : shipping;

  return {
    promo,
    discount,
    isEligible: true,
    message: promo.description
  };
}

export function calculateTotals(items, zoneId = commerceMeta.shippingZones[0].id, promoCode = "") {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingZone = getShippingZone(zoneId);
  const baseShipping = items.length ? shippingZone.cost : 0;
  const autoFreeShipping = Boolean(items.length && zoneId === "dhaka" && subtotal >= commerceMeta.freeShippingThreshold);
  const shipping = autoFreeShipping ? 0 : baseShipping;
  const promoResult = resolvePromo(promoCode, subtotal, shipping);
  const discount = promoResult.isEligible ? promoResult.discount : 0;

  return {
    subtotal,
    baseShipping,
    shipping,
    discount,
    total: Math.max(subtotal + shipping - discount, 0),
    shippingZone,
    autoFreeShipping,
    appliedPromo: promoResult.isEligible ? promoResult.promo : null,
    promoFeedback: promoResult.message,
    promoPending: promoResult.promo && !promoResult.isEligible ? promoResult.promo : null
  };
}

export function getCartOperationalSummary(items, zoneId = commerceMeta.shippingZones[0].id) {
  const shippingZone = getShippingZone(zoneId);
  const lowStockItems = items.filter((item) => item.availability?.status === "low-stock").map((item) => item.name);
  const dispatchLabels = [...new Set(items.map((item) => item.shipping?.dispatchLabel).filter(Boolean))];
  const careSummaries = [...new Set(items.map((item) => item.care?.summary).filter(Boolean))];

  return {
    availabilityMessage: lowStockItems.length
      ? `${lowStockItems.join(", ")} ${lowStockItems.length === 1 ? "is" : "are"} currently marked low stock and may need a final confirmation before dispatch.`
      : "All items in this cart are currently available for standard confirmation-first dispatch.",
    dispatchMessage: dispatchLabels.length <= 1
      ? `${dispatchLabels[0] ?? "Dispatch timing will be confirmed"}. ${shippingZone.label} orders typically arrive in ${shippingZone.eta.toLowerCase()}.`
      : `Mixed dispatch timing applies across this cart. ${shippingZone.label} orders typically arrive in ${shippingZone.eta.toLowerCase()}.`,
    careMessage: careSummaries.length <= 1
      ? careSummaries[0] ?? "Refer to each product page for post-delivery care guidance."
      : "Care instructions vary by product in this cart, so the product pages remain the best reference after purchase."
  };
}