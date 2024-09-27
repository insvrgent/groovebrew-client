// NotificationBlocked.js
import React from "react";

const NotificationBlocked = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Notifications Blocked</h2>
      <p style={styles.message}>
        It looks like notifications are currently blocked in your browser.
        Enabling notifications will help you receive important updates, such as
        new orders or alerts, directly on your device.
      </p>
      <h3 style={styles.instructionsHeader}>To enable notifications:</h3>
      <ol style={styles.instructions}>
        <li>Open Chrome and go to our café's website.</li>
        <li>Tap the menu (three dots) in the top-right corner.</li>
        <li>
          Go to <strong>Settings</strong> &gt; <strong>Site settings</strong>{" "}
          &gt; <strong>Notifications</strong>.
        </li>
        <li>
          Find our café's site in the list and change the setting to{" "}
          <strong>Allow</strong>.
        </li>
      </ol>
      <p style={styles.footer}>
        Once you enable notifications, you'll start receiving updates right
        away! If you need help, feel free to ask!
      </p>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    margin: "20px auto",
    textAlign: "center",
  },
  header: {
    color: "#e74c3c",
  },
  message: {
    marginBottom: "20px",
  },
  instructionsHeader: {
    marginTop: "20px",
    fontWeight: "bold",
  },
  instructions: {
    listStyleType: "decimal",
    paddingLeft: "20px",
    textAlign: "left",
  },
  footer: {
    marginTop: "20px",
    fontStyle: "italic",
  },
};

export default NotificationBlocked;
