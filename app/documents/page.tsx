"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Document = {
  id: string;
  filename: string;
  uploaded_at: string;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/documents");

      if (!res.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data = await res.json();

      setDocuments(data.documents || data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    try {
      setDeleting(id);

      const res = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Delete failed:", res.status, data);
        throw new Error(data?.error ?? `Failed to delete document (${res.status})`);
      }

      setDocuments((current) =>
        current.filter((doc) => doc.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to delete document");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-900">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight"
          >
            Chat with Docs
          </Link>

          <Link
            href="/"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Upload Document
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10">
          <p className="text-sm font-medium text-gray-500">
            Library
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Your Documents
          </h1>

          <p className="mt-2 text-gray-500">
            Select a document to start a conversation.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border bg-white p-10 text-center">
            <p className="text-sm text-gray-500">
              Loading documents...
            </p>
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <span className="text-xl">+</span>
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              No documents yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Upload your first document to start chatting.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Upload Document
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((document) => (
              <div
                key={document.id}
                className="group flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                    <span className="text-sm font-semibold">
                      PDF
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate font-medium">
                      {document.filename}
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(
                        document.uploaded_at
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/chat/${document.id}`}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Open Chat
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(document.id)
                    }
                    disabled={deleting === document.id}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    {deleting === document.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}