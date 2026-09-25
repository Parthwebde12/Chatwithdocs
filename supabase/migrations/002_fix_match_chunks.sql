drop function if exists match_chunks(vector, uuid, int);

create or replace function match_chunks (
  query_embedding vector(768),
  match_document_id uuid,
  match_user_id uuid,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  similarity float
)
language sql stable
set search_path = public
as $$
  select
    chunks.id,
    chunks.content,
    1 - (chunks.embedding <=> query_embedding) as similarity
  from chunks
  join documents on documents.id = chunks.document_id
  where chunks.document_id = match_document_id
    and documents.user_id = match_user_id
  order by chunks.embedding <=> query_embedding
  limit match_count;
$$;

revoke all on function match_chunks(vector, uuid, uuid, int) from public, anon, authenticated;
grant execute on function match_chunks(vector, uuid, uuid, int) to service_role;