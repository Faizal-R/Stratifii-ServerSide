// auth.mapper.ts
import {
  AuthResponseDTO,
  GoogleAuthResponseDTO,
} from "../../dto/response/auth/AuthResponseDTO";
import { ICompany } from "../../models/company/Company";
import { IInterviewer } from "../../models/interviewer/Interviewer";
import { ISubscriptionRecord } from "../../models/subscription/SubscriptionRecord";
import { TUserType } from "../../types/sharedTypes";

export const AuthMapper = {
  toAuthResponse: (data: {
    accessToken: string;
    refreshToken: string;
    user: TUserType;
    subscriptionDetails?: ISubscriptionRecord | null;
  }): AuthResponseDTO => ({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: AuthMapper.toAuthUserResponse(data.user),
    subscription: data.subscriptionDetails ?? null,
  }),

  toGoogleAuthResponse: (data: {
    accessToken?: string;
    refreshToken?: string;
    user?: IInterviewer | ICompany;
    isRegister: boolean;
  }): GoogleAuthResponseDTO => ({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user ? AuthMapper.toAuthUserResponse(data.user) : undefined,
    isRegister: data.isRegister,
  }),

  toAuthUserResponse: (data: TUserType) => ({
    _id: data._id.toString(),
    name: data.name,
    email: data.email,
    isVerified: "isVerified" in data ? data.isVerified : undefined,
  }),
};
