import {Schema,model,InferSchemaType} from "mongoose";

const subscriptionSchema=new Schema({
  organizationId:{
    type:Schema.Types.ObjectId,
    ref:"Organization",
    required:true,
  },
  stripeCustomerId:{
    type:String,
    required:true,
  },
  stripeSubscriptionId:{
    type:String,
    required:true,
    unique:true,
  },
  plan:{
    type:String,
    enum:[
      "free",
      "pro",
      "enterprise",
    ],
    default:"free",
  },
  status:{
    type:String,
    enum:[
      "active",
      "trialing",
      "canceled",
      "past_due",
    ],
    default:"active",
  },
  currentPeriodEnd:{
    type:Date,
  },
},{
  timestamps:true,
});

export type SubscriptionDocument=
  InferSchemaType<typeof subscriptionSchema>;

export default model(
  "Subscription",
  subscriptionSchema
);
