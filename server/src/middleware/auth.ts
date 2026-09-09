import {type Request,type Response,type NextFunction} from "express";
import jwt,{type JwtPayload} from "jsonwebtoken";

export interface AuthRequest extends Request{
  userId?:string;
  email?:string;
  organizationId?:string;
  organizationRole?:string;
}

export default function auth(
  req:AuthRequest,
  res:Response,
  next:NextFunction
){
  try{
    const header=req.headers.authorization;

    if(!header?.startsWith("Bearer ")){
      return res.status(401).json({
        error:"Unauthorized.",
      });
    }

    const secret=process.env.JWT_SECRET;

    if(!secret){
      throw new Error("JWT_SECRET missing.");
    }

    const token=header.slice(7).trim();

    if(!token){
      return res.status(401).json({
        error:"Unauthorized.",
      });
    }

    const decoded=jwt.verify(
      token,
      secret
    );

    if(
      typeof decoded!=="object"||
      decoded===null||
      typeof (decoded as JwtPayload).userId!=="string"
    ){
      return res.status(401).json({
        error:"Invalid token.",
      });
    }

    const payload=decoded as JwtPayload&{
      userId:string;
      email?:string;
    };

    req.userId=payload.userId;

    if(typeof payload.email==="string"){
      req.email=payload.email;
    }

    next();
  }catch{
    return res.status(401).json({
      error:"Invalid token.",
    });
  }
}
