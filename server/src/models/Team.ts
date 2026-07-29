import {Schema,model,InferSchemaType} from "mongoose";

const teamSchema=new Schema({
  name:{
    type:String,
    required:true,
  },
  workspaceId:{
    type:Schema.Types.ObjectId,
    ref:"Workspace",
    required:true,
  },
  members:[
    {
      userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
      },
      roleId:{
        type:Schema.Types.ObjectId,
        ref:"Role",
      },
    },
  ],
},{
  timestamps:true,
});

export type TeamDocument=
  InferSchemaType<typeof teamSchema>;

export default model(
  "Team",
  teamSchema
);
