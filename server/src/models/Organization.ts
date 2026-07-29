import {Schema,model,InferSchemaType} from "mongoose";

const memberSchema = new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  role:{
    type:String,
    default:"member",
  },
});

const organizationSchema=new Schema({
  name:{
    type:String,
    required:true,
    trim:true,
  },
  ownerId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  members:[memberSchema],
},{
  timestamps:true,
});

export type OrganizationDocument=
  InferSchemaType<typeof organizationSchema>;

export default model(
  "Organization",
  organizationSchema
);
