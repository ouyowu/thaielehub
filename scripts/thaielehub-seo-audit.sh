#!/usr/bin/env bash

set -u
shopt -s nullglob

BASE_URL="${THAIELEHUB_BASE_URL:-https://thaielehub.myshopify.com}"
TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/thaielehub-seo-audit.XXXXXX")"
trap 'rm -rf "$TMP_DIR"' EXIT

checks=0
failures=0

pass() {
  checks=$((checks + 1))
  printf 'PASS  %s\n' "$1"
}

fail() {
  checks=$((checks + 1))
  failures=$((failures + 1))
  printf 'FAIL  %s\n' "$1"
}

fetch_page() {
  local slug="$1"
  local route="$2"
  local file="$TMP_DIR/$slug.html"
  local separator='?'
  local code

  if [[ "$route" == *'?'* ]]; then
    separator='&'
  fi

  if ! code="$(curl --location --silent --show-error \
    --output "$file" \
    --write-out '%{http_code}' \
    "${BASE_URL}${route}${separator}hermes_audit=$(date +%s)" 2>/dev/null)"; then
    code='000'
  fi

  if [[ "$code" == '200' ]]; then
    pass "HTTP 200: $route"
  else
    : > "$file"
    fail "HTTP $code: $route"
  fi
}

printf '[ThaiEleHub SEO/GEO Audit]\n'
printf 'Checked: %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')"
printf 'Site: %s\n\n' "$BASE_URL"

fetch_page home '/'
fetch_page sitemap '/sitemap.xml'
fetch_page blog '/blogs/elephant-sanctuary-thailand-guides?view=elephant-care'
fetch_page faq '/blogs/elephant-sanctuary-thailand-guides/thailand-elephant-sanctuary-faq-before-booking?view=elephant-care'
fetch_page chiangmai '/products/living-green-chiang-mai-ethical-half-day-morning'
fetch_page bangkok '/products/chonburi-ethical-half-day-morning-bangkok-departure'
fetch_page pattaya '/products/chonburi-ethical-half-day-morning-pattaya-departure'

html_files=("$TMP_DIR"/*.html)
visible_text="$TMP_DIR/visible-text.txt"

for html_file in "${html_files[@]}"; do
  perl -0777 -pe 's#<script\b[^>]*>.*?</script>##gis; s#<style\b[^>]*>.*?</style>##gis; s#<[^>]+># #g' "$html_file"
done > "$visible_text"

if rg -q 'â|â€|Ã.|\\uFFFD' "${html_files[@]}"; then
  fail 'Possible mojibake detected in public HTML'
else
  pass 'No common mojibake markers detected'
fi

if rg -qi 'living green|big boy' "$visible_text"; then
  fail 'Legacy brand text is still visible in fetched page text'
else
  pass 'No visible Living Green or Big Boy text detected'
fi

if rg -qi 'book now via whatsapp|book via whatsapp' "$visible_text"; then
  fail 'WhatsApp booking CTA is still visible'
else
  pass 'No WhatsApp booking CTA detected'
fi

if rg -q '"@type"[[:space:]]*:[[:space:]]*"FAQPage"' "$TMP_DIR/faq.html"; then
  pass 'FAQPage structured data detected'
else
  fail 'FAQPage structured data missing'
fi

if rg -q '"@type"[[:space:]]*:[[:space:]]*"TravelAgency"' "$TMP_DIR/faq.html"; then
  pass 'TravelAgency structured data detected'
else
  fail 'TravelAgency structured data missing'
fi

printf '\nSummary: %d checks, %d failures\n' "$checks" "$failures"

if (( failures > 0 )); then
  exit 1
fi
