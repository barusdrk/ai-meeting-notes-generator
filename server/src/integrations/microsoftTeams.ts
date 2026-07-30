import axios from "axios";

interface TeamsMeeting{
  subject:string;
  startTime:string;
  endTime:string;
}

function getAccessToken(){
  const token=
    process.env.MICROSOFT_ACCESS_TOKEN;

  if(!token){
    throw new Error(
      "MICROSOFT_ACCESS_TOKEN is not configured."
    );
  }

  return token;
}

export async function createTeamsMeeting(
  data:TeamsMeeting
){
  const token=getAccessToken();

  const response=await axios.post(
    "https://graph.microsoft.com/v1.0/me/onlineMeetings",
    {
      subject:data.subject,
      startDateTime:data.startTime,
      endDateTime:data.endTime,
    },
    {
      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"application/json",
      },
    }
  );

  return response.data;
}
