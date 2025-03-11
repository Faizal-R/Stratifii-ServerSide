import { IAdmin } from "../../models/admin/Admin";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IAdminRepository extends IBaseRepository<IAdmin>{
    findByEmail(email:string):Promise<IAdmin | null>
}
