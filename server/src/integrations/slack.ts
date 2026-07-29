import axios from "axios";

interface SlackMessage{
  text:string;
  channel?:string;
}

export async function sendSlackMessage(message:SlackMessage){
  const webhook=
    process.env.SLACK_WEBHOOK_URL;

  if(!webhook){
    throw new Error("Slack webhook missing.");
  }

  const response=await axios.post(
    webhook,
    {
      text:message.text,
    }
  );

  return response.data;
}

export async function sendMeetingSummaryToSlack(
  summary:string[]
){
  return sendSlackMessage({
    text:
      `AI Meeting Summary:\n\n${summary.join("\n")}`,
  });
}
