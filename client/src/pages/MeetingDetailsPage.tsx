import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

interface Meeting{
  title:string;
  summary:string[];
  decisions:string[];
  actionItems:string[];
}

export default function MeetingDetailsPage(){
  const {id}=useParams();

  const [meeting,setMeeting]=useState<Meeting|null>(null);

  useEffect(()=>{
    async function load(){
      if(!id)return;

      const response=
        await api.get(`/meetings/${id}`);

      setMeeting(response.data);
    }

    load();
  },[id]);

  if(!meeting){
    return(
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return(
    <main className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900 dark:text-white">
      <h1 className="mb-8 text-4xl font-bold">
        {meeting.title}
      </h1>

      <section className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-3 text-2xl font-bold">
          Summary
        </h2>

        <ul className="list-disc pl-6">
          {meeting.summary.map((item)=>(
            <li key={item}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-3 text-2xl font-bold">
          Decisions
        </h2>

        <ul className="list-disc pl-6">
          {meeting.decisions.map((item)=>(
            <li key={item}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-3 text-2xl font-bold">
          Action Items
        </h2>

        <ul className="list-disc pl-6">
          {meeting.actionItems.map((item)=>(
            <li key={item}>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
