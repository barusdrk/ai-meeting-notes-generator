import {Types} from "mongoose";
import Reminder from "../models/Reminder.js";
import Task from "../models/Task.js";
import {queueReminder} from "../jobs/reminderQueue.js";

type ReminderScope={
  userId:string;
  organizationId:string;
};

function getScope(scope:ReminderScope){
  return {
    userId:new Types.ObjectId(scope.userId),
    organizationId:new Types.ObjectId(scope.organizationId),
  };
}

export async function createReminder(data:{
  userId:string;
  organizationId:string;
  taskId?:string;
  message:string;
  date:Date;
}){
  if(
    !Types.ObjectId.isValid(data.userId)||
    !Types.ObjectId.isValid(data.organizationId)
  ){
    throw new Error("Invalid user or organization ID.");
  }

  let taskId:Types.ObjectId|undefined;

  if(data.taskId){
    if(!Types.ObjectId.isValid(data.taskId)){
      throw new Error("Invalid task ID.");
    }

    const task=await Task.findOne({
      _id:new Types.ObjectId(data.taskId),
      organizationId:new Types.ObjectId(data.organizationId),
    }).select("_id");

    if(!task){
      throw new Error("Task not found in this organization.");
    }

    taskId=task._id;
  }

  const reminder=await Reminder.create({
    organizationId:new Types.ObjectId(data.organizationId),
    userId:new Types.ObjectId(data.userId),
    taskId,
    title:data.message,
    message:data.message,
    remindAt:data.date,
    completed:false,
    sent:false,
  });

  await queueReminder(
    {
      reminderId:reminder._id.toString(),
      userId:data.userId,
      organizationId:data.organizationId,
    },
    data.date
  );

  return reminder;
}

export async function getPendingReminders(scope:ReminderScope){
  return Reminder.find({
    ...getScope(scope),
    completed:false,
    sent:false,
    remindAt:{
      $lte:new Date(),
    },
  }).sort({
    remindAt:1,
  });
}

export async function getReminderById(id:string,scope:ReminderScope){
  if(
    !Types.ObjectId.isValid(id)||
    !Types.ObjectId.isValid(scope.userId)||
    !Types.ObjectId.isValid(scope.organizationId)
  ){
    return null;
  }

  return Reminder.findOne({
    _id:new Types.ObjectId(id),
    ...getScope(scope),
  });
}

export async function completeReminder(id:string,scope:ReminderScope){
  if(
    !Types.ObjectId.isValid(id)||
    !Types.ObjectId.isValid(scope.userId)||
    !Types.ObjectId.isValid(scope.organizationId)
  ){
    return null;
  }

  return Reminder.findOneAndUpdate(
    {
      _id:new Types.ObjectId(id),
      ...getScope(scope),
    },
    {
      $set:{
        completed:true,
        sent:true,
      },
    },
    {
      new:true,
    }
  );
}

export async function markReminderSent(id:string,scope:ReminderScope){
  if(
    !Types.ObjectId.isValid(id)||
    !Types.ObjectId.isValid(scope.userId)||
    !Types.ObjectId.isValid(scope.organizationId)
  ){
    return null;
  }

  return Reminder.findOneAndUpdate(
    {
      _id:new Types.ObjectId(id),
      ...getScope(scope),
    },
    {
      $set:{
        sent:true,
      },
    },
    {
      new:true,
    }
  );
}

export async function deleteReminder(id:string,scope:ReminderScope){
  if(
    !Types.ObjectId.isValid(id)||
    !Types.ObjectId.isValid(scope.userId)||
    !Types.ObjectId.isValid(scope.organizationId)
  ){
    return null;
  }

  return Reminder.findOneAndDelete({
    _id:new Types.ObjectId(id),
    ...getScope(scope),
  });
}

export async function getUserReminders(scope:ReminderScope){
  if(
    !Types.ObjectId.isValid(scope.userId)||
    !Types.ObjectId.isValid(scope.organizationId)
  ){
    return [];
  }

  return Reminder.find({
    ...getScope(scope),
  }).sort({
    remindAt:1,
  });
}
