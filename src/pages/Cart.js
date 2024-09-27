import React, { useRef, useEffect, useState } from "react";
import styles from "./Invoice.module.css";
import { useParams } from "react-router-dom"; // Changed from useSearchParams to useLocation
import { ThreeDots, ColorRing } from "react-loader-spinner";

import ItemLister from "../components/ItemLister";
import { getCartDetails } from "../helpers/itemHelper";
import {
  handlePaymentFromClerk,
  handlePaymentFromGuestSide,
  handlePaymentFromGuestDevice,
} from "../helpers/transactionHelpers";

export default function Invoice({ table, sendParam, deviceType, socket }) {
  const { shopId, tableCode } = useParams();
  sendParam({ shopId, tableCode });

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false); // State for payment button loading animation

  const textareaRef = useRef(null);
  const [orderType, setOrderType] = useState("pickup");
  const [tableNumber, setTableNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCartDetails(shopId);
        console.log(items);

        // Filter out unavailable items
        const filteredItems = items
          .map((itemType) => ({
            ...itemType,
            itemList: itemType.itemList.filter((item) => item.availability),
          }))
          .filter((itemType) => itemType.itemList.length > 0); // Remove empty itemTypes

        setCartItems(filteredItems);

        // Update local storage by removing unavailable items
        const updatedLocalStorage =
          JSON.parse(localStorage.getItem("cart")) || [];
        const newLocalStorage = updatedLocalStorage.map((cafe) => {
          if (cafe.cafeId === shopId) {
            return {
              ...cafe,
              items: cafe.items.filter((item) =>
                filteredItems.some((filtered) =>
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

        window.dispatchEvent(new Event("localStorageUpdated"));
        // Calculate total price based on filtered cart items
        const totalPrice = filteredItems.reduce((total, itemType) => {
          return (
            total +
            itemType.itemList.reduce((subtotal, item) => {
              return subtotal + item.qty * item.price;
            }, 0)
          );
        }, 0);
        setTotalPrice(totalPrice);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        // Handle error if needed
      }
    };

    fetchCartItems();
  }, [shopId]);

  const handlePay = async (isCash) => {
    setIsPaymentLoading(true);
    console.log("tipe" + deviceType);
    if (deviceType == "clerk") {
      const pay = await handlePaymentFromClerk(
        shopId,
        email,
        isCash ? "cash" : "cashless",
        orderType,
        tableNumber
      );
    } else if (deviceType == "guestSide") {
      const pay = await handlePaymentFromGuestSide(
        shopId,
        email,
        isCash ? "cash" : "cashless",
        orderType,
        tableNumber
      );
    } else if (deviceType == "guestDevice") {
      const socketId = socket.id;
      const pay = await handlePaymentFromGuestDevice(
        shopId,
        isCash ? "cash" : "cashless",
        orderType,
        table.tableNo || tableNumber,
        textareaRef.current.value,
        socketId
      );
    }

    console.log("transaction from " + deviceType + "success");
    setIsPaymentLoading(false);
  };

  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      const handleResize = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      };

      handleResize(); // Initial resize

      textarea.addEventListener("input", handleResize);
      return () => textarea.removeEventListener("input", handleResize);
    }
  }, [textareaRef.current]);

  useEffect(() => {
    if (table?.tableId != undefined) setOrderType("serve");
    console.log(table);
  }, [table]);

  const handleOrderTypeChange = (event) => {
    setOrderType(event.target.value);
  };

  const handleTableNumberChange = (event) => {
    setTableNumber(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  return (
    <div className={styles.Invoice}>
      <div style={{ marginTop: "30px" }}></div>
      <h2 className={styles["Invoice-title"]}>Cart</h2>
      <div style={{ marginTop: "30px" }}></div>
      <div className={styles.RoundedRectangle}>
        {cartItems.map((itemType) => (
          <ItemLister
            shopId={shopId}
            forInvoice={true}
            key={itemType.id}
            typeName={itemType.typeName}
            itemList={itemType.itemList}
          />
        ))}

        <div className={styles.OrderTypeContainer}>
          <span htmlFor="orderType">Order Type:</span>
          <select
            id="orderType"
            value={orderType}
            onChange={handleOrderTypeChange}
          >
            {table != null && (
              <option value="serve">Serve to table {table.tableNo}</option>
            )}
            <option value="pickup">Pickup</option>
            {table == null && <option value="serve">Serve</option>}

            {/* tableId harus di check terlebih dahulu untuk mendapatkan tableNo */}
          </select>
        </div>
        {orderType === "serve" && table.length < 1 && (
          <div className={styles.OrderTypeContainer}>
            <span htmlFor="orderType">Serve to:</span>
            <input
              type="text"
              placeholder="Table Number"
              value={tableNumber}
              onChange={handleTableNumberChange}
              className={styles.TableNumberInput}
            />
          </div>
        )}

        <div className={styles.NoteContainer}>
          <span>Note :</span>
          <span></span>
        </div>

        <div className={styles.NoteContainer}>
          <textarea
            ref={textareaRef}
            className={styles.NoteInput}
            placeholder="Add a note..."
          />
        </div>
        <div className={styles.TotalContainer}>
          <span>Total:</span>
          <span>Rp {totalPrice}</span>
        </div>
      </div>
      <div className={styles.PaymentOption}>
        <div className={styles.TotalContainer}>
          <span>Payment Option</span>
          <span></span>
        </div>
        <button className={styles.PayButton} onClick={() => handlePay(false)}>
          {isPaymentLoading ? (
            <ColorRing height="50" width="50" color="white" />
          ) : (
            "Cashless"
          )}
        </button>
        <div className={styles.Pay2Button} onClick={() => handlePay(true)}>
          {isPaymentLoading ? (
            <ColorRing height="12" width="12" color="white" />
          ) : (
            "Cash"
          )}
        </div>
      </div>
      <div className={styles.PaymentOptionMargin}></div>
    </div>
  );
}
