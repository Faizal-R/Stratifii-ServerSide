import { Server, Socket } from "socket.io";
import { ROOM_EVENTS } from "../../../constants/socket/events/RoomEvents";

export const handleRoomJoin =
  (_io: Server, socket: Socket) =>
    (data: { room: string; user: { name: string; role: string } }) => {
      const { room, user } = data;

      const roomInfo = _io.sockets.adapter.rooms.get(room);
      const userCount = roomInfo ? roomInfo.size : 0;

      if (userCount < 2) {
        socket.join(room);

        // Tell the joining user they joined successfully
        socket.emit(ROOM_EVENTS.JOIN_ROOM, { room, user });

        if (userCount === 1) {
          // Notify the already-connected user that a new user has joined

          _io
            .to(room)
            .emit(ROOM_EVENTS.USER_JOINED, { user, id: socket.id });

        }
      } else {
        // Room full
        socket.emit("room:full");
      }
    };
