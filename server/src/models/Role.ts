import {Schema,model,InferSchemaType} from "mongoose";

const roleSchema=new Schema({
  name:{
    type:String,
    required:true,
    unique:true,
  },
  permissions:[
    {
      type:String,
    },
  ],
},{
  timestamps:true,
});

export type RoleDocument=
  InferSchemaType<typeof roleSchema>;

export default model(
  "Role",
  roleSchema
);
