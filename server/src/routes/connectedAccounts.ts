import {Router} from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import organizationAuth from "../middleware/organizationAuth.js";
import * as ConnectedAccountRepository from "../repositories/ConnectedAccountRepository.js";
import type {ConnectedAccountProvider} from "../models/ConnectedAccount.js";

const router=Router();

function getProvider(
  value:string|string[]|undefined
):ConnectedAccountProvider|null{
  if(typeof value!=="string"){
    return null;
  }

  const provider=value.toLowerCase();

  if(
    provider==="gmail"||
    provider==="outlook"||
    provider==="zoom"||
    provider==="google_meet"||
    provider==="teams"
  ){
    return provider;
  }

  return null;
}

router.use(auth);
router.use(organizationAuth);

router.get(
  "/",
  async(req:AuthRequest,res)=>{
    try{
      if(!req.organizationId){
        return res.status(403).json({
          error:"Organization authentication required.",
        });
      }

      const accounts=
        await ConnectedAccountRepository.findByOrganization(
          req.organizationId
        );

      res.json(accounts);
    }catch(error:any){
      res.status(500).json({
        error:error.message,
      });
    }
  }
);

router.get(
  "/:provider",
  async(req:AuthRequest,res)=>{
    try{
      if(!req.organizationId){
        return res.status(403).json({
          error:"Organization authentication required.",
        });
      }

      const provider=getProvider(
        req.params.provider
      );

      if(!provider){
        return res.status(400).json({
          error:"Unsupported provider.",
        });
      }

      const account=
        await ConnectedAccountRepository.findProvider(
          req.organizationId,
          provider
        );

      if(!account){
        return res.status(404).json({
          error:"Account not connected.",
        });
      }

      res.json(account);
    }catch(error:any){
      res.status(500).json({
        error:error.message,
      });
    }
  }
);

router.post(
  "/",
  async(req:AuthRequest,res)=>{
    try{
      if(
        !req.userId||
        !req.organizationId
      ){
        return res.status(403).json({
          error:"Organization authentication required.",
        });
      }

      const provider=getProvider(
        req.body.provider
      );

      if(!provider){
        return res.status(400).json({
          error:"Unsupported provider.",
        });
      }

      if(
        typeof req.body.accessToken!=="string"
      ){
        return res.status(400).json({
          error:"Access token is required.",
        });
      }

      if(
        req.body.email!==undefined&&
        typeof req.body.email!=="string"
      ){
        return res.status(400).json({
          error:"Invalid email.",
        });
      }

      const account=
        await ConnectedAccountRepository.upsertAccount({
          userId:req.userId,
          organizationId:req.organizationId,
          provider,
          email:req.body.email,
          accessToken:req.body.accessToken,
          refreshToken:
            typeof req.body.refreshToken==="string"
              ?req.body.refreshToken
              :undefined,
          expiresAt:
            req.body.expiresAt
              ?new Date(req.body.expiresAt)
              :undefined,
        });

      res.status(201).json(account);
    }catch(error:any){
      res.status(500).json({
        error:error.message,
      });
    }
  }
);

router.delete(
  "/:provider",
  async(req:AuthRequest,res)=>{
    try{
      if(!req.organizationId){
        return res.status(403).json({
          error:"Organization authentication required.",
        });
      }

      const provider=getProvider(
        req.params.provider
      );

      if(!provider){
        return res.status(400).json({
          error:"Unsupported provider.",
        });
      }

      const account=
        await ConnectedAccountRepository.deleteAccount(
          req.organizationId,
          provider
        );

      if(!account){
        return res.status(404).json({
          error:"Account not connected.",
        });
      }

      res.json({
        message:"Account disconnected.",
      });
    }catch(error:any){
      res.status(500).json({
        error:error.message,
      });
    }
  }
);

export default router;
