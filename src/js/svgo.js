import OptimizeSVGWorker from './svgoworker.js?worker';
import { svgOutput } from './domrefs.js';

const optimizeSVGWorker = null;

const optimizeSVG = async (svg) => {
  if (optimizeSVGWorker) {
    optimizeSVGWorker.terminate();
  }
  optimizeSVGWorker = new OptimizeSVGWorker();

  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
      channel.port1.close();
      optimizeSVGWorker.terminate();
      optimizeSVGWorker = null;
      resolve(data.result);
    };

    optimizeSVGWorker.postMessage(
      { svg, originalViewBox: svgOutput.dataset.originalViewBox },
      [channel.port2],
    );
  });
};

export { optimizeSVG };
