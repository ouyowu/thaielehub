# Google Indexing Notes

**Date:** 2026-06-04  
**Store:** ThaiEleHub (thaielehub.com)  
**Method:** Safe public search checks (site: queries) and SEO audit script  

## Public Search Checks Performed
- `site:thaielehub.com` – Homepage and main sections indexed
- `site:thaielehub.com/products` – Product pages appearing in index
- `site:thaielehub.com/blogs` – Blog content indexed
- `site:thaielehub.com "elephant sanctuary"` – Brand phrase indexed
- Exact title searches for key product/article pages – Verified indexed

## SEO Audit Script Results (`scripts/thaielehub-seo-audit.sh`)
- ✅ HTTP 200: Homepage (`/`)
- ✅ HTTP 200: Sitemap (`/sitemap.xml`)
- ✅ HTTP 200: Blog FAQ (`/blogs/elephant-sanctuary-thailand-guides?view=elephant-care`)
- ✅ HTTP 200: Article FAQ (`/blogs/elephant-sanctuary-thailand-guides/thailand-elephant-sanctuary-faq-before-booking?view=elephant-care`)
- ✅ HTTP 200: Chiang Mai product (`/products/living-green-chiang-mai-ethical-half-day-morning`)
- ✅ HTTP 200: Bangkok departure product (`/products/chonburi-ethical-half-day-morning-bangkok-departure`)
- ✅ HTTP 200: Pattaya departure product (`/products/chonburi-ethical-half-day-morning-pattaya-departure`)
- ✅ No common mojibake markers detected
- ❌ Legacy brand text is still visible in fetched page text *(needs investigation)*
- ✅ No WhatsApp booking CTA detected
- ✅ FAQPage structured data detected
- ✅ TravelAgency structured data detected

## Google Search Console Status
**NOT AVAILABLE** – No explicit credentials or permission provided for GSC access.

### Owner Checklist for GSC Access
If the owner wishes to enable Google Search Console inspection:
1. Verify ownership of `thaielehub.com` in Google Search Console
2. Provide Hermes with read-only access (preferably via a shared project or limited API key)
3. Explicitly approve inspection of:
   - Sitemap status
   - Indexed pages report
   - Coverage errors (404/redirects)
   - Search performance (impressions, CTR)
   - Core Web Vitals
   - Mobile usability

## Indexing Observations
- Core pages (homepage, sitemap, key product/blog pages) return HTTP 200 and are accessible to crawlers.
- Structured data (FAQPage, TravelAgency) is present, which enhances eligibility for rich results and AI answer engines.
- No obvious blocking in robots.txt (implied by successful fetches).
- The legacy brand text warning suggests possible stale content in cached responses or non-homepage templates; recommend a full site crawl via `site:` operator to locate occurrences.

## Recommendations
1. Enable Google Search Console (if not already) and submit sitemap for monitoring.
2. Use URL Inspection tool to verify rendering and indexing of key templates.
3. Monitor for "Discovered - currently not indexed" pages and improve internal linking.
4. Leverage the existing FAQPage and TravelAgency schema for GEO/AI answer optimization.