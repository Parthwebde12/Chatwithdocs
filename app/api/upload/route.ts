import { NextRequest, NextResponse } from "next/server";
import { parseFile } from "@/lib/parseFile";
import { assertEnv } from "@/lib/checkEnv";
import { ingestDocument } from "@/lib/ingesDocument";


const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt", "md", "csv", "xlsx", "xls", "pptx"];

export async function POST(req: NextRequest) {
  try {
    assertEnv();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const MAX_SIZE_MB = 10;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File too large. Max size is ${MAX_SIZE_MB}MB.` },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Unsupported file type. Use ${ALLOWED_EXTENSIONS.join(", ")}.` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await parseFile(buffer, file.name);
    const result = await ingestDocument(file.name, text);

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}