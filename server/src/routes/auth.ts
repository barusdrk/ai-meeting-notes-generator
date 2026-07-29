import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth,{type AuthRequest} from "../middleware/auth.js";

const router=Router();

function token(id:string){
  const secret=process.env.JWT_SECRET;
  if(!secret) throw new Error("JWT_SECRET missing.");
  return jwt.sign({userId:id},secret,{expiresIn:"7d"});
}

router.post("/register",async(req,res)=>{
  try{
    const {email,password}=req.body;
    if(!email||!password)return res.status(400).json({error:"Email and password required."});

    const exists=await User.findOne({email:email.toLowerCase()});
    if(exists)return res.status(409).json({error:"User already exists."});

    const user=await User.create({
      email:email.toLowerCase(),
      password:await bcrypt.hash(password,10),
    });

    return res.status(201).json({
      token:token(user._id.toString()),
      user:{id:user._id,email:user.email},
    });
  }catch(error){
    console.error(error);
    return res.status(500).json({error:"Registration failed."});
  }
});

router.post("/login",async(req,res)=>{
  try{
    const {email,password}=req.body;

    const user=await User.findOne({
      email:email?.toLowerCase(),
    });

    if(!user)return res.status(401).json({error:"Invalid email or password."});

    const valid=await bcrypt.compare(password,user.password);

    if(!valid)return res.status(401).json({error:"Invalid email or password."});

    return res.json({
      token:token(user._id.toString()),
      user:{id:user._id,email:user.email},
    });
  }catch(error){
    console.error(error);
    return res.status(500).json({error:"Login failed."});
  }
});

router.get("/me",auth,async(req:AuthRequest,res)=>{
  const user=await User.findById(req.userId);

  if(!user)return res.status(404).json({
    error:"User not found.",
  });

  return res.json({
    id:user._id,
    email:user.email,
  });
});

export default router;
