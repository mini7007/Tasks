import { z } from "zod"
export const taskSchema = z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    label: z.string(),
    priority: z.string(),
    // Optional Jira-like fields
    type: z.string().optional(),
    assignee: z.string().optional(),
    dueDate: z.string().optional(),
    estimate: z.number().optional(),
    description: z.string().optional(),
})

export type Task = z.infer<typeof taskSchema>