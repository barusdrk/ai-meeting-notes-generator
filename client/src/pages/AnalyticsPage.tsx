import {useEffect,useState} from "react";
import api from "../services/api";

interface Analytics{
  meetings:number;
  completedTasks:number;
  pendingTasks:number;
  reminders:number;
}

export default function AnalyticsPage(){
  const [data,setData]=useState<Analytics|null>(null);

  useEffect(()=>{
    api.get("/analytics")
      .then(response=>{
        setData(response.data);
      });
  },[]);

  if(!data){
    return <div className="p-8">Loading...</div>;
  }

  return(
    <main className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900 dark:text-white">
      <h1 className="mb-8 text-4xl font-bold">
        Analytics
      </h1>

      <div className="grid gap-6 md:grid-cols-4">
        <Metric title="Meetings" value={data.meetings}/>
        <Metric title="Completed Tasks" value={data.completedTasks}/>
        <Metric title="Pending Tasks" value={data.pendingTasks}/>
        <Metric title="Reminders" value={data.reminders}/>
      </div>
    </main>
  );
}

function Metric({
  title,
  value,
}:{
  title:string;
  value:number;
}){
  return(
    <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
      <p>{title}</p>
      <p className="text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}
