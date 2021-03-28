import {fileOpen, fileSave} from "browser-fs-access";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const fileOpenButton = document.querySelector('.open');
const fileSaveButton = document.querySelector('.save');
const posterize = document.querySelector(".posterize");
const red = document.querySelector(".posterize-r");
const green = document.querySelector(".posterize-g");
const blue = document.querySelector(".posterize-b");

const turdsize = document.querySelector(".turdsize");
const preprocess = document.querySelector(".preprocess");
const filterXML = document.querySelector('#posterize');

const inputImage = document.querySelector("img");
const outputSVG = document.querySelector("output");

const PERCENT = '%';
const DEGREES = 'deg'

const filters = {
  'brightness' : {unit: PERCENT, initial: 100, min: 0, max: 200},
  'contrast' : {unit: PERCENT, initial: 100, min: 0, max: 200},
  'grayscale' : {unit: PERCENT, initial: 0, min: 0, max: 100},
  'hue-rotate': {unit: DEGREES, initial: 0, min: 0, max: 360},
  'invert': {unit: PERCENT, initial: 0, min: 0, max: 100},
  'opacity': {unit: PERCENT, initial: 100, min: 0, max: 100},
  'saturate': {unit: PERCENT, initial: 100, min: 0, max: 200},
  'sepia': {unit: PERCENT, initial: 0, min: 0, max: 100},
}

const getPosterizeFilter = (r, g, b) => {
  return `
    <feComponentTransfer>
      <feFuncR type="discrete" tableValues="${r.join(' ')}" />
      <feFuncG type="discrete" tableValues="${g.join(' ')}" />
      <feFuncB type="discrete" tableValues="${b.join(' ')}" />
    </feComponentTransfer>`;
};

const filterInputs = {};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

for (const [filter, props] of Object.entries(filters)) {
  const {unit, min, max, initial,} = props;

  const div = document.createElement('div');
  div.classList.add('preprocess-input');

  const label = document.createElement('label');
  label.textContent = `${filter} (${unit})`;
  label.for = filter;

  const input = document.createElement('input');
  input.id = filter;
  input.type = 'range';
  input.class = filter;
  input.min = min;
  input.max = max;
  input.value = initial;
  input.dataset.unit = unit;
  filterInputs[filter] = input;
  input.addEventListener('change', debounce(async () => {
      preProcessImage();
      await convertToSVG();
    }, 250));

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Reset';
  button.addEventListener('click', async () => {
    input.value = initial;
    input.dispatchEvent(new Event('change'));
  });

  label.append(input);
  div.append(label);
  div.append(button);
  preprocess.append(div);
}

const convertToSVG = async () => {
  const config = {
    turdsize: parseInt(turdsize.value, 10),
  };
  const svg = await loadFromCanvas(canvas, config);
  outputSVG.innerHTML = svg;
};

const getFilterString = () => {
  let string = `${posterize.checked ? 'url("#posterize") ' : ''}`;
  for (const [filter] of Object.entries(filters)) {
    const input = filterInputs[filter];
    string += `${filter}(${input.value}${input.dataset.unit}) `
  }
  return string.trim();
}

const preProcessImage = () => {
  ctx.drawImage(inputImage, 0, 0);
  ctx.filter = getFilterString();
  ctx.drawImage(inputImage, 0, 0);
}

const getRange = (input) => {
  const value = parseInt(input.value, 10);
  const array = [];
  for (let i = 0; i <= value; i++) {
    array[i] = (1 / value * i).toFixed(1);
  }
  return array;
};

const updateFilter = async () => {
  filterXML.innerHTML = getPosterizeFilter(getRange(red), getRange(green), getRange(blue));
  preProcessImage();
  await convertToSVG()
}

red.addEventListener('change', debounce(updateFilter, 250))
green.addEventListener('change', debounce(updateFilter, 250))
blue.addEventListener('change', debounce(updateFilter, 250))

posterize.addEventListener('change', async () => {
  preProcessImage();
  await convertToSVG()
});

turdsize.addEventListener('change', debounce(async () => {
  await convertToSVG();
}, 250));

const init = async () => {
  canvas.width = inputImage.naturalWidth;
  canvas.height = inputImage.naturalHeight;
  updateFilter();
  preProcessImage();
  try {
    await convertToSVG();
  } catch (err) {
    console.error(err.name, err.message);
  }
};

inputImage.addEventListener("load", init);

if (inputImage.complete) {
  inputImage.removeEventListener("load", init);
  init();
}
