import { Router } from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import {
  createReminder,
  getPendingReminders,
  completeReminder,
} from "../services/reminder.js";

const router=Router();

router.get("/",auth,async(req:AuthRequest,res)=>{
  res.json(
    await getPendingReminders(req.userId!)
  );
});


router.post("/",auth,async(req:AuthRequest,res)=>{
  const reminder=await createReminder({
    userId:req.userId!,
    ...req.body,
  });

  res.status(201).json(reminder);
});


router.patch("/:id/complete",auth,async(req:AuthRequest,res)=>{
  const reminder=await completeReminder(
    req.params.id as string
  );

  res.json(reminder);
});

export default router;
