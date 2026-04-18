import { mountProductDetail } from "@/components/product-detail";
import { products } from "@/data/site";
import { getParam } from "@/scripts/lib/router";
import { bootPage } from "@/scripts/main";

const slug = getParam("product") ?? products[0].slug;
const product = products.find((entry) => entry.slug === slug) ?? products[0];
const relatedProducts = products
  .filter((entry) => entry.category === product.category && entry.id !== product.id)
  .slice(0, 3);

bootPage({
  pageKey: "product",
  title: product.name,
  render(root) {
    mountProductDetail(root, product, relatedProducts.length ? relatedProducts : products.filter((entry) => entry.id !== product.id).slice(0, 3));
  }
});