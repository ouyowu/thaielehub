import { articles } from '../seo-content/elephant-guides-2026-06.mjs';

const index = Number.parseInt(process.argv[2], 10);
const article = articles[index];

if (!article) {
  throw new Error(`Unknown article index: ${process.argv[2]}`);
}

const payload = {
  ...article,
  seoTitle: article.title.length <= 70 ? article.title : article.title.slice(0, 67).replace(/\s+\S*$/, '') + '...',
};

const js = `
(async function () {
  const article = ${JSON.stringify(payload)};
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const event = (name) => new Event(name, { bubbles: true, composed: true });
  const setValue = (element, value) => {
    const prototype = element.tagName === 'TEXTAREA'
      ? HTMLTextAreaElement.prototype
      : element.tagName === 'SELECT'
        ? HTMLSelectElement.prototype
        : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    if (setter) setter.call(element, value);
    else element.value = value;
    element.dispatchEvent(event('input'));
    element.dispatchEvent(event('change'));
  };
  const setTextField = (element, value) => {
    const input = element?.shadowRoot?.querySelector('input, textarea');
    if (!input) throw new Error('Text field input is missing');
    setValue(input, value);
  };
  const setEditor = (frame, html) => {
    if (!frame?.contentDocument?.body) throw new Error('Rich text editor is missing');
    frame.contentDocument.body.innerHTML = html;
    frame.contentDocument.body.dispatchEvent(event('input'));
    frame.contentDocument.body.dispatchEvent(event('change'));
  };
  const findButton = (text) => Array.from(document.querySelectorAll('button, s-internal-button'))
    .find((button) => button.textContent.trim() === text || button.getAttribute('accessibilitylabel') === text);

  localStorage.setItem('codexPublishStatus', 'filling:' + article.handle);

  const title = document.querySelector('s-internal-text-field[name="article.title"]');
  const body = document.querySelector('textarea[name="article.body"]');
  const visibility = document.querySelector('s-choice-list[name="visibility"]');
  const blog = document.querySelector('s-internal-single-picker-field[label="Blog"]');
  const template = document.querySelector('s-internal-select[label="Theme template"]');

  if (!title || !body || !visibility || !blog || !template) {
    throw new Error('Required Shopify fields are missing');
  }

  setTextField(title, article.title);
  setValue(body, article.body);
  setEditor(document.querySelector('iframe[title="Rich Text Area"]'), article.body);

  const addExcerpt = findButton('Add Excerpt');
  if (addExcerpt) {
    addExcerpt.click();
    await wait(250);
  }
  const frames = document.querySelectorAll('iframe[title="Rich Text Area"]');
  if (frames.length < 2) throw new Error('Excerpt editor did not expand');
  setEditor(frames[frames.length - 1], '<p>' + article.excerpt + '</p>');
  const summary = document.querySelector('textarea[name="article.summary"]');
  if (!summary) throw new Error('Excerpt field is missing');
  setValue(summary, '<p>' + article.excerpt + '</p>');

  const visible = visibility.shadowRoot?.querySelector('input[value="visible"]');
  if (!visible) throw new Error('Visible choice is missing');
  visible.click();

  blog.click();
  await wait(350);
  const blogOption = Array.from(document.querySelectorAll('s-internal-picker-option'))
    .find((option) => option.textContent.trim() === 'Elephant Care & Welfare Blog');
  if (!blogOption) {
    throw new Error('Elephant Care & Welfare Blog option is missing');
  }
  blogOption.click();

  const templateSelect = template.shadowRoot?.querySelector('select');
  if (!templateSelect) throw new Error('Template select is missing');
  setValue(templateSelect, 'elephant-care');

  const edit = findButton('Edit');
  if (edit) {
    edit.click();
    await wait(250);
    const seoTitle = document.querySelector('input[name="article.seo.title"]');
    const seoDescription = document.querySelector('textarea[name="article.seo.description"]');
    const handle = document.querySelector('input[name="article.handle"]');
    if (seoTitle) setValue(seoTitle, article.seoTitle);
    if (seoDescription) setValue(seoDescription, article.seoDescription);
    if (handle) setValue(handle, article.handle);
  }

  localStorage.setItem('codexPublishStatus', 'filled:' + article.handle);
  return localStorage.getItem('codexPublishStatus');
})().catch(function (error) {
  localStorage.setItem('codexPublishStatus', 'error:' + error.message);
});
`;

process.stdout.write(Buffer.from(js).toString('base64'));
