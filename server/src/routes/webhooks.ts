import {Router} from "express";
import type Stripe from "stripe";
import Subscription from "../models/Subscription.js";
import {verifyWebhook} from "../services/billing.js";
import {
  claimEvent,
  markProcessed,
  markFailed,
} from "../repositories/StripeWebhookEventRepository.js";

const router=Router();

const supportedPlans=[
  "free",
  "pro",
  "enterprise",
] as const;

type StripeSubscriptionPeriod={
  current_period_end?:number;
};

function getPlan(
  subscription:Stripe.Subscription
){
  const metadataPlan=
    subscription.metadata?.plan;

  if(
    metadataPlan&&
    supportedPlans.includes(
      metadataPlan as typeof supportedPlans[number]
    )
  ){
    return metadataPlan as
      typeof supportedPlans[number];
  }

  return "free";
}

function getOrganizationId(
  subscription:Stripe.Subscription
){
  const organizationId=
    subscription.metadata?.organizationId;

  if(
    typeof organizationId==="string"&&
    organizationId.length>0
  ){
    return organizationId;
  }

  return null;
}

function getCustomerId(
  subscription:Stripe.Subscription
){
  if(typeof subscription.customer==="string"){
    return subscription.customer;
  }

  return subscription.customer.id;
}

function getCurrentPeriodEnd(
  subscription:Stripe.Subscription
){
  const data=
    subscription as unknown as
      StripeSubscriptionPeriod;

  if(
    typeof data.current_period_end!=="number"
  ){
    return undefined;
  }

  return new Date(
    data.current_period_end*1000
  );
}

async function upsertSubscription(
  stripeSubscription:Stripe.Subscription
){
  const organizationId=
    getOrganizationId(
      stripeSubscription
    );

  if(!organizationId){
    throw new Error(
      "Stripe subscription is missing organizationId metadata."
    );
  }

  await Subscription.findOneAndUpdate(
    {
      stripeSubscriptionId:
        stripeSubscription.id,
    },
    {
      $set:{
        organizationId,
        stripeCustomerId:
          getCustomerId(
            stripeSubscription
          ),
        plan:getPlan(
          stripeSubscription
        ),
        status:
          stripeSubscription.status,
        currentPeriodEnd:
          getCurrentPeriodEnd(
            stripeSubscription
          ),
      },
    },
    {
      new:true,
      upsert:true,
      setDefaultsOnInsert:true,
    }
  );
}

async function cancelLocalSubscription(
  stripeSubscription:Stripe.Subscription
){
  const organizationId=
    getOrganizationId(
      stripeSubscription
    );

  if(!organizationId){
    throw new Error(
      "Stripe subscription is missing organizationId metadata."
    );
  }

  await Subscription.findOneAndUpdate(
    {
      stripeSubscriptionId:
        stripeSubscription.id,
      organizationId,
    },
    {
      $set:{
        status:"canceled",
        currentPeriodEnd:
          getCurrentPeriodEnd(
            stripeSubscription
          ),
      },
    }
  );
}

async function processCheckoutCompleted(
  session:Stripe.Checkout.Session
){
  const organizationId=
    session.metadata?.organizationId;

  const plan=
    session.metadata?.plan;

  if(
    typeof organizationId!=="string"||
    !organizationId
  ){
    throw new Error(
      "Checkout session is missing organizationId metadata."
    );
  }

  if(
    typeof plan!=="string"||
    !supportedPlans.includes(
      plan as typeof supportedPlans[number]
    )
  ){
    throw new Error(
      "Checkout session has an invalid plan."
    );
  }

  if(
    typeof session.subscription!=="string"
  ){
    return;
  }

  const stripeSubscriptionId=
    session.subscription;

  const existing=
    await Subscription.findOne({
      stripeSubscriptionId,
    });

  if(existing){
    return;
  }
}

async function processEvent(
  event:Stripe.Event
){
  switch(event.type){
    case "checkout.session.completed":{
      const session=
        event.data.object as
          Stripe.Checkout.Session;

      await processCheckoutCompleted(
        session
      );

      return;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":{
      const stripeSubscription=
        event.data.object as
          Stripe.Subscription;

      await upsertSubscription(
        stripeSubscription
      );

      return;
    }

    case "customer.subscription.deleted":{
      const stripeSubscription=
        event.data.object as
          Stripe.Subscription;

      await cancelLocalSubscription(
        stripeSubscription
      );

      return;
    }

    default:
      return;
  }
}

router.post(
  "/stripe",
  async(req,res)=>{
    let event:Stripe.Event;

    try{
      const signature=
        req.headers["stripe-signature"];

      if(typeof signature!=="string"){
        return res.status(400).json({
          error:"Stripe signature missing.",
        });
      }

      event=verifyWebhook(
        req.body,
        signature
      );
    }catch(error){
      console.error(
        "Stripe webhook verification failed:",
        error
      );

      return res.status(400).json({
        error:"Invalid Stripe webhook.",
      });
    }

    try{
      const claim=
        await claimEvent(
          event.id,
          event.type
        );

      if(!claim.claimed){
        return res.json({
          received:true,
          duplicate:true,
          status:claim.reason,
        });
      }

      try{
        await processEvent(event);

        await markProcessed(
          event.id
        );

        return res.json({
          received:true,
          processed:true,
        });
      }catch(error){
        const message=
          error instanceof Error
            ?error.message
            :"Unknown webhook processing error.";

        await markFailed(
          event.id,
          message
        );

        console.error(
          `Stripe webhook processing failed for ${event.id}:`,
          error
        );

        return res.status(500).json({
          error:
            "Webhook processing failed.",
        });
      }
    }catch(error){
      console.error(
        `Stripe webhook handler failed for ${event.id}:`,
        error
      );

      return res.status(500).json({
        error:"Webhook handler failed.",
      });
    }
  }
);

export default router;
