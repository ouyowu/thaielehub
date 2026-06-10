import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const store = 'yw1nvf-tv.myshopify.com';
const dataPath = new URL('./generated-articles/thaielehub-seo-geo-articles-2026-06-06.json', import.meta.url);
const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));

async function runShopify(query, variables = {}, allowMutations = false) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'thaielehub-shopify-'));
  const queryFile = path.join(dir, 'operation.graphql');
  const varsFile = path.join(dir, 'variables.json');
  await fs.writeFile(queryFile, query);
  await fs.writeFile(varsFile, JSON.stringify(variables));
  const args = [
    'store', 'execute',
    '--store', store,
    '--json',
    '--query-file', queryFile,
    '--variable-file', varsFile,
  ];
  if (allowMutations) args.push('--allow-mutations');
  const out = execFileSync('shopify', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return JSON.parse(out);
}

const blogData = await runShopify(`
  query BlogByHandle {
    blogs(first: 50) {
      nodes {
        id
        handle
        title
        articles(first: 250) {
          nodes { id handle title }
        }
      }
    }
  }
`);

const blog = blogData.blogs.nodes.find((b) => b.handle === data.blogHandle);
if (!blog) throw new Error(`Blog not found: ${data.blogHandle}`);

const existing = new Map(blog.articles.nodes.map((article) => [article.handle, article]));
const results = [];

const articleFields = `
  id
  handle
  title
`;

for (const a of data.articles) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.seoDescription,
    image: `https://thaielehub.com/cdn/shop/t/16/assets/${a.image}`,
    author: { '@type': 'Organization', name: 'ThaiEleHub' },
    publisher: { '@type': 'Organization', name: 'ThaiEleHub', url: 'https://thaielehub.com' },
    mainEntityOfPage: `https://thaielehub.com/blogs/${data.blogHandle}/${a.handle}`,
  };
  const body = `${a.body}\n<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
  const baseArticle = {
    title: a.title,
    handle: a.handle,
    body,
    summary: a.excerpt,
    tags: a.tags,
    isPublished: true,
    author: {
      name: 'ThaiEleHub Editorial Team',
    },
    image: {
      url: `https://thaielehub.com/cdn/shop/t/16/assets/${a.image}`,
      altText: a.title,
    },
  };

  if (existing.has(a.handle)) {
    const current = existing.get(a.handle);
    const res = await runShopify(`
      mutation ArticleUpdate($id: ID!, $article: ArticleUpdateInput!) {
        articleUpdate(id: $id, article: $article) {
          article { ${articleFields} }
          userErrors { field message }
        }
      }
    `, { id: current.id, article: baseArticle }, true);
    results.push({ action: 'updated', ...res.articleUpdate.article, errors: res.articleUpdate.userErrors });
  } else {
    const res = await runShopify(`
      mutation ArticleCreate($article: ArticleCreateInput!) {
        articleCreate(article: $article) {
          article { ${articleFields} }
          userErrors { field message }
        }
      }
    `, { article: { blogId: blog.id, ...baseArticle } }, true);
    results.push({ action: 'created', ...res.articleCreate.article, errors: res.articleCreate.userErrors });
  }
}

console.log(JSON.stringify({
  blog: { id: blog.id, handle: blog.handle, title: blog.title },
  results,
  urls: results.map((r) => `https://thaielehub.com/blogs/${data.blogHandle}/${r.handle}`),
}, null, 2));
