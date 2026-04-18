import { categories } from "@/data/site";
import { escapeHtml } from "@/scripts/lib/dom";
import { formatDiscount, formatPrice } from "@/scripts/lib/format";
import { pageUrl } from "@/scripts/lib/router";

export function renderMediaPanel({
  title,
  kicker,
  theme,
  className,
  details = [],
  stamp = "Northstar",
  imageSrc = "",
  imageAlt = "",
  artworkClass = "",
  body = "",
  titleTag = "h3",
  imageLoading = "lazy"
}) {
  const headingTag = titleTag === "h2" ? "h2" : "h3";

  return `
    <div class="media-panel ${imageSrc ? "has-artwork" : ""} theme-${escapeHtml(theme)} ${className} flex flex-col">
      ${
        imageSrc
          ? `
            <div class="media-artwork-wrap" aria-hidden="true">
              <img class="media-artwork ${escapeHtml(artworkClass)}" src="${escapeHtml(imageSrc)}" alt="${escapeHtml(imageAlt)}" loading="${escapeHtml(imageLoading)}" decoding="async" />
            </div>
          `
          : ""
      }
      <div class="flex items-start justify-between gap-4">
        <span class="media-kicker">${escapeHtml(kicker)}</span>
        <span class="media-stamp">${escapeHtml(stamp)}</span>
      </div>
      <div class="media-specs mt-6">
        ${details.map((detail) => `<span class="media-spec">${escapeHtml(detail)}</span>`).join("")}
      </div>
      ${body ? `<p class="media-copy">${escapeHtml(body)}</p>` : ""}
      <${headingTag} class="media-title">${escapeHtml(title)}</${headingTag}>
    </div>
  `;
}

function buildCategoryDetails(category) {
  return [category.kicker, `${category.name.split(" ").length} block layout`];
}

function buildProductDetails(product, category) {
  const primaryColor = product.colors?.[0] ?? "Core";
  const sizeCount = product.sizes?.length ?? 1;

  return [
    category?.name ?? "Northstar Supply",
    primaryColor,
    `${sizeCount} size${sizeCount > 1 ? "s" : ""}`
  ];
}

export function renderCategoryCard(category) {
  return `
    <a class="category-card surface-card block overflow-hidden p-3" href="${pageUrl("category", { category: category.slug })}">
      ${renderMediaPanel({
        title: category.name,
        kicker: category.kicker,
        theme: category.theme,
        className: "category-media",
        details: buildCategoryDetails(category),
        stamp: "Category",
        imageSrc: category.media,
        imageAlt: category.name
      })}
      <div class="px-2 pb-3 pt-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-accent text-sm font-extrabold uppercase tracking-[0.18em]">${escapeHtml(category.kicker)}</p>
            <h3 class="mt-2 text-xl font-extrabold tracking-tight">${escapeHtml(category.name)}</h3>
          </div>
          <span class="text-muted text-sm font-extrabold uppercase tracking-[0.16em]">Open</span>
        </div>
        <p class="text-muted mt-3 text-sm leading-7">${escapeHtml(category.description)}</p>
      </div>
    </a>
  `;
}

export function renderProductCard(product) {
  const category = categories.find((item) => item.slug === product.category);
  const discount = product.badge ?? formatDiscount(product.price, product.originalPrice);
  const productUrl = pageUrl("product", { product: product.slug });
  const availability = product.availability ?? { label: product.stock, status: "in-stock" };

  return `
    <article class="product-card surface-card overflow-hidden p-3">
      <a class="block" href="${productUrl}" aria-label="View ${escapeHtml(product.name)}">
        ${renderMediaPanel({
          title: product.name,
          kicker: category?.name ?? "Northstar Supply",
          theme: product.theme,
          className: "product-media",
          details: buildProductDetails(product, category),
          stamp: availability.status === "low-stock" ? "Low stock" : "New drop",
          imageSrc: product.media,
          imageAlt: product.name
        })}
      </a>
      <div class="flex flex-wrap gap-2 px-2 pt-4">
        ${discount ? `<span class="badge-chip badge-sale">${escapeHtml(discount)}</span>` : ""}
        <span class="badge-chip badge-stock">${escapeHtml(availability.label)}</span>
        <span class="badge-chip badge-neutral">${escapeHtml(product.colors?.[0] ?? "Core")}</span>
      </div>
      <div class="stack-md px-2 pb-3 pt-4">
        <div>
          <a class="block" href="${productUrl}">
            <h3 class="text-xl font-extrabold tracking-tight">${escapeHtml(product.name)}</h3>
          </a>
          <p class="text-muted mt-2 text-sm leading-7">${escapeHtml(product.shortDescription)}</p>
        </div>
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="text-lg font-black tracking-tight">${formatPrice(product.price)}</p>
            ${product.originalPrice ? `<p class="text-muted text-sm font-semibold line-through">${formatPrice(product.originalPrice)}</p>` : ""}
          </div>
          <a class="text-accent text-sm font-extrabold uppercase tracking-[0.14em]" href="${productUrl}">Details</a>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button class="button-primary w-full" type="button" data-add-to-cart="${product.id}">Add to cart</button>
          <button class="button-secondary w-full" type="button" data-buy-now="${product.id}">Buy now</button>
        </div>
      </div>
    </article>
  `;
}

export function renderProductGrid(items) {
  return items.length
    ? `<div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">${items.map(renderProductCard).join("")}</div>`
    : `
      <div class="surface-card p-8 text-center">
        <p class="text-accent text-sm font-extrabold uppercase tracking-[0.16em]">No matching items</p>
        <h3 class="mt-4 text-2xl font-extrabold tracking-tight">Adjust your filters and try another combination.</h3>
        <p class="text-muted mx-auto mt-3 max-w-xl text-sm leading-7">
          The product system is data-driven, so search, category filters, and price ranges all update this grid from one source.
        </p>
      </div>
    `;
}