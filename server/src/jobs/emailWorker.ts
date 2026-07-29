import {Worker} from "bullmq";
import {
  sendSummaryEmail,
} from "../services/email.js";

export const emailWorker=
new Worker(
  "emails",
  async (job: any)=>{

    const {
      email,
      summary,
    }=job.data;

    await sendSummaryEmail(
      email,
      summary
    );

  },
  {
    connection:{
      url:process.env.REDIS_URL,
    },
  }
);
