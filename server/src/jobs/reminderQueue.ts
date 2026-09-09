import {Queue} from "bullmq";

const connection={
  url:process.env.REDIS_URL||"redis://127.0.0.1:6379",
};

export type ReminderJobData={
  reminderId:string;
  userId:string;
  organizationId:string;
};

export const reminderQueue=
  new Queue<ReminderJobData>(
    "reminders",
    {
      connection,
    }
  );

export async function queueReminder(
  data:ReminderJobData,
  remindAt:Date
){
  const delay=Math.max(
    0,
    remindAt.getTime()-Date.now()
  );

  return reminderQueue.add(
    "send-reminder",
    data,
    {
      delay,
      removeOnComplete:true,
      removeOnFail:false,
    }
  );
}
