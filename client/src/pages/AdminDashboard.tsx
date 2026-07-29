import {useEffect,useState} from "react";
import api from "../services/api";

interface Stats{
  users:number;
  meetings:number;
  tasks:number;
}

export default function AdminDashboard(){
  const [stats,setStats]=useState<Stats>({
    users:0,
    meetings:0,
    tasks:0,
  });

  useEffect(()=>{
    async function load(){
      const response=
        await api.get("/analytics/admin");

      setStats(response.data);
    }

    load();
  },[]);

  return(
    <main className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900 dark:text-white">
      <h1 className="mb-8 text-4xl font-bold">
        Admin Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
          Users
          <p className="text-4xl font-bold">
            {stats.users}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
          Meetings
          <p className="text-4xl font-bold">
            {stats.meetings}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
          Tasks
          <p className="text-4xl font-bold">
            {stats.tasks}
          </p>
        </div>
      </div>
    </main>
  );
}
