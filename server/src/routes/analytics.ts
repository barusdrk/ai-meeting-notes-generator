import {Router} from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import organizationAuth from "../middleware/organizationAuth.js";

import {getMeetingAnalytics} from "../analytics/meetings.js";
import {getProductivityAnalytics} from "../analytics/productivity.js";
import {generateOrganizationReport} from "../analytics/reports.js";

import Report from "../models/Report.js";

const router=Router();

router.use(auth);
router.use(organizationAuth);


router.get("/",async(req:AuthRequest,res)=>{
  try{
    const [
      meetings,
      productivity,
    ]=await Promise.all([
      getMeetingAnalytics(
        req.organizationId!
      ),
      getProductivityAnalytics(
        req.organizationId!
      ),
    ]);

    res.json({
      meetings,
      productivity,
    });
  }catch(error){
    res.status(500).json({
      error:"Analytics loading failed.",
    });
  }
});


router.get("/report",async(req:AuthRequest,res)=>{
  try{
    const reportData=
      await generateOrganizationReport(
        req.organizationId!
      );

    const report=
      await Report.create({
        organizationId:
          req.organizationId,
        data:{
          users:reportData.users,
          teams:reportData.teams,
          meetings:
            reportData.meetings.totalMeetings,
          completedTasks:
            reportData.productivity.completedTasks,
          pendingTasks:
            reportData.productivity.pendingTasks,
          overdueTasks:
            reportData.productivity.overdueTasks,
          completionRate:
            reportData.productivity.completionRate,
        },
        generatedBy:req.userId,
      });

    res.json(report);
  }catch(error){
    res.status(500).json({
      error:"Report generation failed.",
    });
  }
});


router.get("/reports",async(req:AuthRequest,res)=>{
  const reports=
    await Report.find({
      organizationId:req.organizationId,
    }).sort({
      createdAt:-1,
    });

  res.json(reports);
});


export default router;
