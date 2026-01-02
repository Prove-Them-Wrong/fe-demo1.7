export function filterByBrands(products = [], selectedBrands = []) {
  if (!Array.isArray(products) || selectedBrands.length === 0) return products;

  return products.filter((p) =>
    selectedBrands.includes(p?.brandId)
  );
}

export function filterByPrice(products = [], min, max) {
  if (!Array.isArray(products)) return [];

  return products.filter((p) => {
    const price = p?.price;
    if (typeof price !== "number") return false;

    if (min != null && price < min) return false;
    if (max != null && price > max) return false;
    return true;
  });
}

export function filterBySizes(products = [], sizes = []) {
  if (!Array.isArray(products) || sizes.length === 0) return products;

  return products.filter((p) =>
    Array.isArray(p?.variants) &&
    p.variants.some((v) => sizes.includes(v?.size))
  );
}

export function filterByColors(products = [], colors = []) {
  if (!Array.isArray(products) || colors.length === 0) return products;

  return products.filter((p) =>
    Array.isArray(p?.variants) &&
    p.variants.some((v) => colors.includes(v?.color))
  );
}

export function filterByRating(products = [], minRating) {
  if (!Array.isArray(products) || !minRating) return products;

  return products.filter(
    (p) => typeof p?.rating === "number" && p.rating >= minRating
  );
}
