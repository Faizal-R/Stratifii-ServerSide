import { IQuestion } from "../../helper/generateMockQuestions";
import {
  IInterview,
  IInterviewFeedback,
} from "../../models/interview/Interview";

export interface IInterviewService {
  generateCandidateMockInterviewQuestions(
    delegationId: string
  ): Promise<IQuestion[]>;
  finalizeAIMockInterview(
    delegationId: string,
    resultPayload: { percentage: number; correct: number; total: number }
  ): Promise<{ passed: boolean; message: string }>;

  getUpcomingInterviews(interviewerId: string): Promise<IInterview[] | []>;

  updateAndSubmitFeedback(
    interviewId: string,
    feedbackPayload: IInterviewFeedback
  ): Promise<void>;

  getScheduledInterviews(candidateId: string): Promise<IInterview[] | []>;
}
