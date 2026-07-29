import Stripe from "stripe";

export const stripe=
new Stripe(
  process.env.STRIPE_SECRET_KEY!
);


export async function createStripeCustomer(
  email:string
){

  return stripe.customers.create({
    email,
  });
}


export async function createStripeSubscription(
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
  });
}


export async function cancelStripeSubscription(
  id:string
){

  return stripe.subscriptions.cancel(
    id
  );
}
