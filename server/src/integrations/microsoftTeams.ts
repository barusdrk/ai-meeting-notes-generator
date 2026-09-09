import axios from "axios";

interface TeamsMeeting{
  subject:string;
  startTime:string;
  endTime:string;
}

function getAccessToken(){
  const token=process.env.MICROSOFT_ACCESS_TOKEN;

  if(!token){
    throw new Error(
      "MICROSOFT_ACCESS_TOKEN is not configured."
    );
  }

  return token;
}

function getHeaders(){
  return{
    Authorization:`Bearer ${getAccessToken()}`,
    "Content-Type":"application/json",
  };
}

export async function createTeamsMeeting(
  data:TeamsMeeting
){
  const response=await axios.post(
    "https://graph.microsoft.com/v1.0/me/onlineMeetings",
    {
      subject:data.subject,
      startDateTime:data.startTime,
      endDateTime:data.endTime,
    },
    {
      headers:getHeaders(),
    }
  );

  return response.data;
}

export async function getTeamsMeeting(
  meetingId:string
){
  const response=await axios.get(
    `https://graph.microsoft.com/v1.0/me/onlineMeetings/${meetingId}`,
    {
      headers:{
        Authorization:`Bearer ${getAccessToken()}`,
      },
    }
  );

  return response.data;
}
