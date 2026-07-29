import {Schema,model} from "mongoose";

const auditLogSchema=new Schema({
  organizationId:{
    type:Schema.Types.ObjectId,
    ref:"Organization",
    required:true,
  },

  userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },

  action:{
    type:String,
    required:true,
  },

  resource:{
    type:String,
    required:true,
  },

  resourceId:String,

  metadata:Object,

  ip:String,

},{
  timestamps:true,
});


export default model(
  "AuditLog",
  auditLogSchema
);
