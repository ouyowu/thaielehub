import fs from 'node:fs/promises';

const store = 'yw1nvf-tv.myshopify.com';
const dataPath = new URL('./generated-articles/thaielehub-seo-geo-articles-2026-06-06.json', import.meta.url);
const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
const token = process.env.SHOPIFY_ADMIN_TOKEN;
if (!token) throw new Error('Set SHOPIFY_ADMIN_TOKEN with read_content/write_content scopes.');

async function gql(query, variables = {}) {
  const res = await fetch(`https://${store}/admin/api/2026-04/graphql.json`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(JSON.stringify(json, null, 2));
  return json.data;
}

const blogs = await gql(`query { blogs(first: 50) { nodes { id handle title } } }`);
const blog = blogs.blogs.nodes.find(b => b.handle === data.blogHandle);
if (!blog) throw new Error(`Blog not found: ${data.blogHandle}`);

const mutation = `mutation ArticleCreate($article: ArticleCreateInput!) {
  articleCreate(article: $article) {
    article { id handle title onlineStoreUrl }
    userErrors { field message }
  }
}`;

const results = [];
for (const a of data.articles) {
  const body = `${a.body}\n<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.seoDescription,
    image: `https://thaielehub.com/cdn/shop/t/16/assets/${a.image}`,
    author: { '@type': 'Organization', name: 'ThaiEleHub' },
    publisher: { '@type': 'Organization', name: 'ThaiEleHub', url: 'https://thaielehub.com' },
    mainEntityOfPage: `https://thaielehub.com/blogs/${data.blogHandle}/${a.handle}`
  })}</script>`;
  const variables = {
    article: {
      blogId: blog.id,
      title: a.title,
      handle: a.handle,
      body,
      summary: a.excerpt,
      tags: a.tags,
      isPublished: true,
      image: { src: `https://thaielehub.com/cdn/shop/t/16/assets/${a.image}`, altText: a.title },
      seo: { title: a.title.slice(0, 70), description: a.seoDescription.slice(0, 320) }
    }
  };
  const created = await gql(mutation, variables);
  const payload = created.articleCreate;
  if (payload.userErrors?.length) results.push({ title: a.title, errors: payload.userErrors });
  else results.push(payload.article);
}
console.log(JSON.stringify(results, null, 2));
