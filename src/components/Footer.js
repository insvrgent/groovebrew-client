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
            <svg viewBox="0 0 512 512">
              <g
                transform="translate(0 512) scale(0.1 -0.1)"
                style={{ fill: selectedPage === 3 ? "black" : "#8F8787" }}
                stroke="none"
              >
                <path
                  d="M1639 5107 c-47 -13 -70 -28 -177 -109 -119 -90 -246 -102 -381 -34
        -53 27 -83 36 -121 36 -88 0 -167 -57 -190 -138 -8 -26 -10 -620 -8 -1982 l3
        -1945 24 -38 c13 -21 42 -50 64 -65 l41 -27 1535 -5 1536 -5 58 -22 c158 -60
        291 -205 322 -352 10 -45 74 -108 119 -117 78 -14 154 25 182 93 12 27 14 398
        14 2238 0 2400 4 2243 -53 2303 -67 72 -160 81 -268 26 -52 -26 -89 -37 -138
        -41 -99 -8 -161 13 -268 93 -119 89 -140 97 -248 98 -108 0 -129 -8 -249 -98
        -107 -80 -168 -101 -267 -93 -79 7 -121 26 -231 108 -165 122 -309 119 -471
        -9 -87 -69 -138 -92 -216 -99 -99 -8 -161 13 -268 93 -48 36 -104 73 -123 81
        -49 20 -165 26 -221 10z m2274 -1226 c21 -13 50 -42 65 -64 22 -34 27 -52 27
        -106 0 -79 -25 -128 -88 -169 l-41 -27 -1165 0 -1166 0 -38 24 c-76 47 -111
        140 -88 229 14 52 76 117 123 131 20 6 475 9 1183 8 l1150 -2 38 -24z m0 -900
        c21 -13 50 -42 65 -64 22 -34 27 -52 27 -106 0 -79 -25 -128 -88 -169 l-41
        -27 -1165 0 -1166 0 -38 24 c-76 47 -111 140 -88 229 14 52 76 117 123 131
        20 6 475 9 1183 8 l1150 -2 38 -24z m4 -903 c62 -41 88 -90 88 -168 0 -78 -26
        -127 -88 -168 l-41 -27 -665 0 -666 0 -38 24 c-76 47 -111 140 -88 229 14 51
        76 117 123 131 20 6 291 9 684 8 l650 -2 41 -27z"
                />
                <path
                  d="M592 489 c-47 -14 -109 -79 -123 -131 -33 -122 37 -265 159 -325 l57
        -28 1815 -2 c1736 -2 1813 -2 1765 15 -125 43 -186 126 -205 279 -12 89
        -39 138 -97 174 l-38 24 -1650 2 c-1023 1 -1662 -2 -1683 -8z"
                />
              </g>
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
