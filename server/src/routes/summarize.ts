import { Router } from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import { summarizeTranscript } from "../services/ai.js";
import { saveMeeting } from "../services/meeting.js";

const router=Router();

router.post("/",auth,async(req:AuthRequest,res)=>{
  try{
    const {transcript,title}=req.body;

    if(!transcript){
      return res.status(400).json({
        error:"Transcript required.",
      });
    }

    const notes=await summarizeTranscript(transcript);

    const saved=await saveMeeting(
      req.userId!,
      {
        title,
        transcript,
        summary: notes.summary,
        decisions: notes.decisions,
        actionItems: notes.actionItems.map((item) =>
          typeof item === "string" ? item : item.title
        ),
      }
    );

    return res.status(201).json({
      notes,
      ...saved,
    });

  }catch(error){
    console.error(error);
    return res.status(500).json({
      error:"Unable to summarize.",
    });
  }
});

export default router;
