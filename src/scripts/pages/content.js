import { commerceMeta, products, siteMeta, staticPages } from "@/data/site";
import { escapeHtml, qs } from "@/scripts/lib/dom";
import { formatPrice } from "@/scripts/lib/format";
import { getParam, pageUrl } from "@/scripts/lib/router";
import { bootPage } from "@/scripts/main";
import { getRecentOrder } from "@/scripts/state/cart-state";

const pageKey = document.body.dataset.page;
const content = staticPages[pageKey] ?? staticPages.about;
const supportFieldHelp = {
  fullName: "Use the customer or order name that support should respond to.",
  phone: "Optional, but helpful for urgent delivery or order-status issues.",
  email: "Add an email if you want written follow-up instead of only phone support.",
  topic: "Choose the route that best matches the issue.",
  orderRef: "Optional reference for an existing order, promo, or conversation.",
  message: "Add enough detail for support to understand the request without another clarification loop."
};

const defaultSupportTopicGuide = {
  title: "Choose a support route",
  copy: "Select a topic to preview what reference details support needs and how the request would be handled in a production workflow.",
  lines: [
    "Order-status and returns requests work best with a shared order reference.",
    "Fit and promo requests can usually start with clear written context.",
    "The selected route should shape the support response and next-step copy."
  ]
};

const ORDER_REFERENCE_PATTERN = /^NS-(\d{6})-(DHK|CTG)-(\d{4})$/;

function renderSection(section) {
  return `
    <section>
      <h2>${section.title}</h2>
      <p>${section.body}</p>
      ${section.bullets?.length ? `<ul>${section.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
    </section>
  `;
}

function renderSidebarCard(card) {
  return `
    <article class="support-card">
      <h3>${card.title}</h3>
      <p>${card.copy}</p>
      ${card.lines?.length ? `<div class="support-card-list">${card.lines.map((line) => `<span>${line}</span>`).join("")}</div>` : ""}
    </article>
  `;
}

function renderFaqItem(item, index) {
  return `
    <details class="faq-item" ${index === 0 ? "open" : ""}>
      <summary>${item.question}</summary>
      <p>${item.answer}</p>
    </details>
  `;
}

function getSupportTopicConfig(formConfig, topicValue) {
  return formConfig.topics.find((topic) => topic.value === topicValue) ?? null;
}

function normalizeOrderReference(value) {
  return String(value ?? "").trim().toUpperCase();
}

function resolveLookupZone(zoneCode) {
  const zoneId = zoneCode === "DHK" ? "dhaka" : "outside-dhaka";
  return commerceMeta.shippingZones.find((zone) => zone.id === zoneId) ?? commerceMeta.shippingZones[0];
}

function buildLookupResult(reference, recentOrder = getRecentOrder()) {
  const normalizedReference = normalizeOrderReference(reference);
  const recentMatch = recentOrder?.reference === normalizedReference ? recentOrder : null;
  const match = ORDER_REFERENCE_PATTERN.exec(normalizedReference);

  if (!match) {
    return {
      valid: false,
      reference: normalizedReference,
      error: staticPages.help.orderLookup.invalidState
    };
  }

  const [, stamp, zoneCode, phoneTail] = match;
  const zone = recentMatch ? { label: recentMatch.zoneLabel, eta: recentMatch.zoneEta } : resolveLookupZone(zoneCode);
  const statusVariants = [
    {
      label: "Awaiting confirmation",
      copy: "The order is in the confirmation-first queue and still needs the standard delivery confirmation step."
    },
    {
      label: "Packed for dispatch",
      copy: "The order has cleared the demo confirmation stage and is now prepared for dispatch handoff."
    },
    {
      label: "Out for delivery",
      copy: "The order is in the active delivery window and should follow the zone ETA already shown at checkout."
    }
  ];
  const status = recentMatch
    ? statusVariants[1]
    : statusVariants[Number(phoneTail.at(-1) ?? 0) % statusVariants.length];

  return {
    valid: true,
    source: recentMatch ? "recent-order" : "reference-pattern",
    reference: normalizedReference,
    dateLabel: recentMatch?.createdAt ? new Date(recentMatch.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" }) : `20${stamp.slice(0, 2)}-${stamp.slice(2, 4)}-${stamp.slice(4, 6)}`,
    phoneTail,
    fullName: recentMatch?.fullName ?? "Saved customer name not available in this lookup.",
    phone: recentMatch?.phone ?? `Ending in ${phoneTail}`,
    orderNote: recentMatch?.orderNote ?? "No saved delivery note is attached to this lookup.",
    paymentLabel: recentMatch?.paymentLabel ?? "Checkout payment method saved in the confirmation-first demo flow.",
    total: recentMatch?.total ?? null,
    zoneLabel: zone.label,
    zoneEta: zone.eta,
    statusLabel: status.label,
    statusCopy: recentMatch
      ? `${status.copy} This result is using the latest demo checkout stored in localStorage on this browser.`
      : `${status.copy} This result is inferred from the mock reference format because no exact local demo order was found.`
  };
}

function getSupportPrefill(formConfig) {
  const topicValue = getParam("topic") ?? "";
  const topicConfig = getSupportTopicConfig(formConfig, topicValue);
  const orderRef = getParam("orderRef") ?? "";

  return {
    fullName: getParam("fullName") ?? "",
    phone: getParam("phone") ?? "",
    email: getParam("email") ?? "",
    topic: topicConfig?.value ?? "",
    orderRef,
    message: getParam("message") ?? (orderRef && topicValue === "order-status" ? `Need an update on order ${orderRef}.` : "")
  };
}

function renderLookupResult(result, lookupConfig) {
  if (!result?.valid) {
    return `
      <div class="detail-note mt-6">
        <h3>Reference not recognized</h3>
        <p>${escapeHtml(result?.error ?? lookupConfig.invalidState)}</p>
      </div>
    `;
  }

  return `
    <div class="mt-6 space-y-6">
      <div class="info-grid">
        <article class="info-card">
          <h3>Status</h3>
          <p>${escapeHtml(result.statusLabel)}</p>
        </article>
        <article class="info-card">
          <h3>Delivery zone</h3>
          <p>${escapeHtml(result.zoneLabel)} • ${escapeHtml(result.zoneEta)}</p>
        </article>
        <article class="info-card">
          <h3>Reference</h3>
          <p>${escapeHtml(result.reference)}</p>
        </article>
        <article class="info-card">
          <h3>Saved total</h3>
          <p>${result.total ? escapeHtml(formatPrice(result.total)) : "Available after checkout save"}</p>
        </article>
      </div>
      <div class="support-layout">
        <article class="surface-card policy-copy p-6 md:p-8">
          <h2>Status detail</h2>
          <p>${escapeHtml(result.statusCopy)}</p>
          <ul>
            <li>${escapeHtml(`Created or inferred date: ${result.dateLabel}`)}</li>
            <li>${escapeHtml(`Customer contact: ${result.phone}`)}</li>
            <li>${escapeHtml(`Payment route: ${result.paymentLabel}`)}</li>
          </ul>
        </article>
        <aside class="support-sidebar stack-md">
          <article class="support-card">
            <h3>Next action</h3>
            <p>Use this same reference in the support form if the customer needs a live follow-up instead of a quick lookup.</p>
            <div class="mt-4 flex flex-wrap gap-3">
              <button class="button-secondary w-full sm:w-auto" type="button" data-prefill-support-reference="${escapeHtml(result.reference)}">${escapeHtml(lookupConfig.supportButtonLabel)}</button>
            </div>
          </article>
        </aside>
      </div>
    </div>
  `;
}

function renderOrderLookupPanel(lookupConfig) {
  const recentOrder = getRecentOrder();
  const referenceFromQuery = normalizeOrderReference(getParam("orderRef"));
  const initialReference = referenceFromQuery || normalizeOrderReference(recentOrder?.reference);
  const initialResult = initialReference ? buildLookupResult(initialReference, recentOrder) : null;
  const feedbackText = recentOrder
    ? `Latest demo order stored in this browser: ${recentOrder.reference}.`
    : lookupConfig.emptyState;

  return `
    <section class="surface-card p-6 md:p-8" data-order-lookup-root>
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-3xl">
          <span class="eyebrow">${lookupConfig.eyebrow}</span>
          <h2 class="section-heading mt-5 text-[clamp(1.9rem,3.5vw,3rem)]">${lookupConfig.title}</h2>
          <p class="section-copy mt-5">${lookupConfig.intro}</p>
        </div>
        ${recentOrder ? `<span class="summary-pill">Latest: ${escapeHtml(recentOrder.reference)}</span>` : ""}
      </div>
      <form class="summary-box mt-8" id="order-status-lookup-form" novalidate>
        <div class="flex flex-col gap-4 md:flex-row md:items-end">
          <label class="stack-sm block flex-1">
            <span class="field-label">Order reference</span>
            <input class="field-input" name="orderRef" autocomplete="off" placeholder="NS-260418-DHK-7405" value="${escapeHtml(initialReference)}" aria-describedby="order-lookup-feedback" />
          </label>
          <button class="button-primary w-full md:w-auto" type="submit">${lookupConfig.buttonLabel}</button>
          ${recentOrder ? `<button class="button-secondary w-full md:w-auto" type="button" data-use-recent-order>${escapeHtml(lookupConfig.recentButtonLabel)}</button>` : ""}
        </div>
        <p class="text-muted mt-4 text-sm font-semibold form-alert" id="order-lookup-feedback" data-order-lookup-feedback>${escapeHtml(feedbackText)}</p>
        <div data-order-lookup-result>${initialResult ? renderLookupResult(initialResult, lookupConfig) : ""}</div>
      </form>
    </section>
  `;
}

function buildHelpOperationsGuide() {
  const dispatchLabels = [...new Set(products.map((product) => product.shipping?.dispatchLabel).filter(Boolean))];
  const lowStockItems = products.filter((product) => product.availability?.status === "low-stock");
  const careSummaries = [...new Set(products.map((product) => product.care?.summary).filter(Boolean))];
  const shippingLines = commerceMeta.shippingZones.map((zone) => `${zone.label}: ${zone.eta}`);

  return {
    intro: "This support route now reflects the same seeded business metadata used by the catalog, product, cart, and checkout flows.",
    cards: [
      {
        title: "Shipping zones",
        copy: `${shippingLines.join(". ")}. Free Dhaka delivery unlocks above ${formatPrice(commerceMeta.freeShippingThreshold)}.`
      },
      {
        title: "Dispatch timing",
        copy: dispatchLabels.length <= 1
          ? `${dispatchLabels[0] ?? "Dispatch timing is confirmed after order review"}.`
          : `${dispatchLabels.join(" and ")} are both active across the current product dataset.`
      },
      {
        title: "Availability status",
        copy: lowStockItems.length
          ? `${lowStockItems.map((item) => item.name).join(", ")} currently require low-stock confirmation handling before dispatch is fully locked.`
          : "All seeded products are currently available for the standard confirmation-first flow."
      }
    ],
    careTitle: "Care and handling",
    careCopy: careSummaries.length <= 1
      ? careSummaries[0] ?? "Product-specific care instructions are stored in the product dataset for future reuse."
      : "Care guidance differs across the current assortment, so support and post-purchase messaging should continue pulling from product-level instructions instead of one store-wide paragraph.",
    careLines: [
      "Use the product detail page for the most specific fit and care guidance before purchase.",
      "Use support for order-specific delivery, availability, or after-purchase follow-up.",
      "Keep this page aligned with product metadata so policy and support wording do not drift."
    ]
  };
}

function renderHelpOperationsGuide() {
  const guide = buildHelpOperationsGuide();

  return `
    <section class="surface-card p-6 md:p-8">
      <span class="eyebrow">Live storefront rules</span>
      <h2 class="section-heading mt-5 text-[clamp(1.9rem,3.5vw,3rem)]">Help content should match the current commerce data.</h2>
      <p class="section-copy mt-5">${escapeHtml(guide.intro)}</p>
      <div class="info-grid mt-8">
        ${guide.cards.map((card) => `<article class="info-card"><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.copy)}</p></article>`).join("")}
      </div>
      <div class="support-layout mt-8">
        <article class="surface-card policy-copy p-6 md:p-8">
          <h2>${escapeHtml(guide.careTitle)}</h2>
          <p>${escapeHtml(guide.careCopy)}</p>
          <ul>${guide.careLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
        </article>
        <aside class="support-sidebar stack-md">
          <article class="support-card">
            <h3>Why this matters</h3>
            <p>Support, checkout, and product messaging now share the same operational source instead of repeating separate delivery or care copy.</p>
            <div class="support-card-list">
              <span>Fewer support mismatches</span>
              <span>Cleaner future backend integration</span>
              <span>Reusable storefront business rules</span>
            </div>
          </article>
        </aside>
      </div>
    </section>
  `;
}

function renderSupportForm(formConfig) {
  const prefill = getSupportPrefill(formConfig);

  return `
    <section class="surface-card p-6 md:p-8" data-support-form-root>
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-3xl">
          <span class="eyebrow">${formConfig.eyebrow}</span>
          <h2 class="section-heading mt-5 text-[clamp(1.9rem,3.5vw,3rem)]">${formConfig.title}</h2>
          <p class="section-copy mt-5">${formConfig.intro}</p>
        </div>
        <div class="support-links">
          ${formConfig.topics.map((topic) => `<span class="summary-pill">${topic.label}</span>`).join("")}
        </div>
      </div>
      <form class="summary-box mt-8" id="support-request-form" novalidate>
        <div class="support-form-grid md:grid-cols-2">
          <label class="stack-sm block">
            <span class="field-label">Full name</span>
            <input class="field-input" name="fullName" autocomplete="name" placeholder="Your full name" value="${escapeHtml(prefill.fullName)}" aria-describedby="support-fullName-message" />
            <span class="field-help" id="support-fullName-message" data-support-message="fullName">${supportFieldHelp.fullName}</span>
          </label>
          <label class="stack-sm block">
            <span class="field-label">Phone</span>
            <input class="field-input" name="phone" autocomplete="tel" placeholder="01XXXXXXXXX" value="${escapeHtml(prefill.phone)}" aria-describedby="support-phone-message" />
            <span class="field-help" id="support-phone-message" data-support-message="phone">${supportFieldHelp.phone}</span>
          </label>
          <label class="stack-sm block">
            <span class="field-label">Email</span>
            <input class="field-input" name="email" autocomplete="email" type="email" placeholder="name@example.com" value="${escapeHtml(prefill.email)}" aria-describedby="support-email-message" />
            <span class="field-help" id="support-email-message" data-support-message="email">${supportFieldHelp.email}</span>
          </label>
          <label class="stack-sm block">
            <span class="field-label">Support topic</span>
            <select class="field-select" name="topic" aria-describedby="support-topic-message">
              <option value="">Choose a topic</option>
              ${formConfig.topics.map((topic) => `<option value="${topic.value}" ${topic.value === prefill.topic ? "selected" : ""}>${topic.label}</option>`).join("")}
            </select>
            <span class="field-help" id="support-topic-message" data-support-message="topic">${supportFieldHelp.topic}</span>
          </label>
          <label class="stack-sm block md:col-span-2">
            <span class="field-label" data-support-orderref-label>Order or reference code</span>
            <input class="field-input" name="orderRef" placeholder="Optional order or promo reference" value="${escapeHtml(prefill.orderRef)}" aria-describedby="support-orderRef-message" />
            <span class="field-help" id="support-orderRef-message" data-support-message="orderRef">${supportFieldHelp.orderRef}</span>
          </label>
          <label class="stack-sm block md:col-span-2">
            <span class="field-label">Message</span>
            <textarea class="field-textarea" name="message" rows="5" placeholder="Explain what happened, what you need, and any timing details." aria-describedby="support-message-message">${escapeHtml(prefill.message)}</textarea>
            <span class="field-help" id="support-message-message" data-support-message="message">${supportFieldHelp.message}</span>
          </label>
        </div>
        <div class="detail-note mt-6" data-support-topic-guide>
          <h3 data-support-topic-title>${defaultSupportTopicGuide.title}</h3>
          <p data-support-topic-copy>${defaultSupportTopicGuide.copy}</p>
          <div class="support-card-list mt-4" data-support-topic-lines>
            ${defaultSupportTopicGuide.lines.map((line) => `<span>${line}</span>`).join("")}
          </div>
        </div>
        <div class="detail-note mt-8">
          <h3>What this proves</h3>
          <p>${formConfig.responsePromise}</p>
        </div>
        <div class="mt-8 flex flex-wrap gap-3">
          <button class="button-primary w-full sm:w-auto" type="submit">Submit support request</button>
          <a class="button-secondary w-full sm:w-auto" href="tel:${siteMeta.contact.phone.replaceAll(" ", "")}">Call support</a>
        </div>
        <p class="text-muted mt-4 text-sm font-semibold form-alert" data-support-feedback>
          Add your issue details and at least one follow-up contact route.
        </p>
      </form>
    </section>
  `;
}

function getSupportFormState(form) {
  const formData = new FormData(form);
  return {
    fullName: String(formData.get("fullName") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    topic: String(formData.get("topic") ?? "").trim(),
    orderRef: String(formData.get("orderRef") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim()
  };
}

function validateSupportForm(state, formConfig) {
  const errors = {};
  const topicConfig = getSupportTopicConfig(formConfig, state.topic);

  if (state.fullName.length < 3) {
    errors.fullName = "Enter the support contact name with at least 3 characters.";
  }

  if (!state.phone && !state.email) {
    errors.phone = "Add at least a phone number or an email so support can reply.";
    errors.email = "Add at least an email or a phone number so support can reply.";
  }

  if (state.phone && !/^(?:\+?88)?01[3-9]\d{8}$/.test(state.phone)) {
    errors.phone = "Use a valid Bangladesh mobile number, for example 017XXXXXXXX.";
  }

  if (state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    errors.email = "Enter a valid email address or leave the field empty.";
  }

  if (!state.topic) {
    errors.topic = "Choose the support route that best matches the issue.";
  }

  if (topicConfig?.requiresReference && !state.orderRef) {
    errors.orderRef = `Add the ${topicConfig.referenceLabel.toLowerCase()} for this support route.`;
  }

  if (state.message.length < 20) {
    errors.message = "Add at least 20 characters so the request has enough context.";
  }

  return errors;
}

function getSupportFieldHelp(form, fieldName, formConfig) {
  const state = getSupportFormState(form);
  const topicConfig = getSupportTopicConfig(formConfig, state.topic);

  if (!topicConfig) {
    return supportFieldHelp[fieldName] ?? "";
  }

  if (fieldName === "topic") {
    return topicConfig.description;
  }

  if (fieldName === "orderRef") {
    return topicConfig.requiresReference
      ? `${topicConfig.referenceLabel} is required for this route.`
      : `${topicConfig.referenceLabel} is optional but useful for faster follow-up.`;
  }

  if (fieldName === "message") {
    return topicConfig.nextStep;
  }

  return supportFieldHelp[fieldName] ?? "";
}

function syncSupportTopicGuide(form, formConfig) {
  const state = getSupportFormState(form);
  const topicConfig = getSupportTopicConfig(formConfig, state.topic);
  const title = qs("[data-support-topic-title]", form);
  const copy = qs("[data-support-topic-copy]", form);
  const lines = qs("[data-support-topic-lines]", form);
  const orderRefLabel = qs("[data-support-orderref-label]", form);
  const orderRefField = qs('[name="orderRef"]', form);
  const messageField = qs('[name="message"]', form);

  if (!title || !copy || !lines || !orderRefLabel || !orderRefField || !messageField) {
    return;
  }

  if (!topicConfig) {
    title.textContent = defaultSupportTopicGuide.title;
    copy.textContent = defaultSupportTopicGuide.copy;
    lines.innerHTML = defaultSupportTopicGuide.lines.map((line) => `<span>${escapeHtml(line)}</span>`).join("");
    orderRefLabel.textContent = "Order or reference code";
    orderRefField.placeholder = "Optional order or promo reference";
    messageField.placeholder = "Explain what happened, what you need, and any timing details.";
    return;
  }

  title.textContent = topicConfig.followUpTitle;
  copy.textContent = topicConfig.description;
  lines.innerHTML = [
    topicConfig.nextStep,
    topicConfig.responseTarget,
    topicConfig.requiresReference ? `${topicConfig.referenceLabel} should be included before submission.` : `${topicConfig.referenceLabel} can be added if available.`
  ].map((line) => `<span>${escapeHtml(line)}</span>`).join("");
  orderRefLabel.textContent = topicConfig.referenceLabel;
  orderRefField.placeholder = topicConfig.referencePlaceholder;
  messageField.placeholder = topicConfig.messagePlaceholder;
}

function setSupportFieldState(form, fieldName, errorMessage, formConfig) {
  const field = qs(`[name="${fieldName}"]`, form);
  const message = qs(`[data-support-message="${fieldName}"]`, form);

  if (!field || !message) {
    return;
  }

  field.classList.toggle("is-invalid", Boolean(errorMessage));
  field.setAttribute("aria-invalid", String(Boolean(errorMessage)));
  message.textContent = errorMessage ?? getSupportFieldHelp(form, fieldName, formConfig);
  message.className = errorMessage ? "field-error" : "field-help";
}

function syncSupportFeedback(form, errors) {
  const feedback = qs("[data-support-feedback]", form);
  if (!feedback) {
    return;
  }

  const hasErrors = Object.keys(errors).length > 0;
  feedback.textContent = hasErrors
    ? "Review the highlighted fields before submitting the support request."
    : "Add your issue details and at least one follow-up contact route.";
  feedback.classList.toggle("is-error", hasErrors);
}

function syncSupportFormUi(form, errors, formConfig) {
  syncSupportTopicGuide(form, formConfig);
  ["fullName", "phone", "email", "topic", "orderRef", "message"].forEach((fieldName) => {
    setSupportFieldState(form, fieldName, errors[fieldName], formConfig);
  });
  syncSupportFeedback(form, errors);
}

function renderSupportSuccess(formConfig, state) {
  const topic = formConfig.topics.find((item) => item.value === state.topic);

  return `
    <div class="support-success">
      <span class="eyebrow">Request captured</span>
      <h2 class="section-heading mt-5 text-[clamp(1.9rem,3.5vw,3rem)]">Support request recorded in the demo flow.</h2>
      <p class="section-copy mt-5">A production version would now create a ticket, assign the topic route, and return a reference number for follow-up.</p>
      <div class="info-grid mt-8">
        <article class="info-card">
          <h3>Contact</h3>
          <p>${escapeHtml(state.fullName)}</p>
        </article>
        <article class="info-card">
          <h3>Topic</h3>
          <p>${escapeHtml(topic?.label ?? "Support")}</p>
        </article>
        <article class="info-card">
          <h3>Reply route</h3>
          <p>${escapeHtml(state.phone || state.email)}</p>
        </article>
        <article class="info-card">
          <h3>Next step</h3>
          <p>${escapeHtml(topic?.responseTarget ?? "Support follow-up timing will depend on the request route.")}</p>
        </article>
      </div>
      ${state.orderRef ? `<div class="detail-note mt-8"><h3>Reference shared</h3><p>${escapeHtml(state.orderRef)}</p></div>` : ""}
      ${topic ? `<div class="detail-note mt-4"><h3>${escapeHtml(topic.followUpTitle)}</h3><p>${escapeHtml(topic.nextStep)}</p></div>` : ""}
      <div class="detail-note mt-4">
        <h3>Submitted issue</h3>
        <p>${escapeHtml(state.message)}</p>
      </div>
      <div class="mt-8 flex flex-wrap gap-3">
        <a class="button-primary w-full sm:w-auto" href="${pageUrl("products")}">Continue browsing</a>
        <a class="button-secondary w-full sm:w-auto" href="mailto:${siteMeta.contact.email}">Email support directly</a>
      </div>
    </div>
  `;
}

function prefillSupportFromLookup(root, formConfig, result) {
  const form = qs("#support-request-form", root);
  if (!form || !result?.valid) {
    return;
  }

  const fullNameField = qs('[name="fullName"]', form);
  const phoneField = qs('[name="phone"]', form);
  const topicField = qs('[name="topic"]', form);
  const orderRefField = qs('[name="orderRef"]', form);
  const messageField = qs('[name="message"]', form);

  if (fullNameField && result.source === "recent-order") {
    fullNameField.value = result.fullName;
  }

  if (phoneField && result.source === "recent-order") {
    phoneField.value = result.phone;
  }

  if (topicField) {
    topicField.value = "order-status";
  }

  if (orderRefField) {
    orderRefField.value = result.reference;
  }

  if (messageField) {
    messageField.value = `Need an update on order ${result.reference}. Current lookup shows: ${result.statusLabel}.`;
  }

  syncSupportFormUi(form, {}, formConfig);
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bindSupportForm(root, formConfig) {
  const form = qs("#support-request-form", root);
  if (!form) {
    return;
  }

  let currentErrors = {};

  const validateSingleField = (fieldName) => {
    const state = getSupportFormState(form);
    const nextErrors = validateSupportForm(state, formConfig);
    if (nextErrors[fieldName]) {
      currentErrors[fieldName] = nextErrors[fieldName];
    } else {
      delete currentErrors[fieldName];
    }

    if ((fieldName === "phone" || fieldName === "email") && !nextErrors.phone && !nextErrors.email) {
      delete currentErrors.phone;
      delete currentErrors.email;
    }

    syncSupportFormUi(form, currentErrors, formConfig);
  };

  form.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
      return;
    }

    if (currentErrors[target.name]) {
      validateSingleField(target.name);
      return;
    }

    if (target.name === "topic") {
      syncSupportFormUi(form, currentErrors, formConfig);
      return;
    }

    if ((target.name === "phone" || target.name === "email") && (currentErrors.phone || currentErrors.email)) {
      validateSingleField("phone");
      validateSingleField("email");
    }
  });

  form.addEventListener("focusout", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
      return;
    }

    validateSingleField(target.name);
  }, true);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const state = getSupportFormState(form);
    currentErrors = validateSupportForm(state, formConfig);

    if (Object.keys(currentErrors).length) {
      syncSupportFormUi(form, currentErrors, formConfig);
      const firstField = qs(`[name="${Object.keys(currentErrors)[0]}"]`, form);
      firstField?.focus();
      return;
    }

    const formRoot = qs("[data-support-form-root]", root);
    if (formRoot) {
      formRoot.innerHTML = renderSupportSuccess(formConfig, state);
    }
  });

  syncSupportFormUi(form, currentErrors, formConfig);
}

function bindOrderLookup(root, lookupConfig, formConfig) {
  const lookupRoot = qs("[data-order-lookup-root]", root);
  const form = qs("#order-status-lookup-form", lookupRoot);
  const input = qs('[name="orderRef"]', lookupRoot);
  const feedback = qs("[data-order-lookup-feedback]", lookupRoot);
  const resultRoot = qs("[data-order-lookup-result]", lookupRoot);

  if (!lookupRoot || !form || !input || !feedback || !resultRoot) {
    return;
  }

  const renderLookup = (reference) => {
    const normalizedReference = normalizeOrderReference(reference);

    if (!normalizedReference) {
      const recentOrder = getRecentOrder();
      feedback.textContent = recentOrder ? `Latest demo order stored in this browser: ${recentOrder.reference}.` : lookupConfig.emptyState;
      feedback.classList.remove("is-error");
      resultRoot.innerHTML = "";
      return;
    }

    const result = buildLookupResult(normalizedReference, getRecentOrder());
    resultRoot.innerHTML = renderLookupResult(result, lookupConfig);

    if (!result.valid) {
      feedback.textContent = lookupConfig.invalidState;
      feedback.classList.add("is-error");
      return;
    }

    feedback.textContent = result.source === "recent-order"
      ? "Loaded the latest demo order saved in this browser."
      : "No exact local order was found, so this status is inferred from the mock reference pattern.";
    feedback.classList.remove("is-error");
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderLookup(input.value);
  });

  lookupRoot.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.closest("[data-use-recent-order]")) {
      const recentOrder = getRecentOrder();
      if (!recentOrder?.reference) {
        return;
      }

      input.value = recentOrder.reference;
      renderLookup(recentOrder.reference);
      return;
    }

    const supportTrigger = target.closest("[data-prefill-support-reference]");
    if (supportTrigger instanceof HTMLElement) {
      const result = buildLookupResult(supportTrigger.dataset.prefillSupportReference ?? "", getRecentOrder());
      prefillSupportFromLookup(root, formConfig, result);
    }
  });
}

bootPage({
  pageKey,
  title: content.title,
  render(root) {
    const quickLinks = [
      { label: "About", href: pageUrl("about"), key: "about" },
      { label: "Help", href: pageUrl("help"), key: "help" },
      { label: "Privacy", href: pageUrl("privacy"), key: "privacy" },
      { label: "Terms", href: pageUrl("terms"), key: "terms" },
      { label: "Returns", href: pageUrl("returns"), key: "returns" }
    ].filter((link) => link.key !== pageKey);

    root.innerHTML = `
      <section class="py-8 md:py-12">
        <div class="container-shell space-y-8 px-4">
          <div class="support-hero surface-card p-6 md:p-8">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div class="max-w-3xl">
                <span class="eyebrow">${content.eyebrow}</span>
                <h1 class="section-heading mt-5">${content.title}</h1>
                <p class="section-copy mt-5">${content.intro}</p>
              </div>
              <div class="support-links">
                ${quickLinks.map((link) => `<a class="summary-pill" href="${link.href}">${link.label}</a>`).join("")}
              </div>
            </div>
          </div>
          ${content.highlights?.length ? `
            <div class="info-grid">
              ${content.highlights.map((item) => `<article class="info-card"><h3>${item.title}</h3><p>${item.copy}</p></article>`).join("")}
            </div>
          ` : ""}
          <div class="support-layout">
            <article class="surface-card policy-copy p-6 md:p-8">
              ${content.sections.map(renderSection).join("")}
            </article>
            <aside class="support-sidebar stack-md">
              ${content.sidebarCards?.map(renderSidebarCard).join("") ?? ""}
              <article class="support-card">
                <h3>Shared contact</h3>
                <p>These support routes are already reflected in the footer and can be reused across future help-center pages.</p>
                <div class="support-card-list">
                  <span>${siteMeta.contact.phone}</span>
                  <span>${siteMeta.contact.email}</span>
                  <span>${siteMeta.contact.address}</span>
                </div>
              </article>
            </aside>
          </div>
          ${content.faq?.length ? `
            <section class="surface-card p-6 md:p-8">
              <span class="eyebrow">Common questions</span>
              <h2 class="section-heading mt-5 text-[clamp(1.9rem,3.5vw,3rem)]">Support content should answer the next obvious question.</h2>
              <div class="faq-list mt-8">
                ${content.faq.map(renderFaqItem).join("")}
              </div>
            </section>
          ` : ""}
          ${pageKey === "help" ? renderHelpOperationsGuide() : ""}
          ${pageKey === "help" && content.orderLookup ? renderOrderLookupPanel(content.orderLookup) : ""}
          ${content.contactForm ? renderSupportForm(content.contactForm) : ""}
          ${content.callout ? `
            <section class="support-cta surface-card p-6 md:p-8">
              <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div class="max-w-2xl">
                  <span class="eyebrow">Next route</span>
                  <h2 class="section-heading mt-5 text-[clamp(1.9rem,3.5vw,3rem)]">${content.callout.title}</h2>
                  <p class="section-copy mt-5">${content.callout.copy}</p>
                </div>
                <a class="button-primary w-full sm:w-auto" href="${pageUrl(content.callout.actionKey)}">${content.callout.actionLabel}</a>
              </div>
            </section>
          ` : ""}
        </div>
      </section>
    `;

    if (content.contactForm) {
      bindSupportForm(root, content.contactForm);
    }

    if (pageKey === "help" && content.orderLookup && content.contactForm) {
      bindOrderLookup(root, content.orderLookup, content.contactForm);
    }
  }
});