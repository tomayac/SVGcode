import { inputImage, copyButton, pasteButton, svgOutput } from './domrefs.js';
import { optimizeSVG } from './svgo.js';

pasteButton.addEventListener('click', async () => {
  const clipboardItems = await navigator.clipboard.read();
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
});

copyButton.addEventListener('click', async () => {
  let svg = svgOutput.innerHTML;
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
});
