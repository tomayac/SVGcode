const optimizeSVGWorker = new Worker('./svgoworker.js', { type: 'module' });

const optimizeSVG = async (svg) => {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
      channel.port1.close();
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data.result);
      }
    };

    optimizeSVGWorker.postMessage({ svg }, [channel.port2]);
  });
};

export { optimizeSVG };
