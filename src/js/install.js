import { installButton } from './domrefs';

installButton.style.display = 'none';
let installEvent = null;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installEvent = event;
  installButton.style.display = '';
});

installButton.addEventListener('click', async () => {
  if (!installEvent) {
    return;
  }
  installEvent.prompt();
  const result = await installEvent.userChoice;
  if (result.outcome === 'accepted') {
    installEvent = null;
    installButton.style.display = 'none';
  }
});

window.addEventListener('appinstalled', (event) => {
  installEvent = null;
});
