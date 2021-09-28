import { filterInputs, POTRACE } from './ui.js';
import { progress, svgOutput } from './domrefs.js';
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
    progress.style.visibility = 'visible';
    let prefix = '';
    let suffix = '';
    let paths = '';

    const intervalID = setInterval(() => {
      svgOutput.innerHTML = prefix + paths + suffix;
    }, 100);
    const progressChannel = new MessageChannel();
    progressChannel.port1.onmessage = ({ data }) => {
      const percentage = Math.floor((data.processed / data.total) * 100);
      progress.value = percentage;
      if (data.svg) {
        if (!prefix) {
          prefix = data.svg.replace(/(.*?<svg[^>]+>)(.*?)(<\/svg>)/, '$1');
          suffix = data.svg.replace(/(.*?<svg[^>]+>)(.*?)(<\/svg>)/, '$3');
        }
        const path = data.svg.replace(/(.*?<svg[^>]+>)(.*?)(<\/svg>)/, '$2');
        paths += path;
      }
      if (data.processed === data.total) {
        clearInterval(intervalID);
        progressChannel.port1.close();
        progress.value = 0;
        progress.style.visibility = 'hidden';
      }
    };

    const params = {
      minPathSegments: Number(filterInputs[POTRACE.minPathLenght].value),
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
