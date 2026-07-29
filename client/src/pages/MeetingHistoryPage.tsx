import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

interface Meeting{
  _id:string;
  title:string;
  createdAt:string;
}

export default function MeetingHistoryPage(){
  const [meetings,setMeetings]=useState<Meeting[]>([]);

  useEffect(()=>{
    async function load(){
      const response=await api.get("/meetings");
      setMeetings(response.data);
    }

    load();
  },[]);

  return(
    <main className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900 dark:text-white">
      <h1 className="mb-8 text-4xl font-bold">
        Meeting History
      </h1>

      <div className="space-y-4">
        {meetings.map((meeting)=>(
          <Link
            key={meeting._id}
            to={`/meetings/${meeting._id}`}
            className="block rounded-xl bg-white p-5 shadow transition hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <h2 className="text-xl font-bold">
              {meeting.title}
            </h2>

            <p className="text-gray-500 dark:text-gray-300">
              {new Date(
                meeting.createdAt
              ).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
