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
  let fileHandle = false;
  try {
    fileHandle = await get(FILE_HANDLE);
  } catch (err) {
    // Do nothing. The user probably blocks cookies.
  }
  const suggestedFileName = fileHandle
    ? getSuggestedFileName(fileHandle)
    : 'Untitled.svg';
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
