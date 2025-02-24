import React, { useState } from "react";

const SearchBar = ({ orderList, onMatch }) => {
  const [searchMode, setSearchMode] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [itemList, setItemList] = useState([]);

  const handleSearch = (e) => {
    const inputValue = e.target.value;
    setSearchInput(inputValue);

    const matchingItem = orderList.find(
      (item) => item.packingNo === inputValue
    );
    if (matchingItem) {
      onMatch(matchingItem);
      setSearchInput('');
    } else {
      onMatch(null);
    }
    
  };

  return (
    <div className="search-bar-container">
      <button
        className="toggle-button"
        onClick={() => setSearchMode(!searchMode)}
      >
        {searchMode ? "Close" : "Barcode Search ...."}
      </button>
      {searchMode && (
        <input
          type="text"
          value={searchInput}
          onChange={handleSearch}
          placeholder="Barcode Search..."
          className="search-input"
          style={{ width: "250px", color: "transparent" }}
        />
      )}
    </div>
  );
};

export default SearchBar;
