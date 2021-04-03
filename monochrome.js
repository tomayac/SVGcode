import { filterInputs, POTRACE } from './ui.js';
import { loadFromImageData } from './potrace.js';
import { canvasMain, ctxMain } from './preprocess.js';

const outputMonochrome = document.querySelector('.output-main');

const convertToMonochromeSVG = async () => {
  const config = {
    turdsize: parseInt(filterInputs[POTRACE.turdsize].value, 10),
  };
  const imageData = ctxMain.getImageData(
    0,
    0,
    canvasMain.width,
    canvasMain.height,
  );
  const svg = await loadFromImageData(
    imageData.data,
    canvasMain.width,
    canvasMain.height,
    config,
  );
  outputMonochrome.innerHTML = svg;
};

export { convertToMonochromeSVG, outputMonochrome };
