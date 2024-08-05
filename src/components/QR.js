import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";

const QRCodeWithBackground = ({
  isConfigure,
  tableNo,
  qrCodeUrl,
  backgroundUrl,
  initialQrPosition,
  initialQrSize,
  setInitialPos,
  setInitialSize,
  onBackgroundUrlChange,
}) => {
  const [qrPosition, setQrPosition] = useState(initialQrPosition);
  const [qrSize, setQrSize] = useState(initialQrSize);
  const [bgImage, setBgImage] = useState(backgroundUrl);
  const fileInputRef = useRef(null);
  const overlayTextRef = useRef(null);

  const handlePositionChange = (e) => {
    const { name, value } = e.target;
    setQrPosition((prevPosition) => ({
      ...prevPosition,
      [name]: value,
    }));
  };

  const handleSizeChange = (e) => {
    setQrSize(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newBgImage = URL.createObjectURL(file);
      setBgImage(newBgImage);
      onBackgroundUrlChange(newBgImage);
    }
  };

  const handleSave = () => {
    setInitialPos(qrPosition);
    setInitialSize(qrSize);
    onBackgroundUrlChange(bgImage);
  };

  const printQRCode = () => {
    const element = document.getElementById("qr-code-container");
    if (element) {
      // Hide overlay text
      const overlayText = overlayTextRef.current;
      if (overlayText) overlayText.style.display = "none";

      html2canvas(element, {
        useCORS: true,
        backgroundColor: null,
      })
        .then((canvas) => {
          const img = canvas.toDataURL("image/png");
          const printWindow = window.open("", "", "height=600,width=800");
          printWindow.document.write(
            "<html><head><title>Print QR Code</title></head><body>"
          );
          printWindow.document.write(
            '<img src="' + img + '" style="width:100%;height:auto;"/>'
          );
          printWindow.document.write("</body></html>");
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
        })
        .catch((err) => {
          console.error("Error capturing image:", err);
        })
        .finally(() => {
          // Show overlay text again
          if (overlayText) overlayText.style.display = "flex";
        });
    } else {
      console.error("Element not found for printing.");
    }
  };

  const saveImage = () => {
    const element = document.getElementById("qr-code-container");
    if (element) {
      // Hide overlay text
      const overlayText = overlayTextRef.current;
      if (overlayText) overlayText.style.display = "none";

      html2canvas(element, {
        useCORS: true,
        backgroundColor: null,
      })
        .then((canvas) => {
          canvas.toBlob((blob) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `table ${tableNo}_QRCode.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        })
        .catch((err) => {
          console.error("Error capturing image:", err);
        })
        .finally(() => {
          // Show overlay text again
          if (overlayText) overlayText.style.display = "flex";
        });
    } else {
      console.error("Element not found for saving.");
    }
  };

  return (
    <div>
      <div
        id="qr-code-container"
        style={{
          position: "relative",
          width: "300px",
          height: "300px",
          background: `url(${bgImage}) no-repeat center center`,
          backgroundSize: "contain",
          overflow: "hidden",
          border: "1px solid #ddd",
        }}
      >
        <img
          src={qrCodeUrl}
          alt="QR Code"
          style={{
            position: "absolute",
            width: `${qrSize}%`,
            height: `${qrSize}%`,
            left: `${qrPosition.left}%`,
            top: `${qrPosition.top}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
        {/* Overlay text that triggers file input */}
        <div
          ref={overlayTextRef}
          style={styles.overlayText}
          onClick={() => fileInputRef.current.click()}
        >
          Click To Change Image
        </div>
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      {isConfigure ? (
        <div style={{ marginTop: "20px" }}>
          <div style={styles.sliderContainer}>
            <label style={styles.label}>
              QR Code Size:
              <div style={styles.sliderWrapper}>
                <span style={styles.labelStart}>10%</span>
                <input
                  type="range"
                  step="0.25"
                  min="10"
                  max="100"
                  value={qrSize}
                  onChange={handleSizeChange}
                  style={styles.input}
                />
                <span style={styles.labelEnd}>100%</span>
                <span style={styles.value}>{qrSize}%</span>
              </div>
            </label>
          </div>
          <div style={styles.sliderContainer}>
            <label style={styles.label}>
              QR Code Position X:
              <div style={styles.sliderWrapper}>
                <span style={styles.labelStart}>0%</span>
                <input
                  type="range"
                  step="0.25"
                  name="left"
                  min="0"
                  max="100"
                  value={qrPosition.left}
                  onChange={handlePositionChange}
                  style={styles.input}
                />
                <span style={styles.labelEnd}>100%</span>
                <span style={styles.value}>{qrPosition.left}%</span>
              </div>
            </label>
          </div>
          <div style={styles.sliderContainer}>
            <label style={styles.label}>
              QR Code Position Y:
              <div style={styles.sliderWrapper}>
                <span style={styles.labelStart}>0%</span>
                <input
                  type="range"
                  step="0.25"
                  name="top"
                  min="0"
                  max="100"
                  value={qrPosition.top}
                  onChange={handlePositionChange}
                  style={styles.input}
                />
                <span style={styles.labelEnd}>100%</span>
                <span style={styles.value}>{qrPosition.top}%</span>
              </div>
            </label>
          </div>
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
      ) : (
        <div>
          <button
            onClick={printQRCode}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#0056b3")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#007bff")
            }
          >
            Print QR Code
          </button>
          <button
            onClick={saveImage}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#17a2b8",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
              marginLeft: "10px",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#138496")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#17a2b8")
            }
          >
            Save Image
          </button>
        </div>
      )}
    </div>
  );
};

// Styles for the configuration labels and inputs
const styles = {
  label: {
    display: "block",
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  sliderContainer: {
    marginBottom: "20px",
  },
  sliderWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "5px",
  },
  input: {
    flex: "1",
    margin: "0 10px",
  },
  value: {
    fontSize: "16px",
    minWidth: "50px",
    textAlign: "right",
  },
  labelStart: {
    fontSize: "14px",
  },
  labelEnd: {
    fontSize: "14px",
  },
  fileInput: {
    marginLeft: "10px",
  },
  overlayText: {
    position: "absolute",
    fontSize: "70px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    top: "0",
    bottom: "0",
    color: "white",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer", // Indicates it's clickable
    zIndex: 10, // Ensure it appears above other elements
  },
};

export default QRCodeWithBackground;
