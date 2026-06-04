# Claude Code Brief: Thaielehub Shopify SEO/GEO Audit and Optimization

## Project Context

This project is the Shopify storefront for Thaielehub, an ethical elephant sanctuary booking website serving Chiang Mai, Bangkok-departure, and Pattaya-departure travelers.

- Shopify admin: `https://admin.shopify.com/store/thaielehub`
- Public domain: `https://thaielehub.com`
- Shopify fallback domain: `https://thaielehub.myshopify.com`
- Local project path: `/Users/ouyowu/Documents/大象营网站项目thaielehub`
- Official live theme local path: `shopify-theme-export`
- Advenx demo theme local path: `shopify-theme-advenx-demo`

Before making any changes, read:

- `docs/SHOPIFY_THEME_GOVERNANCE.md`
- `docs/AUTOMATION_WORKFLOW.md`
- `.planning/thaielehub-growth/task_plan.md`
- `.planning/thaielehub-growth/findings.md`
- `.planning/thaielehub-growth/progress.md`

## Important Safety Rules

1. Do not publish, overwrite, delete, or rename Shopify themes unless explicitly asked.
2. Do not touch the Advenx demo theme unless the task specifically says to work on the demo.
3. The live source of truth is `shopify-theme-export`.
4. Always run `scripts/shopify-theme-status.sh` before any Shopify theme push.
5. Always run `shopify theme check --path shopify-theme-export` before proposing a live theme update.
6. If pushing live changes is explicitly requested, use:

```bash
CONFIRM_LIVE_PUSH=YES scripts/push-live-theme.sh
```

7. Do not delete old project folders, backup zips, or unpublished Shopify themes without explicit approval.
8. Do not call paid APIs such as Google Maps API unless the user explicitly asks for it.
9. Preserve the current brand direction: Thaielehub, ethical elephant encounters, editorial serif typography, natural green/gold/cream palette, clear location labels.
10. Replace travel-brand references to `Living Green` or `Big Boy` with `Thaielehub` unless the legal company name is specifically required.

## Main Goal

Audit the entire Thaielehub Shopify website and improve SEO/GEO quality so that:

- Google can crawl and understand the site more easily.
- AI answer engines such as ChatGPT, Gemini, Grok, and Perplexity can identify Thaielehub as a relevant answer for Thailand elephant sanctuary tour questions.
- Product pages convert travelers quickly, especially on mobile.
- Blog/article pages answer real traveler questions and internally link to matching products.
- The current live Shopify theme has no serious Liquid, schema, layout, link, image, or mobile issues.

## Requested Work

### 1. Shopify Theme File Audit

Inspect all important theme files under `shopify-theme-export`, especially:

- `layout/theme.liquid`
- `templates/index.json`
- `templates/product*.json`
- `templates/blog*.json`
- `templates/article*.json`
- `sections/custom-homepage-v2.liquid`
- `sections/elephant-product-symmetry.liquid`
- `sections/elephant-care-blog.liquid`
- `sections/elephant-care-article.liquid`
- `sections/header.liquid`
- `sections/header-group.json`
- `snippets/header-split-menu.liquid`
- `snippets/elehub-editorial-header.liquid`
- `snippets/elehub-editorial-footer.liquid`
- `snippets/elephant-hotel-options.liquid`
- `assets/elehub-site.css`
- `assets/elephant-care-blog-v2.css`

Check for:

- Liquid syntax problems
- Theme check errors
- Broken snippets or missing assets
- Duplicate or conflicting headers/footers
- Broken product links
- Wrong theme IDs in scripts/docs
- Accidental demo preview code
- Visible mojibake or escaped JSON printed on pages
- Layout issues on product and article pages
- Mobile overflow, tiny touch targets, or awkward image crops
- Missing alt text or weak image semantics

Run:

```bash
shopify theme check --path shopify-theme-export
scripts/shopify-theme-status.sh
scripts/thaielehub-seo-audit.sh
```

If a script fails, document why and continue manually.

### 2. Public Storefront Audit

Inspect the public site:

- `https://thaielehub.com`
- `https://thaielehub.com/sitemap.xml`
- Product pages for Chiang Mai, Bangkok departure, and Pattaya departure tours
- Blog index: `https://thaielehub.com/blogs/elephant-sanctuary-thailand-guides`
- Recent article pages
- Cart/checkout entry points if safely accessible without placing a real order

Check:

- HTTP status codes
- Canonicals
- Title tags and meta descriptions
- Open Graph tags
- Structured data
- Internal links
- Broken links
- Duplicate content
- Sitemap availability
- Robots restrictions
- Page speed or image-size issues
- Mobile readability
- Whether the current live theme ID matches `docs/SHOPIFY_THEME_GOVERNANCE.md`

### 3. Google Indexing and Search Console Audit

Check Google index visibility using safe methods:

- `site:thaielehub.com`
- `site:thaielehub.com/blogs`
- `site:thaielehub.com/products`
- `site:thaielehub.com "elephant sanctuary"`
- Search for exact article titles when needed.

If Google Search Console access is available locally or through configured tools, inspect:

- Sitemap submission status
- Indexed pages
- Crawled but not indexed pages
- 404 or redirect errors
- Page experience / Core Web Vitals issues
- Query impressions and click-through opportunities

Do not assume Google Search Console access exists. If credentials or tools are missing, create a clear checklist for the owner.

### 4. SEO Optimization

Improve or recommend improvements for:

- Homepage title/meta
- Product titles and meta descriptions
- Product page heading structure
- Blog index title/meta
- Article title/meta/slug quality
- Internal links from articles to products
- Breadcrumbs
- FAQ blocks
- Local intent keywords:
  - Chiang Mai elephant sanctuary
  - Bangkok elephant sanctuary day trip
  - Pattaya elephant sanctuary
  - Thailand ethical elephant sanctuary
  - elephant sanctuary no riding
  - half-day elephant sanctuary Thailand
  - elephant sanctuary hotel pickup

Prefer useful, human-readable copy over keyword stuffing.

### 5. GEO / AI Search Optimization

Optimize the site so AI answer engines can cite and understand it.

Look for opportunities to add:

- Direct-answer paragraphs near the top of articles
- Clear “who this tour is for” sections
- FAQ sections with concise answers
- Comparison content:
  - Chiang Mai vs Bangkok vs Pattaya elephant sanctuary options
  - Half-day vs full-day
  - Ethical sanctuary vs elephant show/riding camp
  - Hotel pickup vs meeting point
- Schema suggestions:
  - `TravelAgency`
  - `TouristTrip`
  - `Product`
  - `FAQPage`
  - `BreadcrumbList`
  - `Article`
  - `Blog`

Do not add false claims such as “best in Thailand” unless it is carefully framed as opinion or based on verifiable recognition.

### 6. Product Page Conversion Audit

Review the booking flow and product pages for:

- Clear location labels: Chiang Mai / Bangkok departure / Pattaya departure
- Clear itinerary timeline
- Pickup area explanation
- Bangkok meeting point option hiding the hotel field when selected
- Hotel autocomplete that allows free address entry
- No WhatsApp booking CTA unless explicitly requested
- One-minute booking experience on mobile
- Full elephant/person image visibility in thumbnails where possible

### 7. Content Growth Plan

Use `seo-content/` as the working area.

Review existing:

- `seo-content/README.md`
- `seo-content/research-notes-2026-06.md`
- `seo-content/elephant-guides-2026-06.mjs`

Create a prioritized article plan based on real traveler search intent. Suggested output:

```text
seo-content/YYYY-MM-DD/claude-code-seo-geo-audit.md
seo-content/YYYY-MM-DD/article-opportunities.md
seo-content/YYYY-MM-DD/draft-01.md
```

Article topics should help travelers asking questions in Google, Reddit, ChatGPT, Gemini, Grok, and Perplexity.

## Expected Output

First produce an audit report before editing:

```text
seo-content/YYYY-MM-DD/claude-code-audit-report.md
```

The report should include:

- Executive summary
- P0 critical issues
- P1 high-value improvements
- P2 nice-to-have improvements
- Files inspected
- URLs inspected
- Shopify theme check result
- Google indexing findings
- SEO/GEO opportunities
- Recommended code/content changes
- Which changes are safe to make immediately
- Which changes require owner approval

If making edits, keep them scoped and commit them clearly.

Recommended commit format:

```bash
git add ...
git commit -m "Improve Thaielehub SEO and storefront health"
git push
```

## Current Known Theme State

At the time this brief was written:

- Live Shopify theme: `thaielehub-geo-split-header-2026-06-04`
- Live theme ID: `191849759091`
- Previous live backup: `thaielehub-live-fixed-2026-06-03` / `191803359603`
- Advenx demo: `Thaielehub Advenx Demo 2026-06-03` / `191801557363`

Verify this again before any Shopify operation because theme state can change.

## Owner Preference

The owner prefers proactive execution. Do not ask for approval for low-risk audits, reports, local analysis, or safe code/content fixes. Ask or clearly mark approval-needed only for:

- Publishing a different theme
- Deleting Shopify themes
- Deleting local files or backups
- Paid API usage
- Google Search Console submission if credentials or ownership are unclear
- Major brand direction changes
