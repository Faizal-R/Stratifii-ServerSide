import { z} from 'zod'

export const SubscriptionPlanSchema = z.object({
   
    name: z.string(),
    price: z.number(),
    features: z.object({
      jobPostLimitPerMonth: z.number(),
      candidateSlotPerMonth: z.number(),
      companySpecificQuestionAccess: z.boolean(),
      feedbackDownloadAccess: z.boolean(),
      finalInterviewAccess: z.boolean(),
      interviewRecordingAccess: z.boolean()
    })
  })
  
