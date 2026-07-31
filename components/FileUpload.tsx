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
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      router.push(`/chat/${data.documentId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 p-8 border-2 border-dashed rounded-lg">
      <p className="text-gray-600">Upload a PDF, DOCX, or TXT file</p>
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleUpload}
        disabled={uploading}
        className="text-sm"
      />
      {uploading && <p className="text-sm text-gray-500">Processing document...</p>}
    </div>
  );
}
