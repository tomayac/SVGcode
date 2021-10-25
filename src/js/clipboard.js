import { inputImage, copyButton, pasteButton, svgOutput } from './domrefs.js';
import { optimizeSVG } from './svgo.js';
import { showToast } from './ui.js';
import { i18n } from './i18n.js';

pasteButton.addEventListener('click', async () => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    console.log(clipboardItems);
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        if (type.startsWith('image/')) {
          const image = await clipboardItem.getType(type);
          if (!image) {
            return;
          }
          const blobURL = URL.createObjectURL(image);
          inputImage.src = blobURL;
          return;
        }
      }
    }
  } catch (err) {
    console.error(err.name, err.message);
    showToast(err.message);
  }
});

document.addEventListener('paste', (e) => {
  try {
    if (!e.clipboardData.files.length) {
      return;
    }
    const file = e.clipboardData.files[0];
    if (file.type.startsWith('image/')) {
      const blobURL = URL.createObjectURL(file);
      inputImage.src = blobURL;
      return;
    }
  } catch (err) {
    console.error(err.name, err.message);
    showToast(err.message);
  }
});

copyButton.addEventListener('click', async () => {
  let svg = svgOutput.innerHTML;
  showToast(i18n.t('optimizingSVG'));
  try {
    // Safari treats user activation differently:
    // https://bugs.webkit.org/show_bug.cgi?id=222262.
    navigator.clipboard.write([
      new ClipboardItem({
        'text/plain': new Promise(async (resolve) => {
          svg = await optimizeSVG(svg);
          resolve(new Blob([svg], { type: 'text/plain' }));
        }),
        'image/svg+xml': new Promise(async (resolve) => {
          svg = await optimizeSVG(svg);
          resolve(new Blob([svg], { type: 'image/svg+xml' }));
        }),
      }),
    ]);
  } catch {
    // Chromium
    svg = await optimizeSVG(svg);
    const textBlob = new Blob([svg], { type: 'text/plain' });
    const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
    navigator.clipboard.write([
      new ClipboardItem({
        [svgBlob.type]: svgBlob,
        [textBlob.type]: textBlob,
      }),
    ]);
  }
  showToast(i18n.t('copiedSVG'));
});
