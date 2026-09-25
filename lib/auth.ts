import { getSupabaseBrowserClient, getSupabaseServerClient } from "./supabase";

export async function signUp(email: string, password: string) {
  const supabase = getSupabaseBrowserClient();
  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseBrowserClient();
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  const supabase = getSupabaseBrowserClient();
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function verifyDocumentOwnership(
  documentId: string,
  userId: string
) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("documents")
    .select("user_id")
    .eq("id", documentId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.user_id === userId;
}