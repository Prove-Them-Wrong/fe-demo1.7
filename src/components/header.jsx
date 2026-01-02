import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import "../styles/headerstyles.css";

export default function Header({ sortOption, onSortChange }) {

  return (
    <header className="site-header">
      <div className="header-left">
        <Link to="/" className="site-header__logo">
          MICHAEL IJI
        </Link>

        <nav className="site-header__nav">
          <Link to="/cartPage">My Cart</Link>
          <Link to="/search">Shop</Link>
        </nav>
      </div>

      <div className="header-middle">
        <SearchBar />
      </div>

      <div className="header-right">
        {/* Sorting options can be added here if needed for the shop page */}
      </div>
    </header>
  );
}
