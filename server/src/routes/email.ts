import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  sendSummaryEmail,
} from "../services/email.js";

const router=Router();

router.post("/send",auth,async(req,res)=>{
  try{
    const result=await sendSummaryEmail(
      req.body.email,
      req.body.summary
    );

    res.json(result);
  }catch(error){
    res.status(500).json({
      error:"Email failed.",
    });
  }
});

export default router;
