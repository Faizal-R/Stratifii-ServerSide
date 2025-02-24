import { ICompany } from "../../interfaces/ICompanyModel";
import { IBaseRepository } from "../base/IBaseRepository";

export interface ICompanyRepository {
 findByEmail(email:string):Promise<ICompany | null>
}