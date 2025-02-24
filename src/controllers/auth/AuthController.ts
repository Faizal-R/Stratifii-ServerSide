import { Request, Response } from "express";
import { Roles } from "../../constants/roles";
import { createResponse } from "../../helper/responseHandler";
// import { AuthService } from "../../services/auth/AuthService";

// export class AuthController {
//   constructor(private readonly _authService: AuthService) {}

//   async login(request: Request, response: Response):Promise<Response> {
//     const { role, email, password } = request.body;
//     if (!role || !email || !password) {
//       createResponse(response, 400, false, "All fields are required");
//     }

//     if (!Object.values(Roles).includes(role)) {
//       return createResponse(response, 400, false, "Invalide Roles");
//     }
//     const {accessToken,refreshToken,user}=await this._authService.login(role, email, password);
//       return createResponse(response,200,true,"User LoggedIn Successfully",{accessToken,refreshToken,user})
//   }
// }
