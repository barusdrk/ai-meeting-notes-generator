import { z } from "zod";

export const MeetingActionItemSchema=z.object({
  title:z.string().min(1),
  assignee:z.string().optional(),
  dueDate:z.string().optional(),
});

export const MeetingResultSchema=z.object({
  summary:z.array(z.string()).default([]),
  decisions:z.array(z.string()).default([]),
  actionItems:z.array(
    MeetingActionItemSchema
  ).default([]),
});

export type MeetingActionItem=
  z.infer<typeof MeetingActionItemSchema>;

export type MeetingAIResult=
  z.infer<typeof MeetingResultSchema>;
