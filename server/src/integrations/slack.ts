import axios from "axios";

interface SlackMessage{
  text:string;
  channel?:string;
}

function getWebhook(){
  const webhook=
    process.env.SLACK_WEBHOOK_URL;

  if(!webhook){
    throw new Error(
      "SLACK_WEBHOOK_URL is not configured."
    );
  }

  return webhook;
}

export async function sendSlackMessage(
  message:SlackMessage
){
  const webhook=getWebhook();

  const response=await axios.post(
    webhook,
    {
      text:message.text,
      ...(message.channel&&{
        channel:message.channel,
      }),
    }
  );

  return response.data;
}

export async function sendMeetingSummaryToSlack(
  summary:string[]
){
  return sendSlackMessage({
    text:`AI Meeting Summary\n\n${summary.join("\n")}`,
  });
}
