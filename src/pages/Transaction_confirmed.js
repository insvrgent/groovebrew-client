import React, { useState, useEffect, useRef } from "react";
import { ColorRing } from "react-loader-spinner";
import jsQR from "jsqr";
import QRCode from "qrcode.react";
import styles from "./Transactions.module.css";
import { getImageUrl } from "../helpers/itemHelper";
import { useSearchParams } from "react-router-dom";
import {
  handleClaimHasPaid,
  getTransaction,
} from "../helpers/transactionHelpers";
import html2canvas from "html2canvas";

export default function Transaction_pending({ paymentUrl }) {
  const [searchParams] = useSearchParams();
  const [qrData, setQrData] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const transactionId = searchParams.get("transactionId") || "";

    const fetchData = async () => {
      try {
        const fetchedTransaction = await getTransaction(transactionId);
        setTransaction(fetchedTransaction);
        console.log(fetchedTransaction);
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    };
    fetchData();
  }, [searchParams]);

  useEffect(() => {
    const detectQRCode = async () => {
      if (paymentUrl) {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Handle CORS if needed
        img.src = getImageUrl(paymentUrl);

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw image on canvas
          context.drawImage(img, 0, 0, img.width, img.height);

          // Get image data
          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

          if (qrCode) {
            setQrData(qrCode.data); // Set the QR data
            console.log(qrCode.data);
          } else {
            console.log("No QR Code detected");
          }
        };
      }
    };

    detectQRCode();
  }, [paymentUrl]);

  const calculateTotalPrice = (detailedTransactions) => {
    if (!Array.isArray(detailedTransactions)) return 0;

    return detailedTransactions.reduce((total, dt) => {
      if (
        dt.Item &&
        typeof dt.Item.price === "number" &&
        typeof dt.qty === "number"
      ) {
        return total + dt.Item.price * dt.qty;
      }
      return total;
    }, 0);
  };

  const downloadQRCode = async () => {
    if (qrCodeRef.current) {
      try {
        const canvas = await html2canvas(qrCodeRef.current);
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "qr-code.png";
        link.click();
      } catch (error) {
        console.error("Error downloading QR Code:", error);
      }
    } else {
      console.log("QR Code element not found.");
    }
  };

  return (
    <div className={styles.Transactions}>
      <div style={{ marginTop: "30px" }}></div>
      <h2 className={styles["Transactions-title"]}>Transaction Confirmed</h2>
      <div style={{ marginTop: "30px" }}></div>
      <div className={styles.TransactionListContainer}>
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          {qrData ? (
            <div style={{ marginTop: "20px" }}>
              <div ref={qrCodeRef}>
                <QRCode value={qrData} size={256} /> {/* Generate QR code */}
              </div>
              <p>Generated QR Code from Data</p>
              <button
                onClick={downloadQRCode}
                style={{
                  marginTop: "20px",
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
                Download QR Code
              </button>
            </div>
          ) : (
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
              <p>Loading QR Code Data...</p>
            </div>
          )}

          {transaction && transaction.DetailedTransactions ? (
            <div
              className={styles.TotalContainer}
              style={{ marginBottom: "20px" }}
            >
              <span>Total:</span>
              <span>
                Rp{" "}
                {calculateTotalPrice(
                  transaction.DetailedTransactions
                ).toLocaleString()}
              </span>
            </div>
          ) : (
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
              <p>Loading Transaction Data...</p>
            </div>
          )}

          <button onClick={handleClaimHasPaid} className={styles.PayButton}>
            I've already paid
          </button>
        </div>
      </div>
    </div>
  );
}
