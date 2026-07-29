import {Router} from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";

import {Queue} from "bullmq";

import Meeting from "../models/Meeting.js";

const router=Router();

const transcriptionQueue=
new Queue(
  "transcription",
  {
    connection:{
      url:
        process.env.REDIS_URL,
    },
  }
);

router.use(auth);

router.post(
  "/analyze",
  async(
    req:AuthRequest,
    res
  )=>{
    try{
      const {
        meetingId,
        filePath,
      }=req.body;

      if(
        !meetingId ||
        !filePath
      ){
        return res.status(400)
          .json({
            error:
              "Meeting ID and file path required.",
          });
      }

      const meeting=
        await Meeting.findById(
          meetingId
        );

      if(!meeting){
        return res.status(404)
          .json({
            error:
              "Meeting not found.",
          });
      }

      await transcriptionQueue.add(
        "analyze-meeting",
        {
          meetingId,
          filePath,
          userId:
            req.userId,
        }
      );

      return res.json({
        message:
          "AI analysis started.",
      });

    }catch(error){
      return res.status(500)
        .json({
          error:
            "AI analysis failed.",
        });
    }
  }
);

router.get(
  "/status/:id",
  async(req,res)=>{
    const meeting=
      await Meeting.findById(
        req.params.id
      );

    if(!meeting){
      return res.status(404)
        .json({
          error:
            "Meeting not found.",
        });
    }

    return res.json({
      status: "completed",
      summary:
        meeting.summary,
      decisions:
        meeting.decisions,
      actionItems:
        meeting.actionItems,
    });
  }
);

export default router;
