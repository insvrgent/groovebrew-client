import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";
import { Oval } from "react-loader-spinner";
import styles from "./GuestSide.module.css"; // Import the CSS Module
import { updateLocalStorage } from "../helpers/localStorageHelpers";

const GuestSide = ({ socket }) => {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        socket.emit("req_guestSide");

        socket.on("res_guest_side", (data) => {
          setLoading(false);
          setQrCode(data);
          console.log(data);
        });

        socket.on("qrCode_hasRead", (response) => {
          const { authGuestCode, shopId } = response;
          updateLocalStorage("authGuestSide", authGuestCode);
          updateLocalStorage("auth", "");

          navigate("/" + shopId, { replace: true, state: { refresh: true } });
        });
      } catch (error) {
        console.error("Error fetching shop items:", error);
        setLoading(false); // Ensure loading state is turned off on error
      }
    };

    fetchData();

    // Clean up on component unmount
    return () => {
      socket.off("res_guest_side");
      socket.off("qrCode_hasRead");
    };
  }, [socket]);

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>
          <Oval height="80" width="80" color="grey" ariaLabel="loading" />
        </div>
      ) : (
        <>
          <QRCode value={qrCode} size={256} />
          <h1>{qrCode}</h1>
        </>
      )}
    </div>
  );
};

export default GuestSide;
