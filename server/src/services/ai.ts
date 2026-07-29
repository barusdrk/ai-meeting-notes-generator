import OpenAI from "openai";
import {MEETING_PROMPT} from "./prompt.js";

const client=new OpenAI({
  apiKey:process.env.OPENAI_API_KEY,
});

export interface MeetingAIResult{
  summary:string[];
  decisions:string[];
  actionItems:{
    title:string;
    assignee?:string;
    dueDate?:string;
  }[];
}

export async function summarizeTranscript(
  transcript:string
):Promise<MeetingAIResult>{

  const response=
    await client.chat.completions.create({
      model:"gpt-5",
      messages:[
        {
          role:"system",
          content:MEETING_PROMPT,
        },
        {
          role:"user",
          content:transcript,
        },
      ],
      response_format:{
        type:"json_object",
      },
    });

  const content = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);

  return {
    summary: Array.isArray(parsed.summary) ? parsed.summary : [parsed.summary ?? ""],
    decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
    actionItems: Array.isArray(parsed.actionItems)
      ? parsed.actionItems.map((item: unknown) =>
          typeof item === "string" ? item : String(item ?? "")
        )
      : [],
  };
}
