import {Types} from "mongoose";
import Meeting from "../models/Meeting.js";

export async function findById(
  meetingId:string,
  organizationId:string
){
  if(
    !Types.ObjectId.isValid(meetingId)||
    !Types.ObjectId.isValid(organizationId)
  ){
    return null;
  }

  return Meeting.findOne({
    _id:new Types.ObjectId(meetingId),
    organizationId:new Types.ObjectId(organizationId),
  });
}

export async function findByOrganization(
  organizationId:string
){
  if(!Types.ObjectId.isValid(organizationId)){
    return [];
  }

  return Meeting.find({
    organizationId:new Types.ObjectId(organizationId),
  }).sort({
    createdAt:-1,
  });
}

export async function createMeeting(
  data:{
    organizationId:string;
    workspaceId?:string;
    userId:string;
    title:string;
    transcript?:string;
    summary?:string[];
    decisions?:string[];
    actionItems?:{
      title:string;
      assignee?:string;
      dueDate?:Date;
    }[];
    provider?:
      |"upload"
      |"zoom"
      |"google_meet"
      |"teams";
    status?:
      |"scheduled"
      |"processing"
      |"completed"
      |"failed";
    duration?:number;
  }
){
  return Meeting.create({
    ...data,
    organizationId:
      new Types.ObjectId(data.organizationId),
    workspaceId:data.workspaceId
      ?new Types.ObjectId(data.workspaceId)
      :undefined,
    userId:new Types.ObjectId(data.userId),
  });
}

export async function updateMeeting(
  meetingId:string,
  organizationId:string,
  data:Record<string,unknown>
){
  if(
    !Types.ObjectId.isValid(meetingId)||
    !Types.ObjectId.isValid(organizationId)
  ){
    return null;
  }

  return Meeting.findOneAndUpdate(
    {
      _id:new Types.ObjectId(meetingId),
      organizationId:new Types.ObjectId(organizationId),
    },
    data,
    {
      new:true,
    }
  );
}

export async function deleteMeeting(
  meetingId:string,
  organizationId:string
){
  if(
    !Types.ObjectId.isValid(meetingId)||
    !Types.ObjectId.isValid(organizationId)
  ){
    return null;
  }

  return Meeting.findOneAndDelete({
    _id:new Types.ObjectId(meetingId),
    organizationId:new Types.ObjectId(organizationId),
  });
}