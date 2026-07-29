import { Router } from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import Task from "../models/Task.js";

const router=Router();

router.get("/",auth,async(req:AuthRequest,res)=>{
  const tasks=await Task.find({
    userId:req.userId,
  }).sort({
    createdAt:-1,
  });

  res.json(tasks);
});


router.patch("/:id",auth,async(req:AuthRequest,res)=>{
  const task=await Task.findOneAndUpdate(
    {
      _id:req.params.id,
      userId:req.userId,
    },
    {
      $set:req.body,
    },
    {
      new:true,
    }
  );

  if(!task){
    return res.status(404).json({
      error:"Task not found.",
    });
  }

  res.json(task);
});


router.delete("/:id",auth,async(req:AuthRequest,res)=>{
  await Task.findOneAndDelete({
    _id:req.params.id,
    userId:req.userId,
  });

  res.json({
    message:"Task deleted.",
  });
});

export default router;
