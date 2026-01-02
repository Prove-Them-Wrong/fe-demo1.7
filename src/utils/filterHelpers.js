export function createFilterHandlers({
  params,
  setParams,
  setSelectedBrands,
  setSelectedSizes,
  setSelectedColors,
  setPrice,
}) {
  if (!(params instanceof URLSearchParams)) {
    throw new Error("params must be an instance of URLSearchParams");
  }

  function resetPage() {
    const next = new URLSearchParams(params);
    next.set("page", "1");
    setParams(next);
  }

  function goToPage(newPage) {
    const next = new URLSearchParams(params);
    next.set("page", String(newPage));
    setParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBrandChange(brandId) {
    setSelectedBrands((prev = []) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
    resetPage();
  }

  function handlePriceChange(type, value) {
    if (type !== "min" && type !== "max") return;

    setPrice((prev = { min: null, max: null }) => ({
      ...prev,
      [type]: value === "" ? null : Number(value),
    }));
    resetPage();
  }

  function handleSizeToggle(size) {
    setSelectedSizes((prev = []) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    resetPage();
  }

  function handleColorToggle(color) {
    setSelectedColors((prev = []) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    resetPage();
  }

  return {
    goToPage,
    resetPage,
    handleBrandChange,
    handlePriceChange,
    handleSizeToggle,
    handleColorToggle,
  };
}
