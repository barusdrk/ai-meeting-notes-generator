import { useState } from "react";

import type { MeetingNotes } from "../services/api";

import {
  exportToPDF,
  exportToWord,
} from "../utils/export";

interface ExportButtonsProps {
  notes: MeetingNotes;
}

export default function ExportButtons({
  notes,
}: ExportButtonsProps) {
  const [exporting, setExporting] =
    useState(false);

  async function handlePDF() {
    try {
      setExporting(true);

      await exportToPDF(notes);
    } catch {
      alert("Unable to export PDF.");
    } finally {
      setExporting(false);
    }
  }

  async function handleWord() {
    try {
      setExporting(true);

      await exportToWord(notes);
    } catch {
      alert("Unable to export Word document.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handlePDF}
        disabled={exporting}
        className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        📄 Export PDF
      </button>

      <button
        type="button"
        onClick={handleWord}
        disabled={exporting}
        className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        📝 Export Word
      </button>
    </div>
  );
}
