# Codex Shopify SEO/GEO Audit

Date: 2026-06-04
Storefront: https://thaielehub.com
Shopify admin: https://admin.shopify.com/store/thaielehub
Live theme: thaielehub-geo-split-header-2026-06-04
Local theme path: shopify-theme-export

## Summary

The live Shopify storefront is technically crawlable and the key customer pages return HTTP 200. The sitemap and robots.txt are publicly accessible, and the theme now includes stronger site-level structured data for AI/search engines.

Public search checks did not surface reliable visible results for `site:thaielehub.com` during this audit. That should be treated as a public-search signal, not the final authority. Google Search Console URL Inspection and sitemap reports are still required for definitive indexing status.

## Checks Run

- `shopify theme check --path shopify-theme-export`
- `THAIELEHUB_BASE_URL=https://thaielehub.com scripts/thaielehub-seo-audit.sh`
- Public fetches for `https://thaielehub.com/robots.txt`
- Public fetches for `https://thaielehub.com/sitemap.xml`
- Public web searches for:
  - `site:thaielehub.com`
  - `site:thaielehub.com/products Thaielehub elephant sanctuary`
  - `site:thaielehub.com/blogs Thaielehub elephant sanctuary`
  - `"thaielehub.com"`

## Results

- PASS: Homepage returns HTTP 200.
- PASS: Sitemap returns HTTP 200.
- PASS: Robots.txt allows normal public crawling.
- PASS: Main blog and key product URLs return HTTP 200.
- PASS: No common mojibake markers detected.
- PASS: No visible "Living Green" or "Big Boy" text detected in rendered public text.
- PASS: No WhatsApp booking CTA detected.
- PASS: FAQPage structured data detected.
- PASS: TravelAgency structured data detected.
- PASS: Theme check reduced from 9 warnings to 1 warning.

Remaining theme warning:

- `snippets/quick-order-product-row.liquid`: orphaned snippet. This is low risk and was left in place because deleting unused Shopify snippets can remove future feature compatibility.

## Optimizations Implemented

1. Added global site schema in `snippets/elehub-site-schema.liquid`.
   - TravelAgency
   - WebSite with SearchAction
   - Site-level FAQPage
   - Thailand / Chiang Mai / Bangkok / Pattaya / Chonburi relevance signals
   - No-riding, no-shows and hotel pickup semantic signals

2. Rendered the new schema from `layout/theme.liquid`.

3. Improved homepage Open Graph description fallback in `snippets/meta-tags.liquid`.
   - The updated theme file is present on the remote live theme.
   - Public HTML still showed `ThaiEleHub` for `og:description` immediately after deployment, so Shopify cache or storefront settings should be rechecked. The normal homepage `<meta name="description">` is already correct.

4. Improved the SEO audit script.
   - Legacy-brand and WhatsApp CTA checks now inspect visible page text while ignoring script/style payloads.
   - This avoids false alarms from Shopify analytics metadata while still checking customer-visible content.

5. Cleaned low-risk Shopify theme warnings.
   - Initialized `scheme_classes`.
   - Replaced hardcoded `/` routes with `{{ routes.root_url }}`.
   - Removed unused Liquid assignments.
   - Normalized Liquid variable names.

## Important Backend Follow-Up

Some Shopify product backend fields may still contain legacy wording such as old product handles, product titles, vendors, or analytics payload metadata. Theme Liquid can hide or replace many visible instances, but Shopify's analytics/web pixel payload can still expose backend product metadata.

The Shopify store description should also be updated in the admin if it is currently only `ThaiEleHub`, because Open Graph and Twitter descriptions can fall back to that value.

Recommended Shopify admin cleanup:

- Product titles: use short Thaielehub titles.
- Vendor: use `Thaielehub` instead of old company/brand labels when appropriate.
- SEO title and meta description: review every product and article.
- Product handles: consider future redirects from legacy handles to clean Thaielehub handles.

## Google Search Console Next Steps

Use Google Search Console as the source of truth:

1. Verify `thaielehub.com` as a domain property or URL-prefix property.
2. Submit `https://thaielehub.com/sitemap.xml`.
3. Use URL Inspection on:
   - `https://thaielehub.com/`
   - `https://thaielehub.com/products/chonburi-ethical-half-day-morning-bangkok-departure`
   - `https://thaielehub.com/products/chonburi-ethical-half-day-morning-pattaya-departure`
   - `https://thaielehub.com/products/living-green-chiang-mai-ethical-half-day-morning`
   - `https://thaielehub.com/blogs/elephant-sanctuary-thailand-guides`
4. Request indexing for the homepage, key product pages and strongest FAQ/blog articles.
5. Track impressions for query groups:
   - thailand elephant sanctuary
   - chiang mai elephant sanctuary
   - bangkok elephant sanctuary day trip
   - pattaya elephant sanctuary
   - ethical elephant sanctuary thailand
   - no riding elephant sanctuary thailand

## GEO Direction

For Gemini, ChatGPT, Grok and other AI answer engines, continue strengthening:

- Clear direct-answer paragraphs near the top of pages.
- Product-specific FAQ sections.
- Consistent entity naming: Thaielehub.
- Location-specific pages for Chiang Mai, Bangkok departure, Pattaya departure and Chonburi.
- Trust signals: Tripadvisor recognition, no riding/no shows, hotel pickup rules, transparent itinerary times.
