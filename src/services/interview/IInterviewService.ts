import { IQuestion } from "../../helper/generateMockQuestions";

export interface IInterviewService{
    generateCandidateMockInterviewQuestions(delegationId:string):Promise<IQuestion[]>
    finalizeAIMockInterview(
  delegationId: string,
  resultPayload: { percentage: number; correct: number; total: number; }
): Promise<{ passed: boolean; message: string }>
}