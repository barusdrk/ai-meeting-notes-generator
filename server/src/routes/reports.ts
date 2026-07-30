import {Router} from "express";
import auth,{type AuthRequest} from "../middleware/auth.js";
import organizationAuth from "../middleware/organizationAuth.js";
import Report from "../models/Report.js";
import {mapReport,exportReportPDF,exportReportCSV} from "../services/reportExport.js";

const router=Router();

router.use(auth);
router.use(organizationAuth);

router.get("/",async(req:AuthRequest,res)=>{
  const reports=await Report.find({organizationId:req.organizationId}).sort({createdAt:-1});
  res.json(reports);
});

router.get("/:id/pdf",async(req:AuthRequest,res)=>{
  try{
    const report=await Report.findById(req.params.id);
    if(!report){
      return res.status(404).json({error:"Report not found."});
    }

    const pdf=await exportReportPDF(
      mapReport(
        report,
        req.organizationId!.toString()
      )
    );

    res.setHeader("Content-Type","application/pdf");
    res.setHeader("Content-Disposition",`attachment; filename="${report.type}-report.pdf"`);
    res.send(pdf);
  }catch{
    res.status(500).json({error:"PDF export failed."});
  }
});

router.get("/:id/csv",async(req:AuthRequest,res)=>{
  try{
    const report=await Report.findById(req.params.id);
    if(!report){
      return res.status(404).json({error:"Report not found."});
    }

    const csv=await exportReportCSV(
      mapReport(
        report,
        req.organizationId!.toString()
      )
    );

    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition",`attachment; filename="${report.type}-report.csv"`);
    res.send(csv);
  }catch{
    res.status(500).json({error:"CSV export failed."});
  }
});

export default router;
