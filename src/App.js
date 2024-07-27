// App.js

import "./App.css";
import "./components/Loading.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import socket from "./services/socketService";

import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import CafePage from "./pages/CafePage";
import Cart from "./pages/Cart";
import Invoice from "./pages/Invoice";
import Footer from "./components/Footer";

import GuestSideLogin from "./pages/GuestSideLogin";
import GuestSide from "./pages/GuestSide";

import {
  // checkToken,
  getConnectedGuestSides,
  removeConnectedGuestSides,
} from "./helpers/userHelpers.js";
import {
  getLocalStorage,
  removeLocalStorage,
} from "./helpers/localStorageHelpers";
import { calculateTotals } from "./helpers/cartHelpers";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [guestSideOfClerk, setGuestSideOfClerk] = useState(null);
  const [guestSides, setGuestSides] = useState([]);
  const [shopId, setShopId] = useState("");
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [deviceType, setDeviceType] = useState("");

  useEffect(() => {
    // Function to calculate totals from localStorage
    const calculateTotalsFromLocalStorage = () => {
      const { totalCount } = calculateTotals(shopId);
      setTotalItemsCount(totalCount);
    };

    // Initial calculation on component mount
    calculateTotalsFromLocalStorage();

    // Function to handle localStorage change event
    const handleStorageChange = () => {
      calculateTotalsFromLocalStorage();
    };

    // Subscribe to custom localStorage change event
    window.addEventListener("localStorageUpdated", handleStorageChange);

    return () => {
      // Clean up: Remove event listener on component unmount
      window.removeEventListener("localStorageUpdated", handleStorageChange);
    };
  }, [shopId]);

  // Function to handle setting parameters from CafePage
  const handleSetParam = (param) => {
    setShopId(param);
  };

  const rmConnectedGuestSides = async (gueseSideSessionId) => {
    const sessionLeft = await removeConnectedGuestSides(gueseSideSessionId);
    setGuestSides(sessionLeft.guestSideList);
  };

  // useEffect(() => {
  //   const validateToken = async () => {
  //     const checkedtoken = await checkToken(socket.id);
  //     if (checkedtoken.ok) {
  //       setUser(checkedtoken.user.user);
  //       if (checkedtoken.user.user.cafeId == shopId) {
  //         const connectedGuestSides = await getConnectedGuestSides();
  //         setGuestSides(connectedGuestSides.sessionDatas);
  //         setDeviceType("clerk");
  //       } else {
  //         setDeviceType("guestDevice");
  //       }
  //     }
  //   };
  //   validateToken();
  // }, [navigate, socket, shopId]);

  useEffect(() => {
    if (getLocalStorage("auth")) {
      console.log("emitting");
      socket.emit("checkUserToken", {
        token: getLocalStorage("auth"),
      });
    } else if (getLocalStorage("authGuestSide")) {
      socket.emit("checkGuestSideToken", {
        token: getLocalStorage("authGuestSide"),
      });
    }
    setDeviceType("guestDevice");

    socket.on("transaction_created", async (data) => {
      console.log("transaction notification");
    });

    socket.on("checkUserTokenRes", async (data) => {
      if (data.status !== 200) {
        removeLocalStorage("authGuestSide");
        removeLocalStorage("auth");
        console.log("auth failed");
      } else {
        console.log("auth success");
        console.log(data.data.user);

        setUser(data.data.user);
        if (data.data.user.cafeId == shopId) {
          const connectedGuestSides = await getConnectedGuestSides();
          setGuestSides(connectedGuestSides.sessionDatas);
          setDeviceType("clerk");
        } else {
          setDeviceType("guestDevice");
        }
      }
    });

    socket.on("checkGuestSideTokenRes", (data) => {
      if (data.status !== 200) {
        removeLocalStorage("authGuestSide");
        removeLocalStorage("auth");
        navigate("/guest-side");
        console.log("isntguestside");
      } else {
        console.log("isguestside");
        setGuestSideOfClerk({
          clerkId: data.sessionData.clerkId,
          clerkUsername: data.sessionData.clerkUsername,
        });
        setDeviceType("guestSide");
      }
    });

    socket.on("signout-guest-session", () => {
      navigate("/guest-side");
    });

    // Clean up on component unmount
    return () => {
      socket.off("signout-guest-session");
    };
  }, [navigate, socket]);

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Dashboard user={user} />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <LoginPage />
              </>
            }
          />
          <Route
            path="/:shopId"
            element={
              <>
                <CafePage
                  sendParam={handleSetParam}
                  socket={socket}
                  user={user} // if logged
                  guestSides={guestSides} // if being clerk
                  guestSideOfClerk={guestSideOfClerk} // if being guest side
                  removeConnectedGuestSides={(e) => rmConnectedGuestSides(e)}
                />
                <Footer shopId={shopId} cartItemsLength={totalItemsCount} />
              </>
            }
          />
          <Route
            path="/:shopId/cart"
            element={
              <>
                <Cart
                  sendParam={handleSetParam}
                  totalItemsCount={totalItemsCount}
                />
                <Footer shopId={shopId} cartItemsLength={totalItemsCount} />
              </>
            }
          />
          <Route
            path="/:shopId/invoice"
            element={
              <>
                <Invoice sendParam={handleSetParam} deviceType={deviceType} />
                <Footer shopId={shopId} cartItemsLength={totalItemsCount} />
              </>
            }
          />

          <Route
            path="/:shopId/guest-side-login"
            element={
              <>
                <GuestSideLogin shopId={shopId} socket={socket} />
              </>
            }
          />
          <Route
            path="/guest-side"
            element={
              <>
                <GuestSide socket={socket} />
              </>
            }
          />
        </Routes>
      </header>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
