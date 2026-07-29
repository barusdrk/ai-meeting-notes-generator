import axios from "axios";

interface TeamsMessage{
  title:string;
  message:string;
}

export async function sendTeamsMessage(
  data:TeamsMessage
){
  const webhook=
    process.env.TEAMS_WEBHOOK_URL;

  if(!webhook){
    throw new Error("Teams webhook missing.");
  }

  const response=await axios.post(
    webhook,
    {
      "@type":"MessageCard",
      "@context":"http://schema.org/extensions",
      summary:data.title,
      title:data.title,
      text:data.message,
    }
  );

  return response.data;
}

export async function sendMeetingSummaryToTeams(
  summary:string[]
){
  return sendTeamsMessage({
    title:"AI Meeting Summary",
    message:summary.join("\n"),
  });
}
