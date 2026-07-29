import { Router } from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";

import { createNotionTask } from "../integrations/notion.js";
import { createTrelloCard } from "../integrations/trello.js";
import { createAsanaTask } from "../integrations/asana.js";
import { createJiraIssue } from "../integrations/jira.js";
import { createClickUpTask } from "../integrations/clickup.js";
import { sendSlackMessage } from "../integrations/slack.js";
import { sendTeamsMessage } from "../integrations/teams.js";

const router=Router();

router.use(auth);

router.post("/notion",async(req:AuthRequest,res)=>{
  try{
    const result=await createNotionTask(req.body);
    res.json(result);
  }catch(error){
    res.status(500).json({
      error:"Notion integration failed.",
    });
  }
});

router.post("/trello",async(req:AuthRequest,res)=>{
  try{
    const result=await createTrelloCard(req.body);
    res.json(result);
  }catch(error){
    res.status(500).json({
      error:"Trello integration failed.",
    });
  }
});

router.post("/asana",async(req:AuthRequest,res)=>{
  try{
    const result=await createAsanaTask(req.body);
    res.json(result);
  }catch(error){
    res.status(500).json({
      error:"Asana integration failed.",
    });
  }
});

router.post("/jira",async(req:AuthRequest,res)=>{
  try{
    const result=await createJiraIssue(req.body);
    res.json(result);
  }catch(error){
    res.status(500).json({
      error:"Jira integration failed.",
    });
  }
});

router.post("/clickup",async(req:AuthRequest,res)=>{
  try{
    const result=await createClickUpTask(req.body);
    res.json(result);
  }catch(error){
    res.status(500).json({
      error:"ClickUp integration failed.",
    });
  }
});

router.post("/slack",async(req:AuthRequest,res)=>{
  try{
    const result=await sendSlackMessage(req.body);
    res.json(result);
  }catch(error){
    res.status(500).json({
      error:"Slack integration failed.",
    });
  }
});

router.post("/teams",async(req:AuthRequest,res)=>{
  try{
    const result=await sendTeamsMessage(req.body);
    res.json(result);
  }catch(error){
    res.status(500).json({
      error:"Teams integration failed.",
    });
  }
});

export default router;
