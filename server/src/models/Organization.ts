import {Schema,model,InferSchemaType} from "mongoose";

const memberSchema=new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  role:{
    type:String,
    enum:["owner","admin","member"],
    default:"member",
  },
},{
  _id:false,
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
  members:{
    type:[memberSchema],
    default:[],
  },
},{
  timestamps:true,
});

export type OrganizationDocument=
  InferSchemaType<typeof organizationSchema>;

export default model(
  "Organization",
  organizationSchema
);
