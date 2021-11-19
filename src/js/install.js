import { installButton } from './domrefs';

let installEvent = null;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installEvent = event;
  installButton.style.visibility = 'visible';
});

installButton.addEventListener('click', async () => {
  if (!installEvent) {
    return;
  }
  installEvent.prompt();
  const result = await installEvent.userChoice;
  if (result.outcome === 'accepted') {
    installEvent = null;
    installButton.style.visibility = 'hidden';
  }
});

window.addEventListener('appinstalled', (event) => {
  installEvent = null;
});
