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

import { inputImage, copyButton, pasteButton, svgOutput } from './domrefs.js';
import { optimizeSVG } from './svgo.js';
import { showToast } from './ui.js';
import { i18n } from './i18n.js';

pasteButton.addEventListener('click', async () => {
  try {
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
  showToast(i18n.t('optimizingSVG'), Infinity);
  try {
    // Firefox only supports `navigator.clipboard.write()`.
    if (!('ClipboardItem' in window)) {
      await navigator.clipboard.writeText(await optimizeSVG(svg));
    } else {
      // Chromium >=98.
      if (!/Apple/.test(navigator.vendor)) {
        svg = await optimizeSVG(svg);
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': new Promise(async (resolve) => {
              resolve(new Blob([svg], { type: 'text/plain' }));
            }),
            'image/svg+xml': new Promise(async (resolve) => {
              resolve(new Blob([svg], { type: 'image/svg+xml' }));
            }),
          }),
        ]);
        // Safari (non-optimized SVG)
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': new Promise(async (resolve) => {
              resolve(new Blob([svg], { type: 'text/plain' }));
            }),
          }),
        ]);
      }
    }
    // Chromium < 98.
  } catch (err) {
    svg = await optimizeSVG(svg);
    const textBlob = new Blob([svg], { type: 'text/plain' });
    const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
    try {
      // Chromium <=88 (text only). Old Chrome crashes hard when trying to copy
      // 'image/svg+xml' blob: https://github.com/tomayac/SVGcode/issues/51.
      if (
        Number(navigator.userAgent.replace(/.*Chrome\/(\d+).*/, '$1')) <= 88
      ) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [textBlob.type]: textBlob,
          }),
        ]);
      } else {
        // Chromium (text and SVG)
        await navigator.clipboard.write([
          new ClipboardItem({
            [svgBlob.type]: svgBlob,
            [textBlob.type]: textBlob,
          }),
        ]);
      }
    } catch (err) {
      try {
        // Chromium (text only)
        await navigator.clipboard.write([
          new ClipboardItem({
            [textBlob.type]: textBlob,
          }),
        ]);
      } catch (err) {
        showToast(err.message);
        return;
      }
    }
  }
  showToast(i18n.t('copiedSVG'));
});
