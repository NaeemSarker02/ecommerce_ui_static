import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  build: {
    rollupOptions: {
      input: {
        home: path.resolve(__dirname, "index.html"),
        products: path.resolve(__dirname, "pages/products.html"),
        category: path.resolve(__dirname, "pages/category.html"),
        product: path.resolve(__dirname, "pages/product.html"),
        cart: path.resolve(__dirname, "pages/cart.html"),
        checkout: path.resolve(__dirname, "pages/checkout.html"),
        about: path.resolve(__dirname, "pages/about.html"),
        help: path.resolve(__dirname, "pages/help.html"),
        privacy: path.resolve(__dirname, "pages/privacy.html"),
        terms: path.resolve(__dirname, "pages/terms.html"),
        returns: path.resolve(__dirname, "pages/returns.html")
      }
    }
  }
});