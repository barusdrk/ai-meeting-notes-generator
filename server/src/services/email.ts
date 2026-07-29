import nodemailer from "nodemailer";

const transporter=
  nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:Number(
      process.env.EMAIL_PORT
    ),
    auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASSWORD,
    },
  });

export async function sendMeetingEmail(
  to:string,
  subject:string,
  content:string
){

  return transporter.sendMail({
    from:
      process.env.EMAIL_USER,
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
