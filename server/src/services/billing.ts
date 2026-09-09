import Stripe from "stripe";

let stripe:Stripe|null=null;

function getStripe(){
  if(stripe){
    return stripe;
  }

  const key=process.env.STRIPE_SECRET_KEY;

  if(!key){
    throw new Error(
      "STRIPE_SECRET_KEY is not configured."
    );
  }

  stripe=new Stripe(key);

  return stripe;
}

export async function createCustomer(
  email:string,
  organizationId:string
){
  return getStripe().customers.create({
    email,
    metadata:{
      organizationId,
    },
  });
}

export async function createCheckoutSession(
  customerId:string,
  priceId:string,
  organizationId:string,
  plan:string
){
  const clientUrl=
    process.env.CLIENT_URL;

  if(!clientUrl){
    throw new Error(
      "CLIENT_URL is not configured."
    );
  }

  return getStripe().checkout.sessions.create({
    mode:"subscription",
    customer:customerId,
    line_items:[
      {
        price:priceId,
        quantity:1,
      },
    ],
    success_url:
      `${clientUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:
      `${clientUrl}/billing/cancel`,
    metadata:{
      organizationId,
      plan,
    },
    subscription_data:{
      metadata:{
        organizationId,
        plan,
      },
    },
  });
}

export async function createSubscription(
  customerId:string,
  priceId:string,
  organizationId:string,
  plan:string
):Promise<Stripe.Subscription>{
  return getStripe().subscriptions.create({
    customer:customerId,
    items:[
      {
        price:priceId,
      },
    ],
    metadata:{
      organizationId,
      plan,
    },
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
  return getStripe().subscriptions.cancel(
    subscriptionId
  );
}

export async function getSubscription(
  subscriptionId:string
){
  return getStripe().subscriptions.retrieve(
    subscriptionId
  );
}

export async function getCheckoutSession(
  sessionId:string
){
  return getStripe().checkout.sessions.retrieve(
    sessionId,
    {
      expand:[
        "subscription",
      ],
    }
  );
}

export function verifyWebhook(
  body:Buffer|string,
  signature:string
){
  const secret=
    process.env.STRIPE_WEBHOOK_SECRET;

  if(!secret){
    throw new Error(
      "STRIPE_WEBHOOK_SECRET is not configured."
    );
  }

  return getStripe().webhooks.constructEvent(
    body,
    signature,
    secret
  );
}
