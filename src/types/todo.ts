import { z } from "zod"

export const TodoSchema = z.object({
  id: z.number().positive(),
  created_at: z.date(),
  title: z.string().min(1),
  description: z.string().min(1),
  updated_at: z.date().nullable(),
  isCompleted: z.boolean().nullable(),
})

export type Todo = z.infer<typeof TodoSchema>

export const TodosSyncQueueSchema = TodoSchema.omit({ id: true }).extend({
  id: z.number().positive().optional(),
})
export type TodosSyncQueue = z.infer<typeof TodosSyncQueueSchema>
