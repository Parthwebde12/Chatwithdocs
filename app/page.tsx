import FileUpload from "@/components/FileUpload";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-900">
      <nav className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Chat with Docs
          </Link>

          <Link
            href="/documents"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
          >
            Documents
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-gray-200/40 blur-3xl" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-20 text-center sm:pt-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            AI-powered document assistant
          </div>

          <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Understand your documents
            <span className="block text-gray-400">
              through conversation.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
            Upload your documents, ask questions, and get answers grounded in
            the content you provide.
          </p>

          <div className="mt-12 w-full max-w-2xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-lg shadow-gray-200/40 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Start with a document
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Upload a file and start asking questions.
                </p>
              </div>

              <FileUpload />
            </div>

            <p className="mt-4 text-xs text-gray-400">
              Upload a document to begin your conversation.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-gray-500">
              Built for your documents
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Ask. Search. Understand.
            </h2>

            <p className="mt-4 text-gray-500">
              Get useful information from your documents without searching
              through pages manually.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border bg-[#fafafa] p-6">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-sm font-semibold">
                AI
              </div>

              <h3 className="font-semibold">Intelligent answers</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Ask questions naturally and receive answers based on your
                document.
              </p>
            </div>

            <div className="rounded-2xl border bg-[#fafafa] p-6">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-sm font-semibold">
                ↗
              </div>

              <h3 className="font-semibold">Context-aware search</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Relevant sections are retrieved before generating an answer.
              </p>
            </div>

            <div className="rounded-2xl border bg-[#fafafa] p-6">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-sm font-semibold">
                ✓
              </div>

              <h3 className="font-semibold">Grounded responses</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Responses stay focused on the information found in your
                document.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fafafa]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">
              Simple workflow
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              From document to answer
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border bg-white font-semibold">
                01
              </div>

              <h3 className="mt-5 font-semibold">Upload</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Upload the document you want to understand.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border bg-white font-semibold">
                02
              </div>

              <h3 className="mt-5 font-semibold">Ask</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Ask questions about the content in natural language.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border bg-white font-semibold">
                03
              </div>

              <h3 className="mt-5 font-semibold">Understand</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Get relevant answers from the information inside your
                document.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Ready to explore your documents?
          </h2>

          <p className="mt-4 text-gray-500">
            Upload a document and start asking questions.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Upload a document
          </Link>
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-gray-400">
          <span>Chat with Docs</span>
          <span>AI-powered document conversations</span>
          <span>Buit by Parth Wakodikar</span>
        </div>
      </footer>
    </main>
  );
}