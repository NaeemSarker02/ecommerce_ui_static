import { categories, products } from "@/data/site";
import { renderProductGrid } from "@/components/cards";
import { qs } from "@/scripts/lib/dom";

const priceRanges = [
  { id: "range-1", label: "BDT 0 - BDT 400", min: 0, max: 400 },
  { id: "range-2", label: "BDT 401 - BDT 800", min: 401, max: 800 },
  { id: "range-3", label: "BDT 801 - BDT 1200", min: 801, max: 1200 },
  { id: "range-4", label: "BDT 1201 - BDT 1600", min: 1201, max: 1600 },
  { id: "range-5", label: "BDT 1601+", min: 1601, max: Number.POSITIVE_INFINITY }
];

function applySorting(items, sortValue) {
  const next = [...items];

  switch (sortValue) {
    case "price-asc":
      return next.sort((left, right) => left.price - right.price);
    case "price-desc":
      return next.sort((left, right) => right.price - left.price);
    case "name-asc":
      return next.sort((left, right) => left.name.localeCompare(right.name));
    default:
      return next.sort((left, right) => Number(right.featured) - Number(left.featured) || right.id - left.id);
  }
}

function filterProducts({ search, selectedCategories, selectedPrice, lockedCategory }) {
  return products.filter((product) => {
    const matchesSearch = search
      ? `${product.name} ${product.shortDescription}`.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesCategory = lockedCategory
      ? product.category === lockedCategory
      : !selectedCategories.length || selectedCategories.includes(product.category);
    const range = priceRanges.find((item) => item.id === selectedPrice);
    const matchesPrice = range ? product.price >= range.min && product.price <= range.max : true;
    return matchesSearch && matchesCategory && matchesPrice;
  });
}

function renderFilters(state, lockedCategory) {
  const activeCategory = categories.find((category) => category.slug === lockedCategory);

  return `
    <div class="surface-card filter-panel p-5">
      <div class="stack-lg">
        <div>
          <p class="text-accent text-sm font-extrabold uppercase tracking-[0.16em]">Catalog tools</p>
          <h3 class="mt-3 text-2xl font-extrabold tracking-tight">Search, sort, and narrow quickly.</h3>
        </div>
        <label class="stack-sm block">
          <span class="field-label">Search</span>
          <input class="field-input" type="search" name="search" aria-describedby="catalog-results-summary" placeholder="Search products" value="${state.search}" />
        </label>
        <fieldset class="filter-group">
          <legend class="field-label">Category</legend>
          ${
            lockedCategory
              ? `<div class="badge-chip badge-stock w-fit">${activeCategory?.name ?? "Collection"}</div>`
              : categories
                  .map(
                    (category) => `
                      <label class="border-soft rounded-panel flex items-center gap-3 border px-4 py-3">
                        <input type="checkbox" value="${category.slug}" name="catalog-category" ${state.selectedCategories.includes(category.slug) ? "checked" : ""} />
                        <span class="font-semibold">${category.name}</span>
                      </label>
                    `
                  )
                  .join("")
          }
        </fieldset>
        <fieldset class="filter-group">
          <legend class="field-label">Price range</legend>
          ${priceRanges
            .map(
              (range) => `
                <label class="border-soft rounded-panel flex items-center gap-3 border px-4 py-3">
                  <input type="radio" value="${range.id}" name="catalog-price" ${state.selectedPrice === range.id ? "checked" : ""} />
                  <span class="font-semibold">${range.label}</span>
                </label>
              `
            )
            .join("")}
          <button class="button-ghost w-full" type="button" data-clear-filters>Clear filters</button>
        </fieldset>
      </div>
    </div>
  `;
}

function renderCategoryPills(state, lockedCategory) {
  const items = lockedCategory
    ? categories.filter((category) => category.slug === lockedCategory)
    : categories;

  return `
    <div class="chip-scroll">
      ${items
        .map((category) => {
          const isActive = lockedCategory || state.selectedCategories.includes(category.slug);
          return `<button class="option-chip ${isActive ? "is-active" : ""}" type="button" aria-pressed="${isActive}" data-category-pill="${category.slug}">${category.name}</button>`;
        })
        .join("")}
    </div>
  `;
}

function renderActiveFilters(state, lockedCategory) {
  const summaryItems = [];
  const range = priceRanges.find((item) => item.id === state.selectedPrice);

  if (lockedCategory) {
    const category = categories.find((item) => item.slug === lockedCategory);
    if (category) {
      summaryItems.push(category.name);
    }
  } else {
    summaryItems.push(...state.selectedCategories.map((slug) => categories.find((item) => item.slug === slug)?.name).filter(Boolean));
  }

  if (state.search) {
    summaryItems.push(`Search: ${state.search}`);
  }

  if (range) {
    summaryItems.push(range.label);
  }

  return summaryItems.length
    ? `
      <div class="flex flex-wrap gap-2">
        ${summaryItems.map((item) => `<span class="summary-pill">${item}</span>`).join("")}
      </div>
    `
    : `<p class="text-muted text-sm">No active filters. Browse the full seeded catalog.</p>`;
}

export function mountCatalog(root, { title, description, lockedCategory = null }) {
  const state = {
    search: "",
    selectedCategories: [],
    selectedPrice: "",
    sort: "featured"
  };

  root.innerHTML = `
    <section class="py-8 md:py-12">
      <div class="container-shell space-y-8 px-4">
        <div class="surface-card overflow-hidden p-6 md:p-8">
          <div class="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <span class="eyebrow">Catalog view</span>
              <h1 class="section-heading mt-5">${title}</h1>
              <p class="section-copy mt-5">${description}</p>
            </div>
            <div class="stat-grid">
              <div class="hero-card p-4">
                <p class="text-muted text-xs font-extrabold uppercase tracking-[0.16em]">Dataset</p>
                <p class="mt-3 text-3xl font-black tracking-tight">${products.length}</p>
                <p class="text-muted mt-1 text-sm">seeded products</p>
              </div>
              <div class="hero-card p-4">
                <p class="text-muted text-xs font-extrabold uppercase tracking-[0.16em]">Reusable</p>
                <p class="mt-3 text-3xl font-black tracking-tight">${categories.length}</p>
                <p class="text-muted mt-1 text-sm">category shells</p>
              </div>
              <div class="hero-card p-4">
                <p class="text-muted text-xs font-extrabold uppercase tracking-[0.16em]">State</p>
                <p class="mt-3 text-3xl font-black tracking-tight">JS</p>
                <p class="text-muted mt-1 text-sm">search and sort</p>
              </div>
            </div>
          </div>
        </div>
        <div class="catalog-layout">
          <div id="catalog-filters"></div>
          <div class="space-y-6">
            <div class="surface-card p-5">
              <div class="catalog-results-topbar">
                <div>
                  <p class="text-accent text-sm font-extrabold uppercase tracking-[0.16em]">Results</p>
                  <h2 class="mt-2 text-2xl font-extrabold tracking-tight"><span aria-live="polite" aria-atomic="true" data-results-count></span> items visible</h2>
                </div>
                <label class="stack-sm block md:min-w-56">
                  <span class="field-label">Sort by</span>
                  <select class="field-select" name="catalog-sort">
                    <option value="featured">Featured first</option>
                    <option value="price-asc">Price low to high</option>
                    <option value="price-desc">Price high to low</option>
                    <option value="name-asc">Name A-Z</option>
                  </select>
                </label>
              </div>
              <div class="mt-5 space-y-4">
                <p id="catalog-results-summary" class="sr-only" aria-live="polite" data-results-announce></p>
                <div id="catalog-pills"></div>
                <div id="catalog-active-filters"></div>
              </div>
            </div>
            <div id="catalog-results"></div>
          </div>
        </div>
      </div>
    </section>
  `;

  const resultsNode = qs("#catalog-results", root);
  const filtersNode = qs("#catalog-filters", root);
  const resultCountNode = qs("[data-results-count]", root);
  const pillsNode = qs("#catalog-pills", root);
  const activeFiltersNode = qs("#catalog-active-filters", root);
  const resultsAnnounceNode = qs("[data-results-announce]", root);

  function render() {
    const filtered = filterProducts({ ...state, lockedCategory });
    const sorted = applySorting(filtered, state.sort);
    filtersNode.innerHTML = renderFilters(state, lockedCategory);
    resultsNode.innerHTML = renderProductGrid(sorted);
    resultCountNode.textContent = String(sorted.length);
    pillsNode.innerHTML = renderCategoryPills(state, lockedCategory);
    activeFiltersNode.innerHTML = renderActiveFilters(state, lockedCategory);
    if (resultsAnnounceNode) {
      resultsAnnounceNode.textContent = `${sorted.length} products shown${state.search ? ` for ${state.search}` : ""}.`;
    }

    const searchInput = qs('[name="search"]', filtersNode);
    const sortSelect = qs('[name="catalog-sort"]', root);
    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        state.search = event.target.value;
        render();
      });
    }

    if (sortSelect) {
      sortSelect.value = state.sort;
      sortSelect.addEventListener("change", (event) => {
        state.sort = event.target.value;
        render();
      });
    }

    filtersNode.querySelectorAll('[name="catalog-category"]').forEach((input) => {
      input.addEventListener("change", () => {
        state.selectedCategories = [...filtersNode.querySelectorAll('[name="catalog-category"]:checked')].map((node) => node.value);
        render();
      });
    });

    filtersNode.querySelectorAll('[name="catalog-price"]').forEach((input) => {
      input.addEventListener("change", (event) => {
        state.selectedPrice = event.target.value;
        render();
      });
    });

    qs("[data-clear-filters]", filtersNode)?.addEventListener("click", () => {
      state.search = "";
      state.selectedCategories = [];
      state.selectedPrice = "";
      state.sort = "featured";
      render();
    });

    root.querySelectorAll("[data-category-pill]").forEach((button) => {
      button.addEventListener("click", () => {
        if (lockedCategory) {
          return;
        }

        const slug = button.dataset.categoryPill;
        state.selectedCategories = state.selectedCategories.includes(slug)
          ? state.selectedCategories.filter((item) => item !== slug)
          : [...state.selectedCategories, slug];
        render();
      });
    });
  }

  render();
}