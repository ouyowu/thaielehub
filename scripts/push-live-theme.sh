#!/usr/bin/env bash
set -euo pipefail

STORE="${SHOPIFY_STORE:-thaielehub.myshopify.com}"
LIVE_THEME_ID="${SHOPIFY_LIVE_THEME_ID:-191849759091}"
THEME_PATH="shopify-theme-export"

if [[ "${CONFIRM_LIVE_PUSH:-}" != "YES" ]]; then
  cat >&2 <<'EOF'
Refusing to push to the live Shopify theme.

Run this only after checking the theme list and verification:

  CONFIRM_LIVE_PUSH=YES scripts/push-live-theme.sh
EOF
  exit 2
fi

if [[ ! -d "${THEME_PATH}" ]]; then
  echo "Missing ${THEME_PATH}" >&2
  exit 1
fi

shopify theme check --path "${THEME_PATH}" || {
  echo "Theme check failed. Fix issues before live push." >&2
  exit 1
}

shopify theme push \
  --store "${STORE}" \
  --theme "${LIVE_THEME_ID}" \
  --path "${THEME_PATH}" \
  --allow-live \
  --nodelete
