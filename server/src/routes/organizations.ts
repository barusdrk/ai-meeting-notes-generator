import {Router} from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import Organization from "../models/Organization.js";

const router=Router();

router.use(auth);

router.post("/",async(req:AuthRequest,res)=>{
  try{
    const organization=await Organization.create({
      name:req.body.name,
      ownerId:req.userId,
      members:[
        {
          userId:req.userId,
          role:"owner",
        },
      ],
    });

    res.status(201).json(organization);
  }catch(error){
    res.status(500).json({
      error:"Organization creation failed.",
    });
  }
});


router.get("/",async(req:AuthRequest,res)=>{
  const organizations=await Organization.find({
    "members.userId":req.userId,
  });

  res.json(organizations);
});


router.get("/:id",async(req,res)=>{
  const organization=
    await Organization.findById(req.params.id);

  if(!organization){
    return res.status(404).json({
      error:"Organization not found.",
    });
  }

  res.json(organization);
});

export default router;
