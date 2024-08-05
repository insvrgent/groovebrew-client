import React, { useState } from "react";
import html2canvas from "html2canvas";

const QRCodeWithBackground = ({
  qrCodeUrl,
  backgroundUrl,
  initialQrPosition,
  initialQrSize,
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

      <div style={{ marginTop: "20px" }}>
        <label>
          QR Code Size:
          <input
            type="range"
            min="10"
            max="100"
            value={qrSize}
            onChange={handleSizeChange}
            style={{ marginLeft: "10px" }}
          />
          {qrSize}%
        </label>
        <br />
        <label>
          QR Code Position X:
          <input
            type="range"
            name="left"
            min="0"
            max="100"
            value={qrPosition.left}
            onChange={handlePositionChange}
            style={{ marginLeft: "10px" }}
          />
          {qrPosition.left}%
        </label>
        <br />
        <label>
          QR Code Position Y:
          <input
            type="range"
            name="top"
            min="0"
            max="100"
            value={qrPosition.top}
            onChange={handlePositionChange}
            style={{ marginLeft: "10px" }}
          />
          {qrPosition.top}%
        </label>
        <br />
        <label>
          Background Image Upload:
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginLeft: "10px" }}
          />
        </label>
        <br />
        <button onClick={printQRCode} style={{ marginTop: "10px" }}>
          Print QR Code
        </button>
      </div>
    </div>
  );
};

export default QRCodeWithBackground;
