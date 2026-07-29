import mammoth from "mammoth";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export async function extractText(
  file:Express.Multer.File
):Promise<string>{

  const type=file.mimetype;

  if(type==="text/plain"){
    return file.buffer.toString("utf-8");
  }

  if(
    type==="application/pdf"
  ){
    const result=await pdfParse(file.buffer);
    return result.text;
  }

  if(
    type==="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ){
    const result=
      await mammoth.extractRawText({
        buffer:file.buffer,
      });

    return result.value;
  }

  throw new Error(
    "Unsupported file type."
  );
}
