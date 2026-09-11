import mammoth from "mammoth";
import JSZip from "jszip";
import * as XLSX from "xlsx";

export async function parseFile(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const result = await pdfParse(buffer);
    return result.text;
  }

  if (ext === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (ext === "txt" || ext === "md") {
    return buffer.toString("utf-8");
  }

  if (ext === "csv" || ext === "xlsx" || ext === "xls") {
    return parseSpreadsheet(buffer);
  }

  if (ext === "pptx") {
    return parsePptx(buffer);
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

function parseSpreadsheet(buffer: Buffer): string {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sections: string[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    sections.push(rowsToText(rows, sheetName));
  }

  return sections.join("\n\n");
}

function rowsToText(rows: any[][], sheetName: string): string {
  if (rows.length === 0) return `Sheet: ${sheetName}\n(empty)`;

  const header = rows[0];
  const lines = [`Sheet: ${sheetName}`];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every((cell) => cell === undefined || cell === "")) continue;

    const pairs = header.map(
      (col, idx) => `${col ?? `col${idx}`}: ${row[idx] ?? ""}`
    );
    lines.push(pairs.join(", "));
  }

  return lines.join("\n");
}

async function parsePptx(buffer: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);

  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] ?? "0", 10);
      const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] ?? "0", 10);
      return numA - numB;
    });

  const slideTexts: string[] = [];

  for (const [index, path] of slideFiles.entries()) {
    const xml = await zip.files[path].async("text");
    slideTexts.push(`Slide ${index + 1}:\n${extractTextFromSlideXml(xml)}`);
  }

  return slideTexts.join("\n\n");
}

function extractTextFromSlideXml(xml: string): string {
  // <a:t> tags hold the visible text runs in a PowerPoint slide's XML
  const matches = [...xml.matchAll(/<a:t>(.*?)<\/a:t>/g)];
  return matches
    .map((m) => decodeXmlEntities(m[1]))
    .filter((t) => t.trim().length > 0)
    .join(" ");
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}