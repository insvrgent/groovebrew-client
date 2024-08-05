import React, { useState } from "react";
import html2canvas from "html2canvas";

const QRCodeWithBackground = ({
  isConfigure,
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
        });
    } else {
      console.error("Element not found for printing.");
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
            <label style={styles.label}>
              Background Image Upload:
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={styles.fileInput}
              />
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
};

export default QRCodeWithBackground;
