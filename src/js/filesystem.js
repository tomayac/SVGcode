import { fileOpen, fileSave, supported } from 'browser-fs-access';
import { inputImage } from './ui.js';
import { canvasMain } from './preprocess.js';
import { monochromeSVGOutput, colorSVGOutput } from './orchestrate.js';

const fileOpenButton = document.querySelector('.open');
const saveImageButton = document.querySelector('.save-image');
const saveMonochromeSVGButton = document.querySelector('.save-bw-svg');
const saveColorSVGButton = document.querySelector('.save-color-svg');
const dropContainer = document.querySelector('.drop');

const canvasToBlob = async (canvas, mimeType = 'image/png') => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, mimeType);
  });
};

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

dropContainer.addEventListener('dragover', (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
});

dropContainer.addEventListener('drop', async (event) => {
  event.preventDefault();
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

saveImageButton.addEventListener('click', async () => {
  try {
    const blob = await canvasToBlob(canvasMain);
    await fileSave(blob, { fileName: '', description: 'PNG file' });
  } catch (err) {
    console.error(err.name, err.message);
  }
});

saveMonochromeSVGButton.addEventListener('click', async () => {
  try {
    const blob = new Blob([monochromeSVGOutput.innerHTML], {
      type: 'image/svg+xml',
    });
    await fileSave(blob, { fileName: '', description: 'SVG file' });
  } catch (err) {
    console.error(err.name, err.message);
  }
});

saveColorSVGButton.addEventListener('click', async () => {
  try {
    const blob = new Blob([colorSVGOutput.innerHTML], {
      type: 'image/svg+xml',
    });
    await fileSave(blob, { fileName: '', description: 'SVG file' });
  } catch (err) {
    console.error(err.name, err.message);
  }
});

export {
  fileOpenButton,
  saveImageButton,
  saveMonochromeSVGButton,
  saveColorSVGButton,
  dropContainer,
};
