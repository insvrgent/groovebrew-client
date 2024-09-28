import API_BASE_URL from "../config.js";

import { getLocalStorage } from "./localStorageHelpers";

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

const getVapidKey = async () => {
  const response = await fetch(`${API_BASE_URL}/vapid-key`);
  const { publicVapidKey } = await response.json();
  return publicVapidKey;
};

const subscribeUser = async () => {
  try {
    const publicVapidKey = await getVapidKey();
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js"
    );
    console.log("Service Worker registered with scope:", registration.scope);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    await fetch(`${API_BASE_URL}/subscribe`, {
      method: "POST",
      body: JSON.stringify({
        subscription,
        token: getLocalStorage("auth"), // Ensure this function is defined elsewhere
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return subscription; // Return subscription if needed
  } catch (error) {
    console.error("Subscription failed:", error);
  }
};

const unsubscribeUser = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await fetch(`${API_BASE_URL}/unsubscribe`, {
        method: "POST",
        body: JSON.stringify({
          subscription,
          token: getLocalStorage("auth"), // Ensure this function is defined elsewhere
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      await subscription.unsubscribe();
      console.log("User unsubscribed from notifications.");
    } else {
      console.log("No subscription found.");
    }
  }
};
const resetNotificationSubscription = async () => {
  await unsubscribeUser(); // First unsubscribe the user
  await subscribeUser(); // Then subscribe the user again
};

export { subscribeUser, unsubscribeUser, resetNotificationSubscription };
