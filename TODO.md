# AdSense "Low Value Content" Fix — Implementation Checklist

## ✅ Status: Deployed to Production & Verified Live

- Production URL: **https://decajob.com** (aliased via Vercel, deployment `decajobs-hocgs011w-anupkumarbehera.vercel.app`)
- All key URLs verified returning **HTTP 200**:
  - `/jobs`, `/jobs/remote`, `/jobs/category/*` (8 categories), `/jobs/location/*` (6 cities), 40+ `/jobs/[slug]` detail pages
  - `/blog`, 21 `/blog/[slug]` articles
  - `/ads.txt` (serving `pub-7950314044956492`), `/sitemap.xml`, `/robots.txt`

## Phase 1 — Public Job Board (biggest impact for AdSense)
- [x] Create `src/lib/public-jobs.ts` — data layer fetching Remotive + RemoteOK + Arbeitnow with dedup, caching, slugify, and filter helpers
- [x] Create `src/app/jobs/page.tsx` — job board index page with editorial intro + live jobs + FAQ + JSON-LD
- [x] Create `src/app/jobs/[slug]/page.tsx` — job detail pages with full description, apply link, similar jobs, JobPosting JSON-LD
- [x] Create `src/app/jobs/remote/page.tsx` — remote jobs page with long-form guide + live remote listings
- [x] Create `src/app/jobs/category/[category]/page.tsx` — category pages with career-guide editorial + matching jobs
- [x] Create `src/app/jobs/location/[city]/page.tsx` — city pages with job-market editorial + matching jobs

## Phase 2 — Expand Blog Content (E-E-A-T & depth)
- [x] Add 8 new substantial blog articles to `src/app/blog/[slug]/page.tsx`
- [x] Add the new articles to `src/app/blog/page.tsx` listing

## Phase 3 — SEO & Navigation Polish
- [x] Update `src/app/sitemap.ts` with all new URLs
- [x] Add Jobs links to `src/components/site-header.tsx` and `src/components/site-footer.tsx`
- [x] Cross-link tools ↔ blog ↔ jobs pages

## Follow-up
- [x] Run `npm run build` to verify everything compiles — PASSED (159 static pages generated; job APIs fetching live data: Remotive 34×2, Arbeitnow 175×2; Arbeitnow 429 rate-limit errors handled gracefully by data layer fallbacks)
- [x] Inline `revalidate = 3600` literal in all 5 job routes (Next.js requires a literal, not an imported constant)
- [x] Commit & push to GitHub (`da8cc9c` → origin/main)

## Deploy (requires your Vercel login)
1. Authenticate Vercel CLI:
   ```
   vercel login
   ```
   (or run `vercel whoami` — it will print a device code like `XFTW-TDKC`; visit https://vercel.com/oauth/device?user_code=CODE and approve)
2. Deploy production build:
   ```
   vercel --prod
   ```
3. Verify live URLs:
   - https://decajob.com/jobs
   - https://decajob.com/jobs/remote
   - https://decajob.com/jobs/category/software-engineering
   - https://decajob.com/jobs/location/bangalore
   - https://decajob.com/blog
4. Confirm `ads.txt` is served at https://decajob.com/ads.txt
5. Wait for Google to re-crawl (Search Console → URL Inspection → Request Indexing for key pages)
6. Submit site for Google AdSense review → https://www.google.com/adsense

