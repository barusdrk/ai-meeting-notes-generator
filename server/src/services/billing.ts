import Stripe from "stripe";

const stripe=new Stripe(
  process.env.STRIPE_SECRET_KEY!
);


export async function createCustomer(
  email:string
){

  return stripe.customers.create({
    email,
  });
}


export async function createSubscription(
  customerId:string,
  priceId:string
){

  return stripe.subscriptions.create({
    customer:customerId,
    items:[
      {
        price:priceId,
      },
    ],
    payment_behavior:
      "default_incomplete",
    expand:[
      "latest_invoice.payment_intent",
    ],
  });
}


export async function cancelSubscription(
  subscriptionId:string
){

  return stripe.subscriptions.cancel(
    subscriptionId
  );
}


export async function getSubscription(
  subscriptionId:string
){

  return stripe.subscriptions.retrieve(
    subscriptionId
  );
}


export function verifyWebhook(
  body:any,
  signature:string
){

  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
