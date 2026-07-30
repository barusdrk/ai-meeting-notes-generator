import Stripe from "stripe";

export function getStripe(){
  const key=process.env.STRIPE_SECRET_KEY;

  if(!key){
    throw new Error(
      "STRIPE_SECRET_KEY is not configured."
    );
  }

  return new Stripe(key);
}

export async function createStripeCustomer(
  email:string
){
  const stripe=getStripe();

  return stripe.customers.create({
    email,
  });
}

export async function createStripeSubscription(
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
  });
}

export async function cancelStripeSubscription(
  id:string
){
  const stripe=getStripe();

  return stripe.subscriptions.cancel(
    id
  );
}

export async function retrieveStripeSubscription(
  id:string
){
  const stripe=getStripe();

  return stripe.subscriptions.retrieve(
    id
  );
}

export function verifyStripeWebhook(
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
