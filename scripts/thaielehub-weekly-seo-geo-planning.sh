#!/usr/bin/env bash

cat <<'EOF'
Perform a read-only weekly SEO and GEO planning review for ThaiEleHub.

First run scripts/thaielehub-seo-audit.sh. Then inspect the public storefront
homepage, blog index, FAQ article, and the Chiang Mai, Bangkok, and Pattaya
product pages.

Produce a concise Telegram-friendly prioritized backlog with sections P0, P1,
and P2. Check broken URLs, visible mojibake, visible Living Green or Big Boy
text, visible WhatsApp booking CTAs, weak or missing structured data,
internal-link gaps, missing itinerary and pickup clarity, article opportunities
for Google search, and answer-ready FAQ opportunities for AI tools such as
ChatGPT, Gemini, and Grok.

Clearly separate verified findings from suggestions. Include recommended next
actions for Codex.

Do not publish, edit Shopify, modify files, contact customers, install anything,
or call Google Maps APIs.
EOF

