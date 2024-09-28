import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css"; // Import module CSS for styling
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import AccountUpdateModal from "../components/AccountUpdateModal";
import { updateLocalStorage } from "../helpers/localStorageHelpers";
import { getAllCafeOwner, createCafeOwner } from "../helpers/userHelpers";
import { getOwnedCafes, createCafe, updateCafe } from "../helpers/cafeHelpers";

import { ThreeDots } from "react-loader-spinner";
import { unsubscribeUser } from "../helpers/subscribeHelpers.js";

const Dashboard = ({ user, setModal }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", type: "" });

  useEffect(() => {
    if (user && user.roleId === 0) {
      setLoading(true);
      getAllCafeOwner()
        .then((data) => {
          setItems(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching cafe owners:", error);
          setLoading(false);
        });
    }
    if (user && user.roleId === 1) {
      setLoading(true);
      getOwnedCafes(user.userId)
        .then((data) => {
          setItems(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching owned cafes:", error);
          setLoading(false);
        });
    }
  }, [user]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    updateLocalStorage("auth", "");
    unsubscribeUser();
    navigate(0);
  };

  const handleCreateItem = () => {
    if (user.roleId < 1) {
      // Create admin functionality
      createCafeOwner(newItem.name)
        .then(() => {
          setItems([...items, { name: newItem.name }]);
          setIsCreating(false);
          setNewItem({ name: "", type: "" });
        })
        .catch((error) => {
          console.error("Error creating admin:", error);
        });
    } else {
      // Create cafe functionality
      createCafe(newItem.name)
        .then(() => {
          setItems([...items, { name: newItem.name }]);
          setIsCreating(false);
          setNewItem({ name: "", type: "" });
        })
        .catch((error) => {
          console.error("Error creating cafe:", error);
        });
    }
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
            <div
              className={styles.rectangle}
              onClick={() => setIsCreating(true)}
            >
              Create Admin
            </div>
          ) : (
            <div
              className={styles.rectangle}
              onClick={() => setIsCreating(true)}
            >
              +
            </div>
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

      {isCreating && (
        <div className={styles.createModal}>
          <h2>Create New {user.roleId < 1 ? "Admin" : "Cafe"}</h2>
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            placeholder="Name"
          />
          <button onClick={handleCreateItem}>Create</button>
          <button onClick={() => setIsCreating(false)}>Cancel</button>
        </div>
      )}
    </>
  );
};

export default Dashboard;
