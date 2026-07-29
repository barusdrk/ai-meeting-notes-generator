import type { MeetingNotes } from "../services/api";

function formatMeetingNotes(
  notes: MeetingNotes
): string {
  const decisions =
    notes.decisions.length > 0
      ? notes.decisions
          .map((d) => `• ${d}`)
          .join("\n")
      : "None";

  const actionItems =
    notes.actionItems.length > 0
      ? notes.actionItems
          .map((a) => `• ${a}`)
          .join("\n")
      : "None";

  const tasks =
    notes.tasks.length > 0
      ? notes.tasks
          .map(
            (task) =>
              `• ${task.person ?? "-"} | ${task.task} | ${
                task.dueDate ?? "-"
              }`
          )
          .join("\n")
      : "None";

  return `AI Meeting Notes

Summary
-------
${notes.summary}

Decisions
---------
${decisions}

Action Items
------------
${actionItems}

Assigned Tasks
--------------
${tasks}
`;
}

export async function copyMeetingNotes(
  notes: MeetingNotes
): Promise<void> {
  await navigator.clipboard.writeText(
    formatMeetingNotes(notes)
  );
}
