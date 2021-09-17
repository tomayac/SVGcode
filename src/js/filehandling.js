import { inputImage } from './domrefs.js';

window.launchQueue.setConsumer(async (launchParams) => {
  if (!launchParams.files.length) {
    return;
  }
  for (const handle of launchParams.files) {
    const file = await handle.getFile();
    if (file.type.startsWith('image/')) {
      const blobURL = URL.createObjectURL(file);
      inputImage.addEventListener(
        'load',
        () => {
          URL.revokeObjectURL(blobURL);
        },
        { once: true },
      );
      inputImage.src = blobURL;
      return;
    }
  }
});
