import { Schema, model, type InferSchemaType } from "mongoose";

const reminderSchema = new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  meetingId:{
    type:Schema.Types.ObjectId,
    ref:"Meeting",
    default:null,
  },
  title:{
    type:String,
    required:true,
  },
  message:{
    type:String,
    required:true,
  },
  remindAt:{
    type:Date,
    required:true,
  },
  completed:{
    type:Boolean,
    default:false,
  },
  sent:{
    type:Boolean,
    default:false,
  },
},{
  timestamps:true,
});

export type ReminderDocument = InferSchemaType<typeof reminderSchema>;

export default model<ReminderDocument>("Reminder", reminderSchema);
