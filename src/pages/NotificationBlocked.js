import React from "react";

const NotificationBlocked = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Heads Up! Notifications Are Off</h2>
      <p style={styles.message}>
        It looks like you’ve got notifications turned off. Turning them on will
        make sure you get important updates, like new orders or alerts, right on
        your device.
      </p>
      <h3 style={styles.instructionsHeader}>Here’s how to turn them on:</h3>
      <ol style={styles.instructions}>
        <li>Open Chrome and go to our café's website.</li>
        <li>Tap the menu (three dots) in the top-right corner.</li>
        <li>
          Go to <strong>Settings</strong> &gt; <strong>Site settings</strong>{" "}
          &gt; <strong>Notifications</strong>.
        </li>
        <li>
          Find our café in the list and set it to <strong>Allow</strong>.
        </li>
      </ol>
      <p style={styles.footer}>
        Once you’ve turned on notifications, you’ll start getting updates
        instantly. Need a hand? Just ask!
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
