import { mountCatalog } from "@/components/browse";
import { bootPage } from "@/scripts/main";

bootPage({
  pageKey: "products",
  title: "All Products",
  render(root) {
    mountCatalog(root, {
      title: "All products",
      description:
        "A reusable browse layout with category filters, search, price ranges, and sort controls. This is the base shell for the broader catalog experience."
    });
  }
});