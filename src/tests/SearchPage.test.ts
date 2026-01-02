import { describe, it, expect } from "vitest";
import { searchProducts } from "../../components/searchPage";

const mockProducts = [
  {
    name: "Floral Summer Dress",
    description: "Lightweight cotton dress",
    keywords: ["floral", "summer"],
    tags: ["women"],
  },
  {
    name: "Winter Jacket",
    description: "Warm and cozy",
    keywords: ["winter"],
    tags: ["outerwear"],
  },
];

describe("searchProducts", () => {
  it("returns all products when query is empty", () => {
    const results = searchProducts(mockProducts, "");
    expect(results).toHaveLength(2);
  });

  it("matches multiple query tokens", () => {
    const results = searchProducts(mockProducts, "floral summer");
    expect(results.map((p) => p.name)).toEqual(["Floral Summer Dress"]);
  });

  it("returns empty array when no products match", () => {
    const results = searchProducts(mockProducts, "electronics");
    expect(results).toEqual([]);
  });

  it("matches against description, keywords, and tags", () => {
    const results = searchProducts(mockProducts, "cotton");
    expect(results.map((p) => p.name)).toEqual(["Floral Summer Dress"]);
  });
});
