import { io } from "socket.io-client";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const socket = io(apiBaseUrl, {
  transports: ["websocket"],
});

export default socket;
