import {Schema,model,InferSchemaType} from "mongoose";

const reportSchema=new Schema({
  organizationId:{
    type:Schema.Types.ObjectId,
    ref:"Organization",
    required:true,
  },
  type:{
    type:String,
    enum:[
      "weekly",
      "monthly",
      "custom",
    ],
    default:"monthly",
  },
  data:{
    users:Number,
    teams:Number,
    meetings:Number,
    completedTasks:Number,
    pendingTasks:Number,
    overdueTasks:Number,
    completionRate:Number,
  },
  generatedBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
},{
  timestamps:true,
});

export type ReportDocument=
  InferSchemaType<typeof reportSchema>;

export default model(
  "Report",
  reportSchema
);
