import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { updateSession } from "@/lib/supabase/middleware";
import { cleanPathname } from "@/lib/i18n/utils";

/**
 * Protected routes that require authentication.
 * Unauthenticated users accessing these paths are redirected to /login.
 */
const protectedRoutes = [
  "/admin",
  "/dashboard",
  "/profile",
  "/settings",
  "/resume-tools",
  "/subscribe",
  "/applications",
  "/referral",
  "/ai-tools",
  "/career-path",
  "/cold-email",
  "/employer/dashboard",
  "/employer/post",
  "/employer/jobs",
];

/**
 * Public routes that do not require authentication.
 * Authenticated users accessing /login are redirected to /dashboard.
 */
const _publicRoutes = ["/", "/login", "/employer/register", "/auth/callback"];

/**
 * Check if a pathname matches any of the given route prefixes.
 * Strips any locale prefix first (e.g., /es/dashboard -> /dashboard).
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  const clean = cleanPathname(pathname);
  return routes.some(
    (route) => clean === route || clean.startsWith(`${route}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // 1. Redirect www.decajob.com -> decajob.com (301 Permanent Redirect for SEO canonicalization)
  if (host.startsWith("www.decajob.com")) {
    const redirectUrl = new URL(
      pathname + request.nextUrl.search,
      "https://decajob.com"
    );
    return NextResponse.redirect(redirectUrl, 301);
  }

  // First, try to refresh the session (handles cookie updates)
  let response: NextResponse;
  try {
    response = await updateSession(request);
  } catch {
    // If session refresh fails (e.g., invalid Supabase credentials), continue without auth
    response = NextResponse.next({ request });
  }

  // After session refresh, check authentication status
  let user = null;
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
          },
        },
      }
    );

    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    // If auth check fails, treat as unauthenticated
    user = null;
  }

  // Redirect unauthenticated users away from protected routes
  if (!user && matchesRoute(pathname, protectedRoutes)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login page to dashboard
  if (user && (cleanPathname(pathname) === "/login" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - ads.txt, robots.txt, sitemap.xml
     * - Public assets with file extensions (e.g. site.webmanifest, etc.)
     * - API routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|ads\\.txt|robots\\.txt|sitemap\\.xml|.*\\.[\\w]+$|api/).*)",
  ],
};
