import {Router} from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import organizationAuth from "../middleware/organizationAuth.js";
import Report from "../models/Report.js";
import {exportReportPDF,exportReportCSV} from "../services/reportExport.js";

const router=Router();

router.use(auth);
router.use(organizationAuth);

router.get("/",async(req:AuthRequest,res)=>{
  const reports=await Report.find({
    organizationId:req.organizationId,
  }).sort({
    createdAt:-1,
  });

  res.json(reports);
});

router.get("/:id/pdf",async(req,res)=>{
  try{
    const report=await Report.findById(req.params.id);

    if(!report){
      return res.status(404).json({
        error:"Report not found.",
      });
    }

    const buffer=await exportReportPDF(report);

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.send(buffer);
  }catch(error){
    res.status(500).json({
      error:"PDF export failed.",
    });
  }
});

router.get("/:id/csv",async(req,res)=>{
  try{
    const report=await Report.findById(req.params.id);

    if(!report){
      return res.status(404).json({
        error:"Report not found.",
      });
    }

    const csv=await exportReportCSV(report);

    res.setHeader(
      "Content-Type",
      "text/csv"
    );

    res.send(csv);
  }catch(error){
    res.status(500).json({
      error:"CSV export failed.",
    });
  }
});

export default router;
