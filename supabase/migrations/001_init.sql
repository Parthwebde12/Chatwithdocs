
create extension if not exists vector;

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  uploaded_at timestamptz not null default now()
);

create table if not exists chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  content text not null,
  chunk_index int not null,
  embedding vector(1536) 
);


alter table documents enable row level security;
alter table chunks enable row level security;

create policy "Allow all on documents (dev)" on documents
  for all using (true) with check (true);

create policy "Allow all on chunks (dev)" on chunks
  for all using (true) with check (true);


create or replace function match_chunks (
  query_embedding vector(1536),
  match_document_id uuid,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  similarity float
)
language sql stable
as $$
  select
    chunks.id,
    chunks.content,
    1 - (chunks.embedding <=> query_embedding) as similarity
  from chunks
  where chunks.document_id = match_document_id
  order by chunks.embedding <=> query_embedding
  limit match_count;
$$;