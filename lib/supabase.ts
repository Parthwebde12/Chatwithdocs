import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

// Service-role client: bypasses RLS, used for privileged DB writes.
// NOT tied to the logged-in user's session — never use this to check "who is logged in".
export function getSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

let browserClient: SupabaseClient | undefined;

// Browser client: uses @supabase/ssr so the session is written to a cookie
// (not just localStorage), which is what lets middleware and API routes
// on the server actually see that you're logged in.
export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return browserClient;
}