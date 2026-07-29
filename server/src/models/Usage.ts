import {Schema,model} from "mongoose";

const usageSchema=new Schema({
  organizationId:{
    type:Schema.Types.ObjectId,
    ref:"Organization",
    required:true,
  },
  aiRequests:{
    type:Number,
    default:0,
  },
  transcriptionMinutes:{
    type:Number,
    default:0,
  },
  storageMB:{
    type:Number,
    default:0,
  },
  month:{
    type:String,
    required:true,
  },
},{
  timestamps:true,
});

export default model(
  "Usage",
  usageSchema
);
