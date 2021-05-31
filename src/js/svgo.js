import OptimizeSVGWorker from './svgoworker.js?worker&inline';

const optimizeSVGWorker = new OptimizeSVGWorker();

const optimizeSVG = async (svg) => {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
      channel.port1.close();
      resolve(data.result);
    };

    optimizeSVGWorker.postMessage({ svg }, [channel.port2]);
  });
};

export { optimizeSVG };
