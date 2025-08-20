import { IAdmin } from "../../models/admin/Admin";
import { ICompany } from "../../models/company/Company";
import { IInterviewer } from "../../models/interviewer/Interviewer";

export interface IAdminService{
    login(email:string,password:string):Promise<{accessToken:string,refreshToken:string}>
    getAllCompanies(status:string):Promise<ICompany[]|[]>
    updateCompanyStatus(companyId:string):Promise<ICompany|null>

    getAllInterivewers(status:string):Promise<IInterviewer[]|[]>
    updateInterviewerStatus(interviewerId:string):Promise<IInterviewer|null>

    handleCompanyVerification(companyId:string,isApproved:boolean,reasonForRejection?:string): Promise<ICompany|null>
    handleInterviewerVerification(interviewerId:string,isApproved:boolean,interviewerName:string,interviewerEmail:string,reasonForRejection?:string): Promise<IInterviewer|null>
    
}  