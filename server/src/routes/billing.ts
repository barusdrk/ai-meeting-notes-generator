import {Router} from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import organizationAuth from "../middleware/organizationAuth.js";
import {createCustomer,createSubscription,cancelSubscription} from "../services/billing.js";
import Subscription from "../models/Subscription.js";

const router=Router();

router.use(auth);
router.use(organizationAuth);


router.post("/subscribe",async(req:AuthRequest,res)=>{
  try{
    const {
      priceId,
    }=req.body;

    const customer=
      await createCustomer(
        req.body.email
      );

    const subscription=
      await createSubscription(
        customer.id,
        priceId
      );

    const saved=
      await Subscription.create({
        organizationId:req.organizationId,
        stripeCustomerId:customer.id,
        stripeSubscriptionId:
          subscription.id,
        plan:req.body.plan||"pro",
        status: (subscription.status as "active" | "trialing" | "canceled" | "past_due") || "active",
      });

    res.json(saved);

  }catch(error){
    res.status(500).json({
      error:"Subscription failed.",
    });
  }
});


router.get("/",async(req:AuthRequest,res)=>{
  const subscription=
    await Subscription.findOne({
      organizationId:req.organizationId,
    });

  res.json(subscription);
});


router.post("/cancel",async(req,res)=>{
  try{
    const subscription=
      await Subscription.findById(
        req.body.subscriptionId
      );

    if(!subscription){
      return res.status(404).json({
        error:"Subscription not found.",
      });
    }

    await cancelSubscription(
      subscription.stripeSubscriptionId
    );

    subscription.status="canceled";

    await subscription.save();

    res.json(subscription);

  }catch(error){
    res.status(500).json({
      error:"Cancellation failed.",
    });
  }
});


export default router;
