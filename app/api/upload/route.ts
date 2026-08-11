import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { parseFile } from "@/lib/parseFile";
import { chunkText } from "@/lib/chunkText";
import { embedBatch } from "@/lib/embeddings";
import { assertEnv } from "@/lib/checkEnv";

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

    const allowedExtensions = ["pdf", "docx", "txt"];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use PDF, DOCX, or TXT." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await parseFile(buffer, file.name);

    const supabase = getSupabaseServerClient();

    const { data: doc, error: docError } = await supabase
      .from("documents")
      .insert({ filename: file.name })
      .select()
      .single();

    if (docError || !doc) {
      throw new Error(docError?.message ?? "Failed to create document");
    }

    const chunks = chunkText(text);
    const embeddings = await embedBatch(chunks);

    const rows = chunks.map((content, i) => ({
      document_id: doc.id,
      content,
      chunk_index: i,
      embedding: embeddings[i],
    }));

    const { error: chunkError } = await supabase.from("chunks").insert(rows);

    if (chunkError) {
      throw new Error(chunkError.message);
    }

    return NextResponse.json({ documentId: doc.id, chunkCount: rows.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}