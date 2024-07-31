// src/CafePage.js

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import "../App.css";
import SearchInput from "../components/SearchInput";
import ItemTypeLister from "../components/ItemTypeLister";
import { MusicPlayer } from "../components/MusicPlayer";
import ItemLister from "../components/ItemLister";
import AccountUpdateModal from "../components/AccountUpdateModal";
import Header from "../components/Header";

import { ThreeDots } from "react-loader-spinner";

import { getItemTypesWithItems } from "../helpers/itemHelper.js";
import {
  getLocalStorage,
  updateLocalStorage,
} from "../helpers/localStorageHelpers";

function CafePage({
  sendParam,
  shopName,
  shopItems,
  shopClerks,
  socket,
  user,
  guestSides,
  guestSideOfClerk,
  removeConnectedGuestSides,
  setModal,
}) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { shopId, tableId } = useParams();
  sendParam({ shopId, tableId });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [screenMessage, setScreenMessage] = useState("");

  const [isSpotifyNeedLogin, setNeedSpotifyLogin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user.cafeId != null && user.cafeId != shopId) {
      navigate("/" + user.cafeId);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      updateLocalStorage("auth", token);
    }
  }, [token]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    updateLocalStorage("auth", "");
    navigate(0);
  };

  useEffect(() => {
    setLoading(false);
  }, [shopItems]);

  useEffect(() => {
    async function fetchData() {
      socket.on("joined-room", (response) => {
        const { isSpotifyNeedLogin } = response;
        setNeedSpotifyLogin(isSpotifyNeedLogin);
      });
    }

    if (socket) fetchData();
  }, [socket]);

  if (loading)
    return (
      <div className="Loader">
        <div className="LoaderChild">
          <ThreeDots />
          <h1>{screenMessage}</h1>
        </div>
      </div>
    );
  else
    return (
      <div className="App">
        <body className="App-header">
          <Header
            HeaderText={"Menu"}
            showProfile={true}
            setModal={setModal}
            isLogout={handleLogout}
            shopId={shopId}
            shopName={shopName}
            shopClerks={shopClerks}
            tableId={tableId}
            user={user}
            guestSides={guestSides}
            guestSideOfClerk={guestSideOfClerk}
            removeConnectedGuestSides={removeConnectedGuestSides}
          />
          <div style={{ marginTop: "5px" }}></div>
          <SearchInput shopId={shopId} />
          <div style={{ marginTop: "15px" }}></div>
          <ItemTypeLister user={user} shopId={shopId} itemTypes={shopItems} />
          <div style={{ marginTop: "-13px" }}></div>
          <h2 className="title">Music Req.</h2>
          <MusicPlayer
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
          ))}
        </body>
        {user.username && (
          <AccountUpdateModal
            user={user}
            isOpen={isModalOpen}
            onClose={handleModalClose}
          />
        )}
      </div>
    );
}

export default CafePage;
