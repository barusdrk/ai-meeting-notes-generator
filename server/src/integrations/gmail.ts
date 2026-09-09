import {google} from "googleapis";
import ConnectedAccount from "../models/ConnectedAccount.js";

async function getOAuthClient(userId:string){
  const account=await ConnectedAccount.findOne({
    userId,
    provider:"gmail",
  });

  if(!account){
    throw new Error("Gmail account is not connected.");
  }

  if(!account.refreshToken){
    throw new Error("Gmail refresh token is missing.");
  }

  const{
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
  }=process.env;

  if(!GOOGLE_CLIENT_ID||!GOOGLE_CLIENT_SECRET||!GOOGLE_REDIRECT_URI){
    throw new Error("Google OAuth is not configured.");
  }

  const client=new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  client.setCredentials({
    access_token:account.accessToken,
    refresh_token:account.refreshToken,
    expiry_date:account.expiresAt?.getTime(),
  });

  return client;
}

export async function sendGmail(
  userId:string,
  to:string,
  subject:string,
  text:string
){
  const gmail=google.gmail({
    version:"v1",
    auth:await getOAuthClient(userId),
  });

  const raw=Buffer.from(
    `To: ${to}\r\n`+
    `Subject: ${subject}\r\n`+
    `Content-Type: text/plain; charset=utf-8\r\n`+
    `\r\n${text}`
  ).toString("base64url");

  return gmail.users.messages.send({
    userId:"me",
    requestBody:{raw},
  });
}

export async function listGmailMessages(
  userId:string,
  maxResults=10
){
  const gmail=google.gmail({
    version:"v1",
    auth:await getOAuthClient(userId),
  });

  return gmail.users.messages.list({
    userId:"me",
    maxResults,
  });
}
