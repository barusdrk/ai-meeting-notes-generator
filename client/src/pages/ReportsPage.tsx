import {useEffect,useState} from "react";
import api from "../services/api";
import ExportReportButton from "../components/ExportReportButton";

interface Report{
  _id:string;
  createdAt:string;
  data:{
    meetings:number;
    completedTasks:number;
    pendingTasks:number;
    completionRate:number;
  };
}

export default function ReportsPage(){
  const [reports,setReports]=useState<Report[]>([]);

  useEffect(()=>{
    api.get("/reports")
      .then(response=>{
        setReports(response.data);
      });
  },[]);

  return(
    <main className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900 dark:text-white">
      <h1 className="mb-8 text-4xl font-bold">
        Reports
      </h1>

      <div className="space-y-6">
        {reports.map(report=>(
          <div
            key={report._id}
            className="rounded-xl bg-white p-6 shadow dark:bg-gray-800"
          >
            <p className="mb-4">
              {new Date(
                report.createdAt
              ).toLocaleDateString()}
            </p>

            <p>
              Meetings:
              {" "}
              {report.data.meetings}
            </p>

            <p>
              Completed Tasks:
              {" "}
              {report.data.completedTasks}
            </p>

            <p>
              Completion Rate:
              {" "}
              {report.data.completionRate}%
            </p>

            <ExportReportButton
              reportId={report._id}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
