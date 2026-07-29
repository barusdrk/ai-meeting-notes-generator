import {Worker} from "bullmq";
import {
  getPendingReminders,
  completeReminder,
} from "../services/reminder.js";
import {
  sendMeetingEmail,
} from "../services/email.js";

export const reminderWorker=
new Worker(
  "reminders",
  async (job: any)=>{
    const reminders=
      await getPendingReminders(
        job.data.userId
      );

    for(const reminder of reminders){

      await sendMeetingEmail(
        job.data.email,
        "Reminder",
        reminder.message
      );

      await completeReminder(
        reminder._id.toString()
      );
    }
  },
  {
    connection:{
      url:process.env.REDIS_URL,
    },
  }
);
