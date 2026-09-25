import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getServerSession } from "@/lib/session";
import { verifyDocumentOwnership } from "@/lib/auth";


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const user = await getServerSession();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized: Please log in" },
      { status: 401 }
    );
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing document id" }, { status: 400 });
  }

  // Verify user owns this document
  const owns = await verifyDocumentOwnership(id, user.id);
  if (!owns) {
    return NextResponse.json(
      { error: "Unauthorized: You do not own this document" },
      { status: 403 }
    );
  }

  const supabase = getSupabaseServerClient();

  const { error, count } = await supabase
    .from("documents")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (count === 0) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}