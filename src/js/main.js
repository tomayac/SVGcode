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

import { initUI, showToast } from './ui.js';
import { registerSW } from 'virtual:pwa-register';
import { i18n } from './i18n.js';
import {
  installButton,
  shareSVGButton,
  inputImage,
  darkModeToggle,
  documentElement,
  metaThemeColor,
} from './domrefs.js';
import 'dark-mode-toggle';

if ('launchQueue' in window) {
  import('./filehandling.js');
}

if ('windowControlsOverlay' in navigator) {
  import('./windowcontrols.js');
}

if ('onbeforeinstallprompt' in window && 'onappinstalled' in window) {
  import('./install.js');
} else {
  installButton.style.display = 'none';
}

if ('share' in navigator && 'canShare' in navigator) {
  import('./share.js');
} else {
  shareSVGButton.style.display = 'none';
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./sharetargetsw.js', {
        scope: '/share-target/',
      });
    } catch (err) {
      console.error(err.name, err.message);
      showToast(err.message);
    }

    if (location.search.includes('share-target')) {
      const keys = await caches.keys();
      const mediaCache = await caches.open(
        keys.filter((key) => key.startsWith('media'))[0],
      );
      const image = await mediaCache.match('shared-image');
      if (image) {
        const blob = await image.blob();
        await mediaCache.delete('shared-image');
        const blobURL = URL.createObjectURL(blob);
        inputImage.addEventListener(
          'load',
          () => {
            URL.revokeObjectURL(blobURL);
          },
          { once: true },
        );
        inputImage.src = blobURL;
      }
    }
  });
}

// From https://stackoverflow.com/a/62963963/6255000.
const supportsWorkerType = () => {
  let supports = false;
  const tester = {
    get type() {
      supports = true;
    },
  };
  try {
    new Worker('blob://', tester);
  } finally {
    return supports;
  }
};

const onColorSchemeChange = () => {
  const mode = darkModeToggle.mode;
  documentElement.style.setProperty('--color-scheme', mode);
  metaThemeColor.content = mode === 'dark' ? '#131313' : '#fff';
};
darkModeToggle.addEventListener('colorschemechange', onColorSchemeChange);
onColorSchemeChange();

(async () => {
  initUI();
  if (!supportsWorkerType()) {
    await import(
      '../.././node_modules/module-workers-polyfill/module-workers-polyfill.min.js'
    );
  }

  const updateSW = registerSW({
    onOfflineReady() {
      showToast(i18n.t('readyToWorkOffline'));
    },
    onNeedRefresh() {
      location.reload();
    },
  });
  updateSW();
})();
