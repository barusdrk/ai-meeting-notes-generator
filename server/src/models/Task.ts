import {Schema,model,InferSchemaType} from "mongoose";

const taskSchema=new Schema({
  organizationId:{
    type:Schema.Types.ObjectId,
    ref:"Organization",
    required:true,
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
  meetingId:{
    type:Schema.Types.ObjectId,
    ref:"Meeting",
    required:true,
    index:true,
  },
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    default:"",
  },
  assignedTo:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  dueDate:Date,
  status:{
    type:String,
    enum:["pending","in_progress","completed"],
    default:"pending",
  },
  priority:{
    type:String,
    enum:["low","medium","high"],
    default:"medium",
  },
  source:{
    type:String,
    enum:["manual","ai_generated"],
    default:"ai_generated",
  },
},{
  timestamps:true,
});

export type TaskDocument=
  InferSchemaType<typeof taskSchema>;

export default model(
  "Task",
  taskSchema
);
