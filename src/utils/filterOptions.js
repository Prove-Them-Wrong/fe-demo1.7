export function getPriceBounds(products) {
  if (!Array.isArray(products) || products.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = products
    .map((p) => p?.salePrice ?? p?.price)
    .filter((price) => typeof price === "number" && !isNaN(price));

  if (prices.length === 0) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

export function getAvailableSizes(products) {
  if (!Array.isArray(products)) return [];

  const sizes = new Set();

  products.forEach((p) => {
    p?.variants?.forEach((v) => {
      if (v?.size) sizes.add(v.size);
    });
  });

  return Array.from(sizes).sort();
}

export function getAvailableColors(products) {
  if (!Array.isArray(products)) return [];

  const colors = new Set();

  products.forEach((p) => {
    p?.variants?.forEach((v) => {
      if (v?.color) colors.add(v.color);
    });
  });

  return Array.from(colors).sort();
}

export function getRatingSteps() {
  return [4, 3, 2];
}
