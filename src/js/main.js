import { initUI, showToast } from './ui.js';
import { registerSW } from 'virtual:pwa-register';
import { i18n } from './i18n.js';
import { installButton } from './domrefs.js';

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

(async () => {
  initUI();

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
