import { NextRequest, NextResponse } from "next/server";
import { assertEnv } from "@/lib/checkEnv";
import { parseUrl } from "@/lib/parseUrl";
import { ingestDocument } from "@/lib/ingestDocument";
import { getServerSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    assertEnv();

    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    const { text, title } = await parseUrl(url);
    const result = await ingestDocument(title || url, text, user.id);

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to import URL" },
      { status: 500 }
    );
  }
}