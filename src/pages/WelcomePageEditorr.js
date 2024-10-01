import React, { useRef, useEffect, useState } from "react";
import styles from "./Cart.module.css";
import ItemLister from "../components/ItemLister";
import { ThreeDots, ColorRing } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import { useNavigationHelpers } from "../helpers/navigationHelpers";
import { getTable } from "../helpers/tableHelper.js";
import { getCartDetails } from "../helpers/itemHelper.js";
import { getItemsByCafeId } from "../helpers/cartHelpers"; // Import getItemsByCafeId
import Modal from "../components/Modal"; // Import the reusable Modal component

export default function Cart({}) {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderType, setOrderType] = useState("serve");
  const [loading, setLoading] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false); // State for checkout button loading animation
  const [email, setEmail] = useState("");

  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const items = await getCartDetails("8");
        setLoading(false);
        console.log(items);
        if (items) setCartItems(items);

        const initialTotalPrice = items.reduce((total, itemType) => {
          return (
            total +
            itemType.itemList.reduce((subtotal, item) => {
              return subtotal + item.qty * item.price;
            }, 0)
          );
        }, 0);
        setTotalPrice(initialTotalPrice);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();

    const textarea = textareaRef.current;
    if (textarea) {
      const handleResize = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      };
      textarea.addEventListener("input", handleResize);
      handleResize();
      return () => textarea.removeEventListener("input", handleResize);
    }
  }, []);

  const refreshTotal = async () => {
    try {
      const items = await getItemsByCafeId("8");
      const updatedTotalPrice = items.reduce((total, localItem) => {
        const cartItem = cartItems.find((itemType) =>
          itemType.itemList.some((item) => item.itemId === localItem.itemId)
        );

        if (cartItem) {
          const itemDetails = cartItem.itemList.find(
            (item) => item.itemId === localItem.itemId
          );
          return total + localItem.qty * itemDetails.price;
        }
        return total;
      }, 0);

      setTotalPrice(updatedTotalPrice);
    } catch (error) {
      console.error("Error refreshing total price:", error);
    }
  };
  return (
    <div className={styles.Cart}>
      <div style={{ marginTop: "30px" }}></div>
      <h2 className={styles["Cart-title"]}></h2>
      <div style={{ marginTop: "-45px" }}></div>
      {cartItems.map((itemType) => (
        <ItemLister
          key={itemType.itemTypeId}
          refreshTotal={refreshTotal}
          forCart={true}
          typeName={itemType.typeName}
          itemList={itemType.itemList}
        />
      ))}
      <div className={styles.OrderTypeContainer}>
        {orderType === "serve" && (
          <input
            type="text"
            placeholder="Table Number"
            className={styles.TableNumberInput}
          />
        )}
      </div>

      <div className={styles.NoteContainer}>
        <span>Note</span>
        <span></span>
      </div>

      <textarea
        ref={textareaRef}
        className={styles.NoteInput}
        placeholder="Add a note..."
      />

      <div className={styles.TotalContainer}>
        <span>Total:</span>
        <span>Rp {totalPrice}</span>
      </div>
      <button className={styles.CheckoutButton}>
        {isCheckoutLoading ? (
          <ColorRing height="50" width="50" color="white" />
        ) : (
          "Checkout"
        )}
      </button>
      <div className={styles.BackToMenu}>Back to menu</div>
    </div>
  );
}
