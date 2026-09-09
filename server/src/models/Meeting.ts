import {Schema,model,InferSchemaType} from "mongoose";

const actionItemSchema=new Schema({
  title:{
    type:String,
    required:true,
  },
  assignee:String,
  dueDate:Date,
},{
  _id:false,
});

const meetingSchema=new Schema({
  organizationId:{
    type:Schema.Types.ObjectId,
    ref:"Organization",
    index:true,
  },
  workspaceId:{
    type:Schema.Types.ObjectId,
    ref:"Workspace",
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
    index:true,
  },
  title:{
    type:String,
    required:true,
  },
  transcript:{
    type:String,
    default:"",
  },
  summary:{
    type:[String],
    default:[],
  },
  decisions:{
    type:[String],
    default:[],
  },
  actionItems:{
    type:[actionItemSchema],
    default:[],
  },
  provider:{
    type:String,
    enum:["upload","zoom","google_meet","teams"],
    default:"upload",
  },
  status:{
    type:String,
    enum:["scheduled","processing","completed","failed"],
    default:"scheduled",
  },
},{
  timestamps:true,
});

export type MeetingDocument=
  InferSchemaType<typeof meetingSchema>;

export default model(
  "Meeting",
  meetingSchema
);
