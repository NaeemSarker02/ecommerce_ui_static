import { renderCategoryCard, renderMediaPanel, renderProductCard } from "@/components/cards";
import { categories, products, siteMeta } from "@/data/site";
import { pageUrl } from "@/scripts/lib/router";
import { bootPage } from "@/scripts/main";

const featuredProducts = products.filter((product) => product.featured).slice(0, 8);
const heroProduct = featuredProducts[0] ?? products[0];
const spotlightGroups = categories.map((category) => ({
  category,
  items: products.filter((product) => product.category === category.slug).slice(0, 4)
})).filter(({ items }) => items.length);

function renderLaneHeader(category) {
  return `
    <div class="lane-header-card overflow-hidden p-4 md:p-5">
      <div class="lane-header-media">
        ${renderMediaPanel({
          title: category.name,
          kicker: category.kicker,
          theme: category.theme,
          className: "lane-media min-h-[14rem] p-5 md:min-h-[16rem]",
          details: ["View all", category.description],
          stamp: "Collection",
          imageSrc: category.media,
          imageAlt: category.name,
          titleTag: "h2"
        })}
      </div>
    </div>
  `;
}

bootPage({
  pageKey: "home",
  title: "Northstar Supply",
  render(root) {
    root.innerHTML = `
      <section class="py-6 md:py-10">
        <div class="container-shell space-y-10 px-4">
          <div class="hero-grid">
            <section class="hero-stage overflow-hidden px-6 py-8 md:px-10 md:py-12">
              <div class="relative z-10 max-w-3xl">
                <span class="eyebrow border-white/20 text-white">New arrivals</span>
                <h1 class="section-heading mt-6 max-w-3xl text-white">${heroProduct.name}</h1>
                <p class="mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg">${heroProduct.shortDescription} ${siteMeta.announcement}</p>
                <div class="mt-8 flex flex-wrap gap-3">
                  <a class="button-primary" href="${pageUrl("product", { product: heroProduct.slug })}">Buy now</a>
                  <a class="button-secondary border-white text-white" href="#categories">Shop by category</a>
                </div>
                <div class="mt-8 grid gap-3 sm:grid-cols-3">
                  <article class="metric-tile bg-white/10 text-white backdrop-blur-sm">
                    <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-white/70">Price</p>
                    <p class="mt-3 text-2xl font-black tracking-tight">BDT ${heroProduct.price}</p>
                  </article>
                  <article class="metric-tile bg-white/10 text-white backdrop-blur-sm">
                    <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-white/70">Category</p>
                    <p class="mt-3 text-2xl font-black tracking-tight">${categories.find((item) => item.slug === heroProduct.category)?.name ?? "Featured"}</p>
                  </article>
                  <article class="metric-tile bg-white/10 text-white backdrop-blur-sm">
                    <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-white/70">Status</p>
                    <p class="mt-3 text-2xl font-black tracking-tight">${heroProduct.availability?.label ?? heroProduct.stock}</p>
                  </article>
                </div>
              </div>
            </section>
            <aside class="grid gap-4">
              <article class="hero-card p-6">
                <p class="text-accent text-xs font-extrabold uppercase tracking-[0.16em]">Category list</p>
                <h2 class="mt-3 text-3xl font-black tracking-tight">Browse the store by section.</h2>
                <div class="mt-5 grid gap-3">
                  ${categories
                    .map(
                      (category) => `
                        <a class="nav-link" href="${pageUrl("category", { category: category.slug })}">${category.name}</a>
                      `
                    )
                    .join("")}
                </div>
              </article>
              <article class="hero-card p-5">
                <p class="text-accent text-sm font-extrabold uppercase tracking-[0.16em]">Order note</p>
                <p class="text-muted mt-3 text-sm leading-7">You will receive a confirmation call after placing your order. Shipping, support, and order-status lookup are already connected through the demo storefront flow.</p>
              </article>
              <article class="hero-card p-5">
                <p class="text-accent text-sm font-extrabold uppercase tracking-[0.16em]">Quick access</p>
                <div class="mt-4 grid gap-3">
                  <a class="button-ghost w-full" href="${pageUrl("products")}">All products</a>
                  <a class="button-ghost w-full" href="${pageUrl("help")}">Help center</a>
                </div>
              </article>
            </aside>
          </div>

          <section id="categories" class="space-y-6">
            <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span class="eyebrow">Shop by category</span>
                <h2 class="section-heading mt-5">Shop through the main storefront categories.</h2>
              </div>
              <a class="button-ghost w-fit" href="${pageUrl("products")}">View all</a>
            </div>
            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              ${categories.map(renderCategoryCard).join("")}
            </div>
          </section>

          <section class="space-y-6">
            <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span class="eyebrow">Featured products</span>
                <h2 class="section-heading mt-5">Featured products</h2>
              </div>
              <a class="button-ghost w-fit" href="${pageUrl("products")}">View all</a>
            </div>
            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              ${featuredProducts.map(renderProductCard).join("")}
            </div>
          </section>

          <section class="space-y-6">
            ${spotlightGroups
              .map(
                ({ category, items }) => `
                  <article class="space-y-5">
                    <div class="flex items-center justify-between gap-4">
                      <div>
                        <span class="eyebrow">${category.name}</span>
                        <h2 class="section-heading mt-5">${category.name}</h2>
                      </div>
                      <a class="button-ghost w-fit" href="${pageUrl("category", { category: category.slug })}">View all</a>
                    </div>
                    ${renderLaneHeader(category)}
                    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      ${items.map(renderProductCard).join("")}
                    </div>
                  </article>
                `
              )
              .join("")}
          </section>
        </div>
      </section>
    `;
  }
});