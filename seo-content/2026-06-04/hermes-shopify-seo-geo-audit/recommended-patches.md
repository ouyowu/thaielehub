# Recommended Local Patches for Thaielehub Shopify Theme

**Date:** 2026-06-04  
**Theme:** thaielehub-geo-split-header-2026-06-04 (ID: 191849759091)  
**Local Path:** shopify-theme-export  

## Patches to Apply

### 1. Remove unused variable `seo_media` in `sections/featured-product.liquid`
- **Line:** 490
- **Change:** Remove or comment out the line: `assign seo_media = product.featured_media`

### 2. Rename variable `anchorId` to `commentAnchorId` in `sections/main-article.liquid`
- **Line:** 102
- **Change:** 
  From: `{%- assign anchorId = '#Comments-' | append: article.id -%}`
  To: `{%- assign commentAnchorId = '#Comments-' | append: article.id -%}`
- **Note:** Also update any usage of `anchorId` in the same file (if any). Currently, the variable appears to be unused after assignment, but rename for consistency.

### 3. Rename variable `moduloResult` to `moduloResultDesktop` in `sections/main-list-collections.liquid`
- **Line:** 20
- **Change:** 
  From: `assign moduloResult = 28 | modulo: section.settings.columns_desktop`
  To: `assign moduloResultDesktop = 28 | modulo: section.settings.columns_desktop`
- **Note:** Update any usage of `moduloResult` in the same file (if any).

### 4. Remove unused variable `product_settings` in `sections/main-search.liquid`
- **Lines:** 274-276 (approximately)
- **Change:** Remove or comment out the capture block:
  ```
  {%- capture product_settings -%}{%- if
    section.settings.product_show_vendor -%}vendor,{%- endif -%}title,price{%- 
   endcapture -%}
  ```

### 5. Fix HardcodedRoutes in elephant policy pages
- **Files:** 
  - `sections/elephant-policy-page-v2.liquid` (line 20)
  - `sections/elephant-policy-page.liquid` (line 20)
- **Change:** 
  From: `<a class=\"ele-cta\" href=\"/\">Back to tours</a>`
  To: `<a class=\"ele-cta\" href=\"{{ routes.root_url }}\">Back to tours</a>`

### 6. Investigate `scheme_classes` undefined object warnings
- **Files:** 
  - `layout/password.liquid` (line 40)
  - `layout/theme.liquid` (line 65)
- **Note:** These warnings indicate an unknown object 'scheme_classes'. This likely requires a schema definition or is a version-specific issue. No patch applied without further investigation. Recommend reviewing the theme's schema settings and ensuring the object is defined in the appropriate schema file or via Liquid drop.

## Verification
After applying patches, run:
```bash
shopify theme check --path shopify-theme-export
```
Expect reduction in warnings (target: fix the 7 patches above, leaving only the 2 scheme_classes warnings if they persist).

## Safety
- All patches are local to the workspace; no changes pushed to Shopify.
- Do not commit or push unless explicitly requested by the owner.
- Keep a backup of original files before applying patches (e.g., copy to `shopify-theme-export.backup/`).