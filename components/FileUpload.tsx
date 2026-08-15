"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

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

  return (
    <label className="w-full max-w-sm flex flex-col items-center gap-3 p-10 bg-paper-raised border border-line rounded-md cursor-pointer hover:border-accent transition-colors">
      <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center text-accent font-display text-lg">
        +
      </div>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-wide">
        {uploading ? "Reading document..." : "PDF · DOCX · TXT"}
      </p>
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleUpload}
        disabled={uploading}
        className="hidden"
      />
    </label>
  );
}

