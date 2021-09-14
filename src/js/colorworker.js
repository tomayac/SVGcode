import { loadFromImageData } from 'esm-potrace-wasm';

const extractColors = (imageData) => {
  const colors = {};
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];
    if (a === 0) {
      continue;
    }
    const rgba = `${r},${g},${b},${a}`;
    if (!colors[rgba]) {
      colors[rgba] = [i];
    } else {
      colors[rgba].push(i);
    }
  }
  return colors;
};

const convertToColorSVG = async (imageData, params, progressPort) => {
  const colors = extractColors(imageData);

  let prefix = '';
  let suffix = '';
  let svgString = '';

  const promises = [];
  let processed = 0;
  for (const [color, occurrences] of Object.entries(colors)) {
    const newImageData = new ImageData(imageData.width, imageData.height);
    newImageData.data.fill(255);
    const len = occurrences.length;
    if (len <= params.turdsize) {
      continue;
    }
    for (let i = 0; i < len; i++) {
      const location = occurrences[i];
      newImageData.data[location] = 0;
      newImageData.data[location + 1] = 0;
      newImageData.data[location + 2] = 0;
      newImageData.data[location + 3] = 255;
    }
    promises.push(
      new Promise(async (resolve) => {
        let svg = await loadFromImageData(
          newImageData.data,
          newImageData.width,
          newImageData.height,
          {},
          params,
        );
        svg = svg.replace(
          'fill="#000000" stroke="none"',
          `fill="rgba(${color})" stroke-width="1px" stroke="rgba(${color})"`,
        );
        processed++;
        progressPort.postMessage({ processed, total });
        console.log(`Potraced %c■■`, `color: rgba(${color})`);
        resolve(svg);
      }),
    );
  }

  const total = promises.length;
  const svgs = await Promise.all(promises);
  for (const svg of svgs) {
    if (!prefix) {
      prefix = svg.replace(/(.*?<svg[^>]+>)(.*?)(<\/svg>)/, '$1');
      suffix = svg.replace(/(.*?<svg[^>]+>)(.*?)(<\/svg>)/, '$3');
      svgString = prefix;
    }
    svgString += svg.replace(/(.*?<svg[^>]+>)(.*?)(<\/svg>)/, '$2');
  }
  svgString += suffix;
  return svgString;
};

self.addEventListener('message', async (e) => {
  const { imageData, params } = e.data;
  const svg = await convertToColorSVG(imageData, params, e.ports[1]);
  e.ports[0].postMessage({ result: svg });
});
