import React, { useState } from "react";

export default function Search() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", query);
  };

  return (
    <form className="d-flex shop-search-form" onSubmit={handleSearch}>
      <input
        type="text"
        id="site-search"
        name="search"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="shop-search-input"
      />
      <button type="submit" className="shop-search-btn">
        <i className="fa fa-search" />
      </button>
    </form>
  );
}