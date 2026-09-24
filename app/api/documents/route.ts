import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getServerSession } from "@/lib/auth";

export async function GET() {
  const user = await getServerSession();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized: Please log in" },
      { status: 401 }
    );
  }

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("uploaded_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ documents: data });
}