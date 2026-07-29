import {useEffect,useState} from "react";
import api from "../services/api";

interface Member{
  userId:string;
  role:string;
}

export default function TeamManagement(){
  const [members,setMembers]=useState<Member[]>([]);
  const [email,setEmail]=useState("");

  async function load(){
    const response=
      await api.get("/members");

    setMembers(response.data);
  }

  useEffect(()=>{
    load();
  },[]);


  async function addMember(){
    await api.post("/members",{
      email,
      role:"member",
    });

    setEmail("");
    load();
  }

  return(
    <main className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900 dark:text-white">
      <h1 className="mb-8 text-4xl font-bold">
        Team Management
      </h1>

      <div className="mb-6 flex gap-3">
        <input
          value={email}
          onChange={e=>setEmail(e.target.value)}
          placeholder="Member email"
          className="rounded border p-3 dark:bg-gray-800"
        />

        <button
          onClick={addMember}
          className="rounded bg-blue-600 px-5 text-white"
        >
          Add
        </button>
      </div>

      <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        {members.map(member=>(
          <div
            key={member.userId}
            className="border-b py-3"
          >
            {member.userId} -
            {member.role}
          </div>
        ))}
      </div>
    </main>
  );
}
