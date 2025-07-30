export enum WEBRTC_EVENTS {
  // Room Management
  JOIN_ROOM = 'webrtc:join-room',
  USER_JOINED = 'webrtc:user-joined',
  USER_LEFT = 'webrtc:user-left',
  
  // WebRTC Signaling
  OFFER = 'webrtc:offer',
  ANSWER = 'webrtc:answer',
  ICE_CANDIDATE = 'webrtc:ice-candidate',

  // Media Status
  TOGGLE_MIC = 'webrtc:toggle-mic',
  TOGGLE_CAMERA = 'webrtc:toggle-camera',

  // Call Controls
  END_CALL = 'webrtc:end-call',
  CALL_ENDED = 'webrtc:call-ended',

  // Error / Debug
  ERROR = 'webrtc:error'
}
