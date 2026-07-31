import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { embedText } from "@/lib/embeddings";
import { anthropic } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const { documentId, question } = await req.json();

    if (!documentId || !question) {
      return NextResponse.json(
        { error: "documentId and question are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    // 1. Embed the question
    const queryEmbedding = await embedText(question);

    // 2. Find the most relevant chunks via the match_chunks SQL function
    const { data: matches, error } = await supabase.rpc("match_chunks", {
      query_embedding: queryEmbedding,
      match_document_id: documentId,
      match_count: 5,
    });

    if (error) throw new Error(error.message);

    const context = (matches ?? [])
      .map((m: { content: string }) => m.content)
      .join("\n\n---\n\n");

    // 3. Ask Claude, grounded in the retrieved chunks
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Answer the question using ONLY the context below. If the answer isn't in the context, say so.\n\nContext:\n${context}\n\nQuestion: ${question}`,
        },
      ],
    });

    const answer =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({
      answer,
      sourceChunks: (matches ?? []).map((m: { content: string }) => m.content),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Chat failed" },
      { status: 500 }
    );
  }
}
