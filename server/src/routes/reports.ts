import { Router } from "express";

import auth,{
  type AuthRequest,
} from "../middleware/auth.js";

import organizationAuth
  from "../middleware/organizationAuth.js";

import Report
  from "../models/Report.js";

import {
  mapReport,
  exportReportPDF,
  exportReportCSV,
} from "../services/reportExport.js";

const router=Router();

router.use(auth);
router.use(organizationAuth);

router.get("/",async(req:AuthRequest,res)=>{

  const reports=
    await Report.find({
      organizationId:req.organizationId,
    }).sort({
      createdAt:-1,
    });

  res.json(reports);

});

router.get("/:id",async(req,res)=>{

  const report=
    await Report.findById(
      req.params.id
    );

  if(!report){
    return res.status(404).json({
      error:"Report not found.",
    });
  }

  res.json(report);

});

router.get("/:id/pdf",async(req:AuthRequest,res)=>{

  const report=
    await Report.findById(
      req.params.id
    );

  if(!report){
    return res.status(404).json({
      error:"Report not found.",
    });
  }

  const pdf=
    await exportReportPDF(
      mapReport(
        report,
        req.organizationId!
      )
    );

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${report.type}.pdf"`
  );

  res.send(pdf);

});

router.get("/:id/csv",async(req:AuthRequest,res)=>{

  const report=
    await Report.findById(
      req.params.id
    );

  if(!report){
    return res.status(404).json({
      error:"Report not found.",
    });
  }

  const csv=
    await exportReportCSV(
      mapReport(
        report,
        req.organizationId!
      )
    );

  res.setHeader(
    "Content-Type",
    "text/csv"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${report.type}.csv"`
  );

  res.send(csv);

});

export default router;
