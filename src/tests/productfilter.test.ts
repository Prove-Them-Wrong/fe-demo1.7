import { describe, expect, test } from "vitest";
import products from "../../data/products.json";
import {
  filterByBrands,
  filterByPrice,
  filterBySizes,
  filterByColors,
  filterByRating,
} from "../../utils/productFilters";

const data = products.products;

describe("productFilters", () => {
  test("filters by brand", () => {
    const result = filterByBrands(data, ["nike"]);
    expect(result.every((p) => p.brandId === "nike")).toBe(true);
  });

  test("filters by min price", () => {
    const result = filterByPrice(data, 100, null);
    expect(result.every((p) => p.price >= 100)).toBe(true);
  });

  test("filters by max price", () => {
    const result = filterByPrice(data, null, 200);
    expect(result.every((p) => (p.salePrice ?? p.price) <= 200)).toBe(true);
  });

  test("filters by rating", () => {
    const result = filterByRating(data, 4);
    expect(result.every((p) => p.rating >= 4)).toBe(true);
  });

  test("returns all products when filters are empty", () => {
    const result = filterByColors(data, []);
    expect(result.length).toBe(data.length);
  });
});
