import { useEffect,useState } from "react";
import api from "../services/api";

interface Reminder{
  _id:string;
  title:string;
  message:string;
  remindAt:string;
}

export default function ReminderList(){
  const [reminders,setReminders]=useState<Reminder[]>([]);

  useEffect(()=>{
    async function load(){
      const response=await api.get("/reminders");
      setReminders(response.data);
    }
    load();
  },[]);

  return(
    <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-bold">
        Reminders
      </h2>

      <div className="space-y-3">
        {reminders.map(reminder=>(
          <div key={reminder._id} className="rounded-lg border p-3 dark:border-gray-600">
            <h3 className="font-bold">
              {reminder.title}
            </h3>
            <p>{reminder.message}</p>
            <p className="text-sm text-gray-500">
              {new Date(reminder.remindAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
