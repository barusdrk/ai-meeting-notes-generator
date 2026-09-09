import {Router} from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/auth.js";

const router=Router();

router.post(
  "/register",
  async (
    req,
    res
  )=>{
    try{
      const result=
        await registerUser(req.body);

      res.status(201).json(result);
    }catch(error:any){
      res.status(400).json({
        error:error.message,
      });
    }
  }
);

router.post(
  "/login",
  async (
    req,
    res
  )=>{
    try{
      const result=
        await loginUser(req.body);

      res.json(result);
    }catch(error:any){
      res.status(401).json({
        error:error.message,
      });
    }
  }
);

router.get(
  "/me",
  auth,
  async (
    req:AuthRequest,
    res
  )=>{
    try{
      if(!req.userId){
        return res.status(401).json({
          error:"Authentication required.",
        });
      }

      const user=
        await getCurrentUser(
          req.userId
        );

      res.json(user);
    }catch(error:any){
      res.status(404).json({
        error:error.message,
      });
    }
  }
);

export default router;
