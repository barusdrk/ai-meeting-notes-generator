import {Router} from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import organizationAuth from "../middleware/organizationAuth.js";
import * as ReminderService from "../services/reminders.js";

const router=Router();

router.use(auth);
router.use(organizationAuth);

router.get(
  "/",
  async(req:AuthRequest,res)=>{
    try{
      if(
        !req.userId||
        !req.organizationId
      ){
        return res.status(403).json({
          error:
            "Organization authentication required.",
        });
      }

      const reminders=
        await ReminderService.getPendingReminders({
          userId:req.userId,
          organizationId:req.organizationId,
        });

      res.json(reminders);
    }catch(error:any){
      console.error(
        "Get reminders failed:",
        error
      );

      res.status(500).json({
        error:error.message,
      });
    }
  }
);

router.get(
  "/:id",
  async(req:AuthRequest,res)=>{
    try{
      if(
        !req.userId||
        !req.organizationId
      ){
        return res.status(403).json({
          error:
            "Organization authentication required.",
        });
      }

      const id=req.params.id;

      if(typeof id!=="string"){
        return res.status(400).json({
          error:"Invalid reminder ID.",
        });
      }

      const reminder=
        await ReminderService.getReminderById(
          id,
          {
            userId:req.userId,
            organizationId:req.organizationId,
          }
        );

      if(!reminder){
        return res.status(404).json({
          error:"Reminder not found.",
        });
      }

      res.json(reminder);
    }catch(error:any){
      console.error(
        "Get reminder failed:",
        error
      );

      res.status(500).json({
        error:error.message,
      });
    }
  }
);

router.post(
  "/",
  async(req:AuthRequest,res)=>{
    try{
      if(
        !req.userId||
        !req.organizationId
      ){
        return res.status(403).json({
          error:
            "Organization authentication required.",
        });
      }

      const{
        taskId,
        message,
        date,
      }=req.body;

      if(
        typeof message!=="string"||
        !message.trim()||
        typeof date!=="string"
      ){
        return res.status(400).json({
          error:"Message and date are required.",
        });
      }

      if(
        taskId!==undefined&&
        typeof taskId!=="string"
      ){
        return res.status(400).json({
          error:"Invalid task ID.",
        });
      }

      const remindAt=new Date(date);

      if(Number.isNaN(remindAt.getTime())){
        return res.status(400).json({
          error:"Invalid reminder date.",
        });
      }

      const reminder=
        await ReminderService.createReminder({
          userId:req.userId,
          organizationId:req.organizationId,
          taskId:
            typeof taskId==="string"
              ?taskId
              :undefined,
          message:message.trim(),
          date:remindAt,
        });

      res.status(201).json(reminder);
    }catch(error:any){
      if(
        error.message==="Invalid task ID."||
        error.message===
          "Task not found in this organization."||
        error.message===
          "Invalid user or organization ID."
      ){
        return res.status(400).json({
          error:error.message,
        });
      }

      console.error(
        "Create reminder failed:",
        error
      );

      res.status(500).json({
        error:"Failed to create reminder.",
      });
    }
  }
);

router.patch(
  "/:id/complete",
  async(req:AuthRequest,res)=>{
    try{
      if(
        !req.userId||
        !req.organizationId
      ){
        return res.status(403).json({
          error:
            "Organization authentication required.",
        });
      }

      const id=req.params.id;

      if(typeof id!=="string"){
        return res.status(400).json({
          error:"Invalid reminder ID.",
        });
      }

      const reminder=
        await ReminderService.completeReminder(
          id,
          {
            userId:req.userId,
            organizationId:req.organizationId,
          }
        );

      if(!reminder){
        return res.status(404).json({
          error:"Reminder not found.",
        });
      }

      res.json(reminder);
    }catch(error:any){
      console.error(
        "Complete reminder failed:",
        error
      );

      res.status(500).json({
        error:"Failed to complete reminder.",
      });
    }
  }
);

router.delete(
  "/:id",
  async(req:AuthRequest,res)=>{
    try{
      if(
        !req.userId||
        !req.organizationId
      ){
        return res.status(403).json({
          error:
            "Organization authentication required.",
        });
      }

      const id=req.params.id;

      if(typeof id!=="string"){
        return res.status(400).json({
          error:"Invalid reminder ID.",
        });
      }

      const reminder=
        await ReminderService.deleteReminder(
          id,
          {
            userId:req.userId,
            organizationId:req.organizationId,
          }
        );

      if(!reminder){
        return res.status(404).json({
          error:"Reminder not found.",
        });
      }

      res.json({
        success:true,
        message:"Reminder deleted.",
      });
    }catch(error:any){
      console.error(
        "Delete reminder failed:",
        error
      );

      res.status(500).json({
        error:"Failed to delete reminder.",
      });
    }
  }
);

export default router;
