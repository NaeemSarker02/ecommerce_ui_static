import { renderMediaPanel, renderProductCard } from "@/components/cards";
import { categories } from "@/data/site";
import { clamp, qs } from "@/scripts/lib/dom";
import { formatDiscount, formatPrice } from "@/scripts/lib/format";
import { pageUrl } from "@/scripts/lib/router";

const galleryViews = [
  { label: "Hero view", stamp: "Primary frame", artworkClass: "media-artwork--hero" },
  { label: "Material focus", stamp: "Texture read", artworkClass: "media-artwork--detail" },
  { label: "Style preview", stamp: "Fit note", artworkClass: "media-artwork--fit" }
];

function gallerySpecs(product, category) {
  return [
    category?.name ?? "Northstar Supply",
    product.colors?.[0] ?? "Core",
    `${product.sizes?.length ?? 1} selectable size${(product.sizes?.length ?? 1) > 1 ? "s" : ""}`
  ];
}

function buildHighlights(product, category) {
  return [
    `${product.profile.styling}`,
    `${product.care.summary}`,
    `${product.availability.note} The same availability state is reused across the card, cart, and PDP for the ${category?.name ?? "collection"} lane.`
  ];
}

function buildProductProfile(product, category) {
  const profileData = product.profile;
  const sizeGuide = profileData.sizeGuide;

  return {
    rating: profileData.rating,
    reviews: profileData.reviews,
    metaCards: [
      {
        label: "Fit profile",
        value: profileData.fit,
        copy: product.shortDescription
      },
      {
        label: "Material direction",
        value: profileData.material,
        copy: profileData.styling
      },
      {
        label: "Dispatch note",
        value: product.shipping.dispatchLabel,
        copy: product.shipping.note
      }
    ],
    sizeGuide,
    tabs: [
      {
        id: "overview",
        label: "Overview",
        title: "Why this piece works",
        copy: `${profileData.overview} The structure stays aligned with the ${category?.name ?? "Northstar Supply"} lane, so the PDP reads like an actual merchandised product page instead of a generic placeholder.`,
        bullets: [
          `Lead color: ${product.colors[0]} for the main presentation and card treatment.`,
          `${product.availability.label} availability is already reflected in shared catalog and cart states.`,
          profileData.support
        ]
      },
      {
        id: "fit-fabric",
        label: "Fit & fabric",
        title: "Construction and wear notes",
        copy: `${profileData.material} keeps the page grounded in something more specific than sale price and CTA buttons alone.`,
        bullets: [
          `Fit direction: ${profileData.fit}.`,
          `Available sizes: ${product.sizes.join(", ")}.`,
          `Care baseline: ${product.care.summary}`
        ]
      },
      {
        id: "delivery-care",
        label: "Delivery & care",
        title: "After-purchase guidance",
        copy: `The storefront now carries more realistic operational detail, which helps future backend and support integration land on a clearer UI structure.`,
        bullets: [
          `Dispatch expectation: ${product.shipping.note}`,
          `Delivery timing: ${product.shipping.deliveryNote}`,
          `Size guidance: ${sizeGuide}`,
          profileData.support
        ]
      }
    ]
  };
}

function renderDetailTabs(profile, activeTabId) {
  const activeTab = profile.tabs.find((tab) => tab.id === activeTabId) ?? profile.tabs[0];

  return `
    <div class="stack-md" data-detail-tabs-root>
      <div class="detail-tab-row" role="tablist" aria-label="Product details">
        ${profile.tabs
          .map(
            (tab) => `
              <button class="detail-tab-button ${tab.id === activeTab.id ? "is-active" : ""}" type="button" role="tab" aria-selected="${tab.id === activeTab.id}" aria-controls="detail-panel-${tab.id}" data-detail-tab="${tab.id}">
                ${tab.label}
              </button>
            `
          )
          .join("")}
      </div>
      <article class="detail-panel" id="detail-panel-${activeTab.id}" role="tabpanel">
        <p class="text-accent text-sm font-extrabold uppercase tracking-[0.14em]">${activeTab.label}</p>
        <h3 class="mt-3 text-2xl font-black tracking-tight">${activeTab.title}</h3>
        <p class="text-muted mt-4 text-sm leading-7">${activeTab.copy}</p>
        <div class="detail-panel-list mt-5">
          ${activeTab.bullets.map((item) => `<div class="detail-list-item"><p class="text-muted">${item}</p></div>`).join("")}
        </div>
      </article>
    </div>
  `;
}

function renderGallery(product, activeIndex = 0) {
  const activeView = galleryViews[activeIndex] ?? galleryViews[0];
  const category = categories.find((entry) => entry.slug === product.category);

  return `
    <div class="stack-md">
      <div data-gallery-stage>
        ${renderMediaPanel({
          title: product.name,
          kicker: activeView.label,
          theme: product.theme,
          className: "detail-media",
          details: gallerySpecs(product, category),
          stamp: activeView.stamp,
          imageSrc: product.media,
          imageAlt: `${product.name} ${activeView.label}`,
          artworkClass: activeView.artworkClass,
          body: product.description,
          titleTag: "h2",
          imageLoading: "eager"
        })}
      </div>
      <div class="grid grid-cols-3 gap-3">
        ${galleryViews
          .map(
            (view, index) => `
              <button class="detail-thumb-button ${index === activeIndex ? "is-active" : ""}" type="button" aria-label="Show ${view.label.toLowerCase()}" aria-pressed="${index === activeIndex}" data-gallery-index="${index}">
                ${renderMediaPanel({
                  title: view.label,
                  kicker: `0${index + 1}`,
                  theme: product.theme,
                  className: "detail-thumb",
                  stamp: view.stamp,
                  imageSrc: product.media,
                  imageAlt: `${product.name} ${view.label}`,
                  artworkClass: view.artworkClass
                })}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

export function mountProductDetail(root, product, relatedProducts) {
  const category = categories.find((entry) => entry.slug === product.category);
  const discount = product.badge ?? formatDiscount(product.price, product.originalPrice);
  const profile = buildProductProfile(product, category);
  let activeGalleryIndex = 0;
  let activeDetailTab = profile.tabs[0].id;
  let quantity = 1;
  let selectedSize = product.sizes[0];
  let selectedColor = product.colors[0];
  const highlights = buildHighlights(product, category);

  root.innerHTML = `
    <section class="py-8 md:py-12">
      <div class="container-shell space-y-8 px-4">
        <nav class="text-sm font-semibold text-(--color-ink-soft)">
          <a href="${pageUrl("home")}">Home</a>
          <span class="mx-2">/</span>
          <a href="${pageUrl("products")}">Products</a>
          <span class="mx-2">/</span>
          <a href="${pageUrl("category", { category: product.category })}">${category?.name ?? "Collection"}</a>
        </nav>
        <div class="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
          <div id="product-gallery">${renderGallery(product)}</div>
          <div class="surface-card p-6 md:p-8" data-purchase-scope>
            <div class="stack-lg">
              <div>
                <span class="eyebrow">${category?.name ?? "Collection"}</span>
                <div class="mt-5 flex flex-wrap items-center gap-3">
                  <span class="summary-pill">${profile.rating} / 5 rating</span>
                  <span class="summary-pill">${profile.reviews} demo reviews</span>
                  <span class="summary-pill">${product.availability.label}</span>
                </div>
                <h1 class="mt-5 text-4xl font-black tracking-tight md:text-5xl">${product.name}</h1>
                <p class="text-muted mt-4 max-w-2xl text-base leading-8">${product.description}</p>
              </div>
              <div class="flex flex-wrap gap-2">
                ${discount ? `<span class="badge-chip badge-sale">${discount}</span>` : ""}
                <span class="badge-chip badge-stock">${product.availability.label}</span>
              </div>
              <div class="flex items-end gap-4">
                <p class="text-3xl font-black tracking-tight">${formatPrice(product.price)}</p>
                ${product.originalPrice ? `<p class="text-muted pb-1 text-base font-semibold line-through">${formatPrice(product.originalPrice)}</p>` : ""}
              </div>
              <div class="stack-sm">
                <span class="field-label">Available sizes</span>
                <div class="flex flex-wrap gap-3">
                  ${product.sizes.map((size) => `<button class="option-chip ${size === selectedSize ? "is-active" : ""}" type="button" aria-pressed="${size === selectedSize}" data-size-option="${size}">${size}</button>`).join("")}
                </div>
              </div>
              <div class="stack-sm">
                <span class="field-label">Colorway</span>
                <div class="flex flex-wrap gap-3">
                  ${product.colors.map((color) => `<button class="option-chip ${color === selectedColor ? "is-active" : ""}" type="button" aria-pressed="${color === selectedColor}" data-color-option="${color}">${color}</button>`).join("")}
                </div>
                <p class="text-muted text-sm">Selected combination: <span class="font-extrabold text-black" aria-live="polite" data-selected-summary>${selectedSize} / ${selectedColor}</span></p>
              </div>
              <div class="flex flex-wrap items-center gap-4">
                <div class="quantity-control">
                  <button type="button" data-quantity-change="decrease">-</button>
                  <span data-quantity-value>1</span>
                  <button type="button" data-quantity-change="increase">+</button>
                </div>
                <div class="grid min-w-[18rem] flex-1 gap-3 sm:grid-cols-2">
                  <button class="button-primary w-full" type="button" data-add-to-cart="${product.id}">Add to cart</button>
                  <button class="button-secondary w-full" type="button" data-buy-now="${product.id}">Buy now</button>
                </div>
              </div>
              <div class="detail-note-grid md:grid-cols-3">
                ${profile.metaCards
                  .map(
                    (card) => `
                      <div class="detail-note">
                        <h3>${card.label}</h3>
                        <p><strong class="text-black">${card.value}</strong><br />${card.copy}</p>
                      </div>
                    `
                  )
                  .join("")}
              </div>
              <div class="detail-note-grid md:grid-cols-2">
                <div class="detail-note">
                  <h3>Size guidance</h3>
                  <p>${profile.sizeGuide}</p>
                </div>
                <div class="detail-note">
                  <h3>Checkout readiness</h3>
                  <p>${product.shipping.deliveryNote} Promo carryover, shipping logic, and field validation already extend from cart through checkout for this item.</p>
                </div>
              </div>
              ${renderDetailTabs(profile, activeDetailTab)}
              <div class="detail-list">
                ${highlights.map((item) => `<div class="detail-list-item"><p class="text-muted">${item}</p></div>`).join("")}
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-6">
          <div>
            <p class="text-accent text-sm font-extrabold uppercase tracking-[0.16em]">Related picks</p>
            <h2 class="mt-3 text-3xl font-black tracking-tight">Keep the same energy across the outfit.</h2>
          </div>
          <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            ${relatedProducts.map(renderProductCard).join("")}
          </div>
        </div>
      </div>
    </section>
  `;

  root.addEventListener("click", (event) => {
    const galleryButton = event.target.closest("[data-gallery-index]");
    const detailTabButton = event.target.closest("[data-detail-tab]");
    const quantityButton = event.target.closest("[data-quantity-change]");
    const sizeButton = event.target.closest("[data-size-option]");
    const colorButton = event.target.closest("[data-color-option]");

    if (galleryButton) {
      activeGalleryIndex = Number(galleryButton.dataset.galleryIndex);
      qs("#product-gallery", root).innerHTML = renderGallery(product, activeGalleryIndex);
      return;
    }

    if (detailTabButton) {
      activeDetailTab = detailTabButton.dataset.detailTab;
      const tabsRoot = qs("[data-detail-tabs-root]", root);
      if (tabsRoot) {
        tabsRoot.outerHTML = renderDetailTabs(profile, activeDetailTab);
      }
      return;
    }

    if (quantityButton) {
      quantity = quantityButton.dataset.quantityChange === "increase"
        ? quantity + 1
        : clamp(quantity - 1, 1, 99);

      const quantityNode = qs("[data-quantity-value]", root);
      if (quantityNode) {
        quantityNode.textContent = String(quantity);
      }
    }

    if (sizeButton) {
      selectedSize = sizeButton.dataset.sizeOption;
      root.querySelectorAll("[data-size-option]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.sizeOption === selectedSize);
        button.setAttribute("aria-pressed", String(button.dataset.sizeOption === selectedSize));
      });
      const summary = qs("[data-selected-summary]", root);
      if (summary) {
        summary.textContent = `${selectedSize} / ${selectedColor}`;
      }
    }

    if (colorButton) {
      selectedColor = colorButton.dataset.colorOption;
      root.querySelectorAll("[data-color-option]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.colorOption === selectedColor);
        button.setAttribute("aria-pressed", String(button.dataset.colorOption === selectedColor));
      });
      const summary = qs("[data-selected-summary]", root);
      if (summary) {
        summary.textContent = `${selectedSize} / ${selectedColor}`;
      }
    }
  });
}