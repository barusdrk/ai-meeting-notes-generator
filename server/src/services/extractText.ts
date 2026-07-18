import fs from "node:fs/promises";
import path from "node:path";

import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export async function extractText(
  filePath: string,
  originalName: string
): Promise<string> {
  const extension = path.extname(originalName).toLowerCase();

  switch (extension) {
    case ".txt":
      return readTextFile(filePath);

    case ".docx":
      return readDocxFile(filePath);

    case ".pdf":
      return readPdfFile(filePath);

    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

async function readTextFile(
  filePath: string
): Promise<string> {
  return fs.readFile(filePath, "utf8");
}

async function readDocxFile(
  filePath: string
): Promise<string> {
  const result = await mammoth.extractRawText({
    path: filePath,
  });

  return result.value.trim();
}

async function readPdfFile(
  filePath: string
): Promise<string> {
  const parser = new PDFParse({
    data: await fs.readFile(filePath),
  });

  const result = await parser.getText();

  await parser.destroy();

  return result.text.trim();
}
