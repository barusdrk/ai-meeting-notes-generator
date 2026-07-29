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

export async function exportPdf(data:ReportData):Promise<Buffer>{
  return new Promise((resolve,reject)=>{
    const doc=new PDFDocument({margin:50});
    const chunks:Buffer[]=[];
    doc.on("data",(chunk:Buffer)=>chunks.push(chunk));
    doc.on("end",()=>resolve(Buffer.concat(chunks)));
    doc.on("error",reject);

    doc.fontSize(24).text(data.title,{align:"center"});
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Organization: ${data.organization}`);
    doc.text(`Generated: ${data.generatedAt.toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(18).text("Summary");
    doc.moveDown(0.5);
    doc.fontSize(12).text(data.summary);
    doc.moveDown();

    doc.fontSize(18).text("Statistics");
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Meetings: ${data.meetings}`);
    doc.text(`Completed Tasks: ${data.completedTasks}`);
    doc.text(`Pending Tasks: ${data.pendingTasks}`);
    doc.text(`Overdue Tasks: ${data.overdueTasks}`);
    doc.text(`Completion Rate: ${data.completionRate}%`);

    doc.end();
  });
}
