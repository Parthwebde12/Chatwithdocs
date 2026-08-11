import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { embedText } from "@/lib/embeddings";
import { geminiChat } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { documentId, question } = await req.json();

    console.log("1. Request received:", {
      documentId,
      question,
    });

    if (!documentId || !question) {
      return NextResponse.json(
        { error: "documentId and question are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    // STEP 1 — Embedding
    console.log("2. Creating query embedding...");

    const queryEmbedding = await embedText(question);

    console.log(
      "3. Embedding created:",
      queryEmbedding.length,
      "dimensions"
    );

    // STEP 2 — Vector search
    console.log("4. Searching Supabase...");

    const { data: matches, error } = await supabase.rpc("match_chunks", {
      query_embedding: queryEmbedding,
      match_document_id: documentId,
      match_count: 5,
    });

    if (error) {
      console.error("SUPABASE RPC ERROR:", error);
      throw new Error(error.message);
    }

    console.log(
      "5. Supabase matches:",
      matches?.length ?? 0
    );

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

    console.log("6. Context length:", context.length);

    // STEP 3 — Gemini chat
    console.log("7. Sending context to Gemini...");

    const result = await geminiChat.generateContent(
  `You are a helpful assistant that answers questions about an uploaded document.

The user is asking about the document provided in the context below.

Important instructions:
- Treat "it", "this", "this document", "the document", and similar references as referring to the uploaded document.
- If the user asks a broad question such as "What is in it?", give a concise summary of what the document contains.
- Answer using ONLY the provided context.
- Do not invent information that is not present in the context.
- If the requested information is not present in the context, clearly say that it is not available.

Document context:
${context}

User question:
${question}

Answer:`
);

    console.log("8. Gemini response received");

    const answer = result.response.text();

    return NextResponse.json({
      answer,
      sourceChunks: matches.map(
        (m: { content: string }) => m.content
      ),
    });
  } catch (err) {
    console.error("CHAT API ERROR:", err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Chat failed",
      },
      { status: 500 }
    );
  }
}