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
  documentElement,
} from './domrefs.js';
import { clearToast, showToast } from './ui.js';
import { optimizeSVG } from './svgo.js';
import { i18n } from './i18n.js';
import { set, get } from 'idb-keyval';

const FILE_HANDLE = 'fileHandle';

const getSuggestedFileName = (fileHandle) => {
  if (!fileHandle) {
    return '';
  }
  // Remove original file extension.
  return fileHandle.name.replace(/\.[^\.]+$/, '');
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
  documentElement.classList.add('dropenter');
});

document.addEventListener('dragleave', (event) => {
  event.preventDefault();
  if (event.target !== documentElement) {
    return;
  }
  documentElement.classList.remove('dropenter');
});

document.addEventListener('drop', async (event) => {
  event.preventDefault();
  event.stopPropagation();
  documentElement.classList.remove('dropenter');
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
  const createPromiseBlob = async () => {
    showToast(i18n.t('optimizingSVG'), Infinity);
    const optimizedSVG = await optimizeSVG(svgOutput.innerHTML);
    clearToast();
    return new Blob([optimizedSVG], { type: 'image/svg+xml' });
  };

  try {
    const fileName = getSuggestedFileName(await get(FILE_HANDLE));
    await fileSave(createPromiseBlob(), {
      fileName,
      description: 'SVG file',
      extensions: ['.svg'],
      mimeTypes: ['image/svg+xml'],
    });
    showToast(i18n.t('savedSVG'));
  } catch (err) {
    console.error(err.name, err.message);
    showToast(err.message);
  }
});

export { FILE_HANDLE, getSuggestedFileName };
