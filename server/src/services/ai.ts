import OpenAI from "openai";

import { MEETING_PROMPT } from "../prompts/prompt.js";

import type { MeetingNotes } from "../types/output.js";
import { MeetingNotesSchema } from "../types/output.js";

import { generateMockMeetingNotes } from "./mockAi.js";

export async function generateMeetingNotes(
  transcript: string
): Promise<MeetingNotes> {
  // Demo mode: no OpenAI API key required.
  if (process.env.USE_MOCK_AI === "true") {
    console.log("Using mocked AI response.");

    return generateMockMeetingNotes(transcript);
  }

  // Ensure an API key is available before creating the client.
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY environment variable is not set."
    );
  }

  const openai = new OpenAI({
    apiKey,
  });

  const response = await openai.responses.create({
    model: "gpt-5",

    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: MEETING_PROMPT,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: transcript,
          },
        ],
      },
    ],
  });

  const text = response.output_text;

  if (!text) {
    throw new Error(
      "Model returned an empty response."
    );
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(
      "OpenAI returned invalid JSON."
    );
  }

  return MeetingNotesSchema.parse(parsed);
}
