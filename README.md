# Northstar Supply UI

Multi-page ecommerce UI inspired by the structure of Leon Outfits, rebuilt as an original frontend using semantic HTML, Tailwind CSS v4, custom CSS layers, and vanilla JavaScript modules.

## Stack

- HTML5 multi-page app
- Tailwind CSS v4 via PostCSS
- Custom CSS token and component layers
- Vanilla JavaScript ES modules
- Vite for dev/build only

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Pages

- `/` homepage
- `/pages/products.html` all products
- `/pages/category.html?category=outerwear` category view
- `/pages/product.html?product=stellar-heavyweight-hoodie` product detail
- `/pages/cart.html` cart
- `/pages/checkout.html` checkout
- `/pages/about.html` about
- `/pages/help.html` help and support
- `/pages/privacy.html` privacy policy template
- `/pages/terms.html` terms template
- `/pages/returns.html` returns template

## Notes

- Product and page content is seeded from `src/data/site.js`.
- Cart state is stored in `localStorage`.
- Shared shell UI lives in `src/components/shell.js`.
- The current content and media are placeholders and should be replaced with original brand assets before launch.# ecommerce_ui_static
