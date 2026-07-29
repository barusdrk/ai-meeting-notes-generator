import {Router} from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import organizationAuth from "../middleware/organizationAuth.js";
import Workspace from "../models/Workspace.js";

const router=Router();

router.use(auth);
router.use(organizationAuth);


router.post("/",async(req:AuthRequest,res)=>{
  try{
    const workspace=await Workspace.create({
      name:req.body.name,
      organizationId:req.organizationId,
      createdBy:req.userId,
    });

    res.status(201).json(workspace);
  }catch(error){
    res.status(500).json({
      error:"Workspace creation failed.",
    });
  }
});


router.get("/",async(req:AuthRequest,res)=>{
  const workspaces=
    await Workspace.find({
      organizationId:req.organizationId,
    });

  res.json(workspaces);
});


export default router;
