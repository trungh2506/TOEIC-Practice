"use client";

import { io } from "socket.io-client";

let socket: any;

if (!socket) {
  socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
    transports: ["websocket"],
  });
}

export { socket };
