import Usage from "../models/Usage.js";
import {
  getPlanLimit,
  type UsageType,
} from "../usage.js";

function currentMonth(){
  return new Date()
    .toISOString()
    .slice(0,7);
}

export async function getUsage(
  organizationId:string
){
  return Usage.findOneAndUpdate(
    {
      organizationId,
      month:currentMonth(),
    },
    {},
    {
      upsert:true,
      new:true,
      setDefaultsOnInsert:true,
    }
  );
}

export async function incrementUsage(
  organizationId:string,
  type:UsageType,
  amount:number=1
){
  const usage=
    await getUsage(
      organizationId
    );

  usage[type]+=amount;

  await usage.save();

  return usage;
}

export async function checkUsageLimit(
  organizationId:string,
  plan:string,
  type:UsageType,
  amount:number=1
){
  const usage=
    await getUsage(
      organizationId
    );

  return(
    usage[type]+amount
  )<=getPlanLimit(
    plan,
    type
  );
}

export async function getUsageStats(
  organizationId:string,
  plan:string
){
  const usage=
    await getUsage(
      organizationId
    );

  return{
    aiRequests:{
      used:usage.aiRequests,
      limit:getPlanLimit(
        plan,
        "aiRequests"
      ),
    },
    transcriptionMinutes:{
      used:
        usage.transcriptionMinutes,
      limit:getPlanLimit(
        plan,
        "transcriptionMinutes"
      ),
    },
    storageMB:{
      used:usage.storageMB,
      limit:getPlanLimit(
        plan,
        "storageMB"
      ),
    },
  };
}

export async function resetMonthlyUsage(
  organizationId:string
){
  return Usage.findOneAndUpdate(
    {
      organizationId,
      month:currentMonth(),
    },
    {
      aiRequests:0,
      transcriptionMinutes:0,
      storageMB:0,
    },
    {
      new:true,
    }
  );
}
