import { loadFromImageData } from 'potrace-wasm';

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

const convertToColorSVG = async (imageData, config) => {
  const colors = extractColors(imageData);

  let prefix = '';
  let suffix = '';
  let svgString = '';

  for (const [color, occurrences] of Object.entries(colors)) {
    const newImageData = new ImageData(imageData.width, imageData.height);
    newImageData.data.fill(255);
    const len = occurrences.length;
    if (len <= config.turdsize) {
      continue;
    }
    for (let i = 0; i < len; i++) {
      const location = occurrences[i];
      newImageData.data[location] = 0;
      newImageData.data[location + 1] = 0;
      newImageData.data[location + 2] = 0;
      newImageData.data[location + 3] = 255;
    }
    let svg = await loadFromImageData(
      newImageData.data,
      newImageData.width,
      newImageData.height,
      config,
    );
    svg = svg.replace(
      'fill="#000000"',
      `fill="rgba(${color})" stroke="rgba(${color})"`,
    );
    if (!prefix) {
      prefix = svg.replace(/(.*?<svg[^>]+>)(.*?)(<\/svg>)/, '$1');
      suffix = svg.replace(/(.*?<svg[^>]+>)(.*?)(<\/svg>)/, '$3');
      svgString = prefix;
    }
    svgString += svg.replace(/(.*?<svg[^>]+>)(.*?)(<\/svg>)/, '$2');
  }
  return svgString + suffix;
};

self.addEventListener('message', async (e) => {
  const [imageData, config] = e.data;
  const svg = await convertToColorSVG(imageData, config);
  self.postMessage(svg);
});
