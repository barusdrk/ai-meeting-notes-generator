import {Router} from "express";
import {verifyWebhook} from "../services/billing.js";
import Subscription from "../models/Subscription.js";

const router=Router();


router.post(
  "/stripe",
  async(req,res)=>{

    try{

      const signature=
        req.headers[
          "stripe-signature"
        ] as string;

      const event=
        verifyWebhook(
          req.body,
          signature
        );


      if(
        event.type===
        "customer.subscription.updated"
      ){

        const subscription=
          event.data.object as any;

        await Subscription.findOneAndUpdate(
          {
            stripeSubscriptionId:
              subscription.id,
          },
          {
            status:
              subscription.status,
          }
        );
      }


      if(
        event.type===
        "customer.subscription.deleted"
      ){

        const subscription=
          event.data.object as any;

        await Subscription.findOneAndUpdate(
          {
            stripeSubscriptionId:
              subscription.id,
          },
          {
            status:"canceled",
          }
        );
      }


      res.json({
        received:true,
      });

    }catch(error){

      res.status(400).json({
        error:"Webhook failed.",
      });
    }
  }
);


export default router;
