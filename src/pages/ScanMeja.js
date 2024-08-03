import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader"; // Import QrReader as named import
import styles from "./GuestSideLogin.module.css"; // Import module CSS file for styles

import { getLocalStorage } from "../helpers/localStorageHelpers";

const GuestSideLogin = ({ socket }) => {
  const navigate = useNavigate();
  const [qrCode, setQRCode] = useState(""); // State to store QR code

  socket.on("qrCode_readSuccess", (response) => {
    const { shopId } = response;
    console.log("qr has been read");
    navigate("/" + shopId);
  });

  const setLoginGuestSide = () => {
    const token = getLocalStorage("auth");
    socket.emit("read_qrCode", { qrCode, token });
  };

  // Function to handle QR code scan
  const handleScan = (data) => {
    if (data) {
      setQRCode(data.text); // Set scanned QR code to state
      setLoginGuestSide(); // Send QR code to backend
    }
  };

  // Function to handle QR scan error
  const handleError = (err) => {
    console.error(err);
  };

  // Function to handle manual input
  const handleManualInput = (e) => {
    setQRCode(e.target.value);
  };

  useEffect(() => {
    if (qrCode.length === 11) {
      const timer = setTimeout(() => {
        setLoginGuestSide();
      }, 1000); // Delay of 1 second (1000 milliseconds)

      return () => clearTimeout(timer); // Cleanup the timer if qrCode changes before the delay completes
    }
  }, [qrCode]);

  return (
    <div className={styles.qrisReaderContainer}>
      <div className={styles.qrScannerContainer}>
        <QrReader
          constraints={{ facingMode: "environment" }}
          delay={500}
          onResult={handleScan}
          onError={handleError}
          videoId="video"
          className={styles.qrReader} // Apply the class
          videoContainerStyle={{
            width: "100vw",
            height: "100vh",
            paddingTop: "0px",
          }}
          videoStyle={{ width: "100%", height: "100%" }}
        />

        <div className={styles.focusSquare}></div>
      </div>
      <div className={styles.inputContainer}>
        {/* Manual input form */}
        <input
          type="text"
          value={qrCode}
          onChange={handleManualInput}
          placeholder="Enter QRIS Code"
        />
      </div>
    </div>
  );
};

export default GuestSideLogin;
