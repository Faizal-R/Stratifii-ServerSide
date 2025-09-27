import { Server, Socket } from "socket.io";
import { registerRoomHandlers } from "./registers/room/RoomRegisters";
import { registerSignalingHandlers } from "./registers/signaling/SignalingRegisters";

export const initializeSocket = (io: Server) => {
  // Handle connections
  io.on("connection", (socket: Socket) => {
   

    
    registerRoomHandlers(io, socket);
    registerSignalingHandlers(io, socket);

    // Handle connection errors
    socket.on("error", (error) => {
      console.error(`Socket error for user ${socket.id}:`, error);
    });

    socket.on("join-room", ({roomId}) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);

     
    });

    socket.on("signal", ({ roomId, data }) => {
      socket.to(roomId).emit("signal", { id: socket.id, data });
    });

    // Handle disconnection
    // socket.on("disconnect", (reason) => {
     
    // });
  });

  return io;
};
