import { z } from 'zod'
export const leadSchema = z.object({
  intent: z.enum(['build', 'custom', 'start', 'audit-result']),
  name: z.string().trim().min(2).max(100), email: z.email().max(254), company: z.string().trim().min(1).max(200),
  message: z.string().trim().min(10).max(3000), team: z.string().max(300).optional(), timing: z.enum(['', 'soon', 'quarter', 'exploring']).optional(), capacity: z.string().max(300).optional(), platforms: z.string().max(500).optional(), decisionMakers: z.string().max(300).optional(),
  consent: z.literal(true), website: z.string().max(0).optional(), requestKey: z.uuid(),
}).strict()
