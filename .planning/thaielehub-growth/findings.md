# Findings

## 2026-06-03

- Local repo is clean on `main` and tracks `origin/main`.
- Official theme directory exists at `shopify-theme-export`.
- Advenx demo theme directory exists at `shopify-theme-advenx-demo`.
- Live Shopify theme is `thaielehub-geo-split-header-2026-06-04` with ID `191849759091`.
- Previous live theme `thaielehub-live-fixed-2026-06-03` with ID `191803359603` is now an unpublished backup.
- Advenx demo theme is unpublished: `Thaielehub Advenx Demo 2026-06-03` with ID `191801557363`.
- Historical unpublished themes remain in Shopify and should be treated as backups unless explicitly promoted.
- Existing custom storefront work includes:
  - Symmetry-style product pages with itinerary timelines and booking fields.
  - Hotel autocomplete via local datalist options.
  - Bangkok meeting-point logic that hides the hotel field when selected.
  - Editorial article/blog templates.
  - Tripadvisor award section.
  - Custom editorial header/footer.
- `seo-content/` already contains June research notes and article generation scripts.
- Existing weekly SEO/GEO helper script is read-only and Telegram-friendly, but it does not write draft articles.
- Google Search Console automation skill is installed, but its external Rube MCP tools were not exposed in this session yet.
- Weekly Codex automation has been created:
  - ID: `thaielehub-weekly-seo-geo-content-engine`
  - Cadence: Monday morning in the local timezone
  - Output target: `seo-content/YYYY-MM-DD/`
