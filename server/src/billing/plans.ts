export interface Plan{
  id:string;
  name:string;
  price:number;
  stripePriceId:string;
  limits:{
    aiRequests:number;
    transcriptionMinutes:number;
    storageMB:number;
  };
}


export const PLANS:Record<string,Plan>={
  free:{
    id:"free",
    name:"Free",
    price:0,
    stripePriceId:"",
    limits:{
      aiRequests:50,
      transcriptionMinutes:60,
      storageMB:500,
    },
  },

  pro:{
    id:"pro",
    name:"Pro",
    price:19,
    stripePriceId:
      process.env.STRIPE_PRO_PRICE_ID || "",
    limits:{
      aiRequests:1000,
      transcriptionMinutes:2000,
      storageMB:10000,
    },
  },

  enterprise:{
    id:"enterprise",
    name:"Enterprise",
    price:99,
    stripePriceId:
      process.env.STRIPE_ENTERPRISE_PRICE_ID || "",
    limits:{
      aiRequests:10000,
      transcriptionMinutes:10000,
      storageMB:100000,
    },
  },
};


export function getPlan(
  id:string
){
  return PLANS[id] || PLANS.free;
}
