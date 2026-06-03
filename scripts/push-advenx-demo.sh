#!/usr/bin/env bash
set -euo pipefail

STORE="${SHOPIFY_STORE:-thaielehub.myshopify.com}"
DEMO_THEME_ID="${SHOPIFY_ADVENX_DEMO_THEME_ID:-191801557363}"
THEME_PATH="shopify-theme-advenx-demo"

if [[ ! -d "${THEME_PATH}" ]]; then
  echo "Missing ${THEME_PATH}" >&2
  exit 1
fi

shopify theme check --path "${THEME_PATH}" || {
  echo "Theme check failed. Fix issues before demo push." >&2
  exit 1
}

shopify theme push \
  --store "${STORE}" \
  --theme "${DEMO_THEME_ID}" \
  --path "${THEME_PATH}" \
  --unpublished \
  --nodelete
