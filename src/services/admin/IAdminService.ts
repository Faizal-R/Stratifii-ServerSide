import { CompanyBasicDTO, CompanyResponseDTO } from "../../dto/response/company/CompanyResponseDTO";
import { InterviewerResponseDTO } from "../../dto/response/interviewer/InterviewerResponseDTO";

import { ICompany } from "../../models/company/Company";
import { IInterviewer } from "../../models/interviewer/Interviewer";


export interface IAdminService{
    login(email:string,password:string):Promise<{accessToken:string,refreshToken:string}>
    getAllCompanies(status:string):Promise<CompanyResponseDTO[]|[]>
    updateCompanyStatus(companyId:string):Promise<CompanyResponseDTO|null>

    getAllInterivewers(status: string): Promise<InterviewerResponseDTO[] | []>
    updateInterviewerStatus(interviewerId:string):Promise<InterviewerResponseDTO|null>

    handleCompanyVerification(companyId:string,isApproved:boolean,reasonForRejection?:string,isPermanentBan?:boolean): Promise<CompanyResponseDTO|null>
    handleInterviewerVerification(interviewerId:string,isApproved:boolean,interviewerName:string,interviewerEmail:string,reasonForRejection?:string): Promise<InterviewerResponseDTO|null>

    getAdminDashboard(): Promise<{
    keyMetrics: {
      activeCompanies: number;
      totalInterviewers: number;
      totalRevenue: number;
      totalActiveSubscription: number;
    };
    monthlyRevenue: {
      month: string;
      interviews: number;
      subscriptions: number;
      total: number;
    }[];
     monthlyUserGrowth:{
      month: string;
      companies: number;
      interviewers: number;
    }[]
    subscriptionDistribution: {
      name: string;
      value: number;
    }[];
    interviewTrends:{
      month:string;
      interviews: number;
    }[]
     recentCompanies:CompanyBasicDTO[]
  }>
}