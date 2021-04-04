import { filterInputs, filters } from './ui.js';
import { inputImage, COLORS, SCALE } from './ui.js';
import { convertToMonochromeSVG } from './monochrome.js';
import { convertToColorSVG } from './color.js';

const preProcessWorker = new Worker('preprocessworker.js');

const posterizeCheckbox = document.querySelector('.posterize');
const posterizeFilterXML = document.querySelector('#posterize');
const monochromeSVGOutput = document.querySelector('.output-monochrome');
const colorSVGOutput = document.querySelector('.output-color');

const startProcessing = async () => {
  updateFilter();
  const imageData = await preProcessInputImage();
  monochromeSVGOutput.innerHTML = await convertToMonochromeSVG(imageData);
  colorSVGOutput.innerHTML = await convertToColorSVG(imageData);
};

const preProcessInputImage = async () => {
  return new Promise(async (resolve, reject) => {
    preProcessWorker.onmessage = (e) => {
      resolve(e.data);
    };
    const { width, height } = getScaledDimensions();
    const imageBitmap = await createImageBitmap(inputImage);
    preProcessWorker.postMessage([
      imageBitmap,
      getFilterString(),
      width,
      height,
    ]);
  });
};

const getScaledDimensions = () => {
  const scaleFactor = parseInt(filterInputs[SCALE.scale].value, 10) / 100;
  return {
    width: Math.ceil(inputImage.naturalWidth * scaleFactor),
    height: Math.ceil(inputImage.naturalHeight * scaleFactor),
  };
};

const getPosterizeFilter = (r, g, b, a) => {
  return `data:image/svg+xml;utf8,
    <svg
      class="filter"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <filter id="posterize">
        <feComponentTransfer>
        <feFuncR type="discrete" tableValues="${r.join(' ')}" />
        <feFuncG type="discrete" tableValues="${g.join(' ')}" />
        <feFuncB type="discrete" tableValues="${b.join(' ')}" />
        <feFuncA type="discrete" tableValues="${a.join(' ')}" />
        </feComponentTransfer>
      </filter>
    </svg>`;
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

const getRange = (input) => {
  const value = parseInt(input.value, 10);
  const array = [];
  for (let i = 0; i <= value; i++) {
    array[i] = ((1 / value) * i).toFixed(1);
  }
  return array;
};

const updateFilter = async () => {
  return getPosterizeFilter(
    getRange(filterInputs[COLORS.red]),
    getRange(filterInputs[COLORS.green]),
    getRange(filterInputs[COLORS.blue]),
    getRange(filterInputs[COLORS.alpha]),
  );
};

posterizeCheckbox.addEventListener('change', async () => {
  startProcessing();
  await convertToMonochromeSVG();
  await convertToColorSVG();
});

export { startProcessing };
