import { z } from "zod";

export const TaskSchema = z.object({
  person: z.string().nullable(),
  task: z.string(),
  dueDate: z.string().nullable(),
});

export const MeetingNotesSchema = z.object({
  summary: z.string(),
  decisions: z.array(z.string()),
  actionItems: z.array(z.string()),
  tasks: z.array(TaskSchema),
});

export type Task = z.infer<typeof TaskSchema>;

export type MeetingNotes = z.infer<typeof MeetingNotesSchema>;
