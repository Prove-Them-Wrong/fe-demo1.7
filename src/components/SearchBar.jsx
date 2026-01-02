import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SearchBar.css";

export default function SearchBar() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const query = value.trim();

    navigate({
      pathname: "/search",
      search: query ? `?q=${encodeURIComponent(query)}` : "",
    });
  }

  return (
    <form
      className="search-bar"
      onSubmit={handleSubmit}
      role="search"
      aria-label="Site search"
    >
      <input
        className="search-bar__input"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
      />

      <button className="search-bar__button" type="submit">
        Search
      </button>
    </form>
  );
}
