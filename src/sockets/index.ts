import { Server, Socket } from "socket.io";
import { registerRoomHandlers } from "./registers/room/RoomRegisters";
import { registerSignalingHandlers } from "./registers/signaling/SignalingRegisters";

export const initializeSocket = (io: Server) => {
  // Handle connections
  io.on("connection", (socket: Socket) => {
    console.log(`🔌 User connected: (${socket.id})`);

    // Register all event handlers

    registerRoomHandlers(io, socket);
    registerSignalingHandlers(io, socket);

    // Handle connection errors
    socket.on("error", (error) => {
      console.error(`Socket error for user ${socket.id}:`, error);
    });

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("signal", ({ roomId, data }) => {
      socket.to(roomId).emit("signal", { id: socket.id, data });
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.log(`🔌 User disconnected: ${socket.id} - Reason: ${reason}`);
    });
  });

  return io;
};
