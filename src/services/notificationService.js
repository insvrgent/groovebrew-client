import API_BASE_URL from "../config.js";
export const NotificationService = {
  async fetchVapidPublicKey() {
    const response = await fetch(API_BASE_URL + "/vapid-public-key"); // Adjust URL if necessary
    const data = await response.json();
    return data.publicKey;
  },

  async requestNotificationPermission(setModal) {
    if (!("Notification" in window)) {
      throw new Error("This browser does not support desktop notification");
    }
    setModal("req_notification");
    const permission = await Notification.requestPermission();
    return permission === "granted";
  },

  urlB64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
  },
};
