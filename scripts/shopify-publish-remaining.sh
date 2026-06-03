#!/bin/zsh
set -euo pipefail

run_js() {
  local payload="$1"
  osascript -e "tell application \"Google Chrome\" to execute active tab of front window javascript \"eval(atob('$payload'))\""
}

read_status() {
  osascript -e 'tell application "Google Chrome" to execute active tab of front window javascript "localStorage.getItem(\"codexPublishStatus\")"'
}

read_url() {
  osascript -e 'tell application "Google Chrome" to return URL of active tab of front window'
}

wait_for_status() {
  local expected="$1"
  local publish_status

  for _ in {1..60}; do
    publish_status="$(read_status)"
    if [[ "$publish_status" == "$expected" ]]; then
      return 0
    fi
    if [[ "$publish_status" == error:* ]]; then
      print -u2 -- "$publish_status"
      return 1
    fi
    sleep 0.5
  done

  print -u2 -- "timeout waiting for $expected, last status: $publish_status"
  return 1
}

handle_for_index() {
  node -e "import('./seo-content/elephant-guides-2026-06.mjs').then(({articles})=>process.stdout.write(articles[$1].handle))"
}

publish_current() {
  local handle="$1"
  local payload
  local current_url

  payload="$(node scripts/shopify-publish-current.mjs "$handle")"
  run_js "$payload"
  for _ in {1..60}; do
    current_url="$(read_url)"
    if [[ "$current_url" == *"/content/articles/"* && "$current_url" != *"/content/articles/new"* ]]; then
      print -- "saved $handle"
      return 0
    fi
    sleep 0.5
  done
  print -u2 -- "timeout waiting for save navigation: $handle"
  return 1
}

fill_article() {
  local index="$1"
  local handle="$2"
  local payload

  osascript -e 'tell application "Google Chrome" to set URL of active tab of front window to "https://admin.shopify.com/store/thaielehub/content/articles/new"'
  sleep 3
  payload="$(node scripts/shopify-fill-article.mjs "$index")"
  run_js "$payload"
  wait_for_status "filled:$handle"
  print -- "filled $handle"
}

for index in {2..12}; do
  handle="$(handle_for_index "$index")"
  fill_article "$index" "$handle"
  publish_current "$handle"
done

print -- "published remaining 12 articles"
