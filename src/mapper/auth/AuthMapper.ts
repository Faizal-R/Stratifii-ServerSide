// Input: Domain Model or Raw Entity

import { AuthLoginResponseDTO } from "../../dto/response/auth/AuthResponseDTO";
import { ISubscriptionRecord } from "../../models/subscription/SubscriptionRecord";
import { TUserType } from "../../types/user";


// Output: DTO formatted for response
export function mapToAuthResponseDTO(data: {
  accessToken:string,
  refreshToken:string,
  user:TUserType ;
  subscriptionDetails?: ISubscriptionRecord | null ;
}):AuthLoginResponseDTO {
   console.log(data);
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    
    user: {
      _id: data.user._id.toString(),
      name: data.user.name,
      email: data.user.email,
    },
    subscription: data.subscriptionDetails
      ? data.subscriptionDetails
      : null,
  };
}



export function mapToAuthUserResponseDTO(data: TUserType) {
  return {
    _id: data._id.toString(),
    name: data.name,
    email: data.email,
  };
}