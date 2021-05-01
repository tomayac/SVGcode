import { filterInputs, POTRACE } from './ui.js';
import { progress } from './domrefs.js';
import ColorWorker from './colorworker?worker';

const colorWorker = new ColorWorker();

const convertToColorSVG = async (imageData) => {
  return new Promise(async (resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
      channel.port1.close();
      resolve(data.result);
    };

    progress.value = 0;
    const progressChannel = new MessageChannel();
    progressChannel.port1.onmessage = ({ data }) => {
      const percentage = Math.floor((data.processed / data.total) * 100);
      progress.value = percentage;
      if (data.processed === data.total) {
        progressChannel.port1.close();
      }
    };

    const config = {
      turdsize: parseInt(filterInputs[POTRACE.turdsize].value, 10),
    };
    colorWorker.postMessage({ imageData, config }, [
      channel.port2,
      progressChannel.port2,
    ]);
  });
};

export { convertToColorSVG };
