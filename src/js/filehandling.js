import { inputImage } from './domrefs.js';
import { set } from 'idb-keyval';
import { FILE_HANDLE } from './filesystem.js';

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
      await set(FILE_HANDLE, handle);
      return;
    }
  }
});
