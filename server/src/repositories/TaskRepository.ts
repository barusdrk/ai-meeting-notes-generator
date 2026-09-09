import {Types} from "mongoose";
import Task from "../models/Task.js";

type CreateTaskData={
  organizationId:string;
  userId:string;
  meetingId:string;
  workspaceId?:string;
  title:string;
  description?:string;
  assignedTo?:string;
  dueDate?:Date;
  status?:"pending"|"in_progress"|"completed";
  priority?:"low"|"medium"|"high";
  source?:"manual"|"ai_generated";
};

function objectId(value:string){
  return new Types.ObjectId(value);
}

export async function createTask(data:CreateTaskData){
  if(
    !Types.ObjectId.isValid(data.organizationId)||
    !Types.ObjectId.isValid(data.userId)||
    !Types.ObjectId.isValid(data.meetingId)
  ){
    throw new Error("Invalid organization, user, or meeting ID.");
  }

  return Task.create({
    organizationId:objectId(data.organizationId),
    userId:objectId(data.userId),
    meetingId:objectId(data.meetingId),
    workspaceId:data.workspaceId
      ?objectId(data.workspaceId)
      :undefined,
    title:data.title,
    description:data.description??"",
    assignedTo:data.assignedTo
      ?objectId(data.assignedTo)
      :undefined,
    dueDate:data.dueDate,
    status:data.status??"pending",
    priority:data.priority??"medium",
    source:data.source??"ai_generated",
  });
}

export async function findById(
  taskId:string,
  organizationId:string
){
  if(
    !Types.ObjectId.isValid(taskId)||
    !Types.ObjectId.isValid(organizationId)
  ){
    return null;
  }

  return Task.findOne({
    _id:objectId(taskId),
    organizationId:objectId(organizationId),
  });
}

export async function findMeetingTasks(
  meetingId:string,
  organizationId:string
){
  if(
    !Types.ObjectId.isValid(meetingId)||
    !Types.ObjectId.isValid(organizationId)
  ){
    return [];
  }

  return Task.find({
    meetingId:objectId(meetingId),
    organizationId:objectId(organizationId),
  }).sort({
    createdAt:-1,
  });
}

export async function findWorkspaceTasks(
  workspaceId:string,
  organizationId:string
){
  if(
    !Types.ObjectId.isValid(workspaceId)||
    !Types.ObjectId.isValid(organizationId)
  ){
    return [];
  }

  return Task.find({
    workspaceId:objectId(workspaceId),
    organizationId:objectId(organizationId),
  }).sort({
    createdAt:-1,
  });
}

export async function updateTask(
  taskId:string,
  organizationId:string,
  data:Record<string,unknown>
){
  if(
    !Types.ObjectId.isValid(taskId)||
    !Types.ObjectId.isValid(organizationId)
  ){
    return null;
  }

  return Task.findOneAndUpdate(
    {
      _id:objectId(taskId),
      organizationId:objectId(organizationId),
    },
    data,
    {
      new:true,
      runValidators:true,
    }
  );
}

export async function deleteTask(
  taskId:string,
  organizationId:string
){
  if(
    !Types.ObjectId.isValid(taskId)||
    !Types.ObjectId.isValid(organizationId)
  ){
    return null;
  }

  return Task.findOneAndDelete({
    _id:objectId(taskId),
    organizationId:objectId(organizationId),
  });
}

export async function completedTasks(
  organizationId:string
){
  if(!Types.ObjectId.isValid(organizationId)){
    return [];
  }

  return Task.find({
    organizationId:objectId(organizationId),
    status:"completed",
  }).sort({
    createdAt:-1,
  });
}

export async function overdueTasks(
  organizationId:string
){
  if(!Types.ObjectId.isValid(organizationId)){
    return [];
  }

  return Task.find({
    organizationId:objectId(organizationId),
    status:{$ne:"completed"},
    dueDate:{$lt:new Date()},
  }).sort({
    dueDate:1,
  });
}