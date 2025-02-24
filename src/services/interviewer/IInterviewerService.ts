import { IInterviewer } from "../../interfaces/IInterviewerModel";
export interface IInterviewerService {
  login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string; user: IInterviewer }>;
  register(
    name: string,
    email: string,
    position: string,
    password: string,
    phone: string,
    experience: number,
    linkedinProfile: string,
    language: Record<string,string>,
    availability:{day:string;timeSlot:string[]}[],
    professionalSummary: string,
    expertise: string[]
  ): Promise<IInterviewer>;
}
