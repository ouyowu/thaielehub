# Thaielehub Weekly Shopify Search Health Check

Date: 2026-06-10
Checked at: 2026-06-10 16:33:08 +07
Automation: `thaielehub-weekly-shopify-search-health-check`

## Scope

- Inspected the local theme export under `shopify-theme-export/`
- Attempted Shopify theme registry access via Shopify CLI
- Ran `scripts/thaielehub-seo-audit.sh`
- Attempted live verification for:
  - `https://thaielehub.com/sitemap.xml`
  - `https://thaielehub.myshopify.com/sitemap.xml`
  - homepage, blog index, FAQ article URL, and key product URLs referenced by the audit script
- Checked for Google Search Console tooling or credentials in the workspace

## What Was Verified This Run

### Environment status

- Shell DNS/network access is unavailable in this runtime.
  - `curl` to both sitemap hosts failed with `Could not resolve host`.
  - Shopify CLI device auth also failed on `accounts.shopify.com` DNS resolution.
- Shopify CLI is installed locally (`4.1.0`), but current registry access was not available this run.
  - Initial CLI execution also hit a local preferences write error under `~/Library/Preferences/shopify-cli-theme-conf-nodejs/`.
- `scripts/thaielehub-seo-audit.sh` is present and executable.
- No local Google Search Console credentials or direct GSC tooling were found.
  - Only theme-side `gsc` naming exists in [`shopify-theme-export/sections/elephant-product-gsc.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/sections/elephant-product-gsc.liquid:1) and [`shopify-theme-export/templates/product.gsc.json`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/templates/product.gsc.json:1).

### Theme SEO implementation

- Sitewide title/description fallback is implemented in [`shopify-theme-export/layout/theme.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/layout/theme.liquid:19).
- Open Graph and Twitter meta tags are implemented in [`shopify-theme-export/snippets/meta-tags.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/snippets/meta-tags.liquid:1).
- Sitewide `TravelAgency`, `WebSite`, and `FAQPage` schema is implemented in [`shopify-theme-export/snippets/elehub-site-schema.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/snippets/elehub-site-schema.liquid:5).
- Product-level `Product` and `TouristTrip` schema is implemented in [`shopify-theme-export/sections/elephant-product-gsc.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/sections/elephant-product-gsc.liquid:618).
- Blog/article internal links are present and consistently route article cards through the custom `?view=elephant-care` template.
  - See [`shopify-theme-export/sections/elephant-care-blog.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/sections/elephant-care-blog.liquid:45) and [`shopify-theme-export/sections/custom-homepage-livinggreen-v3.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/sections/custom-homepage-livinggreen-v3.liquid:1213).

## Live Verification Status

### Not verified this run

Because DNS resolution failed in the shell and no browser automation path was available in this runtime, the following remain unverified today:

- current Shopify theme registry state
- sitemap contents for `thaielehub.com` and `thaielehub.myshopify.com`
- live HTTP status of homepage, blog, recent article pages, and product pages
- live broken-link state
- live visible preview/demo confusion
- live visible mojibake
- live rendered schema presence

### Audit script output

`scripts/thaielehub-seo-audit.sh` completed with environment-driven failures:

- `HTTP 000` for `/`
- `HTTP 000` for `/sitemap.xml`
- `HTTP 000` for `/blogs/elephant-sanctuary-thailand-guides?view=elephant-care`
- `HTTP 000` for `/blogs/elephant-sanctuary-thailand-guides/thailand-elephant-sanctuary-faq-before-booking?view=elephant-care`
- `HTTP 000` for the three checked product URLs
- 12 total checks, 9 failures

Important interpretation:

- The script passed its text-only checks (`No common mojibake markers detected`, `No visible Living Green or Big Boy text detected`, `No WhatsApp booking CTA detected`) only because the fetched HTML files were empty after DNS failure.
- The script output should not be treated as evidence that the live site is clean.

## Verified Findings

### P0

None verified this run.

### P1

1. The sitewide organization schema still points `sameAs` to a legacy Living Green TripAdvisor entity.
   - Verified at [`shopify-theme-export/snippets/elehub-site-schema.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/snippets/elehub-site-schema.liquid:58).
   - Impact:
     - This can reinforce Google/entity association with the old Living Green brand even if visible page copy was cleaned elsewhere.

2. The theme still relies heavily on runtime string replacement to sanitize legacy brand text.
   - Verified in:
     - [`shopify-theme-export/layout/theme.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/layout/theme.liquid:19)
     - [`shopify-theme-export/snippets/meta-tags.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/snippets/meta-tags.liquid:6)
     - [`shopify-theme-export/sections/elephant-care-article.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/sections/elephant-care-article.liquid:96)
     - [`shopify-theme-export/sections/main-article.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/sections/main-article.liquid:52)
   - Impact:
     - This is brittle.
     - It leaves search snippets, structured data, and future templates dependent on replacements instead of clean source content.

3. Legacy `living-green-*` product handles are still embedded in internal links and product logic.
   - Verified in:
     - [`shopify-theme-export/sections/custom-homepage-livinggreen-v3.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/sections/custom-homepage-livinggreen-v3.liquid:718)
     - [`shopify-theme-export/sections/elephant-care-article.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/sections/elephant-care-article.liquid:32)
     - [`shopify-theme-export/templates/article.elephant-care.json`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/templates/article.elephant-care.json:23)
     - [`shopify-theme-export/sections/elephant-product-gsc.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/sections/elephant-product-gsc.liquid:10)
   - Impact:
     - Legacy-branded URLs are still core navigation targets, not just historical redirects.
     - If these URLs are indexed, search will keep seeing the legacy brand in canonical page paths.

4. Visible legacy brand text still exists in theme navigation/support copy and section schema naming.
   - Verified in:
     - [`shopify-theme-export/snippets/elehub-editorial-header.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/snippets/elehub-editorial-header.liquid:13)
     - [`shopify-theme-export/sections/custom-homepage-livinggreen-v3.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/sections/custom-homepage-livinggreen-v3.liquid:553)
     - [`shopify-theme-export/sections/custom-homepage-livinggreen-v3.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/sections/custom-homepage-livinggreen-v3.liquid:1437)
   - Impact:
     - If this section/snippet is live, users can still see `Living Green`.
     - Even if not live, editor labels increase preview/demo confusion and make accidental publishing mistakes more likely.

### P2

1. Mobile readability is still being reduced by hard-hiding FAQ content after the third item.
   - Verified in:
     - [`shopify-theme-export/assets/elehub-site.css`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/assets/elehub-site.css:701)
     - [`shopify-theme-export/assets/elehub-mobile-speed-20260605.css`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/assets/elehub-mobile-speed-20260605.css:212)
     - [`shopify-theme-export/sections/custom-homepage-livinggreen-v3.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/sections/custom-homepage-livinggreen-v3.liquid:528)
   - Impact:
     - Mobile users lose access to part of the FAQ stack.
     - Trust/support content is thinner on the most important viewport.

2. Article and homepage editorial cards still truncate excerpts aggressively.
   - Verified in:
     - [`shopify-theme-export/sections/custom-homepage-livinggreen-v3.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/sections/custom-homepage-livinggreen-v3.liquid:1222)
     - [`shopify-theme-export/sections/elephant-care-article.liquid`](/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-export/sections/elephant-care-article.liquid:165)
   - Impact:
     - Internal-link context is weaker than ideal for both users and search.

3. Preview/demo confusion risk remains locally.
   - Verified local sources:
     - the repo still contains `shopify-theme-advenx-demo/`
     - active homepage section files are still named `custom-homepage-livinggreen*`
   - Impact:
     - This is mainly an operational risk, but it increases the chance of sharing the wrong preview or confusing unpublished theme variants.

## Important URLs Attempted This Run

Attempted via the audit script or direct shell fetch, but not externally verified because DNS failed:

- `https://thaielehub.com/sitemap.xml`
- `https://thaielehub.myshopify.com/sitemap.xml`
- `https://thaielehub.com/`
- `https://thaielehub.com/blogs/elephant-sanctuary-thailand-guides?view=elephant-care`
- `https://thaielehub.com/blogs/elephant-sanctuary-thailand-guides/thailand-elephant-sanctuary-faq-before-booking?view=elephant-care`
- `https://thaielehub.com/products/living-green-chiang-mai-ethical-half-day-morning`
- `https://thaielehub.com/products/chonburi-ethical-half-day-morning-bangkok-departure`
- `https://thaielehub.com/products/chonburi-ethical-half-day-morning-pattaya-departure`

Recent article pages were not enumerable from the repo alone because article handles/content live in Shopify data, not in the theme files.

## Broken Links / Mojibake / Preview Confusion

### Broken links

- Not verifiable on the live site in this environment.
- Locally, internal-link patterns are coherent, but several still target legacy `living-green-*` product paths.

### Mojibake

- No obvious mojibake patterns were found in the local active export during code search.
- The audit script's live mojibake pass is not meaningful this run because HTML fetches failed.

### Preview / demo confusion

- Verified locally:
  - `shopify-theme-advenx-demo/` still exists in the repo
  - active files still use `livinggreen` naming
- Current live theme registry state could not be reconfirmed today.

## Google Search Console Availability

Verified local status:

- No GSC service-account JSON
- No GSC CLI
- No Search Console automation wiring
- Only theme-side `gsc` naming for product template/schema work

If future weekly checks should validate indexing/status directly, this automation needs one of:

1. Search Console property access for `https://thaielehub.com/` or `sc-domain:thaielehub.com`
2. working credentials available to the runtime
3. a network-enabled execution environment

## Recommended Next Actions For Codex

### Highest priority

1. Remove the legacy `sameAs` Living Green TripAdvisor reference from sitewide schema or replace it with the correct Thaielehub entity target.
2. Stop depending on mass `replace: 'Living Green', 'Thaielehub'` cleanup for SEO-critical fields and clean the underlying Shopify source content instead.
3. Decide whether legacy `living-green-*` product handles are temporary or permanent.
   - If permanent, accept the brand mismatch and document it.
   - If temporary, plan handle migration plus redirects.

### Next

1. Rename/remove visible `Living Green` text in header/homepage snippets and section schema labels.
2. Restore full mobile FAQ visibility or replace the hard-hide rule with a user-expand pattern that keeps the content accessible.
3. Re-run this audit from a network-enabled environment to verify:
   - both sitemap indexes
   - homepage
   - blog index
   - 3 recent article pages
   - top Chiang Mai, Bangkok, and Pattaya product URLs
   - live rendered schema and any broken links

## Telegram-Friendly Summary

Weekly Thaielehub search check completed. This runtime could not resolve `thaielehub.com`, `thaielehub.myshopify.com`, or Shopify auth hosts, so live sitemap/storefront/theme-registry verification is still blocked. Verified local risks remain: sitewide schema still references a legacy Living Green TripAdvisor entity, SEO/meta/article output still depends on string replacement, legacy `living-green-*` product URLs are still active internal-link targets, visible `Living Green` text still exists in homepage/header source, and mobile FAQ content is still hidden after item 3. No local Google Search Console credentials or tooling were found.
