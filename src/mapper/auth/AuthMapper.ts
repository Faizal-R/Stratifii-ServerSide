// Input: Domain Model or Raw Entity

import {
  AuthResponseDTO,
  GoogleAuthResponseDTO,
} from "../../dto/response/auth/AuthResponseDTO";
import { ICompany } from "../../models/company/Company";
import { IInterviewer } from "../../models/interviewer/Interviewer";
import { ISubscriptionRecord } from "../../models/subscription/SubscriptionRecord";
import { TUserType } from "../../types/sharedTypes";

// Output: DTO formatted for response
export function mapToAuthResponseDTO(data: {
  accessToken: string;
  refreshToken: string;
  user: TUserType;
  subscriptionDetails?: ISubscriptionRecord | null;
}): AuthResponseDTO {
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: mapToAuthUserResponseDTO(data.user),
    subscription: data.subscriptionDetails ? data.subscriptionDetails : null,
  };
}

export function mapToGooleAuthResponseDTO(data: {
  accessToken?: string;
  refreshToken?: string;
  user?: IInterviewer | ICompany;
  isRegister: boolean;
}): GoogleAuthResponseDTO {
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user ? mapToAuthUserResponseDTO(data.user) : undefined,
    isRegister: data.isRegister,
  };
}

export function mapToAuthUserResponseDTO(data: TUserType) {
  return {
    _id: data._id.toString(),
    name: data.name,
    email: data.email,
    isVerified: "isVerified" in data ? data.isVerified : undefined,
  };
}
