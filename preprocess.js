import { filterInputs, filters } from './ui.js';
import { inputImage, COLORS, SCALE } from './ui.js';
import { convertToMonochromeSVG } from './monochrome.js';
import { getColorSVG } from './color.js';

const canvasMain = /*'OffscreenCanvas' in window ? new OffscreenCanvas(1, 1) :*/ document.querySelector(
  '.canvas-main',
);
const ctxMain = canvasMain.getContext('2d', { desynchronized: true });
ctxMain.imageSmoothingEnabled = false;

const posterizeCheckbox = document.querySelector('.posterize');
const posterizeFilterXML = document.querySelector('#posterize');

const startProcessing = async () => {
  updateFilter();
  preProcessMainCanvas();
  await convertToMonochromeSVG();
  await getColorSVG();
};

const getPosterizeFilter = (r, g, b, a) => {
  return `
    <feComponentTransfer>
      <feFuncR type="discrete" tableValues="${r.join(' ')}" />
      <feFuncG type="discrete" tableValues="${g.join(' ')}" />
      <feFuncB type="discrete" tableValues="${b.join(' ')}" />
      <feFuncA type="discrete" tableValues="${a.join(' ')}" />
    </feComponentTransfer>`;
};

const getFilterString = () => {
  let string = `${posterizeCheckbox.checked ? 'url("#posterize") ' : ''}`;
  for (const [filter, props] of Object.entries(filters)) {
    const input = filterInputs[filter];
    if (props.initial === parseInt(input.value, 10)) {
      continue;
    }
    string += `${filter}(${input.value}${input.dataset.unit}) `;
  }
  return string.trim() || 'none';
};

const preProcessMainCanvas = () => {
  const scaleFactor = parseInt(filterInputs[SCALE.scale].value, 10) / 100;
  canvasMain.width = Math.ceil(inputImage.naturalWidth * scaleFactor);
  canvasMain.height = Math.ceil(inputImage.naturalHeight * scaleFactor);
  ctxMain.clearRect(0, 0, canvasMain.width, canvasMain.height);
  ctxMain.filter = getFilterString();
  ctxMain.drawImage(
    inputImage,
    0,
    0,
    inputImage.naturalWidth,
    inputImage.naturalHeight,
    0,
    0,
    canvasMain.width,
    canvasMain.height,
  );
};

const getRange = (input) => {
  const value = parseInt(input.value, 10);
  const array = [];
  for (let i = 0; i <= value; i++) {
    array[i] = ((1 / value) * i).toFixed(1);
  }
  return array;
};

const updateFilter = async () => {
  posterizeFilterXML.innerHTML = getPosterizeFilter(
    getRange(filterInputs[COLORS.red]),
    getRange(filterInputs[COLORS.green]),
    getRange(filterInputs[COLORS.blue]),
    getRange(filterInputs[COLORS.alpha]),
  );
};

posterizeCheckbox.addEventListener('change', async () => {
  preProcessMainCanvas();
  await convertToMonochromeSVG();
  await getColorSVG();
});

export {
  canvasMain,
  ctxMain,
  updateFilter,
  startProcessing,
  preProcessMainCanvas,
};
