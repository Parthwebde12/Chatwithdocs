export interface DocumentRow {
  id: string;
  filename: string;
  uploaded_at: string;
}

export interface ChunkRow {
  id: string;
  document_id: string;
  content: string;
  chunk_index: number;
  embedding: number[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  answer: string;
  sourceChunks: string[];
}
