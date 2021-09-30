import { fileOpen, fileSave, supported } from 'browser-fs-access';
import {
  inputImage,
  fileOpenButton,
  saveSVGButton,
  svgOutput,
  dropContainer,
} from './domrefs.js';
import { optimizeSVG } from './svgo.js';

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
  } catch (err) {
    console.error(err.name, err.message);
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
      const entry = await item.getAsFileSystemHandle();
      if (entry.kind === 'directory') {
        return;
      } else {
        const file = await entry.getFile();
        blobURL = URL.createObjectURL(file);
        inputImage.src = blobURL;
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
    svg = await optimizeSVG(svg);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    await fileSave(blob, { fileName: '', description: 'SVG file' }, handle);
  } catch (err) {
    console.error(err.name, err.message);
  }
});
