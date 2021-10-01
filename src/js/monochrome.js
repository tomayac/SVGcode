import { filterInputs, POTRACE } from './ui.js';
import { optimizeCurvesCheckbox } from './domrefs.js';
import MonochromeSVGWorker from './monochromeworker.js?worker';

const monochromeSVGWorker = new MonochromeSVGWorker();

const convertToMonochromeSVG = async (imageData) => {
  return new Promise(async (resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
      channel.port1.close();
      resolve(data.result);
    };

    const params = {
      turdsize: Number(filterInputs[POTRACE.turdsize].value),
      alphamax: Number(filterInputs[POTRACE.alphamax].value),
      turnpolicy: Number(filterInputs[POTRACE.turnpolicy].value),
      opttolerance: Number(filterInputs[POTRACE.opttolerance].value),
      opticurve: optimizeCurvesCheckbox.checked ? 1 : 0,
    };
    monochromeSVGWorker.postMessage({ imageData, params }, [channel.port2]);
  });
};

export { convertToMonochromeSVG };
