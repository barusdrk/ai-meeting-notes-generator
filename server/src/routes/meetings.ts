import {Router} from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import organizationAuth from "../middleware/organizationAuth.js";
import Meeting from "../models/Meeting.js";

import {createZoomMeeting} from "../integrations/zoom.js";
import {createGoogleMeet} from "../integrations/googleMeet.js";
import {createTeamsMeeting} from "../integrations/microsoftTeams.js";

const router=Router();

router.use(auth);
router.use(organizationAuth);

router.post("/",async(req:AuthRequest,res)=>{
  try{
    const meeting=await Meeting.create({
      ...req.body,
      userId:req.userId,
      organizationId:req.organizationId,
    });

    res.status(201).json(meeting);
  }catch(error){
    res.status(500).json({
      error:"Meeting creation failed.",
    });
  }
});

router.get("/",async(req:AuthRequest,res)=>{
  const meetings=await Meeting.find({
    organizationId:req.organizationId,
  }).sort({
    createdAt:-1,
  });

  res.json(meetings);
});

router.get("/:id",async(req,res)=>{
  const meeting=await Meeting.findById(
    req.params.id
  );

  if(!meeting){
    return res.status(404).json({
      error:"Meeting not found.",
    });
  }

  res.json(meeting);
});


router.post("/zoom",async(req,res)=>{
  try{
    const result=
      await createZoomMeeting(req.body);

    res.json(result);
  }catch(error){
    res.status(500).json({
      error:"Zoom meeting failed.",
    });
  }
});


router.post("/google-meet",async(req,res)=>{
  try{
    const result=
      await createGoogleMeet(req.body);

    res.json(result);
  }catch(error){
    res.status(500).json({
      error:"Google Meet failed.",
    });
  }
});


router.post("/teams",async(req,res)=>{
  try{
    const result=
      await createTeamsMeeting(req.body);

    res.json(result);
  }catch(error){
    res.status(500).json({
      error:"Teams meeting failed.",
    });
  }
});

export default router;
