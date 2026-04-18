const takaFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0
});

export function formatPrice(value) {
  return takaFormatter.format(value).replace("BDT", "BDT ");
}

export function formatDiscount(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) {
    return null;
  }

  const percent = Math.round(((originalPrice - price) / originalPrice) * 100);
  return `Save ${percent}%`;
}