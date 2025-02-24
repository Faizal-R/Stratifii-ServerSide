import { ICandidate } from "../../interfaces/ICandidateModel";
export interface ICanidateService{
  login(
        email: string,
        password: string
      ): Promise<{
        accessToken: string;
        refreshToken: string;
        user: ICandidate;
      }>
}