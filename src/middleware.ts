import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { updateSession } from "@/lib/supabase/middleware";
import { cleanPathname } from "@/lib/i18n/utils";
import { isValidLocale } from "@/lib/i18n/config";

/**
 * Subpaths under /[lang]/ that have dedicated localized page implementations.
 * e.g., /[lang]/pricing has its own dedicated page.
 */
const DEDICATED_LOCALIZED_SUBPATHS = ["pricing"];

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

  // 2. Redirect crawler artifact URLs and malformed symbol paths (301 Permanent Redirect)
  if (pathname === "/month") {
    return NextResponse.redirect(new URL("/pricing", request.url), 301);
  }
  if (
    pathname === "/&" ||
    pathname === "/$" ||
    pathname === "/%24" ||
    pathname === "/%26"
  ) {
    return NextResponse.redirect(new URL("/", request.url), 301);
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

  // 3. Internationalization (i18n) Routing & Fallbacks
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0]?.toLowerCase();

  if (firstSegment && isValidLocale(firstSegment)) {
    // English (/en or /en/...) permanently redirects to canonical clean URL
    if (firstSegment === "en") {
      const clean = cleanPathname(pathname);
      return NextResponse.redirect(
        new URL(clean + request.nextUrl.search, request.url),
        301
      );
    }

    // For non-English locales:
    // - Root locale (e.g. /hi, /es, /ja) is handled by src/app/[lang]/page.tsx
    // - Dedicated subpaths (e.g. /hi/pricing) are handled by src/app/[lang]/pricing/page.tsx
    // - Any other subpath without a dedicated [lang] page is transparently rewritten to its clean path
    const isDedicatedRoute =
      segments.length === 1 ||
      (segments.length === 2 && DEDICATED_LOCALIZED_SUBPATHS.includes(segments[1]));

    if (!isDedicatedRoute) {
      const clean = cleanPathname(pathname);
      const rewriteUrl = new URL(clean + request.nextUrl.search, request.url);
      const rewriteResponse = NextResponse.rewrite(rewriteUrl, {
        request: {
          headers: request.headers,
        },
      });
      // Preserve any cookies set by session update
      response.cookies.getAll().forEach((c) => {
        rewriteResponse.cookies.set(c.name, c.value);
      });
      return rewriteResponse;
    }
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
