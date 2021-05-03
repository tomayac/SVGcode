import { filterInputs, POTRACE } from './ui.js';
import MonochromeSVGWorker from './monochromeworker.js?worker';

const monochromeSVGWorker = new MonochromeSVGWorker();

const convertToMonochromeSVG = async (imageData) => {
  return new Promise(async (resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
      channel.port1.close();
      resolve(data.result);
    };

    const config = {
      turdsize: Number(filterInputs[POTRACE.turdsize].value),
    };
    monochromeSVGWorker.postMessage({ imageData, config }, [channel.port2]);
  });
};

export { convertToMonochromeSVG };
