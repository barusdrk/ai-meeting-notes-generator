import Reminder from "../models/Reminder.js";

export async function createReminder(
  data:{
    userId:string;
    taskId?:string;
    message:string;
    date:Date;
  }
){

  return Reminder.create({
    userId:data.userId,
    title:data.message,
    message:data.message,
    remindAt:data.date,
    completed:false,
    sent:false,
  });
}


export async function getPendingReminders(
  userId:string
){

  return Reminder.find({
    userId,
    completed:false,
    sent:false,
    remindAt:{
      $lte:new Date(),
    },
  });
}


export async function completeReminder(
  id:string
){

  return Reminder.findByIdAndUpdate(
    id,
    {
      completed:true,
      sent:true,
    },
    {
      new:true,
    }
  );
}
