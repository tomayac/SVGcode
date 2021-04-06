import { filterInputs, POTRACE } from './ui.js';

const colorWorker = new Worker('./colorworker.js', { type: 'module' });

const convertToColorSVG = async (imageData) => {
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
    colorWorker.postMessage({ imageData, config }, [channel.port2]);
  });
};

export { convertToColorSVG };
