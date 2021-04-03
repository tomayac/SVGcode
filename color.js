import { canvasMain, ctxMain } from './preprocess.js';
import { filterInputs, POTRACE } from './ui.js';
import { loadFromImageData } from './potrace.js';

const outputColor = document.querySelector('.output-channel');

const extractColors = () => {
  const colors = {};
  const imageData = ctxMain.getImageData(
    0,
    0,
    canvasMain.width,
    canvasMain.height,
  );
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i + 0];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];
    const rgba = `${r},${g},${b},${a}`;
    if (!colors[rgba]) {
      colors[rgba] = [i];
    } else {
      colors[rgba].push(i);
    }
  }
  return colors;
};

const getColorSVG = async () => {
  const colors = extractColors();

  let prefix = '';
  let suffix = '';
  let svgString = '';

  const config = {
    turdsize: parseInt(filterInputs[POTRACE.turdsize].value, 10),
  };

  for (const [color, occurrences] of Object.entries(colors)) {
    const imageData = new ImageData(canvasMain.width, canvasMain.height);
    imageData.data.fill(255);
    const len = occurrences.length;
    if (len <= config.turdsize) {
      continue;
    }
    for (let i = 0; i < len; i++) {
      const location = occurrences[i];
      imageData.data[location + 0] = 0;
      imageData.data[location + 1] = 0;
      imageData.data[location + 2] = 0;
      imageData.data[location + 3] = 255;
    }
    let svg = await loadFromImageData(
      imageData.data,
      canvasMain.width,
      canvasMain.height,
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
  outputColor.innerHTML = svgString + suffix;
};

export { getColorSVG, outputColor };
