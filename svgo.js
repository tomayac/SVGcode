const optimizeSVG = async (svg) => {
  const optimizeSVGWorker = new Worker('./svgoworker.js', { type: 'module' });
  return new Promise(async (resolve) => {
    optimizeSVGWorker.onmessage = (e) => {
      resolve(e.data);
    };
    optimizeSVGWorker.postMessage([svg]);
  });
};

export { optimizeSVG };
