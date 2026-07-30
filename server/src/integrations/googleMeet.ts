import axios from "axios";

interface GoogleMeeting{
  title:string;
  startTime:string;
  endTime:string;
}

function getAccessToken(){
  const token=
    process.env.GOOGLE_ACCESS_TOKEN;

  if(!token){
    throw new Error(
      "GOOGLE_ACCESS_TOKEN is not configured."
    );
  }

  return token;
}

export async function createGoogleMeet(
  data:GoogleMeeting
){
  const token=getAccessToken();

  const response=await axios.post(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      summary:data.title,
      start:{
        dateTime:data.startTime,
      },
      end:{
        dateTime:data.endTime,
      },
      conferenceData:{
        createRequest:{
          requestId:`meet-${Date.now()}`,
          conferenceSolutionKey:{
            type:"hangoutsMeet",
          },
        },
      },
    },
    {
      params:{
        conferenceDataVersion:1,
      },
      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"application/json",
      },
    }
  );

  return response.data;
}
