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

import fetch from 'node-fetch';
import { writeFile } from 'fs/promises';
import path from 'path';

const URL_PREFIX =
  'https://raw.githubusercontent.com/google/material-design-icons/master/src/';

const icons = {
  paletteicon: 'image/brush/materialicons/24px.svg',
  scaleicon: 'content/square_foot/materialicons/24px.svg',
  filtericon: 'image/filter/materialicons/24px.svg',
  tuneicon: 'image/tune/materialicons/24px.svg',
  openicon: 'file/folder_open/materialicons/24px.svg',
  saveicon: 'content/save/materialicons/24px.svg',
  copyicon: 'content/content_copy/materialicons/24px.svg',
  pasteicon: 'content/content_paste/materialicons/24px.svg',
  shareiconmac: 'social/ios_share/materialicons/24px.svg',
  shareicon: 'social/share/materialicons/24px.svg',
  optionsicon: 'image/tune/materialicons/24px.svg',
  installicon: 'action/install_desktop/materialicons/24px.svg',
};

(async () => {
  const promises = [];
  for (const [fileName, urlSuffix] of Object.entries(icons)) {
    const url = URL_PREFIX + urlSuffix;
    promises.push(
      fetch(url)
        .then((res) => res.text())
        .then((svg) =>
          writeFile(path.resolve('public', `${fileName}.svg`), svg),
        ),
    );
  }
  await Promise.all(promises);
})();
