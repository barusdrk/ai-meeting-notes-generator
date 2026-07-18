import type { MeetingNotes } from "../types/output.js";

export async function generateMockMeetingNotes(
  transcript: string
): Promise<MeetingNotes> {
  const preview =
    transcript.length > 150
      ? `${transcript.slice(0, 150)}...`
      : transcript;

  return {
    summary:
      "The meeting focused on project progress, deadlines, technical challenges, and next steps. Team members aligned on priorities and assigned follow-up work.",

    decisions: [
      "Proceed with the current implementation plan.",
      "Deploy the backend after testing.",
      "Use MongoDB for persistent storage.",
    ],

    actionItems: [
      "Complete authentication.",
      "Test document uploads.",
      "Deploy the application.",
      "Prepare project documentation.",
    ],

    tasks: [
      {
        person: "Alice",
        task: "Complete login page",
        dueDate: "Friday",
      },
      {
        person: "Bob",
        task: "Deploy backend",
        dueDate: "Monday",
      },
      {
        person: "Charlie",
        task: "Write README updates",
        dueDate: "Wednesday",
      },
    ],
  };
}
