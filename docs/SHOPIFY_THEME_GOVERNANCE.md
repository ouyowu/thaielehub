# Thaielehub Shopify Theme Governance

This file is the safety map for working on the Thaielehub Shopify site from any computer or Codex session.

## Current Theme Registry

| Purpose | Shopify theme name | Theme ID | Local path | Status |
| --- | --- | --- | --- | --- |
| Official live storefront | `thaielehub-geo-split-header-2026-06-04` | `191849759091` | `shopify-theme-export` | Live |
| Advenx-style demo only | `Thaielehub Advenx Demo 2026-06-03` | `191801557363` | `shopify-theme-advenx-demo` | Unpublished |
| Historical backups | Multiple unpublished themes | See `shopify theme list` | N/A | Do not edit unless restoring |

## Rules

1. Always run `scripts/shopify-theme-status.sh` before pushing a theme.
2. Push the official site only from `shopify-theme-export`.
3. Push the Advenx demo only from `shopify-theme-advenx-demo`.
4. Do not publish the Advenx demo unless the owner explicitly says to replace the live theme with the demo.
5. Do not delete backup themes from Shopify unless the owner explicitly asks for cleanup.
6. Use `--nodelete` for theme pushes so Shopify-only files are not accidentally removed.
7. Run `shopify theme check --path shopify-theme-export` before pushing the live theme whenever the Shopify CLI supports it.
8. If a browser shows a Shopify preview bar at the bottom, click `Exit preview` before judging the public `thaielehub.com` live storefront.

## Safe Commands

Check themes:

```bash
scripts/shopify-theme-status.sh
```

Push official live theme after checks:

```bash
CONFIRM_LIVE_PUSH=YES scripts/push-live-theme.sh
```

Push demo theme without publishing:

```bash
scripts/push-advenx-demo.sh
```

## Current Public Domain

- Primary domain target: `thaielehub.com`
- Shopify fallback domain: `thaielehub.myshopify.com`

When domain or sitemap work is needed, verify the live theme first, then submit or inspect sitemap URLs from:

- `https://thaielehub.com/sitemap.xml`
- `https://thaielehub.myshopify.com/sitemap.xml`
