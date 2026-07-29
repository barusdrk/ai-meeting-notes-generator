import { useEffect,useState } from "react";
import api from "../services/api";

interface Stats{
  meetings:number;
  tasks:number;
  reminders:number;
}

export default function DashboardPage(){
  const [stats,setStats]=useState<Stats>({
    meetings:0,
    tasks:0,
    reminders:0,
  });

  useEffect(()=>{
    async function load(){
      try{
        const [
          meetings,
          tasks,
          reminders,
        ]=await Promise.all([
          api.get("/meetings"),
          api.get("/tasks"),
          api.get("/reminders"),
        ]);

        setStats({
          meetings:meetings.data.length,
          tasks:tasks.data.length,
          reminders:reminders.data.length,
        });
      }catch(error){
        console.error(error);
      }
    }

    load();
  },[]);

  return(
    <main className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900 dark:text-white">
      <h1 className="mb-8 text-4xl font-bold">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="text-lg">
            Meetings
          </h2>
          <p className="text-4xl font-bold">
            {stats.meetings}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="text-lg">
            Tasks
          </h2>
          <p className="text-4xl font-bold">
            {stats.tasks}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="text-lg">
            Reminders
          </h2>
          <p className="text-4xl font-bold">
            {stats.reminders}
          </p>
        </div>
      </div>
    </main>
  );
}
