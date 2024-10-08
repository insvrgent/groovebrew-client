import React, { useRef, useEffect, useState } from "react";
import styles from "./Transactions.module.css";
import { useParams } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import ButtonWithReplica from "../components/ButtonWithReplica";
import {
  getTransaction,
  confirmTransaction,
  handleClaimHasPaid,
  declineTransaction,
  cancelTransaction,
} from "../helpers/transactionHelpers";
import { getTables } from "../helpers/tableHelper";
import TableCanvas from "../components/TableCanvas";
import { useSearchParams } from "react-router-dom";

export default function Transactions({
  propsShopId,
  sendParam,
  deviceType,
  paymentUrl,
}) {
  const { shopId, tableId } = useParams();
  if (sendParam) sendParam({ shopId, tableId });

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [transaction, setTransaction] = useState(null);
  const noteRef = useRef(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

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
    if (isPaymentLoading) return;
    setIsPaymentLoading(true);
    try {
      const c = await handleClaimHasPaid(transactionId);
      if (c) {
        setTransaction({
          ...transaction,
          confirmed: c.confirmed,
          paymentClaimed: true,
        });
        console.log(transaction);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleDecline = async (transactionId) => {
    if (isPaymentLoading) return;
    setIsPaymentLoading(true);
    try {
      const c = await cancelTransaction(transactionId);
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const autoResizeTextArea = (textarea) => {
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
    }
  };

  useEffect(() => {
    if (noteRef.current) {
      autoResizeTextArea(noteRef.current);
    }
  }, [transaction?.notes]);

  return (
    <div className={styles.Transactions}>
      <div style={{ marginTop: "30px" }}></div>
      <h2 className={styles["Transactions-title"]}>Transactions</h2>
      {/* <TableCanvas tables={tables} selectedTable={selectedTable} /> */}
      <div className={styles.TransactionListContainer}>
        {transaction && (
          <div
            key={transaction.transactionId}
            className={styles.RoundedRectangle}
            onClick={() =>
              setSelectedTable(transaction.Table || { tableId: 0 })
            }
            style={{ overflow: "hidden" }}
          >
            <h2 className={styles["Transactions-detail"]}>
              Transaction ID: {transaction.transactionId}
            </h2>
            <h2 className={styles["Transactions-detail"]}>
              Payment Type: {transaction.payment_type}
            </h2>
            <ul>
              {(isPaymentOpen
                ? transaction.DetailedTransactions.slice(0, 2)
                : transaction.DetailedTransactions
              ).map((detail) => (
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
            {(transaction.notes !== "" || isPaymentOpen) && (
              <>
                <div
                  className={styles.NoteContainer}
                  style={{
                    visibility: transaction.notes == "" ? "hidden" : "visible",
                  }}
                >
                  <span>Note :</span>
                  <span></span>
                </div>

                <div
                  className={styles.NoteContainer}
                  style={{
                    visibility: transaction.notes == "" ? "hidden" : "visible",
                  }}
                >
                  <textarea
                    className={styles.NoteInput}
                    value={transaction.notes}
                    ref={noteRef}
                    disabled
                  />
                </div>
              </>
            )}
            <div className={styles.TotalContainer}>
              <span>Total:</span>
              <span>
                Rp {calculateTotalPrice(transaction.DetailedTransactions)}
              </span>
            </div>
            <div className={styles.PaymentContainer}>
              <ButtonWithReplica
                paymentUrl={paymentUrl}
                price={
                  "Rp" + calculateTotalPrice(transaction.DetailedTransactions)
                }
                disabled={isPaymentLoading}
                isPaymentLoading={isPaymentLoading}
                handleClick={() => handleConfirm(transaction.transactionId)}
                Open={() => setIsPaymentOpen(true)}
                isPaymentOpen={isPaymentOpen}
              >
                {isPaymentLoading ? (
                  <ColorRing height="50" width="50" color="white" />
                ) : isPaymentOpen ? (
                  "Claim has paid" // Display "Confirm has paid" if the transaction is confirmed (1)
                ) : (
                  "Show payment" // Display "Confirm availability" if the transaction is not confirmed (0)
                )}
              </ButtonWithReplica>
            </div>
            <h5
              className={`${styles.DeclineButton} ${
                isPaymentOpen ? styles.active : ""
              }`}
              onClick={() =>
                isPaymentOpen
                  ? setIsPaymentOpen(false)
                  : handleDecline(transaction.transactionId)
              }
            >
              {isPaymentOpen ? "back" : "cancel"}
            </h5>
          </div>
        )}
      </div>
    </div>
  );
}
