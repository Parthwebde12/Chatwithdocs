"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FileUpload() {
  const [mode, setMode] = useState<"file" | "url">("file");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  async function submit(makeRequest: () => Promise<Response>) {
    setUploading(true);
    try {
      const res = await makeRequest();
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
        throw new Error("Server error — check terminal for details");
      }

      if (!res.ok) throw new Error(data.error);
      router.push(`/chat/${data.documentId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    await submit(() => {
      const formData = new FormData();
      formData.append("file", file);
      return fetch("/api/upload", { method: "POST", body: formData });
    });
  }

  async function handleUrlSubmit() {
    if (!url.trim()) return;
    await submit(() =>
      fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })
    );
  }

  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <div className="flex gap-4 text-xs font-mono uppercase">
        <button
          type="button"
          onClick={() => setMode("file")}
          className={mode === "file" ? "font-bold underline" : "text-gray-400"}
        >
          File
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={mode === "url" ? "font-bold underline" : "text-gray-400"}
        >
          URL
        </button>
      </div>

      {mode === "file" ? (
        <label className="flex flex-col items-center gap-3 p-10 bg-paper-raised border border-line rounded-md cursor-pointer hover:border-accent transition-colors">
          <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center text-accent font-display text-lg">
            +
          </div>
          <p className="font-mono text-xs text-ink-soft uppercase tracking-wide text-center">
            {uploading
              ? "Reading document..."
              : "PDF · DOCX · TXT · MD · CSV · XLSX · PPTX"}
          </p>
          <input
            type="file"
            accept=".pdf,.docx,.txt,.md,.csv,.xlsx,.xls,.pptx"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex flex-col gap-3 p-6 bg-paper-raised border border-line rounded-md">
          <input
            type="url"
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={uploading}
            className="rounded-md border border-line px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            disabled={uploading || !url.trim()}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {uploading ? "Fetching page..." : "Import URL"}
          </button>
        </div>
      )}
    </div>
  );
}