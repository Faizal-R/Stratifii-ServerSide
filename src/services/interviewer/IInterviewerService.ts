import { InterviewerResponseDTO } from "../../dto/response/interviewer/InterviewerResponseDTO";
import {
  IBankDetails,
  IInterviewer,
} from "../../models/interviewer/Interviewer";
import { IWallet } from "../../models/wallet/Wallet";

export interface IInterviewerService {
  getInterviewerById(interviewerId: string): Promise<InterviewerResponseDTO | null>;
 updateInterviewerProfile(
    interviewerId: string,
    interviewer: Partial<IInterviewer>,
    avatar?: Express.Multer.File,
    resume?: Express.Multer.File
  ): Promise<InterviewerResponseDTO> 
  changePassword(
    currentPassword: string,
    newPassword: string,
    interviewerId: string
  ): Promise<void>;
  addBankDetails(
    bankDetails: IBankDetails,
    interviewerId: string
  ): Promise<void>;

  getInterviewerWallet(interviewerId: string): Promise<IWallet|null>;
}
