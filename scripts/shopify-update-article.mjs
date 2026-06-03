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
    const frameEvent = (name) => new frame.contentWindow.Event(name, { bubbles: true, composed: true });
    frame.contentDocument.body.focus();
    frame.contentDocument.execCommand('selectAll', false);
    frame.contentDocument.execCommand('insertHTML', false, html);
    frame.contentDocument.body.dispatchEvent(frameEvent('input'));
    frame.contentDocument.body.dispatchEvent(frameEvent('change'));
    frame.contentDocument.body.dispatchEvent(frameEvent('blur'));
  };
  const findButton = (text) => Array.from(document.querySelectorAll('button, s-internal-button'))
    .find((button) => button.textContent.trim() === text || button.getAttribute('accessibilitylabel') === text);

  localStorage.setItem('codexPublishStatus', 'updating:' + article.handle);

  let title;
  let body;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    title = document.querySelector('s-internal-text-field[name="article.title"]');
    body = document.querySelector('textarea[name="article.body"]');
    const bodyFrame = document.querySelector('iframe[title="Rich Text Area"]');
    if (title && body && bodyFrame?.contentDocument?.body) break;
    await wait(250);
  }
  if (!title || !body) throw new Error('Required Shopify article fields are missing');

  setTextField(title, article.title);
  setValue(body, article.body);
  setEditor(document.querySelector('iframe[title="Rich Text Area"]'), article.body);

  const addExcerpt = findButton('Add Excerpt');
  if (addExcerpt) {
    addExcerpt.click();
    await wait(250);
  }
  let frames;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    frames = document.querySelectorAll('iframe[title="Rich Text Area"]');
    if (frames.length >= 2 && frames[frames.length - 1]?.contentDocument?.body) break;
    await wait(250);
  }
  if (frames.length < 2) throw new Error('Excerpt editor did not expand');
  setEditor(frames[frames.length - 1], '<p>' + article.excerpt + '</p>');
  const summary = document.querySelector('textarea[name="article.summary"]');
  if (!summary) throw new Error('Excerpt field is missing');
  setValue(summary, '<p>' + article.excerpt + '</p>');

  const edit = findButton('Edit');
  if (edit) {
    edit.click();
    await wait(250);
  }
  const seoTitle = document.querySelector('input[name="article.seo.title"]');
  const seoDescription = document.querySelector('textarea[name="article.seo.description"]');
  const handle = document.querySelector('input[name="article.handle"]');
  if (!seoTitle || !seoDescription || !handle) throw new Error('SEO fields are missing');
  setValue(seoTitle, article.seoTitle);
  setValue(seoDescription, article.seoDescription);
  setValue(handle, article.handle);

  const save = Array.from(document.querySelectorAll('button'))
    .find((button) => button.textContent.trim() === 'Save' && !button.disabled);
  if (!save) throw new Error('Enabled Save button is missing');
  save.click();
  localStorage.setItem('codexPublishStatus', 'updated:' + article.handle);
})().catch(function (error) {
  localStorage.setItem('codexPublishStatus', 'error:' + error.message);
});
`;

process.stdout.write(Buffer.from(js).toString('base64'));
