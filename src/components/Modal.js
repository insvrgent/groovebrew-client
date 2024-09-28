import React from "react";
import styles from "./Modal.module.css";
import TablesPage from "./TablesPage.js";
import PaymentOptions from "./PaymentOptions.js";
import TableMaps from "../components/TableMaps";
import Transaction from "../pages/Transaction";
import Transaction_pending from "../pages/Transaction_pending";
import Transaction_confirmed from "../pages/Transaction_confirmed";
import Transaction_success from "../pages/Transaction_success";
import Transaction_end from "../pages/Transaction_end";
import Transaction_failed from "../pages/Transaction_failed";
import Payment_claimed from "../pages/Payment_claimed";
import MaterialList from "../pages/MaterialList.js";
import MaterialMutationsPage from "../pages/MaterialMutationsPage.js";
import Reports from "../pages/Reports.js";
import NotificationBlocked from "../pages/NotificationBlocked.js";

const Modal = ({ shop, isOpen, onClose, modalContent }) => {
  if (!isOpen) return null;

  // Function to handle clicks on the overlay
  const handleOverlayClick = (event) => {
    // Close the modal only if the overlay is clicked
    onClose();
  };

  // Function to handle clicks on the modal content
  const handleContentClick = (event) => {
    // Prevent click event from propagating to the overlay
    event.stopPropagation();
  };
  console.log(shop.qrPayment);
  return (
    <div onClick={handleOverlayClick} className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
        {modalContent === "req_notification" && <NotificationBlocked />}
        {modalContent === "blocked_notification" && <NotificationBlocked />}
        {modalContent === "edit_tables" && <TablesPage shop={shop} />}
        {modalContent === "new_transaction" && (
          <Transaction propsShopId={shop.cafeId} />
        )}
        {modalContent === "transaction_canceled" && (
          <Transaction propsShopId={shop.cafeId} />
        )}
        {modalContent === "transaction_pending" && <Transaction_pending />}
        {modalContent === "transaction_confirmed" && (
          <Transaction_confirmed paymentUrl={shop.qrPayment} />
        )}
        {modalContent === "payment_claimed" && (
          <Payment_claimed paymentUrl={shop.qrPayment} />
        )}
        {modalContent === "transaction_success" && <Transaction_success />}
        {modalContent === "transaction_end" && <Transaction_end />}
        {modalContent === "transaction_failed" && <Transaction_failed />}
        {modalContent === "payment_option" && (
          <PaymentOptions shopId={shop.cafeId} />
        )}
        {modalContent === "add_material" && (
          <MaterialList cafeId={shop.cafeId} />
        )}
        {modalContent === "update_stock" && (
          <MaterialMutationsPage cafeId={shop.cafeId} />
        )}
        {modalContent === "reports" && <Reports cafeId={shop.cafeId} />}
      </div>
    </div>
  );
};

export default Modal;
