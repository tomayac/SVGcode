import { loadFromImageData } from 'esm-potrace-wasm';

const convertToMonochromeSVG = async (imageData, params) => {
  const svg = await loadFromImageData(
    imageData.data,
    imageData.width,
    imageData.height,
    {},
    params,
  );
  return svg;
};

self.addEventListener('message', async (e) => {
  const { imageData, params } = e.data;
  const svg = await convertToMonochromeSVG(imageData, params);
  e.ports[0].postMessage({ result: svg });
});
