import React, { useEffect, useState } from "react";
import styles from "./Transactions.module.css";
import { useParams } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import { getTransactions } from "../helpers/transactionHelpers";

export default function Transactions({ propsShopId, sendParam, deviceType }) {
  const { shopId, tableId } = useParams();
  if (sendParam) sendParam({ shopId, tableId });

  const [transactions, setTransactions] = useState([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions(shopId || propsShopId, 5);
        console.log("modallll");
        console.log(response);
        setTransactions(response);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [shopId]);

  const calculateTotalPrice = (detailedTransactions) => {
    return detailedTransactions.reduce((total, dt) => {
      return total + dt.qty * dt.Item.price;
    }, 0);
  };

  const handlePayment = async (isCash) => {
    setIsPaymentLoading(true);
    try {
      // Implement payment logic here
      console.log(`Processing ${isCash ? "cash" : "cashless"} payment`);
      // Simulate payment process
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <div className={styles.Transactions}>
      <div style={{ marginTop: "30px" }}></div>
      <h2 className={styles["Transactions-title"]}>Transactions</h2>
      <div style={{ marginTop: "30px" }}></div>
      <div>
        {transactions.map((transaction) => (
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
                ? "Diambil di kasir"
                : `Diantar ke meja nomor ${
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
                onClick={() => handlePayment(false)}
              >
                {isPaymentLoading ? (
                  <ColorRing height="50" width="50" color="white" />
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
