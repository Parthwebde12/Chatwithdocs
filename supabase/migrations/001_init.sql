-- Enable the pgvector extension
create extension if not exists vector;

-- Drop old tables/function if they exist (from the OpenAI/1536-dim version)
drop function if exists match_chunks;
drop table if exists chunks;
drop table if exists documents;

create table documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  filename text not null,
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  content text not null,
  chunk_index int not null,
  embedding vector(768) -- matches Gemini text-embedding-004 dimensions
);

-- Create indexes for better performance
create index documents_user_id_idx on documents(user_id);
create index documents_created_at_idx on documents(created_at);
create index chunks_document_id_idx on chunks(document_id);

alter table documents enable row level security;
alter table chunks enable row level security;

-- RLS policies for documents: users can only see/modify their own documents
create policy "Users can view their own documents" on documents
  for select using (auth.uid() = user_id);

create policy "Users can insert their own documents" on documents
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own documents" on documents
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete their own documents" on documents
  for delete using (auth.uid() = user_id);

-- RLS policies for chunks: users can only access chunks from their own documents
create policy "Users can view chunks from their documents" on chunks
  for select using (
    exists (
      select 1 from documents
      where documents.id = chunks.document_id
      and documents.user_id = auth.uid()
    )
  );

create or replace function match_chunks (
  query_embedding vector(768),
  match_document_id uuid,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  similarity float
)
language sql stable
security definer
set search_path = public
as $$
  select
    chunks.id,
    chunks.content,
    1 - (chunks.embedding <=> query_embedding) as similarity
  from chunks
  where chunks.document_id = match_document_id
  -- Verify the user owns this document
  and exists (
    select 1 from documents
    where documents.id = match_document_id
    and documents.user_id = auth.uid()
  )
  order by chunks.embedding <=> query_embedding
  limit match_count;
$$;