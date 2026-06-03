import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { pipeline } from 'node:stream/promises';

const seeds = [
  'https://www.livinggreenelephantsanctuary.com/',
  'https://www.bigboyelephantsanctuary.com/',
];

const outputRoot = '/tmp/thaielehub-official-images';
const rawDir = join(outputRoot, 'raw');
const manifestPath = join(outputRoot, 'image-manifest.json');
const pageLimit = 80;
const allowedHosts = new Set([
  'www.livinggreenelephantsanctuary.com',
  'livinggreenelephantsanctuary.com',
  'www.bigboyelephantsanctuary.com',
  'bigboyelephantsanctuary.com',
]);

function normalizeUrl(url) {
  const parsed = new URL(url);
  parsed.hash = '';
  return parsed.toString();
}

function isInternalPage(url) {
  try {
    const parsed = new URL(url);
    if (!allowedHosts.has(parsed.hostname)) return false;
    if (/\.(jpg|jpeg|png|webp|gif|svg|ico|css|js|pdf|zip)$/i.test(parsed.pathname)) return false;
    if (/wp-admin|wp-json|xmlrpc|feed|comments|cart|checkout|author|admin-ajax/i.test(parsed.pathname)) return false;
    return true;
  } catch {
    return false;
  }
}

function isImageUrl(url) {
  try {
    const parsed = new URL(url);
    if (!allowedHosts.has(parsed.hostname)) return false;
    if (!/\.(jpg|jpeg|png|webp)(\?|$)/i.test(parsed.pathname)) return false;
    if (/logo|favicon|icon|apple-touch|gravatar|emoji|winner|badge|award/i.test(parsed.pathname)) return false;
    return true;
  } catch {
    return false;
  }
}

function extractUrls(html, baseUrl) {
  const pageUrls = new Set();
  const imageUrls = new Set();
  const add = (raw) => {
    if (!raw) return;
    const cleaned = raw.replace(/&amp;/g, '&').trim();
    if (!cleaned || cleaned.startsWith('data:') || cleaned.startsWith('#')) return;
    try {
      const absolute = normalizeUrl(new URL(cleaned, baseUrl).toString());
      if (isImageUrl(absolute)) imageUrls.add(absolute);
      if (isInternalPage(absolute)) pageUrls.add(absolute);
    } catch {}
  };

  for (const match of html.matchAll(/\b(?:src|href|content|data-src|data-lazy-src|data-bg|data-background)=["']([^"']+)["']/gi)) {
    add(match[1]);
  }
  for (const match of html.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
    for (const part of match[1].split(',')) add(part.trim().split(/\s+/)[0]);
  }
  for (const match of html.matchAll(/url\((["']?)([^"')]+)\1\)/gi)) {
    add(match[2]);
  }
  return { pageUrls, imageUrls };
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/148 Safari/537.36',
      accept: 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return await response.text();
}

function imageDimensions(buffer) {
  if (buffer.length < 32) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      offset += 2 + length;
    }
  }
  if (buffer.toString('ascii', 1, 4) === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    const type = buffer.toString('ascii', 12, 16);
    if (type === 'VP8X') {
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
      };
    }
    if (type === 'VP8 ' && buffer.length > 30) {
      return {
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff,
      };
    }
  }
  return null;
}

async function downloadImage(url, index) {
  const parsed = new URL(url);
  const extension = extname(parsed.pathname).toLowerCase().replace('.jpeg', '.jpg') || '.jpg';
  const safeBase = basename(parsed.pathname).replace(/[^a-z0-9._-]/gi, '-').slice(0, 120);
  const file = join(rawDir, `${String(index).padStart(4, '0')}-${safeBase}${extension && !safeBase.endsWith(extension) ? extension : ''}`);
  const response = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 AppleWebKit/537.36 Chrome/148 Safari/537.36' },
    redirect: 'follow',
  });
  if (!response.ok || !response.body) throw new Error(`${response.status} ${response.statusText}`);
  await pipeline(response.body, createWriteStream(file));
  const bytes = await readFile(file);
  const dimensions = imageDimensions(bytes);
  return {
    url,
    file,
    bytes: bytes.length,
    width: dimensions?.width || 0,
    height: dimensions?.height || 0,
    area: (dimensions?.width || 0) * (dimensions?.height || 0),
  };
}

await mkdir(rawDir, { recursive: true });

const queue = seeds.map(normalizeUrl);
const seenPages = new Set();
const images = new Set();
const pages = [];

while (queue.length && seenPages.size < pageLimit) {
  const url = queue.shift();
  if (!url || seenPages.has(url)) continue;
  seenPages.add(url);
  try {
    const html = await fetchText(url);
    await writeFile(join(outputRoot, `page-${String(seenPages.size).padStart(3, '0')}.html`), html);
    pages.push(url);
    const { pageUrls, imageUrls } = extractUrls(html, url);
    for (const image of imageUrls) images.add(image);
    for (const page of pageUrls) {
      if (!seenPages.has(page) && queue.length < pageLimit * 3) queue.push(page);
    }
    console.log(`page ${seenPages.size}: ${url} images=${images.size} queue=${queue.length}`);
  } catch (error) {
    console.warn(`page failed: ${url} ${error.message}`);
  }
}

const imageUrls = [...images].sort();
const downloaded = [];
let index = 1;
for (const url of imageUrls) {
  try {
    const item = await downloadImage(url, index++);
    if (item.width >= 700 && item.height >= 400 && item.bytes >= 40000) downloaded.push(item);
    console.log(`image ${downloaded.length}/${imageUrls.length}: ${item.width}x${item.height} ${item.url}`);
  } catch (error) {
    console.warn(`image failed: ${url} ${error.message}`);
  }
}

downloaded.sort((a, b) => b.area - a.area || b.bytes - a.bytes);
await writeFile(manifestPath, JSON.stringify({ pages, imageUrls, downloaded }, null, 2));
console.log(JSON.stringify({ pages: pages.length, imageUrls: imageUrls.length, usableImages: downloaded.length, manifestPath }, null, 2));
