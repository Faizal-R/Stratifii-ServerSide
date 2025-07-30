import { Server, Socket } from "socket.io";
import { WEBRTC_EVENTS } from "../../../constants/socket/events/WebRTCEvents";

export const handleOffer =
  (io: Server, socket: Socket) =>
  (data: { to: string; offer: RTCSessionDescriptionInit }) => {
    const { to, offer } = data;
    console.log("Call Received")

      socket.to(to).emit("incomming:call", { from: socket.id, offer });
      console.log("Incoming request sended")

 
  };

export const handleAnswer =
  (io: Server, socket: Socket) =>
  (data: { answer: RTCSessionDescriptionInit; to: string }) => {
    const { answer, to } = data;
    console.log("Call Accepted",data)
    io.to(to).emit("answer", { from: socket.id, answer });
  };

export const handleIceCandidate =
  (io: Server, socket: Socket) =>
  (data: { candidate: RTCIceCandidate; recipientId: string }) => {
    io.to(data.recipientId).emit("ice-candidate", {
      candidate: data.candidate,
    });
  };
