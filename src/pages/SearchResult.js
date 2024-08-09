
// src/CafePage.js
import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import "../App.css";
import SearchInput from "../components/SearchInput";
import ItemLister from "../components/ItemLister";
import Header from "../components/Header";

import { updateLocalStorage } from "../helpers/localStorageHelpers";

function SearchResult({ user, shopItems, sendParam }) {
  const [searchParams] = useSearchParams();
  const { shopId, tableCode } = useParams();
  const navigate = useNavigate();
  sendParam({ shopId, tableCode });

  const [searchValue, setSearchValue] = useState(
    "dwadawa vvwqd21qb13 4kfawfdwa dhawldhawr dliawbdjawndlks"
  );

  // Function to handle search input change
  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const filteredItems = shopItems
    .map((itemType) => {
      // Filter items in the itemList based on searchValue
      const filteredItemList = itemType.itemList.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );

      // Return itemType with only filtered items
      return {
        ...itemType,
        itemList: filteredItemList,
      };
    })
    .filter((itemType) => itemType.itemList.length > 0); // Only include itemTypes with matching items

  console.log(filteredItems);
  return (
    <div className="App">
      <header className="App-header">
        <Header HeaderText={"Search"} />
        <div style={{ marginTop: "5px" }}></div>
        <SearchInput
          shopId={shopId}
          tableCode={tableCode}
          autofocus={true}
          onSearchChange={handleSearchChange}
        />
        <div style={{ marginTop: "15px" }}></div>
        <div style={{ marginTop: "-13px" }}></div>
        {filteredItems.map((itemType) => (
          <ItemLister
            shopId={shopId}
            user={user}
            key={itemType.itemTypeId}
            itemTypeId={itemType.itemTypeId}
            typeName={itemType.name}
            itemList={itemType.itemList}
          />
        ))}
      </header>
    </div>
  );
}

export default SearchResult;