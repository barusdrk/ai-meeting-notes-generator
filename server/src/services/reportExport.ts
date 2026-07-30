import PDFDocument from "pdfkit";
import { Buffer } from "node:buffer";

export interface ReportData{
  title:string;
  organization:string;
  generatedAt:Date;
  summary:string;
  meetings:number;
  completedTasks:number;
  pendingTasks:number;
  overdueTasks:number;
  completionRate:number;
}

export function mapReport(report:any,organization:string):ReportData{
  return{
    title:`${report.type} Report`,
    organization,
    generatedAt:report.createdAt ?? new Date(),
    summary:report.summary ?? "Meeting analytics report.",
    meetings:report.data?.meetings ?? 0,
    completedTasks:report.data?.completedTasks ?? 0,
    pendingTasks:(report.data?.tasks ?? 0)-(report.data?.completedTasks ?? 0),
    overdueTasks:report.data?.overdueTasks ?? 0,
    completionRate:report.data?.completionRate ?? 0,
  };
}

export async function exportReportPDF(data:ReportData):Promise<Buffer>{
  return new Promise((resolve,reject)=>{
    const doc=new PDFDocument({margin:50});
    const chunks:Buffer[]=[];
    doc.on("data",(c:Buffer)=>chunks.push(c));
    doc.on("end",()=>resolve(Buffer.concat(chunks)));
    doc.on("error",reject);

    doc.fontSize(24).text(data.title,{align:"center"});
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Organization: ${data.organization}`);
    doc.text(`Generated: ${data.generatedAt.toLocaleString()}`);
    doc.moveDown();
    doc.fontSize(18).text("Summary");
    doc.moveDown(.5);
    doc.fontSize(12).text(data.summary);
    doc.moveDown();
    doc.fontSize(18).text("Statistics");
    doc.moveDown(.5);
    doc.fontSize(12);
    doc.text(`Meetings: ${data.meetings}`);
    doc.text(`Completed Tasks: ${data.completedTasks}`);
    doc.text(`Pending Tasks: ${data.pendingTasks}`);
    doc.text(`Overdue Tasks: ${data.overdueTasks}`);
    doc.text(`Completion Rate: ${data.completionRate}%`);
    doc.end();
  });
}

export async function exportReportCSV(data:ReportData):Promise<string>{
  return[
    "Metric,Value",
    `Organization,${data.organization}`,
    `Generated,${data.generatedAt.toISOString()}`,
    `Meetings,${data.meetings}`,
    `Completed Tasks,${data.completedTasks}`,
    `Pending Tasks,${data.pendingTasks}`,
    `Overdue Tasks,${data.overdueTasks}`,
    `Completion Rate,${data.completionRate}%`
  ].join("\n");
}
