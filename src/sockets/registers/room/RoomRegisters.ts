import { Server,Socket } from "socket.io";
import { handleRoomJoin } from "../../handlers/room/RoomHandler";
import { ROOM_EVENTS } from "../../../constants/socket/events/RoomEvents";
export const registerRoomHandlers=(io:Server,socket:Socket)=>{
  socket.on(ROOM_EVENTS.JOIN_ROOM,handleRoomJoin(io,socket))
}