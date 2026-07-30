import nodemailer from "nodemailer";

function getTransporter(){
  if(
    !process.env.EMAIL_HOST||
    !process.env.EMAIL_PORT||
    !process.env.EMAIL_USER||
    !process.env.EMAIL_PASSWORD
  ){
    throw new Error(
      "Email configuration is not complete."
    );
  }

  return nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:Number(process.env.EMAIL_PORT),
    auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASSWORD,
    },
  });
}

export async function sendMeetingEmail(
  to:string,
  subject:string,
  content:string
){
  const transporter=getTransporter();

  return transporter.sendMail({
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
