import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { embedText } from "@/lib/embeddings";
import { geminiChat } from "@/lib/gemini";

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

    const queryEmbedding = await embedText(question);

    const { data: matches, error } = await supabase.rpc("match_chunks", {
      query_embedding: queryEmbedding,
      match_document_id: documentId,
      match_count: 5,
    });

    if (error) throw new Error(error.message);

    if (!matches || matches.length === 0) {
      return NextResponse.json({
        answer:
          "I couldn't find any relevant content in this document to answer that.",
        sourceChunks: [],
      });
    }

    const context = matches
      .map((m: { content: string }) => m.content)
      .join("\n\n---\n\n");

    const result = await geminiChat.generateContent(
      `Answer the question using ONLY the context below. If the answer isn't in the context, say so.\n\nContext:\n${context}\n\nQuestion: ${question}`
    );

    const answer = result.response.text();

    return NextResponse.json({
      answer,
      sourceChunks: matches.map((m: { content: string }) => m.content),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Chat failed" },
      { status: 500 }
    );
  }
}