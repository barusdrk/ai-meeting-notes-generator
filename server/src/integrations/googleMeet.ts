import axios from "axios";

interface GoogleMeeting{
  title:string;
  startTime:string;
  endTime:string;
}

function getAccessToken(){
  const token=process.env.GOOGLE_ACCESS_TOKEN;

  if(!token){
    throw new Error(
      "GOOGLE_ACCESS_TOKEN is not configured."
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

export async function createGoogleMeet(
  data:GoogleMeeting
){
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
      headers:getHeaders(),
    }
  );

  return response.data;
}
