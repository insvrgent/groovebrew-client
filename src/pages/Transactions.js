import React, { useEffect, useState } from "react";
import styles from "./Transactions.module.css";
import { useParams } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import {
  getTransactions,
  confirmTransaction,
} from "../helpers/transactionHelpers";
import { getTables } from "../helpers/tableHelper";
import TableCanvas from "../components/TableCanvas";

export default function Transactions({ propsShopId, sendParam, deviceType }) {
  const { shopId, tableId } = useParams();
  if (sendParam) sendParam({ shopId, tableId });

  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions(shopId || propsShopId, 5);
        setTransactions(response);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [shopId || propsShopId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTables = await getTables(shopId || propsShopId);
        setTables(fetchedTables);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchData();
  }, [shopId || propsShopId]);

  const calculateTotalPrice = (detailedTransactions) => {
    return detailedTransactions.reduce((total, dt) => {
      return total + dt.qty * dt.Item.price;
    }, 0);
  };

  const handleConfirm = async (transactionId) => {
    setIsPaymentLoading(true);
    try {
      const c = await confirmTransaction(transactionId);
      if (c) setMessage("success");
      else setMessage("not confirmed");
      setConfirmed(true);
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
      <TableCanvas tables={tables} selectedTable={selectedTable} />
      <div className={styles.TransactionListContainer}>
        {transactions &&
          transactions.map((transaction) => (
            <div
              key={transaction.transactionId}
              className={styles.RoundedRectangle}
              onClick={() =>
                setSelectedTable(transaction.Table || { tableId: 0 })
              }
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
                  onClick={() => handleConfirm(transaction.transactionId)}
                  disabled={transaction.confirmed || isPaymentLoading} // Disable button if confirmed or loading
                >
                  {isPaymentLoading ? (
                    <ColorRing height="50" width="50" color="white" />
                  ) : transaction.confirmed ? (
                    "Confirmed" // Display "Confirmed" if the transaction is confirmed
                  ) : (
                    "Confirm" // Display "Confirm" otherwise
                  )}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
