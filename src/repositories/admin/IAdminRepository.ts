import { IAdmin } from "../../models/admin/Admin";
import { ICompany } from "../../models/company/Company";
import { IInterviewer } from "../../models/interviewer/Interviewer";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IAdminRepository extends IBaseRepository<IAdmin> {
  findByEmail(email: string): Promise<IAdmin | null>;
  
  getAllCompanies(status:string): Promise<ICompany[] | []>;
  updateCompanyStatus(companyId: string): Promise<ICompany | null>;

  getAllInterviewers(status:string): Promise<IInterviewer[] | []>;
  updateInterviewerStatus(interviewerId: string): Promise<IInterviewer | null>;

  updateCompanyVerificationStatus(companyId:string,isApproved:boolean): Promise<ICompany | null>;
  updateInterviewerVerificationStatus(interviewerId:string,isApproved:boolean): Promise<IInterviewer | null>;
  
}
