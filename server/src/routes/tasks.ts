import {Router} from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import organizationAuth from "../middleware/organizationAuth.js";
import * as TaskRepository from "../repositories/TaskRepository.js";

const router=Router();

router.use(auth);
router.use(organizationAuth);

router.post("/",async(req:AuthRequest,res)=>{
  try{
    if(!req.userId||!req.organizationId){
      return res.status(403).json({
        error:"Organization authentication required.",
      });
    }

    const{
      meetingId,
      workspaceId,
      title,
      description,
      assignedTo,
      dueDate,
      status,
      priority,
      source,
    }=req.body;

    if(typeof meetingId!=="string"||!meetingId.trim()){
      return res.status(400).json({
        error:"Meeting ID is required.",
      });
    }

    if(typeof title!=="string"||!title.trim()){
      return res.status(400).json({
        error:"Task title is required.",
      });
    }

    if(
      workspaceId!==undefined&&
      typeof workspaceId!=="string"
    ){
      return res.status(400).json({
        error:"Invalid workspace ID.",
      });
    }

    if(
      assignedTo!==undefined&&
      typeof assignedTo!=="string"
    ){
      return res.status(400).json({
        error:"Invalid assignee ID.",
      });
    }

    let parsedDueDate:Date|undefined;

    if(dueDate!==undefined){
      if(typeof dueDate!=="string"){
        return res.status(400).json({
          error:"Invalid due date.",
        });
      }

      parsedDueDate=new Date(dueDate);

      if(Number.isNaN(parsedDueDate.getTime())){
        return res.status(400).json({
          error:"Invalid due date.",
        });
      }
    }

    if(
      status!==undefined&&
      !["pending","in_progress","completed"].includes(status)
    ){
      return res.status(400).json({
        error:"Invalid task status.",
      });
    }

    if(
      priority!==undefined&&
      !["low","medium","high"].includes(priority)
    ){
      return res.status(400).json({
        error:"Invalid task priority.",
      });
    }

    if(
      source!==undefined&&
      !["manual","ai_generated"].includes(source)
    ){
      return res.status(400).json({
        error:"Invalid task source.",
      });
    }

    const task=
      await TaskRepository.createTask({
        organizationId:req.organizationId,
        userId:req.userId,
        meetingId:meetingId.trim(),
        workspaceId:workspaceId?.trim(),
        title:title.trim(),
        description:
          typeof description==="string"
            ?description.trim()
            :"",
        assignedTo:assignedTo?.trim(),
        dueDate:parsedDueDate,
        status,
        priority,
        source,
      });

    res.status(201).json(task);
  }catch(error:any){
    console.error(
      "Task creation failed:",
      error
    );

    res.status(500).json({
      error:error.message,
    });
  }
});

router.get("/",async(req:AuthRequest,res)=>{
  try{
    if(!req.organizationId){
      return res.status(403).json({
        error:"Organization authentication required.",
      });
    }

    const meetingId=
      typeof req.query.meetingId==="string"
        ?req.query.meetingId
        :undefined;

    const workspaceId=
      typeof req.query.workspaceId==="string"
        ?req.query.workspaceId
        :undefined;

    if(meetingId){
      const tasks=
        await TaskRepository.findMeetingTasks(
          meetingId,
          req.organizationId
        );

      return res.json(tasks);
    }

    if(workspaceId){
      const tasks=
        await TaskRepository.findWorkspaceTasks(
          workspaceId,
          req.organizationId
        );

      return res.json(tasks);
    }

    const tasks=
      await TaskRepository.completedTasks(
        req.organizationId
      );

    res.json(tasks);
  }catch(error:any){
    console.error(
      "Task lookup failed:",
      error
    );

    res.status(500).json({
      error:error.message,
    });
  }
});

router.get("/:id",async(req:AuthRequest,res)=>{
  try{
    if(!req.organizationId){
      return res.status(403).json({
        error:"Organization authentication required.",
      });
    }

    if(typeof req.params.id!=="string"){
      return res.status(400).json({
        error:"Invalid task ID.",
      });
    }

    const task=
      await TaskRepository.findById(
        req.params.id,
        req.organizationId
      );

    if(!task){
      return res.status(404).json({
        error:"Task not found.",
      });
    }

    res.json(task);
  }catch(error:any){
    console.error(
      "Task lookup failed:",
      error
    );

    res.status(500).json({
      error:error.message,
    });
  }
});

router.patch("/:id",async(req:AuthRequest,res)=>{
  try{
    if(!req.organizationId){
      return res.status(403).json({
        error:"Organization authentication required.",
      });
    }

    if(typeof req.params.id!=="string"){
      return res.status(400).json({
        error:"Invalid task ID.",
      });
    }

    const allowedFields=[
      "title",
      "description",
      "assignedTo",
      "dueDate",
      "status",
      "priority",
      "source",
    ];

    const updates:Record<string,unknown>={};

    for(const field of allowedFields){
      if(req.body[field]!==undefined){
        updates[field]=req.body[field];
      }
    }

    if(
      updates.title!==undefined
    ){
      if(
        typeof updates.title!=="string"||
        !updates.title.trim()
      ){
        return res.status(400).json({
          error:"Task title cannot be empty.",
        });
      }

      updates.title=updates.title.trim();
    }

    if(
      updates.description!==undefined
    ){
      if(typeof updates.description!=="string"){
        return res.status(400).json({
          error:"Invalid task description.",
        });
      }

      updates.description=
        updates.description.trim();
    }

    if(
      updates.assignedTo!==undefined&&
      typeof updates.assignedTo!=="string"
    ){
      return res.status(400).json({
        error:"Invalid assignee ID.",
      });
    }

    if(
      updates.dueDate!==undefined
    ){
      if(
        typeof updates.dueDate!=="string"
      ){
        return res.status(400).json({
          error:"Invalid due date.",
        });
      }

      const date=
        new Date(updates.dueDate);

      if(Number.isNaN(date.getTime())){
        return res.status(400).json({
          error:"Invalid due date.",
        });
      }

      updates.dueDate=date;
    }

    if(
      updates.status!==undefined&&
      !["pending","in_progress","completed"].includes(
        updates.status as string
      )
    ){
      return res.status(400).json({
        error:"Invalid task status.",
      });
    }

    if(
      updates.priority!==undefined&&
      !["low","medium","high"].includes(
        updates.priority as string
      )
    ){
      return res.status(400).json({
        error:"Invalid task priority.",
      });
    }

    if(
      updates.source!==undefined&&
      !["manual","ai_generated"].includes(
        updates.source as string
      )
    ){
      return res.status(400).json({
        error:"Invalid task source.",
      });
    }

    if(
      Object.keys(updates).length===0
    ){
      return res.status(400).json({
        error:"No valid task fields provided.",
      });
    }

    const task=
      await TaskRepository.updateTask(
        req.params.id,
        req.organizationId,
        updates
      );

    if(!task){
      return res.status(404).json({
        error:"Task not found.",
      });
    }

    res.json(task);
  }catch(error:any){
    console.error(
      "Task update failed:",
      error
    );

    res.status(500).json({
      error:error.message,
    });
  }
});

router.delete("/:id",async(req:AuthRequest,res)=>{
  try{
    if(!req.organizationId){
      return res.status(403).json({
        error:"Organization authentication required.",
      });
    }

    if(typeof req.params.id!=="string"){
      return res.status(400).json({
        error:"Invalid task ID.",
      });
    }

    const task=
      await TaskRepository.deleteTask(
        req.params.id,
        req.organizationId
      );

    if(!task){
      return res.status(404).json({
        error:"Task not found.",
      });
    }

    res.json({
      success:true,
      message:"Task deleted.",
    });
  }catch(error:any){
    console.error(
      "Task deletion failed:",
      error
    );

    res.status(500).json({
      error:error.message,
    });
  }
});

router.get("/completed/list",async(req:AuthRequest,res)=>{
  try{
    if(!req.organizationId){
      return res.status(403).json({
        error:"Organization authentication required.",
      });
    }

    const tasks=
      await TaskRepository.completedTasks(
        req.organizationId
      );

    res.json(tasks);
  }catch(error:any){
    console.error(
      "Completed task lookup failed:",
      error
    );

    res.status(500).json({
      error:error.message,
    });
  }
});

router.get("/overdue/list",async(req:AuthRequest,res)=>{
  try{
    if(!req.organizationId){
      return res.status(403).json({
        error:"Organization authentication required.",
      });
    }

    const tasks=
      await TaskRepository.overdueTasks(
        req.organizationId
      );

    res.json(tasks);
  }catch(error:any){
    console.error(
      "Overdue task lookup failed:",
      error
    );

    res.status(500).json({
      error:error.message,
    });
  }
});

export default router;
