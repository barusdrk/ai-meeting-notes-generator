import {Router} from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import organizationAuth from "../middleware/organizationAuth.js";
import Organization from "../models/Organization.js";

const router=Router();

router.use(auth);
router.use(organizationAuth);


router.post("/",async(req:AuthRequest,res)=>{
  try{
    const organization=
      await Organization.findById(
        req.organizationId
      );

    if(!organization){
      return res.status(404).json({
        error:"Organization not found.",
      });
    }

    organization.members.push({
      userId:req.body.userId,
      role:req.body.role||"member",
    });

    await organization.save();

    res.json(organization.members);
  }catch(error){
    res.status(500).json({
      error:"Member addition failed.",
    });
  }
});


router.delete("/:userId",async(req:AuthRequest,res)=>{
  const organization=
    await Organization.findById(
      req.organizationId
    );

  if(!organization){
    return res.status(404).json({
      error:"Organization not found.",
    });
  }

  const filteredMembers = organization.members.filter(
    (member) => member.userId?.toString() !== req.params.userId
  );

  organization.members = filteredMembers as typeof organization.members;

  await organization.save();

  res.json({
    message:"Member removed.",
  });
});


export default router;
