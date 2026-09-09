import {google} from "googleapis";

function getOAuthClient(){
  const client=new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  client.setCredentials({
    access_token:process.env.GOOGLE_ACCESS_TOKEN,
    refresh_token:process.env.GOOGLE_REFRESH_TOKEN
  });

  return client;
}

export async function createGoogleCalendarEvent(
  summary:string,
  start:string,
  end:string
){
  const calendar=google.calendar({
    version:"v3",
    auth:getOAuthClient()
  });

  return calendar.events.insert({
    calendarId:"primary",
    conferenceDataVersion:1,
    requestBody:{
      summary,
      start:{dateTime:start},
      end:{dateTime:end},
      conferenceData:{
        createRequest:{
          requestId:`meet-${Date.now()}`,
          conferenceSolutionKey:{
            type:"hangoutsMeet"
          }
        }
      }
    }
  });
}
