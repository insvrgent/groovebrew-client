import React from "react";
import { ColorRing } from "react-loader-spinner";
import styles from "./Transactions.module.css";

export default function Transaction_pending() {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%", // This makes the container stretch to the bottom of the viewport
    backgroundColor: "#000", // Optional: Set a background color if you want to see the color ring clearly
  };

  return (
    <div className={styles.Transactions}>
      <div className={containerStyle}>
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <h2>waiting for confirmation</h2>
          <ColorRing height="50" width="50" color="white" />
        </div>
      </div>
    </div>
  );
}
