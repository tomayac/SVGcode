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
    installButton.style.visibility = 'hidden';
    installEvent = null;
  }
});

window.addEventListener('appinstalled', (event) => {
  // Duplicate because users can install through the prompt or the button.
  installButton.style.visibility = 'hidden';
  installEvent = null;
});
