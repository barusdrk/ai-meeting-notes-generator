import {Router} from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import organizationAuth from "../middleware/organizationAuth.js";
import requireConnectedAccount from "../middleware/requireConnectedAccount.js";
import * as MeetingRepository from "../repositories/MeetingRepository.js";
import {createZoomMeeting} from "../integrations/zoom.js";
import {createGoogleMeet} from "../integrations/googleMeet.js";
import {createTeamsMeeting} from "../integrations/microsoftTeams.js";

const router=Router();

function requireProvider(
  provider:"zoom"|"google_meet"|"teams"
){
  return(
    req:AuthRequest,
    res:any,
    next:any
  )=>{
    req.headers["x-provider"]=provider;
    return requireConnectedAccount(
      req,
      res,
      next
    );
  };
}

router.use(auth);
router.use(organizationAuth);

router.post(
  "/",
  async(req:AuthRequest,res)=>{
    try{
      if(!req.userId||!req.organizationId){
        return res.status(403).json({
          error:"Organization authentication required.",
        });
      }

      const meeting=
        await MeetingRepository.createMeeting({
          ...req.body,
          userId:req.userId,
          organizationId:req.organizationId,
        });

      res.status(201).json(meeting);
    }catch(error:any){
      res.status(500).json({
        error:error.message,
      });
    }
  }
);

router.get(
  "/",
  async(req:AuthRequest,res)=>{
    try{
      if(!req.organizationId){
        return res.status(403).json({
          error:"Organization authentication required.",
        });
      }

      const meetings=
        await MeetingRepository.findByOrganization(
          req.organizationId
        );

      res.json(meetings);
    }catch(error:any){
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
      if(!req.organizationId){
        return res.status(403).json({
          error:"Organization authentication required.",
        });
      }

      if(typeof req.params.id!=="string"){
        return res.status(400).json({
          error:"Invalid meeting ID.",
        });
      }

      const meeting=
        await MeetingRepository.findById(
          req.params.id,
          req.organizationId
        );

      if(!meeting){
        return res.status(404).json({
          error:"Meeting not found.",
        });
      }

      res.json(meeting);
    }catch(error:any){
      res.status(500).json({
        error:error.message,
      });
    }
  }
);

router.post(
  "/zoom",
  requireProvider("zoom"),
  async(req:AuthRequest,res)=>{
    try{
      res.json(
        await createZoomMeeting(req.body)
      );
    }catch(error:any){
      res.status(500).json({
        error:error.message,
      });
    }
  }
);

router.post(
  "/google-meet",
  requireProvider("google_meet"),
  async(req:AuthRequest,res)=>{
    try{
      res.json(
        await createGoogleMeet(req.body)
      );
    }catch(error:any){
      res.status(500).json({
        error:error.message,
      });
    }
  }
);

router.post(
  "/teams",
  requireProvider("teams"),
  async(req:AuthRequest,res)=>{
    try{
      res.json(
        await createTeamsMeeting(req.body)
      );
    }catch(error:any){
      res.status(500).json({
        error:error.message,
      });
    }
  }
);

export default router;
