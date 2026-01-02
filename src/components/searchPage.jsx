import { useSearchParams } from "react-router-dom";
import products from "../data/products.json"
import SearchSummary from "./SearchSummary";
import FiltersPanel from "./FiltersPanel";
import ResultsGrid from "./ResultsGrid";
import Pagination from "./Pagination";
import { tokenize } from "../utils/SearchHelper";
import { sortProducts } from "../utils/dropdownhelper";
import "../styles/searchPage.css";
import { useState, useEffect } from "react";
import { createFilterHandlers } from "../utils/filterHelpers";
import { FilterToggleButton } from "./filterBtn";
import {
  filterByBrands,
  filterByPrice,
  filterBySizes,
  filterByColors,
  filterByRating,
} from "../utils/productFilters";

const PAGE_SIZE = 10;

/* Empty state */
export function EmptyState({ query }) {
  return (
    <section className="srp-empty">
      <h2>No results found</h2>
      {query ? (
        <p>
          We couldn’t find anything matching <strong>“{query}”</strong>.
        </p>
      ) : (
        <p>No products available.</p>
      )}
    </section>
  );
}

/* Search logic */
export function searchProducts(items = [], query = "") {
  if (!query || !Array.isArray(items)) return items;

  const queryTokens = tokenize(query);

  return items.filter((product) => {
    const haystackTokens = tokenize(
      [
        product?.name,
        product?.description,
        product?.categoryId,
        product?.brandId,
        product?.gender,
        ...(product?.keywords ?? []),
        ...(product?.tags ?? []),
      ].join(" ")
    );

    return queryTokens.some((token) => haystackTokens.includes(token));
  });
}

/* Page component */
export default function SearchPage({ sortOption }) {
  const [isloading, setIsLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [params, setParams] = useSearchParams();

  const query = params.get("q") ?? "";
  const page = Number(params.get("page") ?? "1");

  const [price, setPrice] = useState({ min: null, max: null });

  /* simulate loading */
  useEffect(() => {
  let cancelled = false;

  const load = async () => {
    if (!cancelled) setIsLoading(true);

    await Promise.resolve(); // async boundary

    if (!cancelled) setIsLoading(false);
  };

  load();

  return () => {
    cancelled = true;
  };
}, [
  query,
  selectedBrands,
  selectedSizes,
  selectedColors,
  selectedRating,
  price.min,
  price.max,
  sortOption,
  page,
]);

  /* results pipeline */
  let results = searchProducts(products?.products ?? [], query);
  results = filterByBrands(results, selectedBrands);
  results = filterByPrice(results, price.min, price.max);
  results = filterBySizes(results, selectedSizes);
  results = filterByColors(results, selectedColors);
  results = filterByRating(results, selectedRating);
  results = sortProducts(results, sortOption);

  const hasResults = results.length > 0;
  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const paginatedResults = results.slice(start, start + PAGE_SIZE);

  /* handlers */
  const {
    goToPage,
    handleBrandChange,
    handlePriceChange,
    handleSizeToggle,
    handleColorToggle,
  } = createFilterHandlers({
    params,
    setParams,
    setSelectedBrands,
    setSelectedSizes,
    setSelectedColors,
    setPrice,
  });

  return (
    <main className="srp">
      <div className="sr-top">
        <SearchSummary query={query} count={results.length} />

        <FilterToggleButton
          isOpen={filtersOpen}
          onToggle={() => setFiltersOpen((prev) => !prev)}
        />
      </div>

      <div className={`srp__content ${filtersOpen ? "with-filters" : ""}`}>
        <FiltersPanel
          selectedBrands={selectedBrands}
          onBrandChange={handleBrandChange}
          price={price}
          onPriceChange={handlePriceChange}
          selectedSizes={selectedSizes}
          onSizeToggle={handleSizeToggle}
          selectedColors={selectedColors}
          onColorToggle={handleColorToggle}
          selectedRating={selectedRating}
          onRatingChange={setSelectedRating}
          products={products?.products ?? []}
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          isloading={isloading}
        />

        {hasResults ? (
          <ResultsGrid products={paginatedResults} isloading={isloading} />
        ) : (
          <EmptyState query={query} />
        )}
      </div>

      {hasResults && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
      )}
    </main>
  );
}
