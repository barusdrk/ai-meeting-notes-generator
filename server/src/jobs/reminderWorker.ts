import {Worker,Job} from "bullmq";
import {getReminderById,completeReminder} from "../services/reminders.js";
import User from "../models/User.js";
import {sendMeetingEmail} from "../services/email.js";

const connection={
  url:process.env.REDIS_URL||"redis://127.0.0.1:6379",
};

type ReminderJobData={
  reminderId:string;
  userId:string;
  organizationId:string;
};

export const reminderWorker=
  new Worker<ReminderJobData>(
    "reminders",
    async(job:Job<ReminderJobData>)=>{
      const{
        reminderId,
        userId,
        organizationId,
      }=job.data;

      if(
        !reminderId||
        !userId||
        !organizationId
      ){
        throw new Error(
          "Reminder job requires reminderId, userId, and organizationId."
        );
      }

      const scope={
        userId,
        organizationId,
      };

      const reminder=
        await getReminderById(
          reminderId,
          scope
        );

      if(!reminder){
        return;
      }

      if(
        reminder.completed||
        reminder.sent
      ){
        return;
      }

      const user=await User.findById(
        userId
      ).select("email");

      if(!user?.email){
        throw new Error(
          "Reminder user email not found."
        );
      }

      await sendMeetingEmail(
        user.email,
        reminder.title,
        reminder.message
      );

      await completeReminder(
        reminderId,
        scope
      );
    },
    {
      connection,
    }
  );

reminderWorker.on(
  "completed",
  job=>{
    console.log(
      `Reminder job completed: ${job.id}`
    );
  }
);

reminderWorker.on(
  "failed",
  (job,error)=>{
    console.error(
      `Reminder job failed: ${job?.id??"unknown"}:`,
      error
    );
  }
);
