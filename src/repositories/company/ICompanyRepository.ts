import { ICompany } from "../../models/company/Company";
import { IBaseRepository } from "../base/IBaseRepository";

export interface ICompanyRepository extends IBaseRepository<ICompany> {
 findByEmail(email:string):Promise<ICompany | null>
}