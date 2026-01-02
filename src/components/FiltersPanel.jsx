import brands from "../data/brands.json";
import {
  getPriceBounds,
  getAvailableSizes,
  getAvailableColors,
  getRatingSteps,
} from "../utils/filterOptions";
import "../styles/filter.css";
import { CircularProgress, Box } from "@mui/material";

export default function FiltersPanel({
  /* BRAND */
  selectedBrands = [],
  onBrandChange,

  /* PRICE */
  price = { min: null, max: null },
  onPriceChange,

  /* SIZE */
  selectedSizes = [],
  onSizeToggle,

  /* COLOR */
  selectedColors = [],
  onColorToggle,

  /* RATING */
  selectedRating = null,
  onRatingChange,

  /* DATA */
  products = [],

  /* TogglePanel */
  isOpen = false,
  onClose,

  /* Loading */
  isloading = false,
}) {
  if (typeof onClose !== "function") return null;

  const priceBounds = getPriceBounds(products);
  const sizes = getAvailableSizes(products);
  const colors = getAvailableColors(products);
  const ratings = getRatingSteps();

  return (
    <Box position="relative">
      {isloading && isOpen && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: "translate(-50%, -50%)", zIndex: 1 }}
        >
          <CircularProgress size={24} />
        </Box>
      )}

      <aside className={`srp-filters ${isOpen ? "open" : ""}`}>
        <div className="filter-top">
          <h2>Filters</h2>
          <button onClick={onClose}>X</button>
        </div>

        {/* PRICE */}
        <section className="filter-group">
          <h4>Price</h4>
          <div className="price-range">
            <input
              type="number"
              placeholder={`Min (${priceBounds.min})`}
              value={price.min ?? ""}
              onChange={(e) => onPriceChange("min", e.target.value)}
            />

            <input
              type="number"
              placeholder={`Max (${priceBounds.max})`}
              value={price.max ?? ""}
              onChange={(e) => onPriceChange("max", e.target.value)}
            />
          </div>
        </section>

        {/* BRAND */}
        <section className="filter-group">
          <h4>Brand</h4>
          {brands?.brands?.map((brand) => (
            <label key={brand.id}>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.id)}
                onChange={() => onBrandChange(brand.id)}
              />
              {brand.name}
            </label>
          ))}
        </section>

        {/* SIZE */}
        <section className="filter-group">
          <h4>Size</h4>
          <div className="size-grid">
            {sizes.map((size) => (
              <button
                key={size}
                className={`size-btn ${
                  selectedSizes.includes(size) ? "active" : ""
                }`}
                onClick={() => onSizeToggle(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </section>

        {/* COLOR */}
        <section className="filter-group">
          <h4>Color</h4>
          <div className="color-swatches">
            {colors.map((color) => {
              const isActive = selectedColors.includes(color);

              return (
                <button
                  key={color}
                  type="button"
                  className={`color-swatch ${isActive ? "active" : ""}`}
                  title={color}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => onColorToggle(color)}
                />
              );
            })}
          </div>
        </section>

        {/* RATING */}
        <section className="filter-group">
          <h4>Rating</h4>
          {ratings.map((rating) => (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                checked={selectedRating === rating}
                onChange={() => onRatingChange(rating)}
              />
              {"★".repeat(rating)}
              {"☆".repeat(5 - rating)} &nbsp;up
            </label>
          ))}

          <label>
            <input
              type="radio"
              name="rating"
              checked={selectedRating === null}
              onChange={() => onRatingChange(null)}
            />
            Any rating
          </label>
        </section>
      </aside>
    </Box>
  );
}
