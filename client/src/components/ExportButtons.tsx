import {
  exportToPDF,
  exportToWord,
} from "../utils/export";

import type { MeetingNotes } from "../services/api";

interface ExportButtonsProps {
  notes: MeetingNotes;
}

export default function ExportButtons({
  notes,
}: ExportButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => exportToPDF(notes)}
        className="
          rounded-lg
          bg-red-600
          px-4
          py-2
          font-medium
          text-white
          transition
          hover:bg-red-700
        "
      >
        Export PDF
      </button>

      <button
        type="button"
        onClick={() => exportToWord(notes)}
        className="
          rounded-lg
          bg-blue-600
          px-4
          py-2
          font-medium
          text-white
          transition
          hover:bg-blue-700
        "
      >
        Export Word
      </button>
    </div>
  );
}
