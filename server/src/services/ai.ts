import OpenAI from "openai";
import {zodTextFormat} from "openai/helpers/zod";
import {MEETING_PROMPT} from "./prompt.js";
import {
  MeetingResultSchema,
  type MeetingAIResult,
} from "../schemas/meeting.js";

let client:OpenAI|undefined;

function getClient(){
  if(client) return client;

  const apiKey=process.env.OPENAI_API_KEY;

  if(!apiKey){
    throw new Error(
      "OPENAI_API_KEY is not configured."
    );
  }

  client=new OpenAI({apiKey});

  return client;
}

export async function summarizeTranscript(
  transcript:string
):Promise<MeetingAIResult>{

  const response=
    await getClient().responses.parse({
      model:"gpt-5",
      input:[
        {
          role:"system",
          content:[
            {
              type:"input_text",
              text:MEETING_PROMPT,
            },
          ],
        },
        {
          role:"user",
          content:[
            {
              type:"input_text",
              text:transcript,
            },
          ],
        },
      ],
      text:{
        format:zodTextFormat(
          MeetingResultSchema,
          "meeting_result"
        ),
      },
    });

  if(!response.output_parsed){
    throw new Error(
      "Invalid AI response."
    );
  }

  return response.output_parsed;
}

export async function summarizeSafe(
  transcript:string
):Promise<MeetingAIResult>{

  try{
    return await summarizeTranscript(
      transcript
    );
  }catch(error){

    console.error(
      "AI Error:",
      error
    );

    return{
      summary:[
        "Unable to generate summary.",
      ],
      decisions:[],
      actionItems:[],
    };
  }
}
