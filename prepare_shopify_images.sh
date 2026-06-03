#!/bin/zsh
set -euo pipefail

source_dir="${HOME}/Downloads/elehub"
assets_dir="shopify-theme-export/assets"

selected=("${(@f)$(find "${source_dir}" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) | sort)}")

if (( ${#selected[@]} != 95 )); then
  print -u2 "Expected 95 selected images, found ${#selected[@]}"
  exit 1
fi

for index in {1..95}; do
  printf -v gallery_name 'elehub-selected-%03d.jpg' "${index}"
  ffmpeg -y -v error -i "${selected[$index]}" \
    -vf "scale='if(gt(iw,ih),1400,-2)':'if(gt(iw,ih),-2,1400)'" \
    -q:v 5 "${assets_dir}/${gallery_name}"
done

legacy_names=(
  baby-closeup.jpg baby-fence.jpg baby-jungle.jpg baby-mom.jpg
  bamboo-raft.jpg bamboo-raft2.jpg camp-bridge.jpg camp-bridge2.jpg
  camp-elephants.jpg cooking-class.jpg cooking-class2.jpg cooking-family.jpg
  elephants-behind.jpg elephants-jungle.jpg elephants-meadow.jpg elephants-mountains.jpg
  elephants-parasol.jpg elephants-playing.jpg elephants-river.jpg family-herd.jpg
  feeding-approach.jpg feeding-couple.jpg feeding-group.jpg forest-walk.jpg
  herd-baby.jpg hero-1.jpg meal-group.jpg watching-elephant.jpg
  waterfall-couple.jpg waterfall-group.jpg waterfall-group2.jpg waterfall-solo.jpg
)

for index in {1..${#legacy_names[@]}}; do
  printf -v gallery_name 'elehub-selected-%03d.jpg' "${index}"
  legacy_name="${legacy_names[$index]}"
  find shopify-theme-export -type f \( -name '*.liquid' -o -name '*.json' \) -exec \
    perl -0pi -e "s/\\Q${legacy_name}\\E/${gallery_name}/g" {} +
  rm -f "${assets_dir}/${legacy_name}"
done

print "Prepared ${#selected[@]} selected gallery assets and refreshed ${#legacy_names[@]} legacy theme references."
