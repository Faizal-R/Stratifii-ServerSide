import { Extension } from "typescript";
import { ISubscriptionRecord } from "../../../models/subscription/SubscriptionRecord";

export interface AuthUserResponseDTO {
  _id: string;
  name: string;
  email: string;
  isVerified?:boolean;
  status:string;
}

export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: AuthUserResponseDTO;
  subscription?: ISubscriptionRecord | null;
}

export type GoogleAuthResponseDTO=Partial<AuthResponseDTO> & {isRegister:boolean};
