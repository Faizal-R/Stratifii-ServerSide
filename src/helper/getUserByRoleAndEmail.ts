
import { Roles } from "../constants/enums/roles";
import { Candidate, Company, Interviewer } from "../models";
import { ICandidate } from "../models/candidate/Candidate";
import { ICompany } from "../models/company/Company";
import { IInterviewer } from "../models/interviewer/Interviewer";


export async function getUserByRoleAndEmail(
  email: string,
  role: string,
 _userId: string|null=null
): Promise<ICompany | IInterviewer | ICandidate | null> {
  if (role === Roles.COMPANY) {
    return await Company.findOne({ email });
  } else if (role === Roles.CANDIDATE) {
    return await Candidate.findOne({ email });
  } else if (role === Roles.INTERVIEWER) {
    return await Interviewer.findOne({ email });
  } else return null;
}
  