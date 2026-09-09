import {Schema,model,InferSchemaType} from "mongoose";

const userSchema=new Schema({
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
  },
  password:{
    type:String,
    required:true,
  },
  name:{
    type:String,
    trim:true,
    default:"",
  },
  avatar:{
    type:String,
    default:null,
  },
  lastLoginAt:Date,
  emailVerified:{
    type:Boolean,
    default:false,
  },
},{
  timestamps:true,
});

export type UserDocument=
  InferSchemaType<typeof userSchema>;

export default model(
  "User",
  userSchema
);
