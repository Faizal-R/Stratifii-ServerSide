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
import { DI_REPOSITORIES } from "../../di/types";

@injectable()
export class AdminRepository
  extends BaseRepository<IAdmin>
  implements IAdminRepository
{
  constructor(
  @inject(DI_REPOSITORIES.COMPANY_REPOSITORY)  private _companyRepository: ICompanyRepository,
  @inject(DI_REPOSITORIES.INTERVIEWER_REPOSITORY)  private _interviewerRepository: IInterviewerRepository
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
    return await this._companyRepository.findAll({status});
  }
  async getAllInterviewers(status:string): Promise<IInterviewer[] | []> {
    return await this._interviewerRepository.findAll({status});
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return await Admin.findOne({ email }).exec();
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
      throw new CustomError("Error updating company verification status:", 500);
      
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
        { status: isApproved ? 'approved' : 'rejected' }
      );
  
      return updatedInterviewer ?? null;
    } catch (error) {
      throw new CustomError("Error updating Interviewer verification status:", 500);
  
    }
  }
  
  
}
