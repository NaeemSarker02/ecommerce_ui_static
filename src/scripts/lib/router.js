const base = import.meta.env.BASE_URL ?? "/";

const routeMap = {
  home: "",
  products: "pages/products.html",
  category: "pages/category.html",
  product: "pages/product.html",
  cart: "pages/cart.html",
  checkout: "pages/checkout.html",
  about: "pages/about.html",
  help: "pages/help.html",
  privacy: "pages/privacy.html",
  terms: "pages/terms.html",
  returns: "pages/returns.html"
};

function normalizePath(routeKey) {
  const prefix = base.endsWith("/") ? base : `${base}/`;
  const suffix = routeMap[routeKey] ?? "";
  return `${prefix}${suffix}`.replace(/([^:]\/)\/+?/g, "$1");
}

export function pageUrl(routeKey, params = {}) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  }

  const query = searchParams.toString();
  return query ? `${normalizePath(routeKey)}?${query}` : normalizePath(routeKey);
}

export function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}