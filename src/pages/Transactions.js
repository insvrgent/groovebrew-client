import React, { useEffect, useState } from "react";
import styles from "./Transactions.module.css";
import { useParams } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import {
  getMyTransactions,
  getTransactions,
  confirmTransaction,
  declineTransaction,
} from "../helpers/transactionHelpers";
import { getTables } from "../helpers/tableHelper";
import TableCanvas from "../components/TableCanvas";

export default function Transactions({ propsShopId, sendParam, deviceType }) {
  const { shopId, tableId } = useParams();
  if (sendParam) sendParam({ shopId, tableId });

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        let response;
        if (deviceType == "clerk")
          response = await getTransactions(shopId || propsShopId, 5);
        else if (deviceType == "guestDevice")
          response = await getMyTransactions(shopId || propsShopId, 5);
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
      if (c) {
        // Update the confirmed status locally
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction.transactionId === transactionId
              ? { ...transaction, confirmed: 1 } // Set to confirmed
              : transaction
          )
        );
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleDecline = async (transactionId) => {
    setIsPaymentLoading(true);
    try {
      const c = await declineTransaction(transactionId);
      if (c) {
        // Update the confirmed status locally
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction.transactionId === transactionId
              ? { ...transaction, confirmed: -1 } // Set to confirmed
              : transaction
          )
        );
      }
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
      {/* <TableCanvas tables={tables} selectedTable={selectedTable} /> */}
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
              {transaction.paymentClaimed && transaction.confirmed < 2 && (
                <div className={styles.RibbonBanner}>
                  <img src={"https://i.imgur.com/yt6osgL.png"}></img>
                  <h1>payment claimed</h1>
                </div>
              )}
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
                  onClick={() => handleConfirm(transaction.transactionId)}
                  disabled={
                    isPaymentLoading || // Disable if loading
                    (deviceType === "clerk" &&
                      transaction.confirmed !== 1 &&
                      transaction.confirmed !== 2 &&
                      transaction.confirmed !== 0) || // Disable for clerk when not Confirm has paid, Confirm item is ready, or Confirm availability
                    (deviceType !== "clerk" &&
                      transaction.confirmed !== 1 &&
                      transaction.paymentClaimed) || // Disable for buyer when not Claim has paid
                    transaction.confirmed === 3 || // Disable if Transaction success
                    transaction.confirmed === -1 || // Disable if Declined
                    transaction.confirmed === -2 || // Disable if Canceled
                    transaction.confirmed === 2 || // Disable if In process
                    (transaction.confirmed === 1 && transaction.paymentClaimed) // Disable if verifying payment
                  }
                >
                  {deviceType === "clerk" ? (
                    isPaymentLoading ? (
                      <ColorRing height="50" width="50" color="white" />
                    ) : transaction.confirmed === 1 ? (
                      "Confirm has paid"
                    ) : transaction.confirmed === -1 ? (
                      "Declined"
                    ) : transaction.confirmed === -2 ? (
                      "Canceled"
                    ) : transaction.confirmed === 2 ? (
                      "Confirm item is ready"
                    ) : transaction.confirmed === 3 ? (
                      "Transaction success"
                    ) : (
                      "Confirm availability"
                    )
                  ) : isPaymentLoading ? (
                    <ColorRing height="50" width="50" color="white" />
                  ) : transaction.confirmed === 1 &&
                    !transaction.paymentClaimed ? (
                    "Claim has paid"
                  ) : transaction.confirmed === 1 &&
                    transaction.paymentClaimed ? (
                    "Verifying your payment"
                  ) : transaction.confirmed === -1 ? (
                    "Declined"
                  ) : transaction.confirmed === -2 ? (
                    "Canceled"
                  ) : transaction.confirmed === 2 ? (
                    "In process"
                  ) : (
                    "Transaction success"
                  )}
                </button>
              </div>
              {transaction.confirmed == 0 && (
                <h5
                  className={styles.DeclineButton}
                  onClick={() => handleDecline(transaction.transactionId)}
                >
                  decline
                </h5>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
