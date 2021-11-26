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
    // Safari treats user activation differently:
    // https://bugs.webkit.org/show_bug.cgi?id=222262.
    await navigator.clipboard.write([
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
  } catch (err) {
    console.warn(err.name, err.message);
    svg = await optimizeSVG(svg);
    const textBlob = new Blob([svg], { type: 'text/plain' });
    const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
    try {
      // Chromium (text and SVG)
      await navigator.clipboard.write([
        new ClipboardItem({
          [svgBlob.type]: svgBlob,
          [textBlob.type]: textBlob,
        }),
      ]);
    } catch (err) {
      console.warn(err.name, err.message);
      try {
        // Chromium (text only)
        await navigator.clipboard.write([
          new ClipboardItem({
            [textBlob.type]: textBlob,
          }),
        ]);
      } catch (err) {
        console.error(err.name, err.message);
        showToast(err.message);
        return;
      }
    }
  }
  showToast(i18n.t('copiedSVG'));
});
