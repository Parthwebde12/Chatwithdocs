"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DocumentRow } from "@/lib/types";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    setLoading(true);
    const res = await fetch("/api/documents");
    const data = await res.json();
    setDocuments(data.documents ?? []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }

  if (loading) return <p className="p-6 font-mono text-sm text-ink-soft">loading...</p>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <p className="font-mono text-xs tracking-widest text-accent uppercase mb-1">
        Archive
      </p>
      <h1 className="font-display text-2xl font-semibold mb-6">Your documents</h1>

      {documents.length === 0 && (
        <p className="text-ink-soft text-sm">Nothing uploaded yet.</p>
      )}

      <ul className="space-y-2">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex items-center justify-between bg-paper-raised border border-line rounded-md p-3"
          >
            <Link href={`/chat/${doc.id}`} className="text-sm text-ink hover:text-accent">
              {doc.filename}
            </Link>
            <button
              onClick={() => handleDelete(doc.id)}
              className="text-xs font-mono text-ink-soft hover:text-red-600"
            >
              delete
            </button>
          </li>
        ))}
      </ul>

      <Link href="/" className="inline-block mt-6 text-xs font-mono text-ink-soft hover:text-accent">
        ← upload another
      </Link>
    </main>
  );
}