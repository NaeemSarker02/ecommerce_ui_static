# Northstar Supply Ecommerce UI Context

## 1. Project Goal

This project is a professional frontend implementation plan and starter build for a modern ecommerce website UI inspired by the browsing structure and product merchandising rhythm of https://leonoutfits.com/.

The goal is not to clone that brand. The goal is to build an original, maintainable, reusable storefront UI that captures the same type of experience:

- category-led homepage browsing
- strong product-card presentation
- sale-price and quick-buy behavior
- simple but effective catalog filtering
- product detail, cart, and checkout flow
- about and policy pages with shared templates

The implementation must use only:

- HTML5
- CSS
- Tailwind CSS
- Vanilla JavaScript

No UI framework should be used.

## 2. Reference Site Analysis

The target reference site has a clear ecommerce content rhythm.

### Homepage structure observed

1. Hero/banner area
2. Shop by category section
3. Featured products grid
4. Repeated category spotlight sections
5. Footer with quick links, contact, and social links

### Core UI patterns observed

- Category-first discovery
- Product cards with image, name, sale state, price, original price, and CTA buttons
- Repeated visual merchandising blocks by category
- Simple browse pages with filtering and category navigation
- Minimal informational pages for policies and brand information

### What should be followed

- Content rhythm
- Ecommerce hierarchy
- Catalog behavior expectations
- Compact footer/legal layout style

### What should not be copied directly

- Brand name
- Logo
- Product names
- Product images
- Policy text
- Exact colors, layout values, and branding language

This project therefore uses an inspired direction with original branding: `Northstar Supply`.

## 3. Scope

The approved scope for the first implementation milestone includes:

### Storefront pages

- Homepage
- All products page
- Category page
- Product detail page
- Cart page
- Checkout page

### Static content pages

- About page
- Privacy policy page
- Terms and conditions page
- Return and cancellation page

### UI behavior scope

- Shared announcement bar, header, footer, and mini-cart drawer
- Search, category filter, price filter, and sorting on catalog page
- Add to cart and buy now actions
- Cart persistence with localStorage
- Quantity update behavior
- Checkout form UI with summary panel

### Explicit exclusions for this milestone

- Real backend integration
- Real payments
- Authentication
- Real inventory service
- Real shipping calculation
- Admin panel
- CMS integration

## 4. Brand and Design Direction

The design direction should feel bold, streetwear-oriented, and modern without looking generic.

### Visual direction

- light warm background instead of flat white
- dark high-contrast text
- one warm accent color for badges and highlights
- oversized typography for section headlines
- large atmospheric media panels in place of placeholder product imagery
- rounded cards with soft shadows and clean spacing

### Typography direction

- Display font: `Sora`
- Body/UI font: `Manrope`

### Tone

- clean and confident
- modern streetwear feel
- product-first, not overly decorative
- maintainable and scalable for real ecommerce usage

## 5. Tech Stack Decision

### Core stack

- HTML5 multi-page structure
- Tailwind CSS v4
- Custom CSS layers for tokens, components, and sections
- Vanilla JavaScript ES modules
- Vite for development and production build
- PostCSS for Tailwind integration

### Why Vite is acceptable

Vite is used only as a build and development tool. It is not a UI framework. The runtime output remains plain HTML, CSS, and JS.

This gives the project:

- fast local development
- clean asset handling
- multi-page entry support
- maintainable ES module imports
- production build support without framework overhead

## 6. Folder and File Architecture

The current implementation structure is:

```text
tamplate_2/
├── Context.md
├── README.md
├── index.html
├── package.json
├── postcss.config.js
├── vite.config.js
├── pages/
│   ├── about.html
│   ├── cart.html
│   ├── category.html
│   ├── checkout.html
│   ├── help.html
│   ├── privacy.html
│   ├── product.html
│   ├── products.html
│   ├── returns.html
│   └── terms.html
├── public/
	├── media/
		├── categories/
		│	├── bandanas.svg
		│	├── bracelets.svg
		│	├── essentials.svg
		│	├── eyewear.svg
		│	└── outerwear.svg
		└── products/
			├── arc-link-bracelet.svg
			├── district-zip-hoodie.svg
			├── gridline-denim-pants.svg
			├── metro-polo-tee.svg
			├── monochrome-scarf-bandana.svg
			├── nightshift-oversized-tee.svg
			├── relay-combo-pack.svg
			├── signal-bandana.svg
			├── stacked-bead-bracelet.svg
			├── stellar-heavyweight-hoodie.svg
			├── vector-wrap-shades.svg
			└── void-y2k-sunglasses.svg
└── src/
	├── components/
	│   ├── browse.js
	│   ├── cards.js
	│   ├── product-detail.js
	│   └── shell.js
	├── data/
	│   └── site.js
	├── scripts/
	│   ├── lib/
	│   │   ├── dom.js
	│   │   ├── format.js
	│   │   └── router.js
	│   ├── pages/
	│   │   ├── cart.js
	│   │   ├── category.js
	│   │   ├── checkout.js
	│   │   ├── content.js
	│   │   ├── home.js
	│   │   ├── product.js
	│   │   └── products.js
	│   ├── state/
	│   │   └── cart-state.js
	│   └── main.js
	└── styles/
		├── app.css
		├── components.css
		├── sections.css
		├── tokens.css
		└── utilities.css
```

### Architecture principles

- Page entry files stay thin.
- Reusable markup/render logic lives in `src/components`.
- Shared data lives in one place.
- State logic is separated from rendering.
- Styling is split by responsibility.
- Shared shell is used across every page.

This structure is intended to keep future updates easy and low-risk.

## 7. Styling Strategy

Styling is intentionally split into multiple layers so that future edits remain manageable.

### `src/styles/tokens.css`

Contains:

- colors
- font variables
- radius values
- shadows
- container width
- theme gradients for placeholder media

### `src/styles/utilities.css`

Contains:

- shared container class
- section-heading helper
- surface-card class
- stack utilities
- small reusable layout helpers

### `src/styles/components.css`

Contains:

- announcement bar
- header/nav styles
- button systems
- badges
- product/category media panels
- form fields
- cart drawer behavior

### `src/styles/sections.css`

Contains:

- hero composition
- spotlight band layout
- trust band styling
- catalog page layout
- sticky filter panel rules

### `src/styles/app.css`

Acts as the main CSS entry file and imports Tailwind and all custom layers.

## 8. Reusable Component Inventory

### Global shell components

- announcement bar
- header
- desktop navigation
- mobile menu
- footer
- mini-cart drawer

### Commerce components

- product card
- category card
- catalog filter panel
- sort toolbar
- product gallery block
- quantity control
- order summary panel

### Static page component

- reusable support and policy page shell with sidebar cards and FAQ blocks

These components are rendered with JS functions instead of duplicated HTML across pages.

## 9. Data Model

The current seeded data is stored in `src/data/site.js`.

### Site meta

- brand name
- tagline
- announcement text
- contact data
- social links
- trust highlights

### Commerce meta

- free-shipping threshold
- cart benefit content
- checkout steps
- shipping zones
- promo codes
- payment methods
- checkout notes

### Category fields

- id
- slug
- name
- kicker
- description
- theme
- media

### Product fields

- id
- slug
- name
- category
- price
- originalPrice
- badge
- stock
- theme
- sizes
- colors
- shortDescription
- description
- featured
- spotlight
- media
- profile metadata for PDP guidance
- availability metadata for shared status messaging
- shipping metadata for dispatch and delivery reuse
- care metadata for shared post-purchase guidance

### Static content fields

- eyebrow
- title
- intro
- sections array

This keeps the project data-driven from the start so new products or new sections can be added without rewriting page markup.

## 10. Current Page Specifications

### Homepage

The homepage currently includes:

- hero section
- implementation summary cards
- category grid
- featured products section
- repeated spotlight sections for each category
- project trust/handoff block

Purpose:

- match the category-led structure of the reference site
- show reusable product cards and marketing blocks
- establish the overall visual language

### All products page

Current features:

- search field
- category filter
- price range filter
- sorting select
- result count
- responsive product grid

Purpose:

- prove browse behavior
- provide a reusable catalog layout

### Category page

Current features:

- locked category context based on query parameter
- same catalog system as all-products page
- shared layout with different dataset behavior

Purpose:

- avoid duplicate templates
- reuse browse UI while narrowing data source

### Product detail page

Current features:

- breadcrumb
- product gallery panel
- sale and stock states
- size and color UI blocks
- quantity stepper
- add to cart and buy now actions
- product fit, material, and dispatch cards
- tabbed product guidance panels
- size guidance and checkout-readiness notes
- related products grid

Purpose:

- establish the single-product template
- prove commerce CTA grouping and state behavior

### Cart page

Current features:

- cart item listing
- quantity adjustment
- remove action
- live summary panel
- checkout CTA

Purpose:

- verify localStorage-driven cart state
- prove cart page layout before backend integration

### Checkout page

Current features:

- customer info fields
- zone select
- payment placeholder select
- summary panel
- demo submit action

Purpose:

- prove checkout information architecture
- keep integration-ready layout for future real payment and order handling

### Static content pages

Current pages:

- about
- privacy
- terms
- returns

Purpose:

- use one shared template for all static text pages
- keep policy page UI consistent across the project

## 11. Interaction Plan

### Implemented interactions in current milestone

- open/close mini-cart drawer
- open mobile menu
- add to cart from product cards
- buy now from product cards
- search products
- filter by category
- filter by price range
- sort products
- update cart quantity
- remove item from cart
- clear cart after demo checkout submission

### Interaction rules

- shared cart state comes from localStorage
- product and cart pages should never own duplicate cart logic
- global shell should reflect cart count changes automatically
- browse behavior should always derive from one product dataset

## 12. Maintainability Rules

To keep the project easy to maintain, follow these rules for future development:

1. Do not duplicate header, footer, or cart drawer markup across pages.
2. Keep shared render logic inside `src/components`.
3. Keep data in `src/data` rather than hardcoding content in page scripts.
4. Keep visual tokens in `tokens.css` as the single source of truth.
5. Use section-level CSS only for composition, not for deeply repeated patterns.
6. Use Tailwind utilities for layout speed, but keep reusable design patterns in component classes.
7. Keep page entry scripts focused on bootstrapping only.
8. Replace placeholder policy text and demo brand content before any real deployment.

## 13. Accessibility and Performance Direction

### Accessibility requirements

- semantic HTML landmarks
- keyboard-accessible buttons and links
- clear form labels
- visible focus states
- readable contrast ratios
- descriptive CTA labels

### Performance requirements

- minimal JS for core UI
- shared data-driven rendering
- no framework runtime
- clear CSS layering
- production build through Vite

## 14. Implementation Status

### Completed in this first implementation pass

- project scaffold created
- Vite multi-page setup created
- Tailwind CSS integration created
- separated CSS architecture created
- seeded catalog and static content data created
- shared shell created
- homepage implemented
- all-products page implemented
- category page implemented
- product page implemented
- cart page implemented
- checkout page implemented
- static content pages implemented
- dedicated help/support page added
- help page support-request form with client-side validation added
- local SVG media asset system added
- category and product cards upgraded to image-ready shared media rendering
- product detail gallery upgraded to use shared image-backed media panels
- inline checkout validation and field-level feedback added
- checkout order-note and payment-description flow improved
- promo code state and shared cart-to-checkout discount logic added
- Dhaka free-shipping threshold implemented in shared totals
- seeded product-specific SVG assets added for the full catalog
- product detail gallery views now use product-specific artwork treatments
- product detail page enriched with tabbed guidance and spec cards
- product detail guidance moved to product-level metadata in the data layer
- shared availability, shipping, and care metadata reused across PDP, cart, and checkout
- help page now includes a live storefront-operations guide derived from shared shipping, availability, and care metadata
- help page support form now adapts guidance, placeholder copy, validation rules, and success messaging to the selected support topic
- checkout confirmation now generates a mock order reference and deep-links into help with a prefilled order-status support request
- help page now includes a demo order-status lookup panel and recent-order localStorage memory for quick support handoff without the checkout link
- homepage and footer were adjusted toward the reference site's category-first merchandising rhythm while keeping original brand, content, and asset choices
- homepage was further tightened into a denser storefront landing flow with direct hero merchandising, 5-up category browsing, 4-up featured grids, and category banner lanes
- header and navigation were upgraded with a two-level shell, horizontal category rail, and proper mobile navigation panel for faster storefront browsing
- shared category and product cards were tightened into a denser catalog presentation with compact copy, stronger price rows, and 4-up large-screen product grids
- static support pages upgraded with richer content sections, FAQ blocks, and sidebars
- README added
- Context.md documentation added

### Not yet completed

- production product photography and final brand assets
- backend/API integration
- real checkout logic
- advanced mobile interaction polish
- pagination or load-more system
- analytics hooks
- server-side validation and transactional error handling
- real promo validation and campaign management
- testing automation

## 15. Next Development Phases

### Phase 2

- improve mobile menu and drawer polish
- refine responsive spacing on all pages
- deepen product detail content with real business specs and care data
- add better empty states and field validation messaging

### Phase 3

- replace seeded SVG artwork with real product and category photography
- add JSON/API swap support
- connect cart and checkout to backend
- add order confirmation page

### Phase 4

- add search suggestion behavior
- add wishlist/comparison if required
- add performance optimization pass
- add accessibility review and fixes

## 16. Verification Checklist

Before considering the frontend milestone stable, verify the following:

1. `npm install` works successfully.
2. `npm run dev` starts the project without entry-point issues.
3. `npm run build` completes successfully.
4. Homepage renders correctly on desktop and mobile widths.
5. Product catalog search, filters, and sort work together.
6. Product detail page supports quantity changes and CTA actions.
7. Cart state updates the header cart count and drawer contents.
8. Cart page summary reflects quantity changes accurately.
9. Checkout page reads the same cart state.
10. Static content pages use the same layout shell.
11. No Leon Outfits branded content remains in the shipped UI.

## 17. Final Development Note

This project is already structured as a professional frontend base, not just a loose static template.

The key principle is simple:

- shared shell
- shared data
- shared component renderers
- separated styling layers
- thin page entry files

If future work follows this structure, the project will remain easy to edit, scale, and maintain.
