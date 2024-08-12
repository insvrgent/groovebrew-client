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
          <h2>Transation Pending</h2>
          <div style={{ marginTop: "20px" }}>
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#4fa94d", "#f7c34c", "#ffa53c", "#e34f53", "#d23a8d"]}
            />
            <p>Waiting for clerk confirmation...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
