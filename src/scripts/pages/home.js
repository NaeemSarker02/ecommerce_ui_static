import { renderCategoryCard, renderProductCard } from "@/components/cards";
import { categories, products, siteMeta } from "@/data/site";
import { pageUrl } from "@/scripts/lib/router";
import { bootPage } from "@/scripts/main";

const featuredProducts = products.filter((product) => product.featured);
const spotlightGroups = categories.map((category) => ({
  category,
  items: products.filter((product) => product.category === category.slug).slice(0, 3)
}));

bootPage({
  pageKey: "home",
  title: "Northstar Supply",
  render(root) {
    const heroMetrics = [
      { value: `${categories.length}`, label: "Category lanes" },
      { value: `${featuredProducts.length}`, label: "Featured products" },
      { value: "0", label: "Frameworks used" }
    ];

    root.innerHTML = `
      <section class="py-6 md:py-10">
        <div class="container-shell space-y-10 px-4">
          <div class="hero-grid">
            <section class="hero-stage overflow-hidden px-6 py-8 md:px-10 md:py-12">
              <div class="relative z-10 max-w-3xl">
                <span class="eyebrow border-white/20 text-white">Streetwear storefront system</span>
                <h1 class="section-heading mt-6 max-w-3xl text-white">A Leon-inspired ecommerce UI, rebuilt as a maintainable vanilla stack.</h1>
                <p class="mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg">${siteMeta.tagline} This first implementation pass focuses on reusable structure, strong visual hierarchy, and clean handoff points for future backend integration.</p>
                <div class="mt-8 flex flex-wrap gap-3">
                  <a class="button-primary" href="${pageUrl("products")}">Browse products</a>
                  <a class="button-secondary border-white text-white" href="#categories">Shop by category</a>
                </div>
                <div class="mt-8 grid gap-3 sm:grid-cols-3">
                  ${heroMetrics
                    .map(
                      (item) => `
                        <article class="metric-tile bg-white/10 text-white backdrop-blur-sm">
                          <p class="text-3xl font-black tracking-tight">${item.value}</p>
                          <p class="mt-2 text-xs font-extrabold uppercase tracking-[0.16em] text-white/70">${item.label}</p>
                        </article>
                      `
                    )
                    .join("")}
                </div>
              </div>
            </section>
            <aside class="grid gap-4">
              <article class="hero-card p-6">
                <p class="text-accent text-xs font-extrabold uppercase tracking-[0.16em]">Build direction</p>
                <h2 class="mt-3 text-3xl font-black tracking-tight">Framework-free, data-driven, and ready to extend.</h2>
                <p class="text-muted mt-4 text-sm leading-7">Shared shell components, stateful cart behavior, and page-specific rendering keep the codebase maintainable without introducing a frontend framework.</p>
              </article>
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                ${siteMeta.trustHighlights
                  .map(
                    (item) => `
                      <article class="hero-card p-5">
                        <p class="text-accent text-sm font-extrabold uppercase tracking-[0.16em]">${item.title}</p>
                        <p class="text-muted mt-3 text-sm leading-7">${item.copy}</p>
                      </article>
                    `
                  )
                  .join("")}
              </div>
            </aside>
          </div>

          <section class="editorial-band p-6 md:p-8">
            <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span class="eyebrow">Collection notes</span>
                <h2 class="section-heading mt-5">Three principles behind this storefront build.</h2>
              </div>
              <p class="text-muted max-w-2xl text-sm leading-7">The UI follows the reference site’s section rhythm, but the implementation is cleaned up into reusable modules and a clearer visual system.</p>
            </div>
            <div class="editorial-grid mt-8">
              <article class="hero-card p-5">
                <p class="text-accent text-xs font-extrabold uppercase tracking-[0.16em]">Merchandising</p>
                <h3 class="mt-3 text-2xl font-black tracking-tight">Category-first discovery keeps the homepage usable.</h3>
                <p class="text-muted mt-3 text-sm leading-7">Instead of burying products in one endless grid, category blocks break the catalog into digestible lanes.</p>
              </article>
              <article class="hero-card p-5">
                <p class="text-accent text-xs font-extrabold uppercase tracking-[0.16em]">Maintainability</p>
                <h3 class="mt-3 text-2xl font-black tracking-tight">Shared components reduce future editing risk.</h3>
                <p class="text-muted mt-3 text-sm leading-7">Cards, shell, browse UI, and product detail sections are rendered from shared functions so visual changes stay centralized.</p>
              </article>
              <article class="hero-card p-5">
                <p class="text-accent text-xs font-extrabold uppercase tracking-[0.16em]">Commerce flow</p>
                <h3 class="mt-3 text-2xl font-black tracking-tight">Cart and checkout are already wired for a backend later.</h3>
                <p class="text-muted mt-3 text-sm leading-7">Even as a UI-only build, the cart, checkout summary, and policy structure are shaped for later data integration.</p>
              </article>
            </div>
          </section>

          <section id="categories" class="space-y-6">
            <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span class="eyebrow">Shop by category</span>
                <h2 class="section-heading mt-5">Category-led browsing like the reference site, but cleaner.</h2>
              </div>
              <a class="button-ghost w-fit" href="${pageUrl("products")}">View full catalog</a>
            </div>
            <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              ${categories.map(renderCategoryCard).join("")}
            </div>
          </section>

          <section class="space-y-6">
            <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span class="eyebrow">Featured products</span>
                <h2 class="section-heading mt-5">High-intent product cards with sale states and quick actions.</h2>
              </div>
              <a class="button-ghost w-fit" href="${pageUrl("products")}">See everything</a>
            </div>
            <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              ${featuredProducts.map(renderProductCard).join("")}
            </div>
          </section>

          <section class="space-y-6">
            ${spotlightGroups
              .map(
                ({ category, items }) => `
                  <article class="spotlight-band overflow-hidden p-6 md:p-8">
                    <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                      <div class="max-w-xl">
                        <span class="eyebrow border-white/15 text-white">${category.kicker}</span>
                        <h2 class="mt-5 text-4xl font-black tracking-tight text-white">${category.name}</h2>
                        <p class="mt-4 text-sm leading-7 text-white/70">${category.description}</p>
                      </div>
                      <a class="button-secondary border-white text-white w-fit" href="${pageUrl("category", { category: category.slug })}">View collection</a>
                    </div>
                    <div class="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      ${items.map(renderProductCard).join("")}
                    </div>
                  </article>
                `
              )
              .join("")}
          </section>

          <section class="trust-band surface-card p-6 md:p-8">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span class="eyebrow">Development handoff</span>
                <h2 class="section-heading mt-5">Structure first, then polish, then real commerce integration.</h2>
              </div>
              <p class="text-muted max-w-2xl text-sm leading-7">This version is built to prove the reusable UI system. Product data, policies, payment methods, and shipping rules can be swapped in later without tearing apart the layout architecture.</p>
            </div>
          </section>
        </div>
      </section>
    `;
  }
});