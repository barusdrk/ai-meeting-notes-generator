import Stripe from "stripe";

function getStripe(){
  const key=process.env.STRIPE_SECRET_KEY;

  if(!key){
    throw new Error(
      "STRIPE_SECRET_KEY is not configured."
    );
  }

  return new Stripe(key);
}

export async function createCustomer(
  email:string
){
  const stripe=getStripe();

  return stripe.customers.create({
    email,
  });
}

export async function createSubscription(
  customerId:string,
  priceId:string
){
  const stripe=getStripe();

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
  const stripe=getStripe();

  return stripe.subscriptions.cancel(
    subscriptionId
  );
}

export async function getSubscription(
  subscriptionId:string
){
  const stripe=getStripe();

  return stripe.subscriptions.retrieve(
    subscriptionId
  );
}

export function verifyWebhook(
  body:Buffer|string,
  signature:string
){
  const stripe=getStripe();

  const secret=
    process.env.STRIPE_WEBHOOK_SECRET;

  if(!secret){
    throw new Error(
      "STRIPE_WEBHOOK_SECRET is not configured."
    );
  }

  return stripe.webhooks.constructEvent(
    body,
    signature,
    secret
  );
}
