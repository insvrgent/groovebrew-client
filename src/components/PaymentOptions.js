import React, { useState, useRef, useEffect } from "react";
import jsQR from "jsqr"; // Import jsQR library
import { getImageUrl } from "../helpers/itemHelper";
import { saveCafeDetails } from "../helpers/cafeHelpers"; // Import the helper function

const SetPaymentQr = ({
  isConfigure,
  tableNo,
  qrCodeUrl,
  paymentUrl,
  initialQrPosition,
  initialQrSize,
  handleQrSave,
  shopId, // Pass cafeId as a prop to identify which cafe to update
}) => {
  const [qrPosition, setQrPosition] = useState(initialQrPosition);
  const [qrSize, setQrSize] = useState(initialQrSize);
  const [qrPayment, setQrPayment] = useState(getImageUrl(paymentUrl));
  const [qrCodeDetected, setQrCodeDetected] = useState(false);
  const qrPaymentInputRef = useRef(null);
  const overlayTextRef = useRef(null);
  const qrCodeContainerRef = useRef(null);

  // Use useEffect to detect QR code after qrPayment updates
  useEffect(() => {
    if (qrPayment) {
      detectQRCodeFromContainer();
    }
  }, [qrPayment]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newqrPayment = URL.createObjectURL(file); // Create a temporary URL for display
      setQrPayment(newqrPayment);
    }
  };

  const detectQRCodeFromContainer = () => {
    const container = qrCodeContainerRef.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Create an image element to load the background image
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Handle CORS if needed
    img.onload = () => {
      // Set canvas size
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      // Draw image on canvas
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

      if (qrCode) {
        setQrCodeDetected(true);
        console.log("QR Code detected:", qrCode.data);
      } else {
        setQrCodeDetected(false);
        console.log("No QR Code detected");
      }
    };
    img.src = qrPayment; // Load the image URL
  };

  const handleSave = () => {
    const qrPaymentFile = qrPaymentInputRef.current.files[0]; // Get the selected file for qrPayment

    // Prepare the details object
    const details = {
      qrPosition,
      qrSize,
      qrPaymentFile, // Include qrPayment file
    };

    // Call saveCafeDetails function with the updated details object
    saveCafeDetails(shopId, details)
      .then((response) => {
        console.log("Cafe details saved:", response);
        // handleQrSave(qrPosition, qrSize, qrPayment);
      })
      .catch((error) => {
        console.error("Error saving cafe details:", error);
      });
  };

  return (
    <div>
      <div
        id="qr-code-container"
        ref={qrCodeContainerRef}
        style={{
          position: "relative",
          width: "300px",
          height: "300px",
          background: `center center / contain no-repeat url(${qrPayment})`,
          backgroundSize: "contain",
          overflow: "hidden",
          border: "1px solid #ddd",
        }}
      >
        <div
          ref={overlayTextRef}
          style={styles.overlayText}
          onClick={() => qrPaymentInputRef.current.click()}
        >
          Click To Change Image
        </div>
        <input
          type="file"
          accept="image/*"
          ref={qrPaymentInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        {qrCodeDetected ? <p>QR Code Detected</p> : <p>No QR Code Detected</p>}
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={handleSave}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#218838")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#28a745")
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlayText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  // Other styles omitted for brevity
};

export default SetPaymentQr;
