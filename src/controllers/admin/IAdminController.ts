export interface IAdminController{
    login(email:string,password:string):Promise<{accessToken:string,refreshToken:string}>
}