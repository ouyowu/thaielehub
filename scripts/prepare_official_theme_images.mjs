import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const manifestPath = '/tmp/thaielehub-official-images/image-manifest.json';
const themeAssets = 'shopify-theme-export/assets';
const backupDir = '/tmp/thaielehub-old-elehub-selected-assets';
const selectedPath = '/tmp/thaielehub-official-images/selected-theme-images.json';

function canonical(url) {
  const parsed = new URL(url);
  let path = parsed.pathname;
  path = path.replace(/-\d+x\d+(?=\.(jpe?g|png|webp)$)/i, '');
  return `${parsed.hostname}${path}`.toLowerCase();
}

function classify(item) {
  const ratio = item.width / item.height;
  const url = item.url.toLowerCase();
  const isBigboy = url.includes('bigboyelephantsanctuary.com');
  const isChonburi = url.includes('/chonburi/') || url.includes('/gallery/');
  const isLandscape = ratio >= 1.15;
  const isPortrait = ratio < 0.85;
  const isOriginalSized = !/-\d+x\d+(?=\.(jpe?g|png|webp))/i.test(url);
  return { ratio, isBigboy, isChonburi, isLandscape, isPortrait, isOriginalSized };
}

function score(item) {
  const c = classify(item);
  let value = item.area;
  if (c.isOriginalSized) value += 2_000_000;
  if (c.isLandscape) value += 1_500_000;
  if (c.isBigboy) value += 800_000;
  if (c.isPortrait) value -= 900_000;
  if (/logo|favicon|winner|badge|award|icon/i.test(item.url)) value -= 10_000_000;
  return value;
}

function uniqueBest(downloaded) {
  const best = new Map();
  for (const item of downloaded) {
    if (item.width < 700 || item.height < 400 || item.bytes < 40_000) continue;
    const key = canonical(item.url);
    const previous = best.get(key);
    if (!previous || score(item) > score(previous)) best.set(key, item);
  }
  return [...best.values()];
}

function arrange(items) {
  const landscapes = items
    .filter((item) => classify(item).isLandscape)
    .sort((a, b) => score(b) - score(a));
  const bigboy = landscapes
    .filter((item) => classify(item).isBigboy)
    .sort((a, b) => score(b) - score(a));
  const livingGreen = landscapes
    .filter((item) => !classify(item).isBigboy)
    .sort((a, b) => score(b) - score(a));
  const portraits = items
    .filter((item) => !classify(item).isLandscape)
    .sort((a, b) => score(b) - score(a));

  const chosen = [];
  const seen = new Set();
  const add = (list, limit = Infinity) => {
    for (const item of list) {
      if (chosen.length >= 95 || limit <= 0) break;
      const key = canonical(item.url);
      if (seen.has(key)) continue;
      chosen.push(item);
      seen.add(key);
      limit--;
    }
  };

  // Put varied, crop-friendly images in the early slots used by homepage and product pages.
  add(livingGreen.slice(0, 22));
  add(bigboy.slice(0, 18));
  add(livingGreen.slice(22, 64));
  add(bigboy.slice(18));
  add(portraits);
  add(items.sort((a, b) => score(b) - score(a)));
  return chosen.slice(0, 95);
}

async function convertToJpeg(input, output) {
  await execFileAsync('sips', ['-s', 'format', 'jpeg', input, '--out', output], { maxBuffer: 1024 * 1024 * 4 });
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const candidates = uniqueBest(manifest.downloaded);
const chosen = arrange(candidates);
if (chosen.length < 95) {
  throw new Error(`Only ${chosen.length} usable unique images available, expected 95`);
}

await mkdir(backupDir, { recursive: true });
for (let index = 1; index <= 95; index++) {
  const name = `elehub-selected-${String(index).padStart(3, '0')}.jpg`;
  const target = join(themeAssets, name);
  const backup = join(backupDir, name);
  if (existsSync(target) && !existsSync(backup)) await copyFile(target, backup);
  await convertToJpeg(chosen[index - 1].file, target);
}

await writeFile(selectedPath, JSON.stringify(chosen.map((item, index) => ({
  slot: `elehub-selected-${String(index + 1).padStart(3, '0')}.jpg`,
  width: item.width,
  height: item.height,
  bytes: item.bytes,
  url: item.url,
  file: item.file,
})), null, 2));

console.log(JSON.stringify({
  candidates: candidates.length,
  selected: chosen.length,
  backupDir,
  selectedPath,
  first: chosen.slice(0, 8).map((item) => ({ width: item.width, height: item.height, url: item.url })),
}, null, 2));
