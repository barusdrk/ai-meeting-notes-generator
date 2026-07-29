import Meeting from "../models/Meeting.js";
import Task from "../models/Task.js";

interface MeetingNotesInput {
  title?: string;
  transcript: string;
  summary: string[];
  decisions: string[];
  actionItems: string[];
}

export async function saveMeeting(
  userId: string,
  notes: MeetingNotesInput
) {
  const meeting = await Meeting.create({
    userId,
    title: notes.title ?? "Meeting Notes",
    transcript: notes.transcript,
    summary: notes.summary,
    decisions: notes.decisions,
    actionItems: notes.actionItems,
  });

  const tasks = await Promise.all(
    notes.actionItems.map((item) =>
      Task.create({
        userId,
        meetingId: meeting._id,
        title: item,
        description: "Generated from AI meeting action item.",
        status: "pending",
        priority: "medium",
        source: "ai_generated",
      })
    )
  );

  return {
    meeting,
    tasks,
  };
}


export async function getUserMeetings(
  userId: string
) {
  return Meeting.find({
    userId,
  }).sort({
    createdAt: -1,
  });
}


export async function getMeetingById(
  userId: string,
  meetingId: string
) {
  return Meeting.findOne({
    _id: meetingId,
    userId,
  });
}
