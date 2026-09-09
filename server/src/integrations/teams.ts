import axios from "axios";

interface TeamsMessage{
  title:string;
  message:string;
}

function getWebhook(){
  const webhook=process.env.TEAMS_WEBHOOK_URL;

  if(!webhook){
    throw new Error(
      "TEAMS_WEBHOOK_URL is not configured."
    );
  }

  return webhook;
}

export async function sendTeamsMessage(
  data:TeamsMessage
){
  const response=await axios.post(
    getWebhook(),
    {
      "@type":"MessageCard",
      "@context":"http://schema.org/extensions",
      summary:data.title,
      title:data.title,
      text:data.message
    }
  );

  return response.data;
}

export async function sendMeetingSummaryToTeams(
  summary:string[]
){
  return sendTeamsMessage({
    title:"AI Meeting Summary",
    message:summary.join("\n")
  });
}
