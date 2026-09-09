import {Schema,model,InferSchemaType} from "mongoose";

const reportSchema=new Schema({
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
  generatedBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  type:{
    type:String,
    enum:["weekly","monthly","custom"],
    default:"monthly",
  },
  summary:{
    type:String,
    default:"",
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
},{
  timestamps:true,
});

export type ReportDocument=
  InferSchemaType<typeof reportSchema>;

export default model(
  "Report",
  reportSchema
);
