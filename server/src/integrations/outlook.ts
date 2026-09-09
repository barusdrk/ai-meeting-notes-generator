import axios from "axios";
import ConnectedAccount from "../models/ConnectedAccount.js";

async function getAccessToken(userId:string){
  const account=await ConnectedAccount.findOne({
    userId,
    provider:"outlook",
  });

  if(!account){
    throw new Error("Outlook account is not connected.");
  }

  if(!account.accessToken){
    throw new Error("Outlook access token is missing.");
  }

  return account.accessToken;
}

export async function sendOutlookMail(
  userId:string,
  to:string,
  subject:string,
  body:string
){
  const accessToken=await getAccessToken(userId);

  return axios.post(
    "https://graph.microsoft.com/v1.0/me/sendMail",
    {
      message:{
        subject,
        body:{
          contentType:"Text",
          content:body,
        },
        toRecipients:[
          {
            emailAddress:{
              address:to,
            },
          },
        ],
      },
    },
    {
      headers:{
        Authorization:`Bearer ${accessToken}`,
      },
    }
  );
}

export async function listOutlookMessages(
  userId:string,
  maxResults=10
){
  const accessToken=await getAccessToken(userId);

  return axios.get(
    `https://graph.microsoft.com/v1.0/me/messages?$top=${maxResults}`,
    {
      headers:{
        Authorization:`Bearer ${accessToken}`,
      },
    }
  );
}
