import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL ?? '';

const socket = io(socketUrl, {
  path: '/socket.io',
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
});

export default socket;