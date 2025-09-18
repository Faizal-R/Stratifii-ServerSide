import {
  IBankDetails,
  IInterviewer,
} from "../../models/interviewer/Interviewer";
import { IWallet } from "../../models/wallet/Wallet";

export interface IInterviewerService {
  getInterviewerById(interviewerId: string): Promise<IInterviewer | null>;
  updateInterviewerProfile(
    interviewerId: string,
    interviewer: any,
    avatar?: Express.Multer.File,
    resume?: Express.Multer.File
  ): Promise<IInterviewer | null>;
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
