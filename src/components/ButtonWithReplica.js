import React, { useState, useEffect } from "react";
import "./ButtonWithReplica.css";
import styles from "../pages/Transactions.module.css";
import { QRCodeSVG } from "qrcode.react";
import API_BASE_URL from "../config.js";
import jsqr from "jsqr";

const ButtonWithReplica = ({
  children,
  price,
  paymentUrl,
  handleClick,
  Open,
  isPaymentOpen,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [fgColor, setFgColor] = useState("transparent");
  const [QRValue, setQRValue] = useState("");
  const [qrisComponent, setQrisComponent] = useState({
    merchantName: "",
    nmid: "",
  });
  useEffect(() => {
    const decodeQRCodeFromUrl = async (imageUrl) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Handle CORS if needed
      img.src = API_BASE_URL + "/" + imageUrl;

      return new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          const code = jsqr(imageData.data, canvas.width, canvas.height);

          if (code) {
            resolve(code.data); // This is your QRValue
          } else {
            reject("No QR code found.");
          }
        };

        img.onerror = (error) => {
          reject("Failed to load image: " + error);
        };
      });
    };

    const fetchQRCodeValue = async () => {
      if (paymentUrl) {
        try {
          console.log(paymentUrl);
          const qrv = await decodeQRCodeFromUrl(paymentUrl);
          setQRValue(qrv);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchQRCodeValue();
  }, [paymentUrl]); // Run effect when paymentUrl changes

  useEffect(() => {
    function extractMerchantName(qrisCode) {
      const tagPrefix = "ID59";
      const startIndex = qrisCode.indexOf(tagPrefix);

      if (startIndex !== -1) {
        const lengthIndex = startIndex + tagPrefix.length;
        const nameLength = parseInt(qrisCode.substr(lengthIndex, 2), 10); // Length of the name
        const merchantNameStart = lengthIndex + 2; // Move past the length characters
        const merchantNameEnd = merchantNameStart + nameLength; // Calculate the end index

        const merchantName = qrisCode.substr(merchantNameStart, nameLength);
        return merchantName;
      }

      return null; // Return null if the tag is not found
    }

    function extractNMID(qrisCode) {
      const startTag = "WWW0215";
      const endTag = "0303";

      const startIndex = qrisCode.indexOf(startTag);
      if (startIndex !== -1) {
        const nmStartIndex = startIndex + startTag.length; // Start after WWW0215
        const endIndex = qrisCode.indexOf(endTag, nmStartIndex); // Find the next 0303

        if (endIndex !== -1) {
          const nmid = qrisCode.substring(nmStartIndex, endIndex);
          return nmid; // This will include the ID prefix
        }
      }

      return null; // Return null if NMID is not found
    }

    const parsedMerchantName = extractMerchantName(QRValue);
    const parsedNMID = extractNMID(QRValue);

    setQrisComponent({ merchantName: parsedMerchantName, nmid: parsedNMID });

    console.log("Parsed Merchant Name:", parsedMerchantName);
    console.log("Parsed NMID:", parsedNMID);
  }, [QRValue]);

  useEffect(() => {
    setIsActive(isPaymentOpen);
    if (isPaymentOpen == false) setFgColor("transparent"); // Change color to black on click
  }, [isPaymentOpen]);

  const handleOpen = () => {
    setIsActive(true);
    setFgColor("black"); // Change color to black on click
    console.log(qrisComponent.nmid); // Log the QR value
    Open();
  };

  return (
    <div className="container">
      <button
        className="button"
        onClick={() => (isPaymentOpen ? handleClick() : handleOpen())}
      >
        {children}
      </button>
      <div className={`replica ${isActive ? "active" : ""}`}></div>
      <QRCodeSVG
        className={`bussinessQR ${isActive ? "active" : ""}`}
        bgColor={"transparent"}
        fgColor={fgColor}
        value={QRValue}
      />
      <div className={`bussinessName ${isActive ? "active" : ""}`}>
        <h2>{qrisComponent.merchantName}</h2>
        {qrisComponent.nmid != "" && <h4>NMID : {qrisComponent.nmid}</h4>}
      </div>
      <div className={`price ${isActive ? "active" : ""}`}>
        <h1>{price}</h1>
      </div>
    </div>
  );
};

export default ButtonWithReplica;
