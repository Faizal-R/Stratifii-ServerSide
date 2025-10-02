import { IInterviewFeedback } from "../../../models/interview/Interview";
import { CandidateDTO } from "../candidate/CandidateResponseDTO";
import { CompanyBasicDTO } from "../company/CompanyResponseDTO";
import { InterviewerSummaryDTO } from "../interviewer/InterviewerResponseDTO";
import { JobBasicDTO } from "../job/JobResponseDTO";

export interface InterviewResponseDTO {
  _id: string;

  candidate: CandidateDTO;
  interviewer: InterviewerSummaryDTO;
  bookedBy: CompanyBasicDTO;
  job:JobBasicDTO;

  startTime: string;
  endTime: string;
  duration: number;
  actualDuration?: number;
  bufferDuration?: number;

  status: "booked" | "completed" | "cancelled" | "rescheduled" | "no_show";

  meetingLink?: string;
  rescheduledFrom?: string;
  cancellationReason?: string;

  isRecorded: boolean;
  recordingUrl?: string;

  feedback?: IInterviewFeedback;

  payoutStatus: "pending" | "paid";

  createdAt: string;
  updatedAt?: string;
}
