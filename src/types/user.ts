import { ICandidate } from "../models/candidate/Candidate";
import { ICompany } from "../models/company/Company";
import { IInterviewer } from "../models/interviewer/Interviewer";

export type TUserType = ICompany | IInterviewer | ICandidate;