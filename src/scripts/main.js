import "@/styles/app.css";

import { mountShell } from "@/components/shell";
import { siteMeta } from "@/data/site";
import { qs } from "@/scripts/lib/dom";

function ensureSkipLink() {
  if (qs(".skip-link")) {
    return;
  }

  const skipLink = document.createElement("a");
  skipLink.className = "skip-link";
  skipLink.href = "#page-content";
  skipLink.textContent = "Skip to content";
  document.body.prepend(skipLink);
}

export function bootPage({ pageKey, title, render }) {
  document.title = title ? `${title} | ${siteMeta.brandName}` : siteMeta.brandName;
  ensureSkipLink();
  mountShell(pageKey);
  const root = qs("#page-content");

  if (!root) {
    throw new Error("Missing #page-content mount target.");
  }

  root.tabIndex = -1;
  render(root);
}