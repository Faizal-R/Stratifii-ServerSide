import {z} from 'zod'

export const SubscriptionPlanSchema = z.object({
    name: z.string(),
    price: z.number(),
    features: z.array(z.string())
})

