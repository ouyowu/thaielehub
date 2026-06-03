#!/usr/bin/env bash
set -euo pipefail

STORE="${SHOPIFY_STORE:-thaielehub.myshopify.com}"

echo "Shopify store: ${STORE}"
echo
shopify theme list --store "${STORE}"
echo
cat <<'EOF'
Theme map:
- LIVE official theme: thaielehub-live-fixed-2026-06-03 (#191803359603)
  Local path: shopify-theme-export
- DEMO only: Thaielehub Advenx Demo 2026-06-03 (#191801557363)
  Local path: shopify-theme-advenx-demo

Guardrail:
- Do not publish the Advenx demo unless the owner explicitly asks to make it live.
- Use CONFIRM_LIVE_PUSH=YES scripts/push-live-theme.sh for live changes.
EOF
