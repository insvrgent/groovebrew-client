// public/firebase-messaging-sw.js
self.addEventListener("push", function (event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "https://i.pinimg.com/originals/3c/44/67/3c446785968272f79aaac7ace5ded0fe.jpg", // Path to your icon
    badge: "badge.png", // Path to your badge
    data: {
      // Add data to the notification
      cafeId: data.cafeId,
      transactionId: data.transactionId,
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Close the notification

  const { cafeId, transactionId } = event.notification.data; // Get the notification data

  // Open the URL with the cafeId and transactionId
  event.waitUntil(
    clients.openWindow(
      `https://srrk5s-3000.csb.app/${cafeId}?modal=new_transaction&transactionId=${transactionId}`
    )
  );
});
