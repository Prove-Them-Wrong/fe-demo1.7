export function FilterToggleButton({ onToggle }) {
  if (typeof onToggle !== "function") return null;

  return (
    <button className="toggleFilterBtn" onClick={onToggle}>
      Filters
    </button>
  );
}