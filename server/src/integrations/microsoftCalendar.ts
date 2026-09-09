import axios from "axios";

function getAccessToken(){
  const token=process.env.MICROSOFT_ACCESS_TOKEN;

  if(!token){
    throw new Error("MICROSOFT_ACCESS_TOKEN is not configured.");
  }

  return token;
}

export async function createMicrosoftCalendarEvent(
  subject:string,
  start:string,
  end:string
){
  return axios.post(
    "https://graph.microsoft.com/v1.0/me/events",
    {
      subject,
      start:{
        dateTime:start,
        timeZone:"UTC"
      },
      end:{
        dateTime:end,
        timeZone:"UTC"
      },
      isOnlineMeeting:true,
      onlineMeetingProvider:"teamsForBusiness"
    },
    {
      headers:{
        Authorization:`Bearer ${getAccessToken()}`,
        "Content-Type":"application/json"
      }
    }
  );
}
