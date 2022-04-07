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
