import { shareSVGButton, svgOutput } from './domrefs.js';
import { showToast, clearToast } from './ui.js';
import { optimizeSVG } from './svgo.js';
import { get } from 'idb-keyval';
import { getSuggestedFileName, FILE_HANDLE } from './filesystem.js';
import { i18n } from './i18n.js';

shareSVGButton.style.display = 'flex';

shareSVGButton.addEventListener('click', async () => {
  let svg = svgOutput.innerHTML;
  showToast(i18n.t('optimizingSVG'), Infinity);
  svg = await optimizeSVG(svg);
  clearToast();
  const suggestedFileName =
    getSuggestedFileName(await get(FILE_HANDLE)) || 'Untitled.svg';
  const file = new File([svg], suggestedFileName, { type: 'image/svg+xml' });
  const data = {
    files: [file],
  };
  if (navigator.canShare(data)) {
    try {
      await navigator.share(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err.name, err.message);
        showToast(err.message);
      }
    }
  }
});
