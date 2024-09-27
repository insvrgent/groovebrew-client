import API_BASE_URL from "../config.js";
import { NotificationService } from "./notificationService";

export const SubscriptionService = {
  async subscribeUserToNotifications(userId) {
    const registration = await navigator.serviceWorker.ready;

    const publicKey = await NotificationService.fetchVapidPublicKey(); // Fetch the public key
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: NotificationService.urlB64ToUint8Array(publicKey),
    });

    await this.saveSubscription(userId, subscription);
    console.log("User is subscribed:", subscription);
  },

  async saveSubscription(userId, subscription) {
    await fetch(API_BASE_URL + "/subscribe", {
      method: "POST",
      body: JSON.stringify({ userId, subscription }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
