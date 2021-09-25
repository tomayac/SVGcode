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

    const params = {
      minPathLength: Number(filterInputs[POTRACE.minPathLenght].value),
      turdsize: Number(filterInputs[POTRACE.turdsize].value),
      alphamax: Number(filterInputs[POTRACE.alphamax].value),
      turnpolicy: Number(filterInputs[POTRACE.turnpolicy].value),
      opticurve: Number(filterInputs[POTRACE.opticurve].value),
      opttolerance: Number(filterInputs[POTRACE.opttolerance].value),
    };
    colorWorker.postMessage({ imageData, params }, [
      channel.port2,
      progressChannel.port2,
    ]);
  });
};

export { convertToColorSVG };
