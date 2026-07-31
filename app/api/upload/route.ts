import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { parseFile } from "@/lib/parseFile";
import { chunkText } from "@/lib/chunkText";
import { embedBatch } from "@/lib/embeddings";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await parseFile(buffer, file.name);

    const supabase = getSupabaseServerClient();

    // 1. Create the document record
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .insert({ filename: file.name })
      .select()
      .single();

    if (docError || !doc) {
      throw new Error(docError?.message ?? "Failed to create document");
    }

    // 2. Chunk the text
    const chunks = chunkText(text);

    // 3. Generate embeddings for all chunks in one batch call
    const embeddings = await embedBatch(chunks);

    // 4. Insert chunks with their embeddings
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
