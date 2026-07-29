import {Worker} from "bullmq";
import {transcribeAudio} from "../services/transcription.js";
import Meeting from "../models/Meeting.js";
import {summarizeTranscript} from "../services/ai.js";

export const transcriptionWorker=
new Worker(
  "transcription",
  async (job: any)=>{
    const {
      meetingId,
      filePath,
    }=job.data;

    const transcript=
      await transcribeAudio(filePath);

    const aiResult=
      await summarizeTranscript(
        transcript
      );

    await Meeting.findByIdAndUpdate(
      meetingId,
      {
        transcript,
        summary:aiResult.summary,
        decisions:aiResult.decisions,
        actionItems:aiResult.actionItems,
        status:"completed",
      }
    );
  },
  {
    connection:{
      url:process.env.REDIS_URL,
    },
  }
);
