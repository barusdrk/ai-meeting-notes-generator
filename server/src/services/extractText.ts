import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export async function extractText(
  file: Express.Multer.File
): Promise<string> {
  const extension = getExtension(file.originalname);

  switch (extension) {
    case ".txt":
      return extractTxt(file);

    case ".docx":
      return extractDocx(file);

    case ".pdf":
      return extractPdf(file);

    default:
      throw new Error(
        `Unsupported file type: ${extension}`
      );
  }
}

function getExtension(
  filename: string
): string {
  const index = filename.lastIndexOf(".");

  if (index === -1) {
    return "";
  }

  return filename
    .substring(index)
    .toLowerCase();
}

async function extractTxt(
  file: Express.Multer.File
): Promise<string> {
  return file.buffer
    .toString("utf8")
    .trim();
}

async function extractDocx(
  file: Express.Multer.File
): Promise<string> {
  const result =
    await mammoth.extractRawText({
      buffer: file.buffer,
    });

  return result.value.trim();
}

async function extractPdf(
  file: Express.Multer.File
): Promise<string> {
  const parser = new PDFParse({
    data: file.buffer,
  });

  try {
    const result =
      await parser.getText();

    return result.text.trim();
  } finally {
    await parser.destroy();
  }
}
