import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  createCalendarEvent,
} from "../services/calendar.js";

const router=Router();

router.post("/",auth,async(req,res)=>{
  const event=
    await createCalendarEvent(
      req.body
    );

  res.status(201).json(event);
});

export default router;
