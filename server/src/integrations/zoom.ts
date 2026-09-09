import axios from "axios";

interface ZoomMeeting{
  topic:string;
  startTime:string;
  duration:number;
}

function getAccessToken(){
  const token=process.env.ZOOM_ACCESS_TOKEN;

  if(!token){
    throw new Error(
      "ZOOM_ACCESS_TOKEN is not configured."
    );
  }

  return token;
}

function getHeaders(){
  return{
    Authorization:`Bearer ${getAccessToken()}`,
    "Content-Type":"application/json"
  };
}

export async function createZoomMeeting(
  data:ZoomMeeting
){
  const response=await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      topic:data.topic,
      type:2,
      start_time:data.startTime,
      duration:data.duration
    },
    {
      headers:getHeaders()
    }
  );

  return response.data;
}

export async function getZoomRecording(
  meetingId:string
){
  const response=await axios.get(
    `https://api.zoom.us/v2/meetings/${meetingId}/recordings`,
    {
      headers:{
        Authorization:`Bearer ${getAccessToken()}`
      }
    }
  );

  return response.data;
}
