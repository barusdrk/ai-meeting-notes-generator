import {Router} from "express";
import {Queue} from "bullmq";
import auth,{type AuthRequest} from "../middleware/auth.js";
import organizationAuth from "../middleware/organizationAuth.js";
import requireConnectedAccount from "../middleware/requireConnectedAccount.js";
import * as MeetingRepository from "../repositories/MeetingRepository.js";

const router=Router();

const transcriptionQueue=new Queue(
  "transcription",
  {
    connection:{
      url:process.env.REDIS_URL,
    },
  }
);

router.use(auth);
router.use(organizationAuth);

router.post(
  "/analyze",
  async (
    req:AuthRequest,
    res
  )=>{
    try{
      const{
        meetingId,
        filePath,
      }=req.body;

      if(
        typeof meetingId!=="string"||
        typeof filePath!=="string"
      ){
        return res.status(400).json({
          error:"Meeting ID and file path required.",
        });
      }

      const organizationId=req.organizationId;

      if(typeof organizationId!=="string"){
        return res.status(403).json({
          error:"Organization authentication required.",
        });
      }

      const meeting=
        await MeetingRepository.findById(
          meetingId,
          organizationId
        );

      if(!meeting){
        return res.status(404).json({
          error:"Meeting not found.",
        });
      }

      await transcriptionQueue.add(
        "transcribe",
        {
          meetingId,
          filePath,
          userId:req.userId,
          organizationId,
        }
      );

      res.json({
        success:true,
        message:"Meeting queued for AI analysis.",
      });
    }catch(error:any){
      res.status(500).json({
        error:error.message,
      });
    }
  }
);

router.get(
  "/status/:meetingId",
  async (
    req:AuthRequest,
    res
  )=>{
    try{
      const meetingId=req.params.meetingId;
      const organizationId=req.organizationId;

      if(typeof meetingId!=="string"){
        return res.status(400).json({
          error:"Invalid meeting ID.",
        });
      }

      if(typeof organizationId!=="string"){
        return res.status(403).json({
          error:"Organization authentication required.",
        });
      }

      const meeting=
        await MeetingRepository.findById(
          meetingId,
          organizationId
        );

      if(!meeting){
        return res.status(404).json({
          error:"Meeting not found.",
        });
      }

      res.json({
        id:meeting._id,
        transcript:meeting.transcript,
        summary:meeting.summary,
        decisions:meeting.decisions,
        actionItems:meeting.actionItems,
        status:meeting.status??"completed",
      });
    }catch(error:any){
      res.status(500).json({
        error:error.message,
      });
    }
  }
);

router.post(
  "/reply",
  requireConnectedAccount,
  async (
    req:AuthRequest,
    res
  )=>{
    res.json({
      success:true,
      message:"Connected Gmail account verified.",
    });
  }
);

export default router;
