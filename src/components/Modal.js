import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children }) => {
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
        {children}
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
