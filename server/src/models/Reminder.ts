import {Schema,model,InferSchemaType} from "mongoose";

const reminderSchema=new Schema({
  organizationId:{
    type:Schema.Types.ObjectId,
    ref:"Organization",
    required:true,
    index:true,
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
    index:true,
  },
  taskId:{
    type:Schema.Types.ObjectId,
    ref:"Task",
  },
  title:{
    type:String,
    required:true,
    trim:true,
  },
  message:{
    type:String,
    required:true,
    trim:true,
  },
  remindAt:{
    type:Date,
    required:true,
    index:true,
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

reminderSchema.index({
  organizationId:1,
  userId:1,
  remindAt:1,
});

export type ReminderDocument=
  InferSchemaType<
    typeof reminderSchema
  >;

export default model(
  "Reminder",
  reminderSchema
);
