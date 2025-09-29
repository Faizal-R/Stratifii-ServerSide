export interface AccessTokenPayload {
  userId: string;
  role: "admin" | "candidate" | "interviewer" | "company";
  exp?: number;
}

export interface RefreshTokenPayload {
  jti: string;
  userId: string;
  role: "admin" | "candidate" | "interviewer" | "company";
  exp?: number;
}