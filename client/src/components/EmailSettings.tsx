import { useState } from "react";
import api from "../services/api";

export default function EmailSettings(){
  const [email,setEmail]=useState("");
  const [message,setMessage]=useState("");

  async function save(){
    try{
      await api.post("/email/settings",{email});
      setMessage("Email settings saved.");
    }catch{
      setMessage("Unable to save settings.");
    }
  }

  return(
    <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-bold">
        Email Settings
      </h2>

      <input
        type="email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
        placeholder="Email address"
        className="mb-4 w-full rounded border p-3 dark:bg-gray-900"
      />

      <button
        onClick={save}
        className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
      >
        Save
      </button>

      {message&&(
        <p className="mt-3">
          {message}
        </p>
      )}
    </div>
  );
}
