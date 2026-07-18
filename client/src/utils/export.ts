import { saveAs } from "file-saver";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import jsPDF from "jspdf";

import type { MeetingNotes } from "../services/api";

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export async function exportToWord(
  notes: MeetingNotes
) {
  const taskRows = notes.tasks.map(
    (task) =>
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph(
                task.person ?? "-"
              ),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph(task.task),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph(
                task.dueDate ?? "-"
              ),
            ],
          }),
        ],
      })
  );

  const document = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            children: [
              new TextRun(
                "AI Meeting Notes"
              ),
            ],
          }),

          new Paragraph({
            heading:
              HeadingLevel.HEADING_1,
            text: "Summary",
          }),

          new Paragraph(notes.summary),

          new Paragraph({
            heading:
              HeadingLevel.HEADING_1,
            text: "Decisions",
          }),

          ...notes.decisions.map(
            (decision) =>
              new Paragraph({
                bullet: {
                  level: 0,
                },
                children: [
                  new TextRun(
                    decision
                  ),
                ],
              })
          ),

          new Paragraph({
            heading:
              HeadingLevel.HEADING_1,
            text: "Action Items",
          }),

          ...notes.actionItems.map(
            (item) =>
              new Paragraph({
                bullet: {
                  level: 0,
                },
                children: [
                  new TextRun(item),
                ],
              })
          ),

          new Paragraph({
            heading:
              HeadingLevel.HEADING_1,
            text: "Assigned Tasks",
          }),

          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Person"
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Task"
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Due Date"
                      ),
                    ],
                  }),
                ],
              }),

              ...taskRows,
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(
    document
  );

  saveAs(
    blob,
    `meeting-notes-${today()}.docx`
  );
}

export function exportToPDF(
  notes: MeetingNotes
) {
  const pdf = new jsPDF();

  let y = 20;

  const lineHeight = 8;

  function heading(text: string) {
    pdf.setFontSize(16);

    pdf.text(text, 20, y);

    y += 10;
  }

  function body(text: string) {
    pdf.setFontSize(11);

    const lines = pdf.splitTextToSize(
      text,
      170
    );

    pdf.text(lines, 20, y);

    y += lines.length * lineHeight + 4;
  }

  heading("AI Meeting Notes");

  heading("Summary");

  body(notes.summary);

  heading("Decisions");

  notes.decisions.forEach((d) =>
    body(`• ${d}`)
  );

  heading("Action Items");

  notes.actionItems.forEach((a) =>
    body(`• ${a}`)
  );

  heading("Assigned Tasks");

  notes.tasks.forEach((task) => {
    body(
      `${task.person ?? "-"} | ${
        task.task
      } | ${task.dueDate ?? "-"}`
    );
  });

  pdf.save(
    `meeting-notes-${today()}.pdf`
  );
}
