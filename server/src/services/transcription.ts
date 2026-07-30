import OpenAI from "openai";
import fs from "fs";

function getClient(){
  const apiKey=process.env.OPENAI_API_KEY;

  if(!apiKey){
    throw new Error(
      "OPENAI_API_KEY is not configured."
    );
  }

  return new OpenAI({apiKey});
}

export async function transcribeAudio(
  filePath:string
){
  const client=getClient();

  const audio=
    fs.createReadStream(filePath);

  const response=
    await client.audio.transcriptions.create({
      model:"gpt-4o-transcribe",
      file:audio,
    });

  return response.text;
}
