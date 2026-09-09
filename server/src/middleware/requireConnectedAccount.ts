import type {Response,NextFunction} from "express";
import type {AuthRequest} from "./auth.js";
import ConnectedAccount from "../models/ConnectedAccount.js";
import type {ConnectedAccountProvider} from "../models/ConnectedAccount.js";

export default async function requireConnectedAccount(
  req:AuthRequest,
  res:Response,
  next:NextFunction
){
  try{
    const provider=String(
      req.query.provider||
      req.headers["x-provider"]||
      ""
    ).toLowerCase() as ConnectedAccountProvider;

    const supportedProviders:ConnectedAccountProvider[]=[
      "gmail",
      "outlook",
      "zoom",
      "google_meet",
      "teams",
    ];

    if(!provider){
      return res.status(400).json({
        error:"Provider required.",
      });
    }

    if(!supportedProviders.includes(provider)){
      return res.status(400).json({
        error:"Unsupported provider.",
      });
    }

    if(
      !req.userId||
      !req.organizationId
    ){
      return res.status(403).json({
        error:"Organization authentication required.",
      });
    }

    const connectedAccount=
      await ConnectedAccount.findOne({
        userId:req.userId,
        organizationId:req.organizationId,
        provider,
      });

    if(!connectedAccount){
      return res.status(403).json({
        error:`${provider} account not connected.`,
      });
    }

    if(!connectedAccount.accessToken){
      return res.status(403).json({
        error:`${provider} access token is missing.`,
      });
    }

    next();
  }catch{
    res.status(500).json({
      error:"Connection check failed.",
    });
  }
}
