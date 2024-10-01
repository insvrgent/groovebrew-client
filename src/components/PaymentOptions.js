import React, { useState, useRef, useEffect } from "react";
import jsQR from "jsqr";
import { getImageUrl } from "../helpers/itemHelper";
import {
  getCafe,
  saveCafeDetails,
  setConfirmationStatus,
} from "../helpers/cafeHelpers";
import Switch from "react-switch";

// Main Component
const SetPaymentQr = ({ shopId }) => {
  const [qrPosition, setQrPosition] = useState([50, 50]);
  const [qrSize, setQrSize] = useState(50);
  const [qrPayment, setQrPayment] = useState();
  const [qrCodeDetected, setQrCodeDetected] = useState(false);
  const qrPaymentInputRef = useRef(null);
  const qrCodeContainerRef = useRef(null);
  const [isNeedConfirmation, setIsNeedConfirmation] = useState(false);
  const [cafe, setCafe] = useState({});

  // Fetch cafe details on mount or shopId change
  useEffect(() => {
    const fetchCafe = async () => {
      try {
        const response = await getCafe(shopId);
        setCafe(response);
        setQrPayment(getImageUrl(response.qrPayment));
        setIsNeedConfirmation(response.needsConfirmation);
        setQrPosition([response.xposition, response.yposition]);
        setQrSize(response.scale);
      } catch (error) {
        console.error("Error fetching cafe:", error);
      }
    };
    fetchCafe();
  }, [shopId]);

  // Detect QR code when qrPayment updates
  useEffect(() => {
    if (qrPayment) {
      detectQRCodeFromContainer();
    }
  }, [qrPayment]);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newqrPayment = URL.createObjectURL(file);
      setQrPayment(newqrPayment);
    }
  };

  // Detect QR code from the container
  const detectQRCodeFromContainer = () => {
    const container = qrCodeContainerRef.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
      setQrCodeDetected(!!qrCode);
      if (qrCode) {
        console.log("QR Code detected:", qrCode.data);
      }
    };
    img.src = qrPayment;
  };

  // Save cafe details
  const handleSave = async () => {
    const qrPaymentFile = qrPaymentInputRef.current.files[0];
    const details = {
      qrPosition,
      qrSize,
      qrPaymentFile,
    };

    try {
      const response = await saveCafeDetails(cafe.cafeId, details);
      console.log("Cafe details saved:", response);
    } catch (error) {
      console.error("Error saving cafe details:", error);
    }
  };

  // Toggle confirmation status
  const handleChange = async () => {
    try {
      const response = await setConfirmationStatus(
        cafe.cafeId,
        !isNeedConfirmation
      );
      setIsNeedConfirmation(response.needsConfirmation);
    } catch (error) {
      console.error(error);
      setIsNeedConfirmation(cafe.needsConfirmation);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Payment QRIS</h2>
      <div
        id="qr-code-container"
        ref={qrCodeContainerRef}
        style={{
          ...styles.qrCodeContainer,
          backgroundImage: `url(${qrPayment})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      >
        <div
          style={styles.overlayText}
          onClick={() => qrPaymentInputRef.current.click()}
        >
          Click To Change
        </div>
        <input
          type="file"
          accept="image/*"
          ref={qrPaymentInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      <div style={styles.resultMessage}>
        {qrCodeDetected ? <p>QR Code Detected</p> : <p>No QR Code Detected</p>}
      </div>
      <div style={styles.buttonContainer}>
        <button onClick={handleSave} style={styles.saveButton}>
          Save
        </button>
      </div>
      <div style={styles.switchContainer}>
        <h1>Double Check tem Availability</h1>
        <p style={styles.description}>
          Turn on the switch for the clerk to double check before customer pay.
        </p>
        <Switch onChange={handleChange} checked={isNeedConfirmation} />
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center", // Center text and children
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  qrCodeContainer: {
    position: "relative",
    width: "300px",
    height: "300px",
    backgroundSize: "contain",
    border: "1px solid #ddd",
    overflow: "hidden",
    margin: "0 auto", // Center the QR code container
  },
  overlayText: {
    position: "absolute",
    width: "100%",
    height: "100%",
    fontSize: "550%",
    textAlign: "left",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "rgba(256, 256, 256, 0.5)",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  resultMessage: {
    marginTop: "20px",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  saveButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  switchContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  description: {
    margin: "10px 0",
    fontSize: "14px",
    color: "#666",
  },
};

export default SetPaymentQr;
