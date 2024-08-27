import React, { useState, useEffect, useRef } from "react";
import { ColorRing } from "react-loader-spinner";
import jsQR from "jsqr";
import QRCode from "qrcode.react";
import styles from "./Transactions.module.css";
import { getImageUrl } from "../helpers/itemHelper";
import { useSearchParams } from "react-router-dom";
import {
  getTransaction,
  handleConfirmHasPaid,
} from "../helpers/transactionHelpers";

export default function Transaction_pending() {
  const [searchParams] = useSearchParams();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const transactionId = searchParams.get("transactionId") || "";

    const fetchData = async () => {
      try {
        const fetchedTransaction = await getTransaction(transactionId);
        setTransaction(fetchedTransaction);
        console.log(transaction);
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    };
    fetchData();
  }, [searchParams]);

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

  return (
    <div className={styles.Transactions}>
      <div style={{ marginTop: "30px" }}></div>
      <h2 className={styles["Transactions-title"]}>Payment Claimed</h2>
      <div style={{ marginTop: "30px" }}></div>
      <div className={styles.TransactionListContainer}>
        {transaction && (
          <div
            key={transaction.transactionId}
            className={styles.RoundedRectangle}
          >
            <h2 className={styles["Transactions-detail"]}>
              Transaction ID: {transaction.transactionId}
            </h2>
            <h2 className={styles["Transactions-detail"]}>
              Payment Type: {transaction.payment_type}
            </h2>
            <ul>
              {transaction.DetailedTransactions.map((detail) => (
                <li key={detail.detailedTransactionId}>
                  <span>{detail.Item.name}</span> - {detail.qty} x Rp{" "}
                  {detail.Item.price}
                </li>
              ))}
            </ul>
            <h2 className={styles["Transactions-detail"]}>
              {transaction.serving_type === "pickup"
                ? "Self pickup"
                : `Serve to ${
                    transaction.Table ? transaction.Table.tableNo : "N/A"
                  }`}
            </h2>
            <div className={styles.TotalContainer}>
              <span>Total:</span>
              <span>
                Rp {calculateTotalPrice(transaction.DetailedTransactions)}
              </span>
            </div>
            <div className={styles.TotalContainer}>
              <button
                className={styles.PayButton}
                onClick={() => handleConfirmHasPaid(transaction.transactionId)}
              ></button>
            </div>
            {transaction.confirmed == 0 && (
              <h5 className={styles.DeclineButton}>decline</h5>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
