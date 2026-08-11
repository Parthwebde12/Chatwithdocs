"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { ChatMessage } from "@/lib/types";

export default function ChatPage() {
  const { documentId } = useParams();

  const [messages, setMessages] = useState<
    (ChatMessage & { sources?: string[] })[]
  >([]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId,
          question: userMessage.content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sourceChunks,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong answering that.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen flex-col bg-[#fafafa] text-gray-900">

      <header className="border-b bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-4">
            <Link
              href="/documents"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
            >
              ←
            </Link>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Document
              </p>

              <h1 className="text-sm font-semibold">
                Chat with your document
              </h1>
            </div>
          </div>

          <Link
            href="/documents"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium transition hover:bg-gray-50"
          >
            Documents
          </Link>

        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <section className="mx-auto flex w-full max-w-3xl flex-col px-4 sm:px-6">

          <div className="flex-1 overflow-y-auto py-8">

            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <span className="text-lg font-semibold">
                    AI
                  </span>
                </div>

                <h2 className="mt-6 text-2xl font-semibold tracking-tight">
                  Ask anything about your document
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                  Ask questions about the content, summarize sections,
                  find specific information, or explore the document.
                </p>

                <div className="mt-8 grid w-full max-w-lg gap-3 sm:grid-cols-2">

                  <button
                    onClick={() =>
                      setInput("Summarize this document")
                    }
                    className="rounded-xl border border-gray-200 bg-white p-4 text-left text-sm transition hover:border-gray-300 hover:shadow-sm"
                  >
                    <p className="font-medium">
                      Summarize this document
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Get the key points
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      setInput("What are the main topics?")
                    }
                    className="rounded-xl border border-gray-200 bg-white p-4 text-left text-sm transition hover:border-gray-300 hover:shadow-sm"
                  >
                    <p className="font-medium">
                      Find the main topics
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Discover important sections
                    </p>
                  </button>

                </div>
              </div>
            ) : (
              <div className="space-y-8">

                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      m.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] ${
                        m.role === "user"
                          ? "items-end"
                          : "items-start"
                      }`}
                    >

                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-7 ${
                          m.role === "user"
                            ? "rounded-br-md bg-black text-white"
                            : "rounded-bl-md border border-gray-200 bg-white text-gray-800 shadow-sm"
                        }`}
                      >
                        {m.content}
                      </div>

                      {m.sources &&
                        m.sources.length > 0 && (
                          <div className="mt-3 space-y-2">

                            <p className="text-xs font-medium text-gray-400">
                              Sources
                            </p>

                            <div className="flex flex-wrap gap-2">

                              {m.sources.map((s, idx) => (
                                <details
                                  key={idx}
                                  className="max-w-xs rounded-lg border border-gray-200 bg-white text-xs"
                                >
                                  <summary className="cursor-pointer px-3 py-2 font-medium text-gray-600 hover:text-gray-900">
                                    Source {idx + 1}
                                  </summary>

                                  <p className="border-t px-3 py-2 leading-5 text-gray-500">
                                    {s}
                                  </p>
                                </details>
                              ))}

                            </div>
                          </div>
                        )}

                    </div>

                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400" />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          <div className="border-t bg-[#fafafa] py-4">

            <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">

              <div className="flex items-end gap-2">

                <textarea
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey
                    ) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={1}
                  placeholder="Ask something about the document..."
                  className="max-h-32 min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400"
                />

                <button
                  onClick={sendMessage}
                  disabled={
                    loading || !input.trim()
                  }
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ↑
                </button>

              </div>

            </div>

            <p className="mt-2 text-center text-[11px] text-gray-400">
              Answers are generated from your uploaded document.
            </p>

          </div>

        </section>

      </div>
    </main>
  );
}