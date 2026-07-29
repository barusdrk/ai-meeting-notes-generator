import {Router} from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import organizationAuth from "../middleware/organizationAuth.js";
import Team from "../models/Team.js";

const router=Router();

router.use(auth);
router.use(organizationAuth);


router.post("/",async(req:AuthRequest,res)=>{
  try{
    const team=await Team.create({
      name:req.body.name,
      workspaceId:req.body.workspaceId,
      members:[
        {
          userId:req.userId,
          roleId:req.body.roleId,
        },
      ],
    });

    res.status(201).json(team);
  }catch(error){
    res.status(500).json({
      error:"Team creation failed.",
    });
  }
});


router.get("/:workspaceId",async(req,res)=>{
  const teams=await Team.find({
    workspaceId:req.params.workspaceId,
  });

  res.json(teams);
});


export default router;
