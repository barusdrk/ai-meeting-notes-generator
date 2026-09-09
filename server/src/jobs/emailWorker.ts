import {Worker,Job} from "bullmq";
import {sendSummaryEmail} from "../services/email.js";

const connection={
  url:process.env.REDIS_URL||"redis://127.0.0.1:6379",
};

export const emailWorker=new Worker(
  "emails",
  async(job:Job)=>{
    const{
      email,
      summary,
    }=job.data as{
      email:string;
      summary:string[];
    };

    await sendSummaryEmail(
      email,
      summary
    );
  },
  {
    connection,
  }
);
