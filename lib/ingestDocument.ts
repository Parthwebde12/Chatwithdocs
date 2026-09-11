import { getSupabaseServerClient } from "./supabase";
import { chunkText } from "./chunkText";
import { embedBatch } from "./embeddings";

export async function ingestDocument(filename: string, text: string) {
  if (!text || text.trim().length === 0) {
    throw new Error("No extractable text found in this document");
  }

  const supabase = getSupabaseServerClient();

  const { data: doc, error: docError } = await supabase
    .from("documents")
    .insert({ filename })
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

  return { documentId: doc.id, chunkCount: rows.length };
}