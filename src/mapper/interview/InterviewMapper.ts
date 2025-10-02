import { InterviewResponseDTO } from "../../dto/response/interview/InterviewResponseDTO";
import { ICandidate } from "../../models/candidate/Candidate";
import { ICompany } from "../../models/company/Company";
import { IInterview } from "../../models/interview/Interview";
import { IInterviewer } from "../../models/interviewer/Interviewer";
import { IJob } from "../../models/job/Job";
import { CandidateMapper } from "../candidate/CandidateMapper";
import { CompanyMapper } from "../company/CompanyMapper";
import { InterviewerMapper } from "../interviewer/InterviewerMapper";
import { JobMapper } from "../job/JobMapper";

export const InterviewMapper = {
    toResponse: (
        interview: IInterview,
        candidateResumeUrl: string,
        candidateAvatarUrl: string
    ): InterviewResponseDTO => {
        return {
            _id: interview._id.toString(),

            candidate: CandidateMapper.toResponse(
                interview.candidate as ICandidate,
                candidateAvatarUrl,
                candidateResumeUrl
            ),

            interviewer: InterviewerMapper.toSummary(
                interview.interviewer as IInterviewer,
                "",
                ""
            ),

            bookedBy: CompanyMapper.toSummary(interview.bookedBy as ICompany),

            job: JobMapper.toSummary(interview.job as IJob),

            startTime: interview.startTime.toISOString(),
            endTime: interview.endTime.toISOString(),
            duration: interview.duration,
            actualDuration: interview.actualDuration,
            bufferDuration: interview.bufferDuration,

            status: interview.status,

            meetingLink: interview.meetingLink,
            rescheduledFrom: interview.rescheduledFrom
                ? interview.rescheduledFrom.toString()
                : undefined,
            cancellationReason: interview.cancellationReason,

            isRecorded: interview.isRecorded,
            recordingUrl: interview.recordingUrl,

            feedback: interview.feedback,

            payoutStatus: interview.payoutStatus,

            createdAt: interview.createdAt
                ? interview.createdAt.toISOString()
                : new Date().toISOString(),
            updatedAt: interview.updatedAt
                ? interview.updatedAt.toISOString()
                : undefined,
        };
    },
};
