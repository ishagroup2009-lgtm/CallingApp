import io from "socket.io-client";

const SOCKET_URL = "https://test-backend-bqhi.onrender.com";

const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
});

export default socket;