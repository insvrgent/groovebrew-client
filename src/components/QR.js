import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { getImageUrl } from "../helpers/itemHelper";
import { saveCafeDetails } from "../helpers/cafeHelpers"; // Import the helper function

const QRCodeWithBackground = ({
  isConfigure,
  tableNo,
  qrCodeUrl,
  backgroundUrl,
  initialQrPosition,
  initialQrSize,
  handleQrSave,
  shopId, // Pass cafeId as a prop to identify which cafe to update
}) => {
  const [qrPosition, setQrPosition] = useState(initialQrPosition);
  const [qrSize, setQrSize] = useState(initialQrSize);
  const [bgImage, setBgImage] = useState(getImageUrl(backgroundUrl)); // URL or File
  const qrBackgroundInputRef = useRef(null);
  const overlayTextRef = useRef(null);

  const handlePositionChange = (e) => {
    const { name, value } = e.target;
    setQrPosition((prevPosition) => ({
      ...prevPosition,
      [name]: parseFloat(value).toFixed(2),
    }));
  };

  const handleSizeChange = (e) => {
    setQrSize(parseFloat(e.target.value).toFixed(2));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newBgImage = URL.createObjectURL(file); // Create a temporary URL for display
      setBgImage(newBgImage);
    }
  };

  const handleSave = () => {
    const qrBackgroundFile = qrBackgroundInputRef.current.files[0]; // Get the selected file for qrBackground

    // Prepare the details object
    const details = {
      qrPosition,
      qrSize,
      qrBackgroundFile, // Include qrBackground file
    };

    // Call saveCafeDetails function with the updated details object
    saveCafeDetails(shopId, details)
      .then((response) => {
        console.log("Cafe details saved:", response);
        handleQrSave(qrPosition, qrSize, bgImage);
      })
      .catch((error) => {
        console.error("Error saving cafe details:", error);
      });
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
          background: `center center / contain no-repeat url(${bgImage})`,
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
        {isConfigure && (
          <div
            ref={overlayTextRef}
            style={styles.overlayText}
            onClick={() => qrBackgroundInputRef.current.click()}
          >
            Click To Change Image
          </div>
        )}
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={qrBackgroundInputRef}
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
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#117a8b")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#17a2b8")
            }
          >
            Save QR Code
          </button>
        </div>
      )}
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
  sliderContainer: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
  },
  sliderWrapper: {
    display: "flex",
    alignItems: "center",
  },
  input: {
    flex: "1",
    margin: "0 10px",
  },
  labelStart: {
    marginRight: "10px",
  },
  labelEnd: {
    marginLeft: "10px",
  },
  value: {
    marginLeft: "10px",
  },
};

export default QRCodeWithBackground;
