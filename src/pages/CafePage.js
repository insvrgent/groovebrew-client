// src/CafePage.js

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";

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
  table,
  sendParam,
  shopName,
  shopOwnerId,
  shopItems,
  shopClerks,
  socket,
  user,
  guestSides,
  guestSideOfClerk,
  removeConnectedGuestSides,
  setModal,
}) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { shopId, tableCode } = useParams();
  sendParam({ shopId, tableCode });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [screenMessage, setScreenMessage] = useState("");

  const [isSpotifyNeedLogin, setNeedSpotifyLogin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [filterId, setFilterId] = useState(0);

  useEffect(() => {
    if (user.cafeId != null && user.cafeId !== shopId) {
      // Preserve existing query parameters
      const currentParams = new URLSearchParams(location.search).toString();
      
      // Navigate to the new cafeId while keeping existing params
      navigate(`/${user.cafeId}?${currentParams}`, { replace: true });
    }
  }, [user, shopId]);
  

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
            shopOwnerId={shopOwnerId}
            shopClerks={shopClerks}
            tableCode={table.tableCode}
            user={user}
            guestSides={guestSides}
            guestSideOfClerk={guestSideOfClerk}
            removeConnectedGuestSides={removeConnectedGuestSides}
            setIsEditMode={(e) => setIsEditMode(e)}
            isEditMode={isEditMode}
          />
          <div style={{ marginTop: "5px" }}></div>
          <SearchInput shopId={shopId} tableCode={table.tableCode} />
          <div style={{ marginTop: "15px" }}></div>
          <ItemTypeLister
            user={user}
            shopOwnerId={shopOwnerId}
            shopId={shopId}
            itemTypes={shopItems}
            isEditMode={isEditMode}
            onFilterChange={(e) => setFilterId(e)}
            filterId={filterId}
          />
          <div style={{ marginTop: "-13px" }}></div>
          {filterId === 0 ? (
            <>
              <h2 className="title">Music Req.</h2>
              <MusicPlayer
                socket={socket}
                shopId={shopId}
                user={user}
                isSpotifyNeedLogin={isSpotifyNeedLogin}
              />
            </>
          ) : (
            <div style={{ marginTop: "35px" }}></div>
          )}

          <div style={{ marginTop: "-15px" }}></div>
          {shopItems
            .filter(
              (itemType) => filterId == 0 || itemType.itemTypeId === filterId
            )
            .map((itemType) => (
              <ItemLister
                shopId={shopId}
                shopOwnerId={shopOwnerId}
                user={user}
                key={itemType.itemTypeId}
                itemTypeId={itemType.itemTypeId}
                typeName={itemType.name}
                itemList={itemType.itemList}
                isEditMode={isEditMode}
                raw={isEditMode || filterId == 0 ? false : true}
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
