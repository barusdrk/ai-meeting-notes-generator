export const PLAN_LIMITS={
  free:{
    aiRequests:50,
    transcriptionMinutes:60,
    storageMB:500,
  },
  pro:{
    aiRequests:1000,
    transcriptionMinutes:2000,
    storageMB:10000,
  },
  enterprise:{
    aiRequests:10000,
    transcriptionMinutes:10000,
    storageMB:100000,
  },
};


export type UsageType=
  | "aiRequests"
  | "transcriptionMinutes"
  | "storageMB";


export function getPlanLimit(
  plan:string,
  type:UsageType
){
  const limits=
    PLAN_LIMITS[
      plan as keyof typeof PLAN_LIMITS
    ] || PLAN_LIMITS.free;

  return limits[type];
}


export function hasUsageLimit(
  current:number,
  plan:string,
  type:UsageType
){

  return current <
    getPlanLimit(
      plan,
      type
    );
}


export function usagePercentage(
  current:number,
  plan:string,
  type:UsageType
){

  const limit=
    getPlanLimit(
      plan,
      type
    );

  if(limit===0){
    return 100;
  }

  return Math.round(
    (current/limit)*100
  );
}
