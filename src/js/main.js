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
import { installButton } from './domrefs.js';
import './collect.js';

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
