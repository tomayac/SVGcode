import { initUI } from './ui.js';
import colorURL from './color.js?url';
import colorworkerURL from './colorworker.js?url';
import filesystemURL from './filesystem.js?url';
import mainURL from './main.js?url';
import monochromeURL from './monochrome.js?url';
import monochromeworkerURL from './monochromeworker.js?url';
import orchestrateURL from './orchestrate.js?url';
import preprocessURL from './preprocess.js?url';
import preprocessworkerURL from './preprocessworker.js?url';
import svgoworkerURL from './svgoworker.js?url';
import svgoURL from './svgo.js?url';
import uiURL from './ui.js?url';
import utilURL from './util.js?url';

(() => {
  initUI();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          'serviceworker.js',
        );
        (async () => {
          return new Promise((resolve, reject) => {
            const channel = new MessageChannel();
            channel.port1.onmessage = (e) => {
              channel.port1.close();
              console.log(e);
            };

            navigator.serviceWorker.controller.postMessage(
              {
                urls: [
                  svgoworkerURL,
                  preprocessworkerURL,
                  monochromeworkerURL,
                  colorworkerURL,
                ],
              },
              [channel.port2],
            );
          });
        })();
      } catch (err) {
        console.error(err.name, err.message);
      }
    });
  }
})();
