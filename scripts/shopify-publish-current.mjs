const expectedHandle = process.argv[2];

if (!expectedHandle) {
  throw new Error('Expected handle is required');
}

const js = `
(async function () {
  const expectedHandle = ${JSON.stringify(expectedHandle)};
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const handle = document.querySelector('input[name="article.handle"]')?.value;

  if (handle !== expectedHandle) {
    throw new Error('Handle mismatch: expected ' + expectedHandle + ', found ' + handle);
  }

  const save = Array.from(document.querySelectorAll('button'))
    .find((button) => button.textContent.trim() === 'Save' && !button.disabled);
  if (!save) throw new Error('Enabled Save button is missing');

  localStorage.setItem('codexPublishStatus', 'saving:' + expectedHandle);
  save.click();
})().catch(function (error) {
  localStorage.setItem('codexPublishStatus', 'error:' + error.message);
});
`;

process.stdout.write(Buffer.from(js).toString('base64'));
