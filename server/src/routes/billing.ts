import {Router} from "express";
import {Types} from "mongoose";
import auth,{type AuthRequest} from "../middleware/auth.js";
import organizationAuth from "../middleware/organizationAuth.js";
import Subscription from "../models/Subscription.js";
import {
  createCustomer,
  createCheckoutSession,
  cancelSubscription,
  getCheckoutSession,
} from "../services/billing.js";

const router=Router();

const plans=[
  "free",
  "pro",
  "enterprise",
] as const;

type Plan=typeof plans[number];

function isPlan(
  value:unknown
):value is Plan{
  return typeof value==="string"&&
    plans.includes(
      value as Plan
    );
}

router.use(auth);
router.use(organizationAuth);

router.get(
  "/",
  async(req:AuthRequest,res)=>{
    try{
      if(!req.organizationId){
        return res.status(403).json({
          error:"Organization authentication required.",
        });
      }

      const subscription=
        await Subscription.findOne({
          organizationId:req.organizationId,
        });

      res.json(subscription);
    }catch(error:any){
      console.error(
        "Subscription lookup failed:",
        error
      );

      res.status(500).json({
        error:error.message,
      });
    }
  }
);

router.post(
  "/checkout",
  async(req:AuthRequest,res)=>{
    try{
      if(
        !req.userId||
        !req.organizationId
      ){
        return res.status(403).json({
          error:"Organization authentication required.",
        });
      }

      const{
        email,
        priceId,
        plan,
      }=req.body;

      if(
        typeof email!=="string"||
        typeof priceId!=="string"||
        typeof plan!=="string"
      ){
        return res.status(400).json({
          error:
            "Email, price ID, and plan are required.",
        });
      }

      const normalizedEmail=
        email.trim().toLowerCase();

      if(!normalizedEmail){
        return res.status(400).json({
          error:"Email is required.",
        });
      }

      if(!isPlan(plan)){
        return res.status(400).json({
          error:"Invalid subscription plan.",
        });
      }

      if(plan==="free"){
        return res.status(400).json({
          error:
            "The free plan does not require checkout.",
        });
      }

      const existingSubscription=
        await Subscription.findOne({
          organizationId:req.organizationId,
        });

      if(existingSubscription){
        return res.status(409).json({
          error:
            "Organization already has a subscription.",
        });
      }

      const customer=
        await createCustomer(
          normalizedEmail,
          req.organizationId
        );

      const session=
        await createCheckoutSession(
          customer.id,
          priceId.trim(),
          req.organizationId,
          plan
        );

      if(!session.url){
        return res.status(500).json({
          error:
            "Stripe checkout URL was not created.",
        });
      }

      res.status(201).json({
        sessionId:session.id,
        url:session.url,
      });
    }catch(error:any){
      console.error(
        "Checkout session creation failed:",
        error
      );

      res.status(500).json({
        error:error.message,
      });
    }
  }
);

router.get(
  "/checkout/:sessionId",
  async(req:AuthRequest,res)=>{
    try{
      if(!req.organizationId){
        return res.status(403).json({
          error:"Organization authentication required.",
        });
      }

      const sessionId=
        req.params.sessionId;

      if(typeof sessionId!=="string"){
        return res.status(400).json({
          error:"Invalid checkout session ID.",
        });
      }

      const session=
        await getCheckoutSession(
          sessionId
        );

      const metadata=
        session.metadata;

      if(
        metadata?.organizationId!==
        req.organizationId
      ){
        return res.status(403).json({
          error:"Checkout session does not belong to this organization.",
        });
      }

      res.json({
        id:session.id,
        status:session.status,
        paymentStatus:
          session.payment_status,
        subscription:
          typeof session.subscription==="string"
            ?session.subscription
            :session.subscription?.id??null,
      });
    }catch(error:any){
      console.error(
        "Checkout session lookup failed:",
        error
      );

      res.status(500).json({
        error:error.message,
      });
    }
  }
);

router.post(
  "/cancel",
  async(req:AuthRequest,res)=>{
    try{
      if(!req.organizationId){
        return res.status(403).json({
          error:"Organization authentication required.",
        });
      }

      if(
        typeof req.body.subscriptionId!=="string"
      ){
        return res.status(400).json({
          error:"Subscription ID is required.",
        });
      }

      const subscription=
        await Subscription.findOne({
          _id:req.body.subscriptionId,
          organizationId:req.organizationId,
        });

      if(!subscription){
        return res.status(404).json({
          error:"Subscription not found.",
        });
      }

      await cancelSubscription(
        subscription.stripeSubscriptionId
      );

      res.json({
        success:true,
        message:
          "Subscription cancellation requested.",
      });
    }catch(error:any){
      console.error(
        "Subscription cancellation failed:",
        error
      );

      res.status(500).json({
        error:error.message,
      });
    }
  }
);

export default router;
