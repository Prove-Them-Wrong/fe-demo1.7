export function sortProducts(products, sortOption) {
  if (!Array.isArray(products)) return [];
  const sorted = [...products];

  switch (sortOption) {
    case "priceLow":
      return sorted.sort((a, b) => a.price - b.price);

    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);

    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case "relevance":
    default:
      return products;
  }
}
