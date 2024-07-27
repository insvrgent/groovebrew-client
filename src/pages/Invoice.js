import React, { useEffect, useState } from "react";
import styles from "./Invoice.module.css";
import { useParams, useLocation } from "react-router-dom"; // Changed from useSearchParams to useLocation
import { ThreeDots, ColorRing } from "react-loader-spinner";

import ItemLister from "../components/ItemLister";
import { getCartDetails } from "../helpers/itemHelper";
import {
  handlePaymentFromClerk,
  handlePaymentFromGuestSide,
  handlePaymentFromGuestDevice,
} from "../helpers/transactionHelpers";

export default function Invoice({ sendParam, deviceType }) {
  const { shopId } = useParams();
  const location = useLocation(); // Use useLocation hook instead of useSearchParams
  const searchParams = new URLSearchParams(location.search); // Pass location.search directly

  const email = searchParams.get("email");
  const orderType = searchParams.get("orderType");
  const tableNumber = searchParams.get("tableNumber");

  useEffect(() => {
    sendParam(shopId);
  }, [sendParam, shopId]);

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false); // State for payment button loading animation

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCartDetails(shopId);
        setCartItems(items);

        // Calculate total price based on fetched cart items
        const totalPrice = items.reduce((total, itemType) => {
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
        tableNumber,
      );
    } else if (deviceType == "guestDevice") {
      const pay = await handlePaymentFromGuestSide(
        shopId,
        email,
        isCash ? "cash" : "cashless",
        orderType,
        tableNumber,
      );
    } else if (deviceType == "guestDevice") {
      const pay = await handlePaymentFromGuestDevice(
        shopId,
        isCash ? "cash" : "cashless",
        orderType,
        tableNumber,
      );
    }

    console.log("transaction from " + deviceType + "success");
    setIsPaymentLoading(false);
  };

  return (
    <div className={styles.Invoice}>
      <div style={{ marginTop: "30px" }}></div>
      <h2 className={styles["Invoice-title"]}>Invoice</h2>
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
        <h2 className={styles["Invoice-detail"]}>
          {orderType === "pickup"
            ? "Diambil di kasir"
            : `Diantar ke meja nomor ${tableNumber}`}
        </h2>
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
