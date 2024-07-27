// src/CafePage.js

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import "../App.css";
import SearchInput from "../components/SearchInput";
import ItemLister from "../components/ItemLister";
import Header from "../components/Header";

import { ThreeDots } from "react-loader-spinner";

import { getItemTypesWithItems } from "../helpers/itemHelper.js";
import {
  getLocalStorage,
  updateLocalStorage,
} from "../helpers/localStorageHelpers";

function SearchResult({ user }) {
  const [searchParams] = useSearchParams();
  const { shopId } = useParams();

  const handleLogout = () => {
    updateLocalStorage("auth", "");
  };

  return (
    <div className="App">
      <body className="App-header">
        <Header HeaderText={"Search"} shopId={shopId} user={user} />
        <div style={{ marginTop: "5px" }}></div>
        <SearchInput shopId={shopId} autofocus={true} />
        <div style={{ marginTop: "15px" }}></div>
        {/* <ItemTypeLister user={user} shopId={shopId} itemTypes={shopItems} /> */}
        <div style={{ marginTop: "-13px" }}></div>
        {/* <MusicPlayer
          socket={socket}
          shopId={shopId}
          user={user}
          isSpotifyNeedLogin={isSpotifyNeedLogin}
        />
        <div style={{ marginTop: "-15px" }}></div>
        {shopItems.map((itemType) => (
          <ItemLister
            shopId={shopId}
            user={user}
            key={itemType.itemTypeId}
            itemTypeId={itemType.itemTypeId}
            typeName={itemType.name}
            itemList={itemType.itemList}
          />
        ))} */}
      </body>
    </div>
  );
}

export default SearchResult;
