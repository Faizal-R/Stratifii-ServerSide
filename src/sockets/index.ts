import { Server, Socket } from "socket.io";
import { registerRoomHandlers } from "./registers/room/RoomRegisters";
import { registerSignalingHandlers } from "./registers/signaling/SignalingRegisters";

export const initializeSocket = (io: Server) => {
  // Handle connections
  const userToSockets = new Map<string, Set<string>>();
  const socketToUser = new Map<string, string>();

  io.on("connection", (socket: Socket) => {
    console.log(`🔌 User connected: (${socket.id})`);
    registerRoomHandlers(io, socket);
    registerSignalingHandlers(io, socket);

    // Handle connection errors
    socket.on("error", (error) => {
      console.error(`Socket error for user ${socket.id}:`, error);
    });

    socket.on("join-room", ({ roomId }) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("user:loggedIn", (userId: string) => {
      console.log("userSocketID", userId);
      // Map userId → socketId
      if (!userToSockets.has(userId)) {
        userToSockets.set(userId, new Set());
      }
      userToSockets.get(userId)!.add(socket.id);
      // console.log(userToSockets)

      // Map socketId → userId
      socketToUser.set(socket.id, userId);

      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("user:status", (data: { userId: string; status: string }) => {
      console.log("SocketData:", data);
      const userSockets = userToSockets.get(data.userId);
      console.log("userSockets:", userSockets);
      if (userSockets) {
        userSockets.forEach((socketId) => {
          console.log("socketIDs:", socketId);
          io.to(socketId).emit("user:status:updated", { status: data.status });
        });
      }
    });

    socket.on(
      "code:changes",
      ({ roomId, code }: { roomId: string; code: string }) => {
        console.log("code:", code);
        io.to(roomId).emit("receive:code:update", code);
      }
    );

    socket.on("signal", ({ roomId, data }) => {
      socket.to(roomId).emit("signal", { id: socket.id, data });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      // Find the userId associated with this socket
      const userId = socketToUser.get(socket.id);

      if (userId) {
        // Remove this socket from the user's set of sockets
        const userSockets = userToSockets.get(userId);
        if (userSockets) {
          userSockets.delete(socket.id);

          // If user has no more active sockets, remove the entry entirely
          if (userSockets.size === 0) {
            userToSockets.delete(userId);
            console.log(
              `User ${userId} has no active sockets, removed from map.`
            );
          }
        }

        // Remove the socket → user mapping
        socketToUser.delete(socket.id);
      }
    });
  });

  return io;
};
