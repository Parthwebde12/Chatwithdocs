# ChatWithDoc

Upload a document, ask questions about it in plain English, and get answers grounded in the actual content — with the exact source passages shown alongside each answer.

## What it does

ChatWithDoc lets you upload a PDF, DOCX, or TXT file and have a conversation with it. Instead of skimming a long contract, research paper, or report, just ask — "what's the termination clause?" or "what methodology did they use?" — and get a direct answer pulled from the document, along with the source snippets it was based on.

Built using **RAG (Retrieval-Augmented Generation)**: the document is chunked, converted into vector embeddings, and stored in a database. When you ask a question, the most relevant chunks are retrieved and passed to an LLM, which answers using only that content.

## Tech Stack

| Layer | Tool |
| --- | --- |
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) |
| Vector search | pgvector |
| LLM / Embeddings | *fill in whichever provider you ended up using* |
| File parsing | pdf-parse, mammoth |
| Hosting | Vercel |

## Features

- Upload PDF, DOCX, or TXT files
- Ask natural-language questions about the uploaded document
- Answers are grounded in the document's actual content, with source passages shown
- View and manage all previously uploaded documents
- Delete documents you no longer need

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/chat-with-docs.git
cd chat-with-docs
npm install
```

### 2. Set up Supabase

- Create a free project at [supabase.com](https://supabase.com)
- In the SQL Editor, run the migration in `supabase/migrations/001_init.sql`
- This enables `pgvector` and creates the `documents` and `chunks` tables

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your Supabase URL/keys and your LLM/embedding API key(s).

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How it works

```
Upload → text extracted → split into chunks → embedded → stored in Supabase (pgvector)
Question → embedded → nearest chunks retrieved → LLM answers using only those chunks
```

## Project Structure

```
app/
├── page.tsx              # Upload page
├── chat/[documentId]/    # Chat interface for a document
├── documents/            # List of uploaded documents
└── api/
    ├── upload/           # Handles file upload, chunking, embedding
    ├── chat/             # Retrieves relevant chunks, generates answer
    └── documents/        # List/delete documents

lib/
├── supabase.ts           # Supabase client
├── embeddings.ts         # Embedding generation
├── chunkText.ts          # Text chunking logic
├── parseFile.ts          # PDF/DOCX/TXT extraction
└── types.ts              # Shared TypeScript types

supabase/
└── migrations/           # Database schema + vector search function
```

## Roadmap

- [x] Auth so documents are scoped per user
- [x] Support for larger documents / pagination
- [x] Chat history persistence
