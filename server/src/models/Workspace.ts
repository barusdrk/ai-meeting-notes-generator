import {Schema,model,InferSchemaType} from "mongoose";

const workspaceSchema=new Schema({
  organizationId:{
    type:Schema.Types.ObjectId,
    ref:"Organization",
    required:true,
    index:true,
  },
  name:{
    type:String,
    required:true,
    trim:true,
  },
  description:{
    type:String,
    default:"",
  },
  createdBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  archived:{
    type:Boolean,
    default:false,
  },
},{
  timestamps:true,
});

export type WorkspaceDocument=
  InferSchemaType<typeof workspaceSchema>;

export default model(
  "Workspace",
  workspaceSchema
);
