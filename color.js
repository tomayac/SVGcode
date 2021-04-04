import { filterInputs, POTRACE } from './ui.js';

const colorWorker = new Worker('./colorworker.js');

const convertToColorSVG = async (imageData) => {
  return new Promise(async (resolve, reject) => {
    colorWorker.onmessage = (e) => {
      resolve(e.data);
    };
    const config = {
      turdsize: parseInt(filterInputs[POTRACE.turdsize].value, 10),
    };
    colorWorker.postMessage([imageData, config]);
  });
};

export { convertToColorSVG };
