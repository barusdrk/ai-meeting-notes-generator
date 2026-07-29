import type {Response,NextFunction} from "express";
import type {AuthRequest} from "./auth.js";
import Organization from "../models/Organization.js";

export default async function organizationAuth(req:AuthRequest,res:Response,next:NextFunction){
  try{
    const organizationId=req.headers["x-organization-id"];

    if(!organizationId){
      return res.status(400).json({
        error:"Organization ID required.",
      });
    }

    const organization=await Organization.findById(
      organizationId
    );

    if(!organization){
      return res.status(404).json({
        error:"Organization not found.",
      });
    }

    const member=organization.members.find(
      (item)=>item.userId?.toString()===req.userId
    );

    if(!member){
      return res.status(403).json({
        error:"Access denied.",
      });
    }

    req.organizationId=organizationId.toString();
    req.organizationRole=member.role;

    next();
  }catch(error){
    res.status(500).json({
      error:"Organization authorization failed.",
    });
  }
}
