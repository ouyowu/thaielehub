# Automation Workflow

This is the operating rhythm for Codex-driven long-term work.

## Tool Split

- Codex runs the actual workspace checks, reports, content drafts, and Shopify/theme audits.
- Hermes and Telegram are best used as the remote command and notification layer when the owner is away from the computer.
- Cleanup automations are read-only by default. They may recommend deletions or moves, but they must not delete, move, rename, or upload files without an explicit follow-up instruction.

## Active Automations

| Cadence | Automation ID | Purpose | Output |
| --- | --- | --- | --- |
| Every Monday 09:30 | `thaielehub-weekly-seo-geo-content-engine` | Research Reddit/Google/AI questions and draft SEO/GEO content for Thaielehub | `seo-content/YYYY-MM-DD/` |
| Every Tuesday 09:30 | `weekly-all-projects-status-scan` | Scan active local project status across key workspaces | `/Users/ouyowu/Documents/weekly-project-reports/` |
| Every Wednesday 09:30 | `thaielehub-weekly-shopify-search-health-check` | Check Shopify theme, sitemap, storefront URLs, page issues, schema, and search-health risks | `seo-content/YYYY-MM-DD/search-health-check.md` |
| Monthly on day 1 at 10:00 | `monthly-local-projects-cleanup-review` | Review old projects, backups, duplicate folders, and stale files | `/Users/ouyowu/Documents/monthly-cleanup-reports/` |

## Thaielehub Weekly Loop

1. Monday: discover search demand and produce article drafts.
2. Wednesday: check Shopify, sitemap, storefront, product pages, article pages, and SEO/GEO technical risks.
3. Use Codex to turn the highest-priority findings into actual Shopify/theme/content changes.
4. Commit and push successful changes to GitHub.
5. Keep Advenx demo and live theme separated according to `docs/SHOPIFY_THEME_GOVERNANCE.md`.

## Remote Work Pattern

When working from a phone:

1. Use Telegram/Hermes to request a specific task.
2. Let Codex perform the local work when the computer is reachable.
3. Ask Codex for the latest automation report if you need a quick status view.
4. Avoid asking Hermes to make destructive file changes directly; use it to trigger Codex or summarize reports.
