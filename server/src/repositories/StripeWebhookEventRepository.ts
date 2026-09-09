import StripeWebhookEvent
  from "../models/StripeWebhookEvent.js";

const PROCESSING_TIMEOUT_MS=
  5*60*1000;

export async function claimEvent(
  eventId:string,
  type:string
){
  const existing=
    await StripeWebhookEvent.findOne({
      eventId,
    });

  if(existing){
    if(existing.status==="processed"){
      return {
        claimed:false,
        reason:"processed" as const,
      };
    }

    if(
      existing.status==="processing"&&
      existing.processingStartedAt
    ){
      const processingAge=
        Date.now()-
        existing.processingStartedAt.getTime();

      if(
        processingAge<
        PROCESSING_TIMEOUT_MS
      ){
        return {
          claimed:false,
          reason:"processing" as const,
        };
      }
    }
  }

  try{
    const now=new Date();

    const event=
      await StripeWebhookEvent.findOneAndUpdate(
        {
          eventId,
          $or:[
            {
              status:"failed",
            },
            {
              status:"processing",
              processingStartedAt:{
                $lt:new Date(
                  Date.now()-
                  PROCESSING_TIMEOUT_MS
                ),
              },
            },
          ],
        },
        {
          $set:{
            type,
            status:"processing",
            processingStartedAt:now,
            lastError:undefined,
          },
          $inc:{
            attempts:1,
          },
        },
        {
          new:true,
        }
      );

    if(event){
      return {
        claimed:true,
        event,
      };
    }

    const created=
      await StripeWebhookEvent.create({
        eventId,
        type,
        status:"processing",
        attempts:1,
        processingStartedAt:new Date(),
      });

    return {
      claimed:true,
      event:created,
    };
  }catch(error:any){
    if(error?.code===11000){
      const duplicate=
        await StripeWebhookEvent.findOne({
          eventId,
        });

      if(
        duplicate?.status==="processed"
      ){
        return {
          claimed:false,
          reason:"processed" as const,
        };
      }

      return {
        claimed:false,
        reason:"processing" as const,
      };
    }

    throw error;
  }
}

export async function markProcessed(
  eventId:string
){
  return StripeWebhookEvent.findOneAndUpdate(
    {
      eventId,
    },
    {
      $set:{
        status:"processed",
        processedAt:new Date(),
      },
      $unset:{
        processingStartedAt:1,
        lastError:1,
      },
    },
    {
      new:true,
    }
  );
}

export async function markFailed(
  eventId:string,
  error:string
){
  return StripeWebhookEvent.findOneAndUpdate(
    {
      eventId,
    },
    {
      $set:{
        status:"failed",
        failedAt:new Date(),
        lastError:error.slice(0,2000),
      },
      $unset:{
        processingStartedAt:1,
      },
    },
    {
      new:true,
    }
  );
}
