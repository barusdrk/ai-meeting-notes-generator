import Subscription from "../models/Subscription.js";
import {getPlan} from "./plans.js";


export async function createSubscriptionRecord(
  data:any
){

  return Subscription.create({
    organizationId:
      data.organizationId,

    stripeCustomerId:
      data.customerId,

    stripeSubscriptionId:
      data.subscriptionId,

    plan:
      data.plan,

    status:
      "active",
  });
}


export async function getOrganizationSubscription(
  organizationId:string
){

  return Subscription.findOne({
    organizationId,
  });
}


export async function changePlan(
  organizationId:string,
  plan:string
){

  return Subscription.findOneAndUpdate(
    {
      organizationId,
    },
    {
      plan,
    },
    {
      new:true,
    }
  );
}


export function getPlanFeatures(
  plan:string
){

  return getPlan(
    plan
  ).limits;
}
