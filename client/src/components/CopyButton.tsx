import { useState } from "react";

import type { MeetingNotes } from "../services/api";

import {
  copyMeetingNotes,
} from "../utils/clipboard";

interface CopyButtonProps {
  notes: MeetingNotes;
}

export default function CopyButton({
  notes,
}: CopyButtonProps) {
  const [copied, setCopied] =
    useState(false);

  async function handleCopy() {
    try {
      await copyMeetingNotes(notes);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert(
        "Failed to copy meeting notes."
      );
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700"
    >
      {copied
        ? "✓ Copied!"
        : "📋 Copy Results"}
    </button>
  );
}
