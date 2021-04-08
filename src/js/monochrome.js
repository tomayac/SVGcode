import { filterInputs, POTRACE } from './ui.js';
import MonochromeSVGWorker from './monochromeworker.js?worker';

const monochromeSVGWorker = new MonochromeSVGWorker();

const convertToMonochromeSVG = async (imageData) => {
  return new Promise(async (resolve, reject) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
      channel.port1.close();
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data.result);
      }
    };

    const config = {
      turdsize: parseInt(filterInputs[POTRACE.turdsize].value, 10),
    };
    monochromeSVGWorker.postMessage({ imageData, config }, [channel.port2]);
  });
};

export { convertToMonochromeSVG };
