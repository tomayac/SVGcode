import { fileOpen, fileSave, supported } from 'browser-fs-access';
import {
  inputImage,
  fileOpenButton,
  saveSVGButton,
  svgOutput,
  dropContainer,
} from './domrefs.js';
import { showToast } from './ui.js';
import { optimizeSVG } from './svgo.js';
import { i18n } from './i18n.js';
import { set } from 'idb-keyval';

const FILE_HANDLE = 'fileHandle';

fileOpenButton.addEventListener('click', async () => {
  try {
    const file = await fileOpen({
      mimeTypes: ['image/*'],
      description: 'Image files',
    });
    const blobURL = URL.createObjectURL(file);
    inputImage.addEventListener(
      'load',
      () => {
        URL.revokeObjectURL(blobURL);
      },
      { once: true },
    );
    inputImage.src = blobURL;
    if (supported) {
      await set(FILE_HANDLE, file.handle);
    }
  } catch (err) {
    console.error(err.name, err.message);
    showToast(err.message);
  }
});

document.addEventListener('dragover', (event) => {
  event.preventDefault();
});

document.addEventListener('dragenter', (event) => {
  event.preventDefault();
  dropContainer.classList.add('dropenter');
});

document.addEventListener('dragleave', (event) => {
  event.preventDefault();
  if (event.target !== document.documentElement) {
    return;
  }
  dropContainer.classList.remove('dropenter');
});

document.addEventListener('drop', async (event) => {
  event.preventDefault();
  event.stopPropagation();
  dropContainer.classList.remove('dropenter');
  const item = event.dataTransfer.items[0];
  if (item.kind === 'file') {
    let blobURL;
    inputImage.addEventListener(
      'load',
      () => {
        URL.revokeObjectURL(blobURL);
      },
      { once: true },
    );
    if (supported) {
      const handle = await item.getAsFileSystemHandle();
      if (handle.kind === 'directory') {
        return;
      } else {
        const file = await handle.getFile();
        blobURL = URL.createObjectURL(file);
        inputImage.src = blobURL;
        await set(FILE_HANDLE, handle);
      }
    } else {
      const file = item.getAsFile();
      blobURL = URL.createObjectURL(file);
      inputImage.src = blobURL;
    }
  }
});

saveSVGButton.addEventListener('click', async () => {
  try {
    let svg = svgOutput.innerHTML;
    let handle = null;
    // To not consume the user gesture obtain the handle before preparing the
    // blob, which may take longer.
    if (supported) {
      handle = await showSaveFilePicker({
        types: [
          { description: 'SVG file', accept: { 'image/svg+xml': ['.svg'] } },
        ],
      });
    }
    showToast(i18n.t('optimizingSVG'));
    svg = await optimizeSVG(svg);
    showToast(i18n.t('savedSVG'));
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    await fileSave(blob, { fileName: '', description: 'SVG file' }, handle);
  } catch (err) {
    console.error(err.name, err.message);
    showToast(err.message);
  }
});

export { FILE_HANDLE };
