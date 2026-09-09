import {Worker,Job} from "bullmq";
import Meeting from "../models/Meeting.js";
import {transcribeAudio} from "../services/transcription.js";
import {summarizeTranscript} from "../services/ai.js";

const connection={
  url:process.env.REDIS_URL||"redis://127.0.0.1:6379",
};

export const transcriptionWorker=new Worker(
  "transcription",
  async(job:Job)=>{
    const{
      meetingId,
      filePath,
    }=job.data as{
      meetingId:string;
      filePath:string;
    };

    const transcript=
      await transcribeAudio(filePath);

    const ai=
      await summarizeTranscript(transcript);

    await Meeting.findByIdAndUpdate(
      meetingId,
      {
        transcript,
        summary:ai.summary,
        decisions:ai.decisions,
        actionItems:ai.actionItems,
        status:"completed",
      }
    );
  },
  {
    connection,
  }
);
