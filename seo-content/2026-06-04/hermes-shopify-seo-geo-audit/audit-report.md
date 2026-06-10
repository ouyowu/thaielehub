# Hermes Shopify SEO/GEO Audit Report

**Date:** 2026-06-04  
**Store:** ThaiEleHub (thaielehub.com)  
**Live Theme:** thaielehub-geo-split-header-2026-06-04 (ID: 191849759091)  
**Local Theme Path:** shopify-theme-export  

## Executive Summary
Performed a read‑first audit of the Thaielehub Shopify storefront, theme files, public URLs, and SEO/GEO opportunities. The theme check revealed 9 warnings (mostly Liquid syntax and unused variables). The public site returns HTTP 200 on key pages and includes proper structured data (FAQPage, TravelAgency). One failure was reported by the SEO audit script: "Legacy brand text is still visible in fetched page text", though a quick grep for "Living Green" / "Big Boy" on the homepage did not show matches—likely the text appears in deeper cached content or non‑homepage sections. No WhatsApp booking CTAs were detected.

Overall, the store is in good health with minor theme‑code improvements and SEO/GEO enhancements available.

## Commands Run
```bash
scripts/shopify-theme-status.sh
shopify theme check --path shopify-theme-export
scripts/thaielehub-seo-audit.sh
curl -s https://thaielehub.com | grep -i title
curl -s https://thaielehub.com | grep -i "living green\|big boy"
```

## Files Inspected (Theme)
- layout/theme.liquid
- layout/password.liquid
- sections/elephant-policy-page-v2.liquid
- sections/elephant-policy-page.liquid
- sections/featured-product.liquid
- sections/main-article.liquid
- sections/main-list-collections.liquid
- sections/main-search.liquid
- snippets/quick-order-product-row.liquid
- assets/elehub-site.css
- assets/elephant-care-blog-v2.css
- sections/custom-homepage-v2.liquid
- sections/elephant-product-symmetry.liquid
- sections/elephant-care-blog.liquid
- sections/elephant-care-article.liquid
- sections/header.liquid
- sections/header-group.json
- snippets/header-split-menu.liquid
- snippets/elehub-editorial-header.liquid
- snippets/elehub-editorial-footer.liquid
- snippets/elephant-hotel-options.liquid

## URLs Inspected
- https://thaielehub.com/
- https://thaielehub.com/sitemap.xml
- https://thaielehub.com/blogs/elephant-sanctuary-thailand-guides?view=elephant-care
- https://thaielehub.com/blogs/elephant-sanctuary-thailand-guides/thailand-elephant-sanctuary-faq-before-booking?view=elephant-care
- https://thaielehub.com/products/living-green-chiang-mai-ethical-half-day-morning
- https://thaielehub.com/products/chonburi-ethical-half-day-morning-bangkok-departure
- https://thaielehub.com/products/chonburi-ethical-half-day-morning-pattaya-departure

## Theme Check Result
```
186 files inspected with 9 total offenses found across 9 files.
9 warnings.
```
Details:
- `layout/password.liquid`: UndefinedObject – Unknown object 'scheme_classes' used.
- `layout/theme.liquid`: UndefinedObject – Unknown object 'scheme_classes' used.
- `sections/elephant-policy-page-v2.liquid`: HardcodedRoutes – Use routes object {{ routes.root_url }} instead of hardcoding /.
- `sections/elephant-policy-page.liquid`: HardcodedRoutes – Use routes object {{ routes.root_url }} instead of hardcoding /.
- `sections/featured-product.liquid`: UnusedAssign – The variable 'seo_media' is assigned but not used.
- `sections/main-article.liquid`: VariableName – The variable 'anchorId' uses wrong naming format.
- `sections/main-list-collections.liquid`: VariableName – The variable 'moduloResult' uses wrong naming format.
- `sections/main-search.liquid`: UnusedAssign – The variable 'product_settings' is assigned but not used.
- `snippets/quick-order-product-row.liquid`: OrphanedSnippet – This snippet is not referenced by any other files.

## Shopify Theme Status
- LIVE official theme: thaielehub-geo-split-header-2026-06-04 (#191849759091) – Local path: shopify-theme-export
- DEMO only: Thaielehub Advenx Demo 2026-06-03 (#191801557363) – Local path: shopify-theme-advenx-demo

## Google Indexing Result
From `scripts/thaielehub-seo-audit.sh`:
- PASS HTTP 200 on homepage, sitemap.xml, blog FAQ, product pages (Chiang Mai, Bangkok, Pattaya departures).
- PASS No common mojibake markers detected.
- FAIL Legacy brand text is still visible in fetched page text.
- PASS No WhatsApp booking CTA detected.
- PASS FAQPage structured data detected.
- PASS TravelAgency structured data detected.

## P0 Critical Issues
- None detected that would break storefront or violate safety rules.

## P1 High-Value Improvements
1. **Fix Liquid warnings** in layout and sections to eliminate undefined object and hardcoded route warnings.
2. **Remove unused variables** (`seo_media`, `product_settings`) and orphaned snippet to clean up theme.
3. **Standardize variable naming** (`anchorId`, `moduloResult`) to follow Shopify Liquid conventions.
4. **Investigate legacy brand text** ("Living Green", "Big Boy") – ensure all instances are replaced with "Thaielehub" across theme files, snippets, and assets.

## P2 Nice-to-Have Improvements
- Add `alt` text improvements for product images where missing.
- Enhance mobile tap sizes and avoid overflow in product grids.
- Add BreadcrumbList schema to article and product templates.
- Expand FAQPage blocks on product pages for GEO/AI answer optimization.
- Add direct‑answer intros at the top of long‑form blog articles.

## Safe Local Patches Prepared
- Patch to remove unused `seo_media` assignment in `sections/featured-product.liquid`.
- Patch to rename `anchorId` to `commentAnchorId` in `sections/main-article.liquid`.
- Patch to rename `moduloResult` to `moduloResultDesktop` in `sections/main-list-collections.liquid`.
- Patch to remove unused `product_settings` in `sections/main-search.liquid`.
- Patch to replace hardcoded `/` with `{{ routes.root_url }}` in both elephant‑policy‑page*.liquid files.
- Note: The `scheme_classes` undefined object warnings require upstream investigation (likely a missing schema definition); no local patch applied without further context.

## Owner‑Approval‑Needed Items
- Any changes to live theme files (even if local patches) must be reviewed before pushing to Shopify.
- Submission of sitemap changes to Google Search Console (requires explicit credentials and approval).
- Any edits to the Advenx demo theme (unless explicitly asked to replace live theme).

## Recommended Next Codex Actions
1. Apply the safe local patches listed above to `shopify-theme-export`.
2. Run `shopify theme check --path shopify-theme-export` again to confirm warnings are reduced.
3. Verify that the legacy brand text failure is resolved by searching theme files for "Living Green" and "Big Boy" and replacing with "Thaielehub".
4. After local verification, prepare a commit diff for owner review; do not push to Shopify without explicit instruction.
5. Optionally, draft SEO/GEO content improvements (FAQ expansions, direct‑answer intros) in `seo-content/2026-06-04/` for future implementation.