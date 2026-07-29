import { Schema, model, type InferSchemaType } from "mongoose";

const meetingSchema = new Schema({
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
    required:true,
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
    type:[String],
    default:[],
  },
},{
  timestamps:true,
});

export type MeetingDocument = InferSchemaType<typeof meetingSchema>;

export default model<MeetingDocument>("Meeting", meetingSchema);
