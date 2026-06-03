#!/bin/zsh
set -euo pipefail

article_ids=(
  1000810938739
  1000811004275
  1000811037043
  1000811102579
  1000811135347
  1000811168115
  1000811200883
  1000811233651
  1000811266419
  1000811299187
  1000811331955
  1000811364723
  1000811430259
)

read_status() {
  osascript -e 'tell application "Google Chrome" to execute active tab of front window javascript "localStorage.getItem(\"codexPublishStatus\")"'
}

start_index="${1:-0}"

for index in {$start_index..12}; do
  id="${article_ids[$((index + 1))]}"
  handle="$(node -e "import('./seo-content/elephant-guides-2026-06.mjs').then(({articles})=>process.stdout.write(articles[$index].handle))")"

  osascript -e "tell application \"Google Chrome\" to set URL of active tab of front window to \"https://admin.shopify.com/store/thaielehub/content/articles/$id\""
  sleep 3
  payload="$(node scripts/shopify-update-article.mjs "$index")"
  osascript -e "tell application \"Google Chrome\" to execute active tab of front window javascript \"eval(atob('$payload'))\""

  for _ in {1..30}; do
    rewrite_status="$(read_status)"
    if [[ "$rewrite_status" == "updated:$handle" ]]; then
      print -- "updated $handle"
      break
    fi
    if [[ "$rewrite_status" == error:* ]]; then
      print -u2 -- "$rewrite_status"
      return 1
    fi
    sleep 0.5
  done
  sleep 4
done

print -- "rewrote 13 published articles"
