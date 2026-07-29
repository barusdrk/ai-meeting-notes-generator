import {
  useState,
} from "react";

import type { MeetingNotes } from "../services/api";


interface CopyButtonProps {
  notes: MeetingNotes;
}


function formatNotes(
  notes: MeetingNotes
): string {

  return `
Summary:

${notes.summary}


Decisions:

${notes.decisions.join("\n")}


Action Items:

${notes.actionItems.join("\n")}


Tasks:

${notes.tasks
  .map(
    (task) =>
      `- ${task.task} | ${task.person ?? "-"} | ${task.dueDate ?? "-"}`
  )
  .join("\n")}
`;
}


export default function CopyButton({
  notes,
}: CopyButtonProps) {

  const [copied, setCopied] =
    useState(false);


  async function handleCopy() {
    await navigator.clipboard.writeText(
      formatNotes(notes)
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }


  return (
    <button
      type="button"
      onClick={handleCopy}
      className="
        rounded-lg
        border
        px-4
        py-2
        hover:bg-gray-100
        dark:hover:bg-gray-700
      "
    >
      {copied
        ? "Copied!"
        : "Copy Notes"}
    </button>
  );
}
