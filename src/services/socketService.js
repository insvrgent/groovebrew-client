import socketIOClient from "socket.io-client";
import API_BASE_URL from "../config.js";

const socket = socketIOClient(API_BASE_URL, {
  transports: ["websocket"], // Use WebSocket for better performance
  reconnection: true, // Enable automatic reconnection
  reconnectionAttempts: Infinity, // Set to Infinity to keep trying
  reconnectionDelay: 1000, // Time in ms to wait before attempting reconnection
  reconnectionDelayMax: 5000, // Max delay in ms for reconnection attempts
  timeout: 20000, // Connection timeout
});

export default socket;
