import { inject, injectable } from "inversify";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { CustomError } from "../../error/CustomError";
import Admin, { IAdmin } from "../../models/admin/Admin";
import { ICompany } from "../../models/company/Company";
import { IInterviewer } from "../../models/interviewer/Interviewer";
import { BaseRepository } from "../base/BaseRepository";
import { ICompanyRepository } from "../company/ICompanyRepository";
import { IInterviewerRepository } from "../interviewer/IInterviewerRepository";
import { IAdminRepository } from "./IAdminRepository";
import { DI_TOKENS } from "../../di/types";

@injectable()
export class AdminRepository
  extends BaseRepository<IAdmin>
  implements IAdminRepository
{
  constructor(
  @inject(DI_TOKENS.REPOSITORIES.COMPANY_REPOSITORY)  private _companyRepository: ICompanyRepository,
  @inject(DI_TOKENS.REPOSITORIES.INTERVIEWER_REPOSITORY)  private _interviewerRepository: IInterviewerRepository
  ) {
    super(Admin);
  }
  async updateInterviewerStatus(interviewerId: string) {
    const interviewer = await this._interviewerRepository.findById(interviewerId);
    if (!interviewer) throw new Error("interviewer not found");

    return this._interviewerRepository.update(interviewerId, {
      isBlocked: !interviewer.isBlocked,
    });
  }
  async getAllCompanies(status:string): Promise<ICompany[] | []> {
    return await this._companyRepository.find({status});
  }
  async getAllInterviewers(status:string): Promise<IInterviewer[] | []> {
    return await this._interviewerRepository.find({status});
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return await this.model.findOne({ email }).exec();
  }

  async updateCompanyStatus(companyId: string) {
    const company = await this._companyRepository.findById(companyId);
    if (!company) throw new Error("Company not found");

    return this._companyRepository.update(companyId, {
      isBlocked: !company.isBlocked,
    });
  }

  async updateCompanyVerificationStatus(companyId: string, isApproved: boolean): Promise<ICompany | null> {
    try {
      const existingCompany = await this._companyRepository.findById(companyId);
      if (!existingCompany) {
         throw new CustomError("Company not found", 404);
        
      }
      const updatedCompany = await this._companyRepository.update(
        companyId,
        { status: isApproved ? 'approved' : 'rejected' }
      );
  
      return updatedCompany ?? null;
    } catch (error) {
      if(error instanceof CustomError){
        throw error;
      }
      throw new CustomError("Error updating Company verification status:", 500);
      
    }
  }
  async updateInterviewerVerificationStatus(interviewerId: string, isApproved: boolean): Promise<IInterviewer | null> {
    try {
      const existingInterviewer = await this._interviewerRepository.findById(interviewerId);
      if (!existingInterviewer) {
         throw new CustomError("Interviewer not found", HttpStatus.NOT_FOUND);
       
      }
      const updatedInterviewer = await this._interviewerRepository.update(
        interviewerId,
        { status: isApproved ? 'approved' : 'rejected' ,
        resubmissionPeriod : isApproved ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

        }
        
      );
  
      return updatedInterviewer ?? null;
    } catch (error) {
      if(error instanceof CustomError){
        throw error;
      }
      throw new CustomError("Error updating Interviewer verification status:", 500);
  
    }
  }
  
  
}
