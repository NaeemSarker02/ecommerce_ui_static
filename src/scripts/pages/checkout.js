import { commerceMeta, siteMeta } from "@/data/site";
import { escapeHtml } from "@/scripts/lib/dom";
import { formatPrice } from "@/scripts/lib/format";
import { calculateTotals, getCartOperationalSummary, getDetailedCartItems, getShippingZone } from "@/scripts/lib/cart-helpers";
import { pageUrl } from "@/scripts/lib/router";
import { bootPage } from "@/scripts/main";
import { clearCart, getAppliedPromoCode, getCart } from "@/scripts/state/cart-state";

const fieldHelp = {
  fullName: "Use the name needed for delivery confirmation.",
  phone: "Enter a Bangladesh mobile number so the order can be confirmed.",
  email: "Optional for now, but useful later for order receipts.",
  address: "Include house, road, area, and city for handoff.",
  orderNote: "Optional rider note, landmark, or preferred call time."
};

const validatableFields = ["fullName", "phone", "email", "address"];

function cartItems() {
  return getDetailedCartItems();
}

function createFormState(overrides = {}) {
  return {
    fullName: "",
    phone: "",
    email: "",
    address: "",
    orderNote: "",
    zone: commerceMeta.shippingZones[0].id,
    paymentMethod: commerceMeta.paymentMethods[0].id,
    ...overrides
  };
}

function valueAttr(value) {
  return escapeHtml(value ?? "");
}

function getPaymentMethod(methodId) {
  return commerceMeta.paymentMethods.find((method) => method.id === methodId) ?? commerceMeta.paymentMethods[0];
}

function validateFormState(formState) {
  const errors = {};
  const fullName = formState.fullName.trim();
  const phone = formState.phone.trim();
  const email = formState.email.trim();
  const address = formState.address.trim();

  if (fullName.length < 3) {
    errors.fullName = "Enter the customer name with at least 3 characters.";
  }

  if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(phone)) {
    errors.phone = "Use a valid Bangladesh mobile number, for example 017XXXXXXXX.";
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address or leave the field empty.";
  }

  if (address.length < 12) {
    errors.address = "Add a fuller delivery address with area and city details.";
  }

  return errors;
}

function messageMarkup(fieldName, validationErrors) {
  const hasError = Boolean(validationErrors[fieldName]);
  const text = validationErrors[fieldName] ?? fieldHelp[fieldName] ?? "";

  return `
    <span class="${hasError ? "field-error" : "field-help"}" id="${fieldName}-message" data-field-message="${fieldName}">
      ${escapeHtml(text)}
    </span>
  `;
}

function setFeedbackState(form, errors) {
  const feedback = form.querySelector("#checkout-feedback");
  if (!feedback) {
    return;
  }

  const hasErrors = Object.keys(errors).length > 0;
  feedback.textContent = hasErrors
    ? "Review the highlighted fields before placing the demo order."
    : "Shipping totals and payment copy update from the current form state.";
  feedback.classList.toggle("form-alert", true);
  feedback.classList.toggle("is-error", hasErrors);
}

function setFieldState(form, fieldName, errorMessage) {
  const field = form.querySelector(`[name="${fieldName}"]`);
  const message = form.querySelector(`[data-field-message="${fieldName}"]`);

  if (!field || !message) {
    return;
  }

  field.classList.toggle("is-invalid", Boolean(errorMessage));
  field.setAttribute("aria-invalid", String(Boolean(errorMessage)));
  message.textContent = errorMessage ?? fieldHelp[fieldName] ?? "";
  message.className = errorMessage ? "field-error" : "field-help";
}

function syncValidationUi(form, errors) {
  validatableFields.forEach((fieldName) => {
    setFieldState(form, fieldName, errors[fieldName]);
  });
  setFeedbackState(form, errors);
}

function syncCheckoutMeta(scope, formState) {
  const paymentDescription = scope.querySelector("[data-payment-copy]");
  const orderNotePreview = scope.querySelector("[data-order-note-preview]");
  const customerPreview = scope.querySelector("[data-customer-preview]");
  const paymentMethod = getPaymentMethod(formState.paymentMethod);

  if (paymentDescription) {
    paymentDescription.textContent = paymentMethod.description;
  }

  if (orderNotePreview) {
    orderNotePreview.textContent = formState.orderNote.trim()
      ? formState.orderNote.trim()
      : "No delivery note added yet. Use this field for landmarks or call timing guidance.";
  }

  if (customerPreview) {
    customerPreview.textContent = formState.fullName.trim() || "Customer name will appear here after validation-ready input.";
  }
}

function buildOrderReference(formState) {
  const stamp = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  const phoneTail = formState.phone.replace(/\D/g, "").slice(-4) || "0000";
  const zoneCode = formState.zone === "dhaka" ? "DHK" : "CTG";

  return `NS-${stamp}-${zoneCode}-${phoneTail}`;
}

function buildHelpSupportUrl(payload) {
  return pageUrl("help", {
    topic: "order-status",
    fullName: payload.fullName,
    phone: payload.phone,
    orderRef: payload.orderReference,
    message: `Need an update on order ${payload.orderReference}.`
  });
}

function renderSuccess(root, payload) {
  root.innerHTML = `
    <section class="py-8 md:py-12">
      <div class="container-shell space-y-8 px-4">
        <div class="checkout-success">
          <span class="eyebrow">Order placed</span>
          <h1 class="section-heading mt-5">Demo checkout completed successfully.</h1>
          <p class="section-copy mt-5">A real production version would now create an order record, trigger confirmation workflows, and hand off to fulfillment logic.</p>
          <div class="info-grid mt-8">
            <article class="info-card">
              <h3>Customer</h3>
              <p>${escapeHtml(payload.fullName)}</p>
            </article>
            <article class="info-card">
              <h3>Delivery</h3>
              <p>${escapeHtml(payload.zone.label)} • ${escapeHtml(payload.zone.eta)}</p>
            </article>
            <article class="info-card">
              <h3>Payment</h3>
              <p>${escapeHtml(payload.paymentLabel)}</p>
            </article>
            <article class="info-card">
              <h3>Phone</h3>
              <p>${escapeHtml(payload.phone)}</p>
            </article>
            <article class="info-card">
              <h3>Order reference</h3>
              <p>${escapeHtml(payload.orderReference)}</p>
            </article>
            ${payload.orderNote ? `<article class="info-card"><h3>Delivery note</h3><p>${escapeHtml(payload.orderNote)}</p></article>` : ""}
          </div>
          <div class="summary-box mt-8">
            <div class="summary-row text-lg font-black tracking-tight">
              <span>Total confirmed</span>
              <span>${formatPrice(payload.total)}</span>
            </div>
            <p class="text-muted mt-4 text-sm leading-7">Support contact: ${siteMeta.contact.phone}. Reference ${escapeHtml(payload.orderReference)} is ready for any post-order help flow, and the cart was cleared to prove the transition from checkout to confirmation.</p>
          </div>
          <div class="detail-note mt-8">
            <h3>Need support next?</h3>
            <p>The help page can now open with this order reference and the order-status topic already selected, which makes the mock support handoff feel closer to a real storefront workflow.</p>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <a class="button-primary" href="${pageUrl("products")}">Continue browsing</a>
            <a class="button-secondary" href="${buildHelpSupportUrl(payload)}">Open support with this reference</a>
            <a class="button-secondary" href="${pageUrl("home")}">Back home</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderCheckout(root, formState = createFormState(), validationErrors = {}, focusFieldName = "") {
  const items = cartItems();
  const promoCode = getAppliedPromoCode();
  const { subtotal, shipping, total, discount, shippingZone, appliedPromo, promoPending, autoFreeShipping, promoFeedback } = calculateTotals(items, formState.zone, promoCode);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const operationalSummary = getCartOperationalSummary(items, formState.zone);
  const paymentMethod = getPaymentMethod(formState.paymentMethod);

  root.innerHTML = `
    <section class="py-8 md:py-12">
      <div class="container-shell space-y-8 px-4">
        <div>
          <span class="eyebrow">Checkout UI</span>
          <h1 class="section-heading mt-5">Shipping and payment flow preview.</h1>
          <p class="section-copy mt-5">This page proves the layout and state wiring only. Replace the fields and summary rules with real business logic during backend integration.</p>
        </div>
        <div class="steps-row">
          ${commerceMeta.checkoutSteps
            .map((step, index) => `<span class="step-chip ${index === 1 ? "is-active" : ""}">${step}</span>`)
            .join("")}
        </div>
        ${
          items.length
            ? `
              <div class="info-grid">
                ${commerceMeta.checkoutNotes
                  .map(
                    (note) => `
                      <article class="info-card">
                        <h3>${note.title}</h3>
                        <p>${note.copy}</p>
                      </article>
                    `
                  )
                  .join("")}
                <article class="info-card">
                  <h3>Live summary</h3>
                  <p>${itemCount} items, ${shippingZone.label}, and ${formatPrice(total)} total are all derived from current local state.</p>
                </article>
                <article class="info-card">
                  <h3>Dispatch status</h3>
                  <p>${operationalSummary.dispatchMessage}</p>
                </article>
                ${(appliedPromo || promoPending) ? `<article class="info-card"><h3>Promo state</h3><p>${escapeHtml((appliedPromo ?? promoPending).code)} ${appliedPromo ? "is applied." : "is saved but needs a higher subtotal."} ${escapeHtml(promoFeedback)}</p></article>` : ""}
              </div>
              <div class="commerce-layout">
                <form class="summary-box" id="checkout-form">
                  <div class="checkout-form-grid md:grid-cols-2">
                    <label class="stack-sm block md:col-span-2">
                      <span class="field-label">Full name</span>
                      <input class="field-input ${validationErrors.fullName ? "is-invalid" : ""}" name="fullName" autocomplete="name" required placeholder="Your full name" value="${valueAttr(formState.fullName)}" aria-invalid="${Boolean(validationErrors.fullName)}" aria-describedby="fullName-message" />
                      ${messageMarkup("fullName", validationErrors)}
                    </label>
                    <label class="stack-sm block">
                      <span class="field-label">Phone number</span>
                      <input class="field-input ${validationErrors.phone ? "is-invalid" : ""}" name="phone" autocomplete="tel" required placeholder="01XXXXXXXXX" value="${valueAttr(formState.phone)}" aria-invalid="${Boolean(validationErrors.phone)}" aria-describedby="phone-message" />
                      ${messageMarkup("phone", validationErrors)}
                    </label>
                    <label class="stack-sm block">
                      <span class="field-label">Email</span>
                      <input class="field-input ${validationErrors.email ? "is-invalid" : ""}" name="email" autocomplete="email" type="email" placeholder="name@example.com" value="${valueAttr(formState.email)}" aria-invalid="${Boolean(validationErrors.email)}" aria-describedby="email-message" />
                      ${messageMarkup("email", validationErrors)}
                    </label>
                    <label class="stack-sm block md:col-span-2">
                      <span class="field-label">Address</span>
                      <textarea class="field-textarea ${validationErrors.address ? "is-invalid" : ""}" name="address" autocomplete="street-address" rows="4" required placeholder="House, road, area, city" aria-invalid="${Boolean(validationErrors.address)}" aria-describedby="address-message">${valueAttr(formState.address)}</textarea>
                      ${messageMarkup("address", validationErrors)}
                    </label>
                    <label class="stack-sm block md:col-span-2">
                      <span class="field-label">Order note</span>
                      <textarea class="field-textarea" name="orderNote" rows="3" placeholder="Landmark, preferred call time, or delivery note">${valueAttr(formState.orderNote)}</textarea>
                      ${messageMarkup("orderNote", validationErrors)}
                    </label>
                    <label class="stack-sm block">
                      <span class="field-label">Delivery zone</span>
                      <select class="field-select" name="zone">
                        ${commerceMeta.shippingZones
                          .map(
                            (zone) => `<option value="${zone.id}" ${zone.id === formState.zone ? "selected" : ""}>${zone.label}</option>`
                          )
                          .join("")}
                      </select>
                    </label>
                    <label class="stack-sm block">
                      <span class="field-label">Payment method</span>
                      <select class="field-select" name="paymentMethod">
                        ${commerceMeta.paymentMethods
                          .map((method) => `<option value="${method.id}" ${method.id === formState.paymentMethod ? "selected" : ""}>${method.label}</option>`)
                          .join("")}
                      </select>
                      <span class="field-help" data-payment-copy>${escapeHtml(paymentMethod.description)}</span>
                    </label>
                  </div>
                  <div class="detail-note-grid mt-8 md:grid-cols-3">
                    <div class="detail-note">
                      <h3>Delivery confirmation</h3>
                      <p>${operationalSummary.availabilityMessage}</p>
                    </div>
                    <div class="detail-note">
                      <h3>Current zone</h3>
                      <p>${shippingZone.label} with an estimated ${shippingZone.eta} delivery window.${autoFreeShipping ? ` Free shipping unlocked above ${formatPrice(commerceMeta.freeShippingThreshold)}.` : ""} ${operationalSummary.dispatchMessage}</p>
                    </div>
                    <div class="detail-note">
                      <h3>Payment route</h3>
                      <p>${escapeHtml(paymentMethod.label)} is selected. <span data-customer-preview>${escapeHtml(formState.fullName.trim() || "Customer name will appear here after validation-ready input.")}</span></p>
                    </div>
                  </div>
                  <div class="mt-8 flex flex-wrap gap-3">
                    <button class="button-primary w-full sm:w-auto" type="submit">Place demo order</button>
                    <a class="button-secondary w-full sm:w-auto" href="${pageUrl("cart")}">Back to cart</a>
                  </div>
                  <p class="text-muted mt-4 text-sm font-semibold form-alert ${Object.keys(validationErrors).length ? "is-error" : ""}" id="checkout-feedback">
                    ${Object.keys(validationErrors).length ? "Review the highlighted fields before placing the demo order." : "Shipping totals and payment copy update from the current form state."}
                  </p>
                </form>
                <aside class="summary-box sticky-summary">
                  <p class="text-accent text-sm font-extrabold uppercase tracking-[0.16em]">Order summary</p>
                  <h2 class="mt-3 text-3xl font-black tracking-tight">Ready to confirm</h2>
                  <div class="mt-5 space-y-4">
                    ${items
                      .map(
                        (item) => `
                          <div class="summary-row border-soft border-b pb-4">
                            <div>
                              <p class="font-extrabold tracking-tight">${item.name}</p>
                              <p class="text-muted mt-1 text-sm">Qty ${item.quantity}</p>
                            </div>
                            <p class="font-black">${formatPrice(item.price * item.quantity)}</p>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                  <div class="text-muted mt-6 space-y-3 text-sm">
                    <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
                    <div class="summary-row"><span>Shipping</span><span>${shipping ? formatPrice(shipping) : "Free"}</span></div>
                    ${discount ? `<div class="summary-row"><span>Promo savings</span><span>-${formatPrice(discount)}</span></div>` : ""}
                    <div class="summary-row"><span>Delivery ETA</span><span>${shippingZone.eta}</span></div>
                    <div class="summary-row"><span>Support</span><span>${siteMeta.contact.phone}</span></div>
                    ${(appliedPromo || promoPending) ? `<div class="summary-row"><span>Promo</span><span>${escapeHtml((appliedPromo ?? promoPending).code)}</span></div>` : ""}
                  </div>
                  <div class="muted-divider mt-6 pt-6">
                    <div class="summary-row text-lg font-black tracking-tight"><span>Total</span><span>${formatPrice(total)}</span></div>
                  </div>
                  <div class="detail-note mt-6">
                    <h3>Why this matters</h3>
                    <p>The zone select now changes shipping in the summary immediately, which makes checkout behavior more realistic even before backend integration.</p>
                  </div>
                  ${(appliedPromo || promoPending) ? `<div class="detail-note mt-4"><h3>Promo carryover</h3><p>${escapeHtml((appliedPromo ?? promoPending).label)} came from the cart and is reflected here automatically. Edit promo selection from the cart page if needed.</p></div>` : ""}
                  <div class="detail-note mt-4">
                    <h3>Delivery instructions</h3>
                    <p data-order-note-preview>${escapeHtml(formState.orderNote.trim() || operationalSummary.careMessage)}</p>
                  </div>
                </aside>
              </div>
            `
            : `
              <div class="empty-state-panel">
                <p class="text-accent text-sm font-extrabold uppercase tracking-[0.16em]">Checkout blocked</p>
                <h2 class="mt-4 text-3xl font-black tracking-tight">Add products before testing checkout.</h2>
                <p class="text-muted mx-auto mt-4 max-w-xl text-sm leading-7">The checkout summary reads the same local cart state used by the drawer and cart page.</p>
                <a class="button-primary mt-8" href="${pageUrl("products")}">Shop catalog</a>
              </div>
            `
        }
      </div>
    </section>
  `;

  const form = root.querySelector("#checkout-form");
  let currentErrors = { ...validationErrors };

  form?.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
      return;
    }

    formState = {
      ...formState,
      [target.name]: target.value
    };

    syncCheckoutMeta(root, formState);

    if (validatableFields.includes(target.name) && currentErrors[target.name]) {
      const nextErrors = validateFormState(formState);
      if (nextErrors[target.name]) {
        currentErrors[target.name] = nextErrors[target.name];
      } else {
        delete currentErrors[target.name];
      }
      syncValidationUi(form, currentErrors);
    }
  });

  form?.addEventListener("focusout", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) || !validatableFields.includes(target.name)) {
      return;
    }

    const nextErrors = validateFormState(formState);
    if (nextErrors[target.name]) {
      currentErrors[target.name] = nextErrors[target.name];
    } else {
      delete currentErrors[target.name];
    }
    syncValidationUi(form, currentErrors);
  }, true);

  root.querySelector('[name="zone"]')?.addEventListener("change", (event) => {
    formState = {
      ...formState,
      zone: event.target.value
    };
    renderCheckout(root, formState, currentErrors, "zone");
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    currentErrors = validateFormState(formState);

    if (Object.keys(currentErrors).length) {
      renderCheckout(root, formState, currentErrors, Object.keys(currentErrors)[0]);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const zone = getShippingZone(formData.get("zone"));
    const paymentMethod = getPaymentMethod(formData.get("paymentMethod"));
    const orderReference = buildOrderReference(formState);
    clearCart();
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: [] }));
    renderSuccess(root, {
      fullName: formData.get("fullName") || "Customer",
      phone: formData.get("phone") || siteMeta.contact.phone,
      orderNote: formData.get("orderNote") || "",
      zone,
      paymentLabel: paymentMethod.label,
      orderReference,
      total
    });
  });

  if (form) {
    syncValidationUi(form, currentErrors);
  }

  syncCheckoutMeta(root, formState);

  if (focusFieldName) {
    root.querySelector(`[name="${focusFieldName}"]`)?.focus();
  }
}

bootPage({
  pageKey: "checkout",
  title: "Checkout",
  render(root) {
    renderCheckout(root, createFormState());
  }
});