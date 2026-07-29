import { Schema, model, type InferSchemaType } from "mongoose";

const taskSchema = new Schema({
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
    type:String,
    default:"",
  },
  dueDate:{
    type:Date,
    default:null,
  },
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
    default:"manual",
  },
},{
  timestamps:true,
});

export type TaskDocument = InferSchemaType<typeof taskSchema>;

export default model<TaskDocument>("Task", taskSchema);
