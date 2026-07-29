import {Schema,model,InferSchemaType} from "mongoose";

const workspaceSchema=new Schema({
  name:{
    type:String,
    required:true,
    trim:true,
  },
  organizationId:{
    type:Schema.Types.ObjectId,
    ref:"Organization",
    required:true,
  },
  createdBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
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
