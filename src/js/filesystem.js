/**
 * SVGcode—Convert raster images to SVG vector graphics
 * Copyright (C) 2021 Google LLC
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

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
import { set, get } from 'idb-keyval';

const FILE_HANDLE = 'fileHandle';

const getSuggestedFileName = fileHandle => {
  const fileName = fileHandle?.name || '';
  return fileName.replace(/\.[^/.]+$/, ''); // Remove original filename's extension
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
      if (handle.kind !== 'file') {
        return;
      }
      const file = await handle.getFile();
      blobURL = URL.createObjectURL(file);
      inputImage.src = blobURL;
      await set(FILE_HANDLE, handle);
      return;
    }
    const file = item.getAsFile();
    blobURL = URL.createObjectURL(file);
    inputImage.src = blobURL;
  }
});

saveSVGButton.addEventListener('click', async () => {
  try {
    let suggestedFileName = '';
    let svg = svgOutput.innerHTML;
    let handle = null;
    // To not consume the user gesture obtain the handle before preparing the
    // blob, which may take longer.
    if (supported) {
      suggestedFileName = getSuggestedFileName((await get(FILE_HANDLE)));
      handle = await showSaveFilePicker({
        suggestedName: suggestedFileName,
        types: [
          { description: 'SVG file', accept: { 'image/svg+xml': ['.svg'] } },
        ],
      });
    }
    showToast(i18n.t('optimizingSVG'), Infinity);
    svg = await optimizeSVG(svg);
    showToast(i18n.t('savedSVG'));
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    await fileSave(blob, { fileName: suggestedFileName, description: 'SVG file' }, handle);
  } catch (err) {
    console.error(err.name, err.message);
    showToast(err.message);
  }
});

export { FILE_HANDLE, getSuggestedFileName };
