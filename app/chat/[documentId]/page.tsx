"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import type { ChatMessage } from "@/lib/types";

export default function ChatPage() {
  const { documentId } = useParams();
  const [messages, setMessages] = useState<(ChatMessage & { sources?: string[] })[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, question: userMessage.content }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, sources: data.sourceChunks },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong answering that." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6 flex flex-col h-screen">
      <p className="font-mono text-xs tracking-widest text-accent uppercase mb-1">
        Reading
      </p>
      <h1 className="font-display text-2xl font-semibold mb-6">Ask a question</h1>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((m, i) => (
          <div key={i}>
            <div
              className={`p-3 rounded-md max-w-[85%] text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-ink text-paper ml-auto"
                  : "bg-paper-raised border border-line text-ink"
              }`}
            >
              {m.content}
            </div>

            {m.sources && m.sources.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {m.sources.map((s, idx) => (
                  <details
                    key={idx}
                    className="bg-accent-soft border border-accent/30 rounded-sm px-2 py-1 text-xs font-mono text-ink-soft max-w-[220px]"
                  >
                    <summary className="cursor-pointer text-accent">
                      source {idx + 1}
                    </summary>
                    <p className="mt-1 line-clamp-4">{s}</p>
                  </details>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <p className="font-mono text-xs text-ink-soft">reading document...</p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask something about the document..."
          className="flex-1 border border-line bg-paper-raised rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
        />
        <button
          onClick={sendMessage}
          className="bg-ink text-paper px-4 py-2 rounded-md text-sm font-medium hover:bg-ink/90"
        >
          Ask
        </button>
      </div>
    </main>
  );
}