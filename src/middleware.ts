import { type NextRequest, NextResponse } from "next/server";
import { updateSessionAndGetUser } from "@/lib/supabase/middleware";
import { cleanPathname } from "@/lib/i18n/utils";
import { isValidLocale } from "@/lib/i18n/config";

/**
 * Subpaths under /[lang]/ that have dedicated localized page implementations.
 * e.g., /[lang]/pricing has its own dedicated page.
 */
const DEDICATED_LOCALIZED_SUBPATHS = ["pricing"];

/**
 * Fast lookup map for city query normalization.
 * Redirects parameter queries like /jobs?q=Bangalore directly to dedicated SEO hubs like /jobs/location/bangalore.
 */
const CITY_SLUG_BY_ALIAS: Record<string, string> = {
  bangalore: "bangalore",
  bengaluru: "bangalore",
  blr: "bangalore",
  mumbai: "mumbai",
  bombay: "mumbai",
  delhi: "delhi",
  ncr: "delhi",
  gurgaon: "delhi",
  gurugram: "delhi",
  noida: "delhi",
  "new delhi": "delhi",
  hyderabad: "hyderabad",
  hitech: "hyderabad",
  gachibowli: "hyderabad",
  chennai: "chennai",
  madras: "chennai",
  pune: "pune",
  puna: "pune",
  bhubaneswar: "bhubaneswar",
  bbsr: "bhubaneswar",
  odisha: "bhubaneswar",
  infocity: "bhubaneswar",
  kolkata: "kolkata",
  calcutta: "kolkata",
  ahmedabad: "ahmedabad",
  amdavad: "ahmedabad",
  chandigarh: "chandigarh",
  tricity: "chandigarh",
  mohali: "chandigarh",
  kochi: "kochi",
  cochin: "kochi",
  ernakulam: "kochi",
  jaipur: "jaipur",
  "pink city": "jaipur",
  indore: "indore",
  trivandrum: "trivandrum",
  thiruvananthapuram: "trivandrum",
  technopark: "trivandrum",
  seattle: "seattle",
  austin: "austin",
  "san francisco": "san-francisco",
  sf: "san-francisco",
  "new york": "new-york",
  nyc: "new-york",
};

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

  // 1b. Redirect *.workers.dev staging/edge domain -> decajob.com (301 Permanent Redirect)
  // and attach X-Robots-Tag: noindex, nofollow, noarchive to force search engines to de-index the worker domain to 0.
  // Bypass redirect if ?preview=true is specified (useful during DNS propagation or debugging).
  if (host.includes("workers.dev")) {
    if (request.nextUrl.searchParams.get("preview") !== "true") {
      const redirectUrl = new URL(
        pathname + request.nextUrl.search,
        "https://decajob.com"
      );
      const redirectRes = NextResponse.redirect(redirectUrl, 301);
      redirectRes.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      return redirectRes;
    }
  }

  // 1c. Attach X-Robots-Tag: noindex, noarchive to non-page assets (OpenGraph images, webmanifest, media)
  // Prevents binary assets and social sharing cards from cluttering Google Search Console Page Indexing reports.
  if (
    pathname.includes("/opengraph-image") ||
    pathname.endsWith("/site.webmanifest") ||
    pathname.endsWith("/favicon.ico") ||
    pathname.startsWith("/_next/static/media/")
  ) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, noarchive");
    return res;
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

  // 2b. Redirect legacy /mock-interview path to canonical /tools/mock-interview (301 Permanent Redirect)
  if (pathname === "/mock-interview" || cleanPathname(pathname) === "/mock-interview") {
    return NextResponse.redirect(new URL("/tools/mock-interview", request.url), 301);
  }

  // 4. Canonicalize non-auth parameter URLs on /login (301 Permanent Redirect to clean /login)
  // Preserves OAuth/auth callbacks (code, error) while stripping crawler/promotional params (role, company, city, alert, etc.)
  if ((pathname === "/login" || cleanPathname(pathname) === "/login") && request.nextUrl.search) {
    const searchParams = request.nextUrl.searchParams;
    const isAuthCallback = searchParams.has("code") || searchParams.has("error") || searchParams.has("redirectTo");
    if (!isAuthCallback) {
      return NextResponse.redirect(new URL(cleanPathname(pathname), request.url), 301);
    }
  }

  // Check auth session cookie
  const hasAuthCookie = request.cookies.getAll().some(
    (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token")
  );

  // 5. Canonicalize /resume-tools URLs (301 Permanent Redirect to /tools/resume-matcher)
  // Collapses all 119 legacy GSC crawler parameter URLs (tab=builder, role=..., company=..., desc=...)
  // and unauthenticated visits into the canonical public AI tool, cleanly resolving "Blocked by robots.txt".
  if (pathname === "/resume-tools" || cleanPathname(pathname) === "/resume-tools") {
    if (request.nextUrl.search || !hasAuthCookie) {
      return NextResponse.redirect(new URL("/tools/resume-matcher", request.url), 301);
    }
  }

  // 6. Canonicalize referral tracking parameters on homepage (301 Permanent Redirect to clean /)
  // Resolves GSC "Alternate page with proper canonical tag" for campaign URLs like /?ref=producthunt
  if ((pathname === "/" || cleanPathname(pathname) === "/") && request.nextUrl.searchParams.has("ref")) {
    return NextResponse.redirect(new URL("/", request.url), 301);
  }

  // 7. Canonicalize /jobs filter parameters to high-intent SEO hubs (301 Permanent Redirect)
  // Resolves /jobs?remote=true -> /jobs/remote and /jobs?q=Bangalore -> /jobs/location/bangalore
  if (pathname === "/jobs" || cleanPathname(pathname) === "/jobs") {
    const searchParams = request.nextUrl.searchParams;

    if (searchParams.get("remote") === "true" || searchParams.get("remote") === "1") {
      return NextResponse.redirect(new URL("/jobs/remote", request.url), 301);
    }

    const q = searchParams.get("q")?.trim().toLowerCase();
    if (q) {
      const citySlug = CITY_SLUG_BY_ALIAS[q];
      if (citySlug) {
        return NextResponse.redirect(new URL(`/jobs/location/${citySlug}`, request.url), 301);
      }
    }
  }

  const isProtected = matchesRoute(pathname, protectedRoutes);
  const isLoginPage = cleanPathname(pathname) === "/login" || pathname === "/login";

  let response: NextResponse = NextResponse.next({ request });
  let user = null;

  // Only perform remote Supabase Auth network calls when necessary:
  // 1. User is accessing a protected route (must verify auth)
  // 2. User is on /login (redirect if already logged in)
  // 3. User has an active Supabase auth cookie that needs token refresh
  // Anonymous visitors and bots browsing public routes bypass all remote network roundtrips!
  if (isProtected || isLoginPage || hasAuthCookie) {
    try {
      const result = await updateSessionAndGetUser(request);
      response = result.response;
      user = result.user;
    } catch {
      response = NextResponse.next({ request });
      user = null;
    }
  }

  // Redirect unauthenticated users away from protected routes
  if (!user && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    const redirectRes = NextResponse.redirect(loginUrl);
    redirectRes.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return redirectRes;
  }

  // Redirect authenticated users away from login page to admin or dashboard
  if (user && isLoginPage) {
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (!adminEmails.includes("anup4503@gmail.com")) adminEmails.push("anup4503@gmail.com");
    if (!adminEmails.includes("anupkist@gmail.com")) adminEmails.push("anupkist@gmail.com");

    const isAdmin = user.email && adminEmails.includes(user.email.toLowerCase());
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Attach X-Robots-Tag header to protected app routes so crawlers never index them
  if (isProtected) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
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
