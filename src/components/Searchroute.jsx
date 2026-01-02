import Header from "./header";
import SearchPage from "./searchPage";

export function SearchRoute({ sortOption, setSortOption }) {
  return (
    <>
      <Header sortOption={sortOption} onSortChange={setSortOption} />
      <SearchPage sortOption={sortOption} />
    </>
  );
}