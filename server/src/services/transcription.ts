import OpenAI from "openai";
import fs from "fs";

let client:OpenAI|undefined;

function getClient(){
  if(client) return client;

  const apiKey=
    process.env.OPENAI_API_KEY;

  if(!apiKey){
    throw new Error(
      "OPENAI_API_KEY is not configured."
    );
  }

  client=new OpenAI({apiKey});

  return client;
}

export async function transcribeAudio(
  filePath:string
){

  const audio=
    fs.createReadStream(filePath);

  const response=
    await getClient()
      .audio.transcriptions.create({
        model:"gpt-4o-transcribe",
        file:audio,
      });

  return response.text;
}
