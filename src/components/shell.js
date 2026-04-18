import { categories, products, siteMeta } from "@/data/site";
import { qs } from "@/scripts/lib/dom";
import { formatPrice } from "@/scripts/lib/format";
import { pageUrl } from "@/scripts/lib/router";
import { addToCart, getCart, getCartCount, removeFromCart } from "@/scripts/state/cart-state";

let lastCartTrigger = null;
let lastMenuTrigger = null;

function cartDetailItems() {
  const catalog = new Map(products.map((product) => [product.id, product]));

  return getCart()
    .map((item) => {
      const product = catalog.get(item.id);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter(Boolean);
}

function renderHeader(pageKey) {
  const activeCategory = new URLSearchParams(window.location.search).get("category");
  const navLinks = [
    { key: "home", label: "Home", href: pageUrl("home") },
    { key: "products", label: "All products", href: pageUrl("products") },
    ...categories.map((category) => ({
      key: category.slug,
      label: category.name,
      href: pageUrl("category", { category: category.slug })
    }))
  ];

  return `
    <div class="announcement-bar">
      <div class="container-shell flex items-center justify-between gap-4 px-4 py-3 text-xs font-extrabold uppercase tracking-[0.18em] sm:text-sm">
        <span>${siteMeta.announcement}</span>
        <a class="hidden sm:inline" href="${pageUrl("checkout")}">Checkout flow preview</a>
      </div>
    </div>
    <header class="site-header">
      <div class="container-shell px-4 py-4">
        <div class="flex items-center justify-between gap-4">
          <a class="brand-lockup" href="${pageUrl("home")}">${siteMeta.brandName}</a>
          <nav class="hidden items-center gap-6 xl:flex">
            ${navLinks
              .map(
                (link) =>
                  `<a class="nav-link ${pageKey === link.key || (pageKey === "category" && activeCategory === link.key) ? "is-active" : ""}" href="${link.href}">${link.label}</a>`
              )
              .join("")}
          </nav>
          <div class="flex items-center gap-3">
            <a class="button-ghost hidden sm:inline-flex" href="${pageUrl("products")}">Shop the catalog</a>
            <button class="button-secondary button-compact" type="button" aria-controls="site-cart-drawer" aria-expanded="false" aria-label="Open cart" data-open-cart>
              Cart
              <span class="cart-count-badge" aria-live="polite" data-cart-count>${getCartCount()}</span>
            </button>
            <button class="button-ghost button-compact xl:hidden" type="button" aria-controls="mobile-navigation" aria-expanded="false" aria-label="Open navigation menu" data-open-menu>Menu</button>
          </div>
        </div>
        <div id="mobile-navigation" class="bg-surface rounded-panel border-soft mt-4 hidden flex-col gap-3 border p-4 xl:hidden" hidden data-mobile-menu>
          ${navLinks.map((link) => `<a class="nav-link ${pageKey === link.key || (pageKey === "category" && activeCategory === link.key) ? "is-active" : ""}" href="${link.href}">${link.label}</a>`).join("")}
        </div>
      </div>
    </header>
  `;
}

function renderFooter() {
  return `
    <footer class="bg-surface border-soft border-t">
      <div class="container-shell grid gap-10 px-4 py-16 md:grid-cols-[1.2fr,0.9fr,0.9fr,0.9fr]">
        <div class="stack-md">
          <p class="brand-lockup">${siteMeta.brandName}</p>
          <p class="text-muted max-w-md text-sm leading-7">${siteMeta.tagline} The project is intentionally structured to scale into a real commerce build later.</p>
        </div>
        <div class="stack-sm">
          <p class="text-sm font-extrabold uppercase tracking-[0.16em]">Quick links</p>
          <a href="${pageUrl("about")}">About</a>
          <a href="${pageUrl("help")}">Help center</a>
          <a href="${pageUrl("privacy")}">Privacy policy</a>
          <a href="${pageUrl("terms")}">Terms</a>
          <a href="${pageUrl("returns")}">Returns</a>
        </div>
        <div class="stack-sm">
          <p class="text-sm font-extrabold uppercase tracking-[0.16em]">Contact</p>
          <p>${siteMeta.contact.phone}</p>
          <p>${siteMeta.contact.email}</p>
          <p>${siteMeta.contact.address}</p>
        </div>
        <div class="stack-sm">
          <p class="text-sm font-extrabold uppercase tracking-[0.16em]">Follow</p>
          ${siteMeta.socialLinks.map((link) => `<a href="${link.href}">${link.label}</a>`).join("")}
        </div>
      </div>
    </footer>
  `;
}

function renderDrawerItems() {
  const items = cartDetailItems();

  if (!items.length) {
    return `
      <div class="surface-card p-6 text-center">
        <p class="text-accent text-sm font-extrabold uppercase tracking-[0.16em]">Cart is empty</p>
        <p class="text-muted mt-3 text-sm leading-7">Add a few items from the catalog to test the persistent cart behavior.</p>
      </div>
    `;
  }

  return items
    .map(
      (item) => `
        <div class="border-soft rounded-soft flex items-center gap-4 border p-4">
          <div class="media-panel theme-${item.theme} rounded-soft flex h-24 w-20 shrink-0 flex-col p-3">
            <span class="media-kicker">${item.category}</span>
            <span class="mt-auto font-bold leading-4">${item.name}</span>
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-extrabold tracking-tight">${item.name}</p>
            <p class="text-muted mt-1 text-sm">Qty ${item.quantity}</p>
            <p class="mt-2 text-sm font-black">${formatPrice(item.price * item.quantity)}</p>
          </div>
          <button class="button-ghost button-compact shrink-0" type="button" aria-label="Remove ${item.name} from cart" data-remove-drawer-item="${item.id}">Remove</button>
        </div>
      `
    )
    .join("");
}

function drawerSubtotal() {
  return cartDetailItems().reduce((total, item) => total + item.price * item.quantity, 0);
}

function renderCartDrawer() {
  return `
    <div class="cart-backdrop" data-cart-backdrop></div>
    <aside id="site-cart-drawer" class="cart-drawer flex h-full flex-col" aria-hidden="true" aria-label="Shopping cart" aria-modal="true" role="dialog" data-cart-drawer>
      <div class="border-soft flex items-center justify-between border-b px-6 py-5">
        <div>
          <p class="text-accent text-sm font-extrabold uppercase tracking-[0.16em]">Mini cart</p>
          <h2 class="mt-2 font-display text-2xl font-black tracking-tight">Saved picks</h2>
        </div>
        <button class="button-ghost button-compact" type="button" aria-label="Close cart" data-close-cart>Close</button>
      </div>
      <div class="flex-1 space-y-4 overflow-y-auto px-6 py-6" data-cart-items>
        ${renderDrawerItems()}
      </div>
      <div class="border-soft border-t px-6 py-5">
        <div class="mb-4 flex items-center justify-between text-sm font-bold">
          <span>Subtotal</span>
          <span data-cart-subtotal>${formatPrice(drawerSubtotal())}</span>
        </div>
        <div class="grid gap-3">
          <a class="button-secondary w-full" href="${pageUrl("cart")}">View cart</a>
          <a class="button-primary w-full" href="${pageUrl("checkout")}">Go to checkout</a>
        </div>
      </div>
    </aside>
  `;
}

function setMenuState(nextState) {
  const menu = qs("[data-mobile-menu]");
  const toggle = qs("[data-open-menu]");

  if (!menu || !toggle) {
    return;
  }

  menu.classList.toggle("hidden", !nextState);
  menu.hidden = !nextState;
  toggle.setAttribute("aria-expanded", String(nextState));
  document.body.classList.toggle("menu-open", nextState);

  if (nextState) {
    lastMenuTrigger = document.activeElement;
    window.requestAnimationFrame(() => {
      menu.querySelector("a")?.focus();
    });
    return;
  }

  if (lastMenuTrigger instanceof HTMLElement) {
    lastMenuTrigger.focus();
  }
  lastMenuTrigger = null;
}

function setDrawerState(nextState) {
  const drawer = qs("[data-cart-drawer]");
  const backdrop = qs("[data-cart-backdrop]");
  const toggle = qs("[data-open-cart]");

  if (!drawer || !backdrop) {
    return;
  }

  drawer.classList.toggle("is-open", nextState);
  drawer.setAttribute("aria-hidden", String(!nextState));
  backdrop.classList.toggle("is-open", nextState);
  toggle?.setAttribute("aria-expanded", String(nextState));
  document.body.classList.toggle("drawer-open", nextState);

  if (nextState) {
    lastCartTrigger = document.activeElement;
    window.requestAnimationFrame(() => {
      qs("[data-close-cart]", drawer)?.focus();
    });
    return;
  }

  if (lastCartTrigger instanceof HTMLElement) {
    lastCartTrigger.focus();
  }
  lastCartTrigger = null;
}

function bindShellEvents() {
  qs("[data-open-cart]")?.addEventListener("click", () => setDrawerState(true));
  qs("[data-close-cart]")?.addEventListener("click", () => setDrawerState(false));
  qs("[data-cart-backdrop]")?.addEventListener("click", () => setDrawerState(false));

  qs("[data-open-menu]")?.addEventListener("click", () => {
    const toggle = qs("[data-open-menu]");
    if (!toggle) {
      return;
    }

    const shouldOpen = toggle.getAttribute("aria-expanded") !== "true";
    setMenuState(shouldOpen);
  });

  if (document.body.dataset.shellActionsBound === "true") {
    return;
  }

  document.addEventListener("click", (event) => {
    const addTrigger = event.target.closest("[data-add-to-cart]");
    const buyTrigger = event.target.closest("[data-buy-now]");
    const removeTrigger = event.target.closest("[data-remove-drawer-item]");
    const mobileLink = event.target.closest("[data-mobile-menu] a");

    if (mobileLink) {
      setMenuState(false);
    }

    if (removeTrigger) {
      removeFromCart(Number(removeTrigger.dataset.removeDrawerItem));
      return;
    }

    if (addTrigger) {
      const productId = Number(addTrigger.dataset.addToCart);
      const product = products.find((entry) => entry.id === productId);
      if (!product) {
        return;
      }

      addToCart(product, resolveQuantity(addTrigger));
      setDrawerState(true);
    }

    if (buyTrigger) {
      const productId = Number(buyTrigger.dataset.buyNow);
      const product = products.find((entry) => entry.id === productId);
      if (!product) {
        return;
      }

      addToCart(product, resolveQuantity(buyTrigger));
      window.location.href = pageUrl("checkout");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    setDrawerState(false);
    setMenuState(false);
  });

  window.addEventListener("cart:updated", refreshCartUi);
  document.body.dataset.shellActionsBound = "true";
}

function resolveQuantity(trigger) {
  const scope = trigger.closest("[data-purchase-scope]");
  const quantityNode = scope?.querySelector("[data-quantity-value]");
  const quantity = Number(quantityNode?.textContent ?? 1);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

export function refreshCartUi() {
  const count = getCartCount();
  const countNode = qs("[data-cart-count]");
  const cartItems = qs("[data-cart-items]");
  const subtotal = qs("[data-cart-subtotal]");

  if (countNode) {
    countNode.textContent = String(count);
  }

  if (cartItems) {
    cartItems.innerHTML = renderDrawerItems();
  }

  if (subtotal) {
    subtotal.textContent = formatPrice(drawerSubtotal());
  }
}

export function mountShell(pageKey) {
  qs("#site-header").innerHTML = renderHeader(pageKey);
  qs("#site-footer").innerHTML = renderFooter();
  qs("#cart-drawer-root").innerHTML = renderCartDrawer();
  bindShellEvents();
}