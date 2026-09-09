import nodemailer from "nodemailer";

let transporter:
  nodemailer.Transporter|undefined;

function getTransporter(){

  if(transporter){
    return transporter;
  }

  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASSWORD,
  }=process.env;

  if(
    !EMAIL_HOST||
    !EMAIL_PORT||
    !EMAIL_USER||
    !EMAIL_PASSWORD
  ){
    throw new Error(
      "Email configuration is incomplete."
    );
  }

  transporter=
    nodemailer.createTransport({
      host:EMAIL_HOST,
      port:Number(EMAIL_PORT),
      auth:{
        user:EMAIL_USER,
        pass:EMAIL_PASSWORD,
      },
    });

  return transporter;
}

export async function sendMeetingEmail(
  to:string,
  subject:string,
  content:string
){

  return getTransporter().sendMail({
    from:process.env.EMAIL_USER,
    to,
    subject,
    text:content,
  });
}

export async function sendSummaryEmail(
  email:string,
  summary:string[]
){

  return sendMeetingEmail(
    email,
    "Meeting Summary",
    summary.join("\n")
  );
}
