import OpenAI from "openai";
import fs from "fs";

const client=new OpenAI({
  apiKey:process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(
  filePath:string
){

  const audio=
    fs.createReadStream(filePath);

  const response=
    await client.audio.transcriptions.create({
      model:"whisper-1",
      file:audio,
    });

  return response.text;
}
