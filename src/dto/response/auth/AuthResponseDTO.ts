import { ISubscriptionRecord } from "../../../models/subscription/SubscriptionRecord";

export interface AuthUserResponseDTO {
  _id: string;
  name: string;
  email: string;
}

export interface AuthLoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: AuthUserResponseDTO;
  subscription?: ISubscriptionRecord | null;
}
