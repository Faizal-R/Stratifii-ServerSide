import { Server, Socket } from "socket.io";
import { WEBRTC_EVENTS } from "../../../constants/socket/events/WebRTCEvents";
import {
  handleAnswer,
  handleIceCandidate,
  handleOffer,
} from "../../handlers/signaling/SignalingHandlers";

export const registerSignalingHandlers = (io: Server, socket: Socket) => {
  socket.on("offer", handleOffer(io, socket));
  socket.on("answer", handleAnswer(io, socket));
  socket.on("ice-candidate", handleIceCandidate(io,socket));
};
