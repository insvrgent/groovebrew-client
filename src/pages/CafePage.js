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
  socket,
  user,
  guestSides,
  guestSideOfClerk,
  removeConnectedGuestSides,
}) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { shopId } = useParams();
  sendParam(shopId);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [screenMessage, setScreenMessage] = useState("");

  const [shopItems, setShopItems] = useState([]);

  const [isSpotifyNeedLogin, setNeedSpotifyLogin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user.cafeId != null && user.cafeId != shopId) {
      navigate("/" + user.cafeId);
      sendParam(user.cafeId);
    }
    if (user.password == "unsetunsetunset") setIsModalOpen(true);
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
    async function fetchData() {
      try {
        setLoading(true);
        const { response, data } = await getItemTypesWithItems(shopId);
        console.log(data);
        if (response.status === 200) {
          setShopItems(data);
          setLoading(false);
          socket.emit("join-room", { token: getLocalStorage("auth"), shopId });

          socket.on("joined-room", (response) => {
            const { isSpotifyNeedLogin } = response;
            setNeedSpotifyLogin(isSpotifyNeedLogin);
          });

          socket.on("transaction_created", () => {
            console.log("transaction created");
          });
        } else {
          setScreenMessage("Kafe tidak tersedia");
        }
      } catch (error) {
        console.error("Error fetching shop items:", error);
        setLoading(false); // Ensure loading state is turned off on error
      }
    }

    fetchData();
  }, [shopId]);

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
            isEdit={() => setIsModalOpen(true)}
            isLogout={handleLogout}
            shopId={shopId}
            user={user}
            guestSides={guestSides}
            guestSideOfClerk={guestSideOfClerk}
            removeConnectedGuestSides={removeConnectedGuestSides}
          />
          <div style={{ marginTop: "5px" }}></div>
          <SearchInput />
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
