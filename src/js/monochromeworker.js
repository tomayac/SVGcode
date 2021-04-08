import { loadFromImageData } from 'potrace-wasm';

const convertToMonochromeSVG = async (imageData, config) => {
  const svg = await loadFromImageData(
    imageData.data,
    imageData.width,
    imageData.height,
    config,
  );
  return svg;
};

self.addEventListener('message', async (e) => {
  const { imageData, config } = e.data;
  const svg = await convertToMonochromeSVG(imageData, config);
  e.ports[0].postMessage({ result: svg });
});
