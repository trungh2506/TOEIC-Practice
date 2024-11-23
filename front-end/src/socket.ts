"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (user_id: string): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_BASE_URL!, {
      transports: ["websocket"],
      query: { user_id },
    });
  }
  return socket;
};
