import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// Only the admin area needs a per-request session check — the storefront
// reads auth state client-side and doesn't gate any server-rendered
// content on it, so running this on every page load would just add an
// avoidable Supabase round-trip to each navigation.
export const config = {
  matcher: ["/admin/:path*"],
};
