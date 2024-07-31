import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css"; // Import module CSS for styling
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import AccountUpdateModal from "../components/AccountUpdateModal";
import { updateLocalStorage } from "../helpers/localStorageHelpers";
import { getAllCafeOwner } from "../helpers/userHelpers";
import { getOwnedCafes } from "../helpers/cafeHelpers";

import { ThreeDots } from "react-loader-spinner";

const Dashboard = ({ user, setModal }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (user && user.roleId === 0) {
      setLoading(true);
      // Example of calling getAllCafeOwner if roleId is 0
      getAllCafeOwner()
        .then((data) => {
          setItems(data); // Assuming getAllCafeOwners returns an array of cafe owners
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching cafe owners:", error);
        });
    }
    if (user && user.roleId === 1) {
      // Example of calling getAllCafeOwner if roleId is 0
      setLoading(true);
      getOwnedCafes(user.userId)
        .then((data) => {
          setItems(data); // Assuming getAllCafeOwners returns an array of cafe owners
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching cafe owners:", error);
        });
    }
  }, [user]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    updateLocalStorage("auth", "");
    navigate(0);
  };

  return (
    <>
      <Header
        HeaderText={"GrooveBrew"}
        isEdit={() => setIsModalOpen(true)}
        isLogout={handleLogout}
        user={user}
        showProfile={true}
        setModal={setModal}
      />
      {user && user.roleId < 2 && (
        <div className={styles.dashboard}>
          {loading && <ThreeDots />}
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate("/" + item.cafeId)}
              className={styles.rectangle}
            >
              {item.name || item.username}
            </div>
          ))}
          {user && user.roleId < 1 ? (
            <div className={styles.rectangle}>Create Admin</div>
          ) : (
            <div className={styles.rectangle}>Create Cafe</div>
          )}
        </div>
      )}

      {user.username && (
        <AccountUpdateModal
          user={user}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default Dashboard;
