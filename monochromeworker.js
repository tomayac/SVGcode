importScripts(['./potrace.js']);

const convertToMonochromeSVG = async (imageData, config) => {
  const svg = await self.loadFromImageData(
    imageData.data,
    imageData.width,
    imageData.height,
    config,
  );
  return svg;
};

self.addEventListener('message', async (e) => {
  const [imageData, config] = e.data;
  const svg = await convertToMonochromeSVG(imageData, config);
  self.postMessage(svg);
});
