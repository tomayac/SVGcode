import OptimizeSVGWorker from './svgoworker.js?worker';
import { svgOutput } from './domrefs';

const optimizeSVGWorker = new OptimizeSVGWorker();

const optimizeSVG = async (svg) => {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
      channel.port1.close();
      resolve(data.result);
    };

    optimizeSVGWorker.postMessage(
      { svg, originalViewBox: svgOutput.dataset.originalViewBox },
      [channel.port2],
    );
  });
};

export { optimizeSVG };
