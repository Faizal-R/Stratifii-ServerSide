// import jwt from "jsonwebtoken";
// import { Roles } from "../../constants/roles";
// import { InterviewerRepository } from "../../repositories/interviewer/InterviewerRepository";
// import { CandidateRepository } from "../../repositories/candidate/CandidateRepository";
// import { CompanyRepository } from "../../repositories/company/CompanyRepository";
// import { ICompany } from "../../interfaces/ICompanyModel";
// import { IInterviewer } from "../../interfaces/IInterviewerModel";
// import { ICandidate } from "../../interfaces/ICandidateModel";
// import { comparePassword } from "../../utils/hash";


// type UserType = ICompany | IInterviewer | ICandidate;

// export class AuthService {
//   constructor(
//     private readonly _interviewerRepository?: InterviewerRepository,
//     private readonly _candidateRepository?: CandidateRepository,
//     private readonly _companyRepository?: CompanyRepository
//   ) {}

//   async login(
//     role: Roles,
//     email: string,
//     password: string
//   ): Promise<{ accessToken: string; refreshToken: string; user: UserType }> {
//     let user: UserType | null | undefined;

//     switch (role) {
//       case Roles.COMPANY:
//         user = await this._companyRepository?.findByEmail(email);
//         break;
//       case Roles.INTERVIEWER:
//         user = await this._interviewerRepository?.findByEmail(email);
//         break;
//       case Roles.CANDIDATE:
//         user = await this._candidateRepository?.findByEmail(email);
//         break;
//       default:
//         throw new Error("Invalid Role");
//     }

//     if (!user || !(await comparePassword(password, user.password))) {
//       throw new Error("Invalid email or password");
//     }

//     const accessToken = this.generateAccessToken(user._id as string, role);
//     const refreshToken = this.generateRefreshToken(user._id as string);

//     return { accessToken, refreshToken, user };
//   }

//   private 

//   private 
// }
