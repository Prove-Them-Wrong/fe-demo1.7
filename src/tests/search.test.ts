import { describe, it, expect } from "vitest";
import { normalize, singularize, tokenize } from "../../utils/SearchHelper";

describe("normalize", () => {
  it("lowercases text", () => {
    expect(normalize("Hello WORLD")).toBe("hello world");
  });

  it("removes punctuation and special characters", () => {
    expect(normalize("Hello, world!!!")).toBe("hello world");
  });

  it("collapses multiple spaces into one", () => {
    expect(normalize("hello    world")).toBe("hello world");
  });

  it("trims leading and trailing spaces", () => {
    expect(normalize("   hello world   ")).toBe("hello world");
  });

  it("keeps numbers", () => {
    expect(normalize("Item 123!!!")).toBe("item 123");
  });
});

describe("singularize", () => {
  it('converts words ending in "ies" to "y"', () => {
    expect(singularize("batteries")).toBe("battery");
    expect(singularize("parties")).toBe("party");
  });

  it('handles words ending in "sses"', () => {
    expect(singularize("classes")).toBe("class");
    expect(singularize("dresses")).toBe("dress");
    expect(singularize("glasses")).toBe("glass");
  });

  it('handles words ending in "ses"', () => {
    expect(singularize("cases")).toBe("case");
    expect(singularize("phrases")).toBe("phrase");
  });

  it('removes trailing "s" for simple plurals', () => {
    expect(singularize("dogs")).toBe("dog");
    expect(singularize("cats")).toBe("cat");
    expect(singularize("cars")).toBe("car");
  });

  it('does not singularize short words ending with "s"', () => {
    expect(singularize("bus")).toBe("bus");
    expect(singularize("gas")).toBe("gas");
  });

  it("returns the word unchanged if not plural", () => {
    expect(singularize("cat")).toBe("cat");
    expect(singularize("phone")).toBe("phone");
  });
});

describe("tokenize", () => {
  it("normalizes and splits text into tokens", () => {
    expect(tokenize("Hello World")).toEqual(["hello", "world"]);
  });

  it("singularizes plural words", () => {
    expect(tokenize("dogs cats batteries")).toEqual(["dog", "cat", "battery"]);
  });

  it("handles punctuation and extra spaces", () => {
    expect(tokenize("  Red,   Apples!!! ")).toEqual(["red", "apple"]);
  });

  it("handles mixed case, numbers, and plurals", () => {
    expect(tokenize("iPhone 14 Cases")).toEqual(["iphone", "14", "case"]);
  });

  it("returns an empty array for empty input", () => {
    expect(tokenize("")).toEqual([""]);
  });
});
