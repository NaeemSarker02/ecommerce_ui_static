import { categories } from "@/data/site";
import { getParam } from "@/scripts/lib/router";
import { bootPage } from "@/scripts/main";
import { mountCatalog } from "@/components/browse";

const categorySlug = getParam("category") ?? categories[0].slug;
const category = categories.find((entry) => entry.slug === categorySlug) ?? categories[0];

bootPage({
  pageKey: "category",
  title: category.name,
  render(root) {
    mountCatalog(root, {
      title: category.name,
      description: category.description,
      lockedCategory: category.slug
    });
  }
});