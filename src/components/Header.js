import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useLocation } from "react-router-dom";
import { useNavigationHelpers } from "../helpers/navigationHelpers";

const HeaderBar = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 15px;
  color: black;
  background-color: white;
`;

const Title = styled.h2`
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-style: normal;
  font-size: 32px;
  color: rgba(88, 55, 50, 1);
`;

const ProfileName = styled.h2`
  position: absolute;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-style: normal;
  font-size: 30px;
  z-index: 11;
  overflow: hidden;
  white-space: nowrap;
  animation: ${(props) => {
      if (props.animate === "grow") return gg;
      if (props.animate === "shrink") return ss;
      return nn;
    }}
    0.5s forwards;
`;

const nn = keyframes`
  0% {
    top: 20px;
    right: 30px;
    width: 0ch;
    height: 60px;
  }
  100% {
    top: 20px;
    right: 30px;
    width: 0ch;
    height: 60px;
  }
`;

const gg = keyframes`
  0% {
    top: 20px;
    right: 30px;
    width: 0ch;
    height: 60px;
  }
  100% {
    top: 34px;
    right: 30px;
    width: 200px; /* Adjust this value based on the length of the text */
    height: 60px;
  }
`;

const ss = keyframes`
  0% {
    top: 34px;
    right: 30px;
    width: 200px; /* Adjust this value based on the length of the text */
    height: 60px;
  }
  100% {
    top: 20px;
    right: 30px;
    width: 0ch;
    height: 60px;
  }
`;

const ProfileImage = styled.img`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 12;
  animation: ${(props) => {
      if (props.animate === "grow") return g;
      if (props.animate === "shrink") return s;
      return "none";
    }}
    0.5s forwards;
`;

const g = keyframes`
  0% {
    top: 0px;
    right: 0px;
    width: 60px;
    height: 60px;
  }
  100% {
    top: 10px;
    right: 220px;
    width: 60px;
    height: 60px;
  }
`;

const s = keyframes`
  0% {
    top: 10px;
    right: 220px;
    width: 60px;
    height: 60px;
  }
  100% {
    top: 0px;
    right: 0px;
    width: 60px;
    height: 60px;
  }
`;

const grow = keyframes`
  0% {
    width: 60px;
    height: 60px;
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
  }
  100% {
    width: 300px;
    height: auto;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
`;

const shrink = keyframes`
  0% {
    width: 300px;
    height: auto;
    border-radius: 20px;
  }
  100% {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
`;

const Rectangle = styled.div`
  position: absolute;
  top: 45px;
  right: 15px;
  width: 200px;
  height: auto;
  background-color: white;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: ${(props) => (props.animate === "grow" ? grow : shrink)} 0.5s
    forwards;
  overflow: hidden;
  padding: 10px;
  box-sizing: border-box;
`;

const ChildContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  flex-wrap: wrap;
  padding-top: 70px;
`;

const ChildWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Child = styled.div`
  width: 100%;
  height: 40px;
  margin: 5px;
  background-color: rgba(88, 55, 50, 0.2);
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  padding-top: 10px;
  padding-left: 5px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-style: normal;

  ${(props) =>
    props.hasChildren &&
    `
    height: auto;
    padding-bottom: 10px;
  `}
`;

const Header = ({
  HeaderText,
  shopId,
  shopName,
  shopOwnerId,
  shopClerks,
  tableId,
  showProfile,
  user,
  setModal,
  isLogout,
  guestSides,
  guestSideOfClerk,
  removeConnectedGuestSides,
}) => {
  const { goToLogin, goToGuestSideLogin, goToAdminCafes } =
    useNavigationHelpers(shopId, tableId);
  const [showRectangle, setShowRectangle] = useState(false);
  const [animate, setAnimate] = useState("");
  const rectangleRef = useRef(null);
  const [guestSideOf, setGuestSideOf] = useState(null);
  const location = useLocation();

  const handleImageClick = () => {
    if (showRectangle) {
      setAnimate("shrink");
      setTimeout(() => setShowRectangle(false), 500);
    } else {
      setAnimate("grow");
      setShowRectangle(true);
    }
  };

  const handleClickOutside = (event) => {
    if (rectangleRef.current && !rectangleRef.current.contains(event.target)) {
      setAnimate("shrink");
      setTimeout(() => setShowRectangle(false), 500);
    }
  };

  const handleScroll = () => {
    if (showRectangle) {
      setAnimate("shrink");
      setTimeout(() => setShowRectangle(false), 500);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const hasModalParam = queryParams.has("modal");

    if (showRectangle && !hasModalParam) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showRectangle, location.search]);

  useEffect(() => {
    setGuestSideOf(guestSideOfClerk);
    console.log(guestSideOfClerk);
  }, [guestSideOfClerk]);

  return (
    <HeaderBar>
      <Title>{HeaderText}</Title>
      <div style={{ visibility: showProfile ? "visible" : "hidden" }}>
        <ProfileImage
          src="https://static-00.iconduck.com/assets.00/profile-major-icon-1024x1024-9rtgyx30.png"
          alt="Profile"
          onClick={handleImageClick}
          animate={showRectangle && animate}
        />
        <ProfileName animate={showRectangle && animate}>
          {showProfile && user.username !== undefined ? user.username : "guest"}
        </ProfileName>
        {showRectangle && (
          <Rectangle ref={rectangleRef} animate={animate}>
            <ChildContainer>
              {guestSideOfClerk && guestSideOfClerk.clerkUsername && (
                <Child hasChildren>
                  this is the guest side of {guestSideOfClerk.clerkUsername}
                </Child>
              )}
              {user.username === undefined && !guestSideOfClerk && (
                <Child onClick={goToLogin}>Click to login</Child>
              )}
              {user.username !== undefined && (
                <Child onClick={() => setModal("edit_account")}>Edit</Child>
              )}
              {shopId &&
                user.userId == shopOwnerId &&
                user.username !== undefined &&
                user.roleId === 1 && (
                  <>
                    <Child onClick={goToAdminCafes}>see your other cafes</Child>
                    <Child onClick={() => setModal("edit_tables")}>
                      {shopName} table maps
                    </Child>
                    <Child hasChildren>
                      {shopName} clerks
                      <Child onClick={() => setModal("craete_account_clerk")}>
                        + Add clerk
                      </Child>
                      {shopClerks &&
                        shopClerks.map((key, index) => (
                          <Child key={index}>
                            {shopClerks[index].username}
                            <button
                              onClick={() =>
                                removeConnectedGuestSides(guestSides[index][3])
                              }
                            >
                              remove
                            </button>
                          </Child>
                        ))}
                    </Child>
                    <Child onClick={() => setModal("add_material")}>
                      add material
                    </Child>
                  </>
                )}
              {user.username !== undefined &&
                ((user.userId == shopOwnerId && user.roleId === 1) ||
                  (user.cafeId == shopId && user.roleId === 2)) && (
                  <Child onClick={() => setModal("update_stock")}>
                    update stock
                  </Child>
                )}
              {user.username !== undefined &&
                user.roleId == 2 &&
                user.cafeId == shopId && (
                  <Child hasChildren>
                    connected guest sides
                    <Child onClick={goToGuestSideLogin}>+ Add guest side</Child>
                    {guestSides &&
                      guestSides.map((key, index) => (
                        <Child key={index}>
                          guest side {index + 1}
                          <button
                            onClick={() =>
                              removeConnectedGuestSides(guestSides[index][3])
                            }
                          >
                            remove
                          </button>
                        </Child>
                      ))}
                  </Child>
                )}
              {user.username !== undefined && (
                <Child onClick={isLogout}>Logout</Child>
              )}
            </ChildContainer>
          </Rectangle>
        )}
      </div>
    </HeaderBar>
  );
};

export default Header;
