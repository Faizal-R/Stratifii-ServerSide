import { IAdmin } from "../../models/admin/Admin";

export interface IAdminService{
    login(email:string,password:string):Promise<{accessToken:string,refreshToken:string}>
}