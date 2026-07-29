import axios from "axios";

interface ZoomMeeting{
  topic:string;
  startTime:string;
  duration:number;
}

export async function createZoomMeeting(data:ZoomMeeting){
  const token=process.env.ZOOM_ACCESS_TOKEN;

  if(!token){
    throw new Error("Zoom token missing.");
  }

  const response=await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      topic:data.topic,
      type:2,
      start_time:data.startTime,
      duration:data.duration,
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

export async function getZoomRecording(meetingId:string){
  const token=process.env.ZOOM_ACCESS_TOKEN;

  if(!token){
    throw new Error("Zoom token missing.");
  }

  const response=await axios.get(
    `https://api.zoom.us/v2/meetings/${meetingId}/recordings`,
    {
      headers:{
        Authorization:`Bearer ${token}`,
      },
    }
  );

  return response.data;
}
