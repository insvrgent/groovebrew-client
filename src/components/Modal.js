import React from "react";
import styles from "./Modal.module.css";
import TablesPage from "./TablesPage.js";
import TableMaps from "../components/TableMaps";
import Transactions from "../pages/Transactions";

const Modal = ({ shopId, isOpen, onClose, modalContent }) => {
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

  return (
    <div onClick={handleOverlayClick} className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
        {modalContent === "edit_tables" && <TablesPage shopId={shopId} />}
        {modalContent === "new_transaction" && (
          <Transactions propsShopId={shopId} />
        )}
      </div>
    </div>
  );
};

export default Modal;
