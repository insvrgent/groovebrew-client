import React, { useState, useEffect } from "react";
import "./App.css";
import "./components/Loading.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import socket from "./services/socketService";

import API_BASE_URL from "./config.js";

import Dashboard from "./pages/Dashboard";
import ScanMeja from "./pages/ScanMeja";
import LoginPage from "./pages/LoginPage";
import CafePage from "./pages/CafePage";
import SearchResult from "./pages/SearchResult";
import Cart from "./pages/Cart";
import Invoice from "./pages/Invoice";
import Transactions from "./pages/Transactions";
import Footer from "./components/Footer";

import GuestSideLogin from "./pages/GuestSideLogin";
import GuestSide from "./pages/GuestSide";
import { getItemTypesWithItems } from "./helpers/itemHelper.js";
import { getTableByCode } from "./helpers/tableHelper.js";

import {
  getConnectedGuestSides,
  getClerks,
  removeConnectedGuestSides,
} from "./helpers/userHelpers.js";
import {
  getLocalStorage,
  removeLocalStorage,
} from "./helpers/localStorageHelpers";
import { calculateTotals } from "./helpers/cartHelpers";
import {
  subscribeUser,
  resetNotificationSubscription,
} from "./helpers/subscribeHelpers.js";
import Modal from "./components/Modal"; // Import your modal component

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [shopClerks, setShopClerks] = useState([]);
  const [guestSideOfClerk, setGuestSideOfClerk] = useState(null);
  const [guestSides, setGuestSides] = useState([]);
  const [shopId, setShopId] = useState("");
  const [table, setTable] = useState([]);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [deviceType, setDeviceType] = useState("");
  const [shop, setShop] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [nextModalContent, setNextModalContent] = useState(null);

  useEffect(() => {
    const calculateTotalsFromLocalStorage = () => {
      const { totalCount } = calculateTotals(shopId);
      setTotalItemsCount(totalCount);
    };

    calculateTotalsFromLocalStorage();

    const handleStorageChange = () => {
      calculateTotalsFromLocalStorage();
    };

    window.addEventListener("localStorageUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("localStorageUpdated", handleStorageChange);
    };
  }, [shopId]);

  const handleSetParam = async ({ shopId, tableCode }) => {
    setShopId(shopId);

    if (tableCode)
      if (table.length == 0) {
        const gettable = await getTableByCode(shopId, tableCode);
        if (gettable) setTable(gettable);
      }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("gettingItems");
      try {
        const { response, cafe, data } = await getItemTypesWithItems(shopId);
        if (response.status === 200) {
          setShop(cafe);
          setShopItems(data);

          // Filter out unavailable items
          const filteredData = data
            .map((itemType) => ({
              ...itemType,
              itemList: itemType.itemList.filter((item) => item.availability),
            }))
            .filter((itemType) => itemType.itemList.length > 0); // Remove empty itemTypes

          // Update local storage by removing unavailable items
          const updatedLocalStorage =
            JSON.parse(localStorage.getItem("cart")) || [];
          const newLocalStorage = updatedLocalStorage.map((cafe) => {
            if (cafe.cafeId === shopId) {
              return {
                ...cafe,
                items: cafe.items.filter((item) =>
                  filteredData.some((filtered) =>
                    filtered.itemList.some(
                      (i) => i.itemId === item.itemId && i.availability
                    )
                  )
                ),
              };
            }
            return cafe;
          });
          localStorage.setItem("cart", JSON.stringify(newLocalStorage));

          socket.on("transaction_created", () => {
            console.log("transaction created");
          });
        }
      } catch (error) {
        console.error("Error fetching shop items:", error);
      }
    };

    if (shopId !== "") fetchData();
  }, [shopId]);

  const rmConnectedGuestSides = async (gueseSideSessionId) => {
    const sessionLeft = await removeConnectedGuestSides(gueseSideSessionId);
    setGuestSides(sessionLeft.guestSideList);
  };

  // const checkNotifications = async (userId) => {
  //   try {
  //     const permissionGranted =
  //       await NotificationService.requestNotificationPermission(setModal);
  //     if (permissionGranted) {
  //       await SubscriptionService.subscribeUserToNotifications(userId);
  //     } else {
  //       setModal("blocked_notification");
  //       console.log("req notif");
  //     }
  //   } catch (error) {
  //     console.error("Error handling notifications:", error);
  //   }
  // };
  useEffect(() => {
    if (socket == null) return;

    if (getLocalStorage("authGuestSide")) {
      socket.emit("checkGuestSideToken", {
        token: getLocalStorage("authGuestSide"),
      });
    } else {
      socket.emit("checkUserToken", {
        token: getLocalStorage("auth"),
        shopId,
      });
    }

    //for guest
    socket.on("transaction_pending", async (data) => {
      console.log("transaction notification");
      // Call `setModal` with content and parameters
      setModal("transaction_pending", data);
    });

    socket.on("transaction_confirmed", async (data) => {
      console.log("transaction notification" + data);
      setModal("transaction_confirmed", data);
    });

    socket.on("transaction_success", async (data) => {
      console.log("transaction notification");
      setModal("transaction_success", data);
    });

    socket.on("transaction_end", async (data) => {
      console.log("transaction notification");
      setModal("transaction_end", data);
    });

    socket.on("payment_claimed", async (data) => {
      console.log(data);
      setModal("payment_claimed", data);
    });

    socket.on("transaction_failed", async (data) => {
      console.log("transaction notification");
      setModal("transaction_failed", data);
    });

    socket.on("transaction_canceled", async (data) => {
      console.log("transaction notification");
      setModal("transaction_canceled", data);
    });

    //for clerk
    socket.on("transaction_created", async (data) => {
      console.log("transaction notification");
      setModal("new_transaction", data);

      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("New Transaction", {
          body: `A new transaction was created: ${data.transactionDetails}`, // Customize as needed
          icon: "icon.png", // Optional icon
        });
      });
    });

    socket.on("checkUserTokenRes", async (data) => {
      if (data.status !== 200) {
        removeLocalStorage("auth");
        setDeviceType("guestDevice");
      } else {
        setUser(data.data.user);
        if (
          data.data.user.password == "unsetunsetunset" &&
          localStorage.getItem("settings")
        )
          setModal("complete_account");
        if (data.data.user.cafeId == shopId) {
          const connectedGuestSides = await getConnectedGuestSides();
          setGuestSides(connectedGuestSides.sessionDatas);
          console.log("getting guest side");
          setDeviceType("clerk");

          // checkNotifications(data.data.user.userId);
        } else {
          setDeviceType("guestDevice");
        }
        if (data.data.user.roleId == 1 && user.userId == shop.ownerId) {
          // shopClerks is can only be obtained by the shop owner
          // so every user that is admin will try to getting shopClerks, even not yet proven that this is their shop
          const shopClerks = await getClerks(shopId);
          if (shopClerks != null) setShopClerks(shopClerks);
        }
      }
    });

    socket.on("checkGuestSideTokenRes", (data) => {
      if (data.status !== 200) {
        removeLocalStorage("authGuestSide");
        navigate("/guest-side");
      } else {
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

    return () => {
      socket.off("signout-guest-session");
    };
  }, [socket, shopId]);

  const handleModalFromURL = () => {
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get("modal");
    if (modal) setModal(modal);
  };

  useEffect(() => {
    handleModalFromURL();
  }, [shopId]);

  useEffect(() => {
    console.log(shopId + table?.tableCode);
  }, [navigate]);

  // Function to open the modal
  const setModal = (content, params = {}) => {
    if (modalContent) {
      setNextModalContent(content);
      return;
    } // Prepare query parameters
    const queryParams = new URLSearchParams(location.search);

    // Update the modal and any additional params
    queryParams.set("modal", content);
    Object.entries(params).forEach(([key, value]) => {
      queryParams.set(key, value);
    });

    // Update URL with new parameters
    navigate(`?${queryParams.toString()}`, { replace: true });

    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";

    setIsModalOpen(true);
    setModalContent(content);
  };

  // Function to close the modal
  const closeModal = (closeTheseContent = []) => {
    if (
      Array.isArray(closeTheseContent) &&
      (closeTheseContent.length === 0 ||
        closeTheseContent.includes(modalContent))
    ) {
      setIsModalOpen(false);
      document.body.style.overflow = "auto";

      const queryParams = new URLSearchParams(location.search);

      // Remove the 'modal' parameter
      queryParams.delete("modal");
      queryParams.delete("transactionId");

      // Update the URL without the 'modal' parameter
      navigate({ search: queryParams.toString() }, { replace: true });

      if (nextModalContent) setModal(nextModalContent);
      setNextModalContent("");
    }
  };

  useEffect(() => {
    const askNotificationPermission = async () => {
      let permission = Notification.permission;

      // Check current permission
      if (permission === "default") {
        setModal("req_notification");

        // Request permission and wait for the result
        permission = await Notification.requestPermission();
      }

      // If permission is already granted, reset subscriptions
      if (permission === "granted") {
        await resetNotificationSubscription();
        closeModal(["req_notification", "denied_notification"]);
      } else if (permission === "denied") {
        setModal("blocked_notification");
        console.error("Notification permission denied.");
      }

      // Continuously check until permission is granted
      while (permission !== "granted") {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
        const permissionn = Notification.permission;

        if (permissionn === "granted") {
          closeModal(["req_notification", "denied_notification"]);
          await resetNotificationSubscription();
          break;
        } else if (permissionn === "denied") {
          setModal("blocked_notification");
          console.error("Notification permission denied.");
          break;
        }
      }
    };
    const handleLoad = async () => {
      if (user != null && (user.roleId < 3 || user.roleId > 2)) {
        await askNotificationPermission();
      }
    };
    handleLoad();
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", handleLoad);

      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener("load", handleLoad);
      };
    }
  }, [user]);

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard user={user} socket={socket} setModal={setModal} />
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/scan"
            element={
              <>
                <ScanMeja
                  sendParam={handleSetParam}
                  shopName={shop.name}
                  shopOwnerId={shop.ownerId}
                  shopItems={shopItems}
                  shopClerks={shopClerks}
                  socket={socket}
                  user={user}
                  guestSides={guestSides}
                  guestSideOfClerk={guestSideOfClerk}
                  removeConnectedGuestSides={rmConnectedGuestSides}
                  setModal={setModal} // Pass the function to open modal
                />
              </>
            }
          />
          <Route
            path="/:shopId/:tableCode?"
            element={
              <>
                <CafePage
                  table={table}
                  sendParam={handleSetParam}
                  shopName={shop.name}
                  shopOwnerId={shop.ownerId}
                  shopItems={shopItems}
                  shopClerks={shopClerks}
                  socket={socket}
                  user={user}
                  guestSides={guestSides}
                  guestSideOfClerk={guestSideOfClerk}
                  removeConnectedGuestSides={rmConnectedGuestSides}
                  setModal={setModal} // Pass the function to open modal
                />
                <Footer
                  showTable={true}
                  shopId={shopId}
                  table={table}
                  cartItemsLength={totalItemsCount}
                  selectedPage={0}
                />
              </>
            }
          />
          <Route
            path="/:shopId/:tableCode?/search"
            element={
              <>
                <SearchResult
                  cafeId={shopId}
                  sendParam={handleSetParam}
                  user={user}
                  shopItems={shopItems}
                  guestSides={guestSides}
                  guestSideOfClerk={guestSideOfClerk}
                  removeConnectedGuestSides={rmConnectedGuestSides}
                  setModal={setModal} // Pass the function to open modal
                />
                <Footer
                  shopId={shopId}
                  table={table}
                  cartItemsLength={totalItemsCount}
                  selectedPage={1}
                />
              </>
            }
          />
          <Route
            path="/:shopId/:tableCode?/cart"
            element={
              <>
                <Cart
                  table={table}
                  sendParam={handleSetParam}
                  socket={socket}
                  totalItemsCount={totalItemsCount}
                  deviceType={deviceType}
                />
                <Footer
                  shopId={shopId}
                  table={table}
                  cartItemsLength={totalItemsCount}
                  selectedPage={2}
                />
              </>
            }
          />
          <Route
            path="/:shopId/:tableCode?/invoice"
            element={
              <>
                <Invoice
                  table={table}
                  sendParam={handleSetParam}
                  socket={socket}
                  deviceType={deviceType}
                />
                <Footer
                  shopId={shopId}
                  table={table}
                  cartItemsLength={totalItemsCount}
                  selectedPage={2}
                />
              </>
            }
          />
          <Route
            path="/:shopId/:tableCode?/transactions"
            element={
              <>
                <Transactions
                  sendParam={handleSetParam}
                  deviceType={deviceType}
                />
                <Footer
                  shopId={shopId}
                  table={table}
                  cartItemsLength={totalItemsCount}
                  selectedPage={3}
                />
              </>
            }
          />
          <Route
            path="/:shopId/guest-side-login"
            element={<GuestSideLogin shopId={shopId} socket={socket} />}
          />
          <Route path="/guest-side" element={<GuestSide socket={socket} />} />
        </Routes>
      </header>
      <Modal
        shop={shop}
        isOpen={isModalOpen}
        modalContent={modalContent}
        onClose={closeModal}
      />
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
