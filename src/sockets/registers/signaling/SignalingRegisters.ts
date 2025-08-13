import { Server, Socket } from "socket.io";
import { handleSignaling } from "../../handlers/signaling/SignalingHandlers";

export const registerSignalingHandlers=(io:Server,socket:Socket)=>{
    // socket.on("signal",handleSignaling(io,socket))
}