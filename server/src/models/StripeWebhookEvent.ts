import {Schema,model,InferSchemaType} from "mongoose";

const stripeWebhookEventSchema=new Schema({
  eventId:{
    type:String,
    required:true,
    unique:true,
    index:true,
  },
  type:{
    type:String,
    required:true,
  },
  status:{
    type:String,
    enum:[
      "processing",
      "processed",
      "failed",
    ],
    required:true,
    default:"processing",
    index:true,
  },
  attempts:{
    type:Number,
    required:true,
    default:0,
  },
  processingStartedAt:{
    type:Date,
  },
  processedAt:{
    type:Date,
  },
  failedAt:{
    type:Date,
  },
  lastError:{
    type:String,
  },
},{
  timestamps:true,
});

export type StripeWebhookEventDocument=
  InferSchemaType<
    typeof stripeWebhookEventSchema
  >;

export default model(
  "StripeWebhookEvent",
  stripeWebhookEventSchema
);
