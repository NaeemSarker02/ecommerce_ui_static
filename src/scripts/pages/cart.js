import { commerceMeta } from "@/data/site";
import { escapeHtml } from "@/scripts/lib/dom";
import { formatPrice } from "@/scripts/lib/format";
import { calculateTotals, getCartOperationalSummary, getDetailedCartItems, getPromoDefinition } from "@/scripts/lib/cart-helpers";
import { pageUrl } from "@/scripts/lib/router";
import { bootPage } from "@/scripts/main";
import {
  clearAppliedPromoCode,
  getAppliedPromoCode,
  getCart,
  removeFromCart,
  setAppliedPromoCode,
  updateCartQuantity
} from "@/scripts/state/cart-state";

function cartItems() {
  return getDetailedCartItems();
}

function renderCart(root, flash = null) {
  const items = cartItems();
  const promoCode = getAppliedPromoCode();
  const {
    subtotal,
    shipping,
    total,
    discount,
    shippingZone,
    appliedPromo,
    promoFeedback,
    promoPending,
    autoFreeShipping
  } = calculateTotals(items, undefined, promoCode);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const operationalSummary = getCartOperationalSummary(items);
  const promoNotice = flash?.message ?? promoFeedback ?? (appliedPromo ? `${appliedPromo.label} is active on this cart.` : "Apply a demo promo code to test summary interactions.");
  const promoToneClass = flash?.tone === "error"
    ? "is-error"
    : flash?.tone === "success"
      ? "is-success"
      : "";

  root.innerHTML = `
    <section class="py-8 md:py-12">
      <div class="container-shell space-y-8 px-4">
        <div>
          <span class="eyebrow">Cart page</span>
          <h1 class="section-heading mt-5">Review items before checkout.</h1>
          <p class="section-copy mt-5">The cart state is stored in localStorage and shared across the mini-cart, product pages, and checkout summary.</p>
        </div>
        <div class="steps-row">
          <span class="step-chip is-active">Cart review</span>
          <span class="step-chip">Shipping details</span>
          <span class="step-chip">Confirmation call</span>
          <span class="step-chip">Delivery</span>
        </div>
        ${
          items.length
            ? `
              <div class="info-grid">
                ${commerceMeta.cartBenefits
                  .map(
                    (item) => `
                      <article class="info-card">
                        <h3>${item.title}</h3>
                        <p>${item.copy}</p>
                      </article>
                    `
                  )
                  .join("")}
              </div>
              <div class="commerce-layout">
                <div class="space-y-4">
                  <div class="summary-box">
                    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p class="text-accent text-sm font-extrabold uppercase tracking-[0.16em]">Cart snapshot</p>
                        <h2 class="mt-3 text-3xl font-black tracking-tight">${itemCount} items ready for checkout.</h2>
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <span class="summary-pill">${formatPrice(subtotal)} subtotal</span>
                        ${discount ? `<span class="summary-pill">-${formatPrice(discount)} savings</span>` : ""}
                        <span class="summary-pill">${shippingZone.eta}</span>
                      </div>
                    </div>
                  </div>
                  ${items
                    .map(
                      (item) => `
                        <article class="line-item-card md:flex-row md:items-center">
                          <div class="media-panel theme-${item.theme} rounded-soft flex h-44 w-full flex-col p-5 md:h-36 md:w-32">
                            <span class="media-kicker">${item.category}</span>
                            <span class="mt-auto text-xl font-black leading-5">${item.name}</span>
                          </div>
                          <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap gap-2">
                              <span class="badge-chip badge-stock">${item.availability.label}</span>
                              ${item.badge ? `<span class="badge-chip badge-sale">${item.badge}</span>` : ""}
                            </div>
                            <h2 class="text-2xl font-black tracking-tight">${item.name}</h2>
                            <p class="text-muted mt-3 text-sm leading-7">${item.shortDescription}</p>
                            <div class="mt-5 flex flex-wrap items-center gap-3">
                              <div class="quantity-control">
                                <button type="button" aria-label="Decrease quantity for ${item.name}" data-item-action="decrease" data-item-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button type="button" aria-label="Increase quantity for ${item.name}" data-item-action="increase" data-item-id="${item.id}">+</button>
                              </div>
                              <button class="button-ghost w-full sm:w-auto" type="button" data-remove-item="${item.id}">Remove</button>
                              <a class="button-secondary button-compact w-full sm:w-auto" href="${pageUrl("product", { product: item.slug })}">View product</a>
                            </div>
                          </div>
                          <div class="border-soft mt-2 border-t pt-4 text-left md:mt-0 md:border-0 md:p-0 md:text-right">
                            <p class="text-muted text-sm font-semibold">${formatPrice(item.price)} each</p>
                            <p class="mt-2 text-2xl font-black tracking-tight">${formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </article>
                      `
                    )
                    .join("")}
                </div>
                <aside class="summary-box sticky-summary h-fit">
                  <p class="text-accent text-sm font-extrabold uppercase tracking-[0.16em]">Summary</p>
                  <h2 class="mt-3 text-3xl font-black tracking-tight">Order preview</h2>
                  <div class="detail-note mt-6">
                    <h3>Promo code</h3>
                    <form class="mt-4 grid gap-3 sm:grid-cols-[1fr,auto]" id="promo-form">
                      <input class="field-input" name="promoCode" placeholder="Try NORTH10 or FREESHIP" value="${escapeHtml(promoCode)}" aria-label="Promo code" />
                      <button class="button-secondary w-full sm:w-auto" type="submit">Apply</button>
                    </form>
                    <div class="mt-3 flex flex-wrap gap-2">
                      ${commerceMeta.promoCodes.map((promo) => `<button class="button-ghost button-compact" type="button" data-promo-suggest="${promo.code}">${promo.code}</button>`).join("")}
                    </div>
                    <p class="mt-4 text-sm font-semibold ${promoToneClass} form-alert" id="promo-feedback">${escapeHtml(promoNotice)}</p>
                    ${appliedPromo || promoPending ? `<div class="mt-4 flex flex-wrap items-center gap-2"><span class="summary-pill">${escapeHtml((appliedPromo ?? promoPending).code)}</span><span class="text-muted text-sm">${escapeHtml((appliedPromo ?? promoPending).label)}</span><button class="button-ghost button-compact" type="button" data-remove-promo>Remove</button></div>` : ""}
                  </div>
                  <div class="text-muted mt-6 space-y-3 text-sm">
                    <div class="summary-row">
                      <span>Subtotal</span>
                      <span>${formatPrice(subtotal)}</span>
                    </div>
                    <div class="summary-row">
                      <span>Shipping</span>
                      <span>${shipping ? formatPrice(shipping) : "Free"}</span>
                    </div>
                    ${discount ? `<div class="summary-row"><span>Promo savings</span><span>-${formatPrice(discount)}</span></div>` : ""}
                    <div class="summary-row">
                      <span>Delivery zone</span>
                      <span>${shippingZone.label}</span>
                    </div>
                    <div class="summary-row">
                      <span>Delivery ETA</span>
                      <span>${shippingZone.eta}</span>
                    </div>
                  </div>
                  <div class="muted-divider mt-6 pt-6">
                    <div class="summary-row text-lg font-black tracking-tight">
                      <span>Total</span>
                      <span>${formatPrice(total)}</span>
                    </div>
                  </div>
                  <div class="mt-6 grid gap-3">
                    <a class="button-primary w-full" href="${pageUrl("checkout")}">Continue to checkout</a>
                    <a class="button-secondary w-full" href="${pageUrl("products")}">Keep shopping</a>
                  </div>
                  <div class="detail-note mt-6">
                    <h3>What happens next</h3>
                    <p>${autoFreeShipping ? `This cart already unlocked free Dhaka delivery above ${formatPrice(commerceMeta.freeShippingThreshold)}.` : operationalSummary.dispatchMessage}</p>
                  </div>
                  <div class="detail-note mt-4">
                    <h3>Availability and care</h3>
                    <p>${operationalSummary.availabilityMessage} ${operationalSummary.careMessage}</p>
                  </div>
                </aside>
              </div>
            `
            : `
              <div class="empty-state-panel">
                <p class="text-accent text-sm font-extrabold uppercase tracking-[0.16em]">No saved picks</p>
                <h2 class="mt-4 text-3xl font-black tracking-tight">Your cart is empty.</h2>
                <p class="text-muted mx-auto mt-4 max-w-xl text-sm leading-7">Use the product cards or the product detail page to test quantity controls and cart persistence.</p>
                <a class="button-primary mt-8" href="${pageUrl("products")}">Browse products</a>
              </div>
            `
        }
      </div>
    </section>
  `;

  root.querySelectorAll("[data-item-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.itemId);
      const item = cartItems().find((entry) => entry.id === productId);
      if (!item) {
        return;
      }

      const nextQuantity = button.dataset.itemAction === "increase" ? item.quantity + 1 : item.quantity - 1;
      updateCartQuantity(productId, nextQuantity);
      renderCart(root);
    });
  });

  root.querySelectorAll("[data-remove-item]").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(Number(button.dataset.removeItem));
      renderCart(root);
    });
  });

  root.querySelectorAll("[data-promo-suggest]").forEach((button) => {
    button.addEventListener("click", () => {
      setAppliedPromoCode(button.dataset.promoSuggest);
      renderCart(root, { tone: "success", message: `${button.dataset.promoSuggest} added to the cart.` });
    });
  });

  root.querySelector("#promo-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedCode = String(formData.get("promoCode") ?? "").trim().toUpperCase();

    if (!submittedCode) {
      clearAppliedPromoCode();
      renderCart(root, { tone: "success", message: "Promo code removed from the cart." });
      return;
    }

    const promo = getPromoDefinition(submittedCode);
    if (!promo) {
      renderCart(root, { tone: "error", message: "Promo code not recognized. Try NORTH10 or FREESHIP." });
      return;
    }

    setAppliedPromoCode(submittedCode);
    renderCart(root, { tone: "success", message: `${promo.label} saved to this cart.` });
  });

  root.querySelector("[data-remove-promo]")?.addEventListener("click", () => {
    clearAppliedPromoCode();
    renderCart(root, { tone: "success", message: "Promo code removed from the cart." });
  });

  window.dispatchEvent(new CustomEvent("cart:updated", { detail: getCart() }));
}

bootPage({
  pageKey: "cart",
  title: "Cart",
  render(root) {
    renderCart(root);
  }
});