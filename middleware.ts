import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function middleware(request: NextRequest) {
  const supabase = getSupabaseServerClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

 
  const protectedRoutes = ["/documents", "/chat"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/documents/:path*", "/chat/:path*"],
};
