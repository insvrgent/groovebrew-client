import React, { useState, useEffect, useRef } from "react";
import styles from "./Footer.module.css"; // assuming you have a CSS module for Footer
import { useNavigationHelpers } from "../helpers/navigationHelpers";

export default function Footer({
  showTable,
  shopId,
  table,
  cartItemsLength,
  selectedPage,
}) {
  const {
    goToShop,
    goToSearch,
    goToCart,
    goToTransactions,
    goToScan,
    goToNonTable,
  } = useNavigationHelpers(shopId, table.tableCode);

  const [isStretched, setIsStretched] = useState(false);
  const scanMejaRef = useRef(null);

  const handleScanMejaClick = () => {
    if (table) {
      setIsStretched(true);
    } else {
      goToTransactions();
    }
  };

  const handleHapusMeja = (event) => {
    event.stopPropagation(); // Ensure click event doesn't propagate
    goToNonTable();
    setIsStretched(false);
  };

  const handleClickOutside = (event) => {
    if (scanMejaRef.current && !scanMejaRef.current.contains(event.target)) {
      setIsStretched(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.footerContainer}>
      <div className={styles.item}>
        <div className={styles["footer-rect"]}>
          {/* Shop Icon */}
          <div onClick={goToShop} className={styles["footer-icon"]}>
            <svg
              viewBox="0 0 34 34"
              style={{ fill: selectedPage === 0 ? "black" : "#8F8787" }}
            >
              <path d="M14.0834 29.1667V18.9167H20.9167V29.1667H29.4584V15.5H34.5834L17.5001 0.125L0.416748 15.5H5.54175V29.1667H14.0834Z" />
            </svg>
          </div>

          {/* Search Icon */}
          <div onClick={goToSearch} className={styles["footer-icon"]}>
            <svg
              viewBox="0 0 34 34"
              style={{ fill: selectedPage === 1 ? "black" : "#8F8787" }}
            >
              <path d="M20.8333 18.3333H19.5167L19.05 17.8833C20.6833 15.9833 21.6667 13.5167 21.6667 10.8333C21.6667 4.85 16.8167 0 10.8333 0C4.85 0 0 4.85 0 10.8333C0 16.8167 4.85 21.6667 10.8333 21.6667C13.5167 21.6667 15.9833 20.6833 17.8833 19.05L18.3333 19.5167V20.8333L26.6667 29.15L29.15 26.6667L20.8333 18.3333ZM10.8333 18.3333C6.68333 18.3333 3.33333 14.9833 3.33333 10.8333C3.33333 6.68333 6.68333 3.33333 10.8333 3.33333C14.9833 3.33333 18.3333 6.68333 18.3333 10.8333C18.3333 14.9833 14.9833 18.3333 10.8333 18.3333Z" />
            </svg>
          </div>

          {/* Cart Icon */}
          <div onClick={goToCart} className={styles["footer-icon"]}>
            {cartItemsLength !== 0 && (
              <div className={styles.circle}>{cartItemsLength}</div>
            )}
            <svg
              viewBox="0 0 34 34"
              style={{ fill: selectedPage === 2 ? "black" : "#8F8787" }}
            >
              <path d="M9.79175 24.75C8.09591 24.75 6.72383 26.1375 6.72383 27.8333C6.72383 29.5292 8.09591 30.9167 9.79175 30.9167C11.4876 30.9167 12.8751 29.5292 12.8751 27.8333C12.8751 26.1375 11.4876 24.75 9.79175 24.75ZM0.541748 0.0833435V3.16668H3.62508L9.17508 14.8679L7.09383 18.645C6.84717 19.0767 6.70842 19.5854 6.70842 20.125C6.70842 21.8208 8.09591 23.2083 9.79175 23.2083H28.2917V20.125H10.4392C10.2234 20.125 10.0538 19.9554 10.0538 19.7396L10.1001 19.5546L11.4876 17.0417H22.973C24.1292 17.0417 25.1467 16.4096 25.6709 15.4538L31.1901 5.44834C31.3134 5.23251 31.3751 4.97043 31.3751 4.70834C31.3751 3.86043 30.6813 3.16668 29.8334 3.16668H7.03217L5.583 0.0833435H0.541748ZM25.2084 24.75C23.5126 24.75 22.1405 26.1375 22.1405 27.8333C22.1405 29.5292 23.5126 30.9167 25.2084 30.9167C26.9042 30.9167 28.2917 29.5292 28.2917 27.8333C28.2917 26.1375 26.9042 24.75 25.2084 24.75Z" />
            </svg>
          </div>

          {/* Profile Icon */}
          <div onClick={goToTransactions} className={styles["footer-icon"]}>
            <svg
              viewBox="0 0 34 34"
              style={{ fill: selectedPage === 3 ? "black" : "#8F8787" }}
            >
              <path d="M15.9842 0.166656C7.24421 0.166656 0.150879 7.25999 0.150879 16C0.150879 24.74 7.24421 31.8333 15.9842 31.8333C24.7242 31.8333 31.8175 24.74 31.8175 16C31.8175 7.25999 24.7242 0.166656 15.9842 0.166656ZM21.7 10.205C23.3942 10.205 24.7559 11.5667 24.7559 13.2608C24.7559 14.955 23.3942 16.3167 21.7 16.3167C20.0059 16.3167 18.6442 14.955 18.6442 13.2608C18.6284 11.5667 20.0059 10.205 21.7 10.205ZM12.2 7.70332C14.2584 7.70332 15.9367 9.38166 15.9367 11.44C15.9367 13.4983 14.2584 15.1767 12.2 15.1767C10.1417 15.1767 8.46338 13.4983 8.46338 11.44C8.46338 9.36582 10.1259 7.70332 12.2 7.70332ZM12.2 22.1592V28.0967C8.40005 26.9092 5.39171 23.98 4.06171 20.2433C5.72421 18.47 9.87255 17.5675 12.2 17.5675C13.0392 17.5675 14.1 17.6942 15.2084 17.9158C12.6117 19.2933 12.2 21.1142 12.2 22.1592ZM15.9842 28.6667C15.5567 28.6667 15.145 28.6508 14.7334 28.6033V22.1592C14.7334 19.9108 19.3884 18.7867 21.7 18.7867C23.3942 18.7867 26.3234 19.4042 27.78 20.6075C25.9275 25.31 21.3517 28.6667 15.9842 28.6667Z" />
            </svg>
          </div>
        </div>
        <div className={styles["footer-bottom"]}></div>
      </div>

      {/* Rounded Rectangle with "Scan Meja" and QR Icon */}
      {showTable && shopId && (
        <div
          ref={scanMejaRef}
          onClick={table.length == 0 ? goToScan : handleScanMejaClick}
          className={`${styles.scanMeja} ${
            isStretched ? styles.stretched : ""
          }`}
        >
          <span>
            {table.length != 0
              ? `Diantar ke meja ${table.tableNo}`
              : `Scan Meja\u00A0`}
          </span>
          {table.length == 0 && (
            <img
              src="https://i.imgur.com/I44LpDO.png"
              alt="QR Code"
              className={styles.qrIcon}
            />
          )}
          {table.length != 0 && isStretched && (
            <button onClick={handleHapusMeja} className={styles.hapusMejaBtn}>
              Hapus Meja
            </button>
          )}
        </div>
      )}
    </div>
  );
}
