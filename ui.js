import { debounce } from './util.js';
import { startProcessing } from './preprocess.js';
import { convertToMonochromeSVG } from './monochrome.js';
import { convertToColorSVG } from './color.js';
import './filesystem.js';

const preprocessContainer = document.querySelector('.preprocess');
const inputImage = document.querySelector('img');
const resetAllButton = document.querySelector('.reset-all');

const PERCENT = '%';
const DEGREES = 'deg';

const FILTERS = {
  brightness: 'brightness',
  contrast: 'contrast',
  grayscale: 'grayscale',
  hueRotate: 'hue-rotate',
  invert: 'invert',
  opacity: 'opacity',
  saturate: 'saturate',
  sepia: 'sepia',
};

const filters = {
  [FILTERS.brightness]: { unit: PERCENT, initial: 100, min: 0, max: 200 },
  [FILTERS.contrast]: { unit: PERCENT, initial: 100, min: 0, max: 200 },
  [FILTERS.grayscale]: { unit: PERCENT, initial: 0, min: 0, max: 100 },
  [FILTERS.hueRotate]: { unit: DEGREES, initial: 0, min: 0, max: 360 },
  [FILTERS.invert]: { unit: PERCENT, initial: 0, min: 0, max: 100 },
  [FILTERS.opacity]: { unit: PERCENT, initial: 100, min: 0, max: 100 },
  [FILTERS.saturate]: { unit: PERCENT, initial: 100, min: 0, max: 200 },
  [FILTERS.sepia]: { unit: PERCENT, initial: 0, min: 0, max: 100 },
};

const COLORS = { red: 'red', green: 'green', blue: 'blue', alpha: 'alpha' };

const posterizeComponents = {
  [COLORS.red]: { unit: null, initial: 5, min: 1, max: 10 },
  [COLORS.green]: { unit: null, initial: 5, min: 1, max: 10 },
  [COLORS.blue]: { unit: null, initial: 5, min: 1, max: 10 },
  [COLORS.alpha]: { unit: null, initial: 1, min: 1, max: 10 },
};

const SCALE = {
  scale: 'scale',
};

const scale = {
  [SCALE.scale]: { unit: null, initial: 100, min: 1, max: 200 },
};

const POTRACE = { turdsize: 'turdsize' };

const potraceOptions = {
  [POTRACE.turdsize]: { unit: null, initial: 2, min: 1, max: 1000 },
};

const filterInputs = {};

const createControls = (filter, props) => {
  const { unit, min, max, initial } = props;
  const div = document.createElement('div');
  div.classList.add('preprocess-input');

  const label = document.createElement('label');
  label.textContent = `${filter}${unit ? ` (${unit})` : ''}`;
  label.for = filter;

  const input = document.createElement('input');
  input.type = 'range';
  input.class = filter;
  input.min = min;
  input.max = max;
  input.value = initial;
  if (unit) {
    input.dataset.unit = unit;
  }
  filterInputs[filter] = input;
  if (Object.keys(COLORS).includes(filter)) {
    input.addEventListener(
      'change',
      debounce(async () => {
        await startProcessing();
      }, 250),
    );
  } else if (Object.keys(POTRACE).includes(filter)) {
    input.addEventListener(
      'change',
      debounce(async () => {
        await convertToMonochromeSVG();
        await convertToColorSVG();
      }, 250),
    );
  } else if (Object.keys(FILTERS).includes(filter)) {
    input.addEventListener(
      'change',
      debounce(async () => {
        await startProcessing();
        await convertToMonochromeSVG();
        await convertToColorSVG();
      }, 250),
    );
  }

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
  preprocessContainer.append(div);
};

const initUI = () => {
  for (const [filter, props] of Object.entries(posterizeComponents)) {
    createControls(filter, props);
  }
  for (const [filter, props] of Object.entries(scale)) {
    createControls(filter, props);
  }
  for (const [filter, props] of Object.entries(filters)) {
    createControls(filter, props);
  }
  for (const [filter, props] of Object.entries(potraceOptions)) {
    createControls(filter, props);
  }
  inputImage.addEventListener('load', () => {
    startProcessing();
  });
  if (inputImage.complete) {
    inputImage.dispatchEvent(new Event('load'));
  }
};

const resetToDefault = (filter, initial) => {
  filterInputs[filter].value = initial;
};

resetAllButton.addEventListener('click', async () => {
  for (const [filter, props] of Object.entries(posterizeComponents)) {
    resetToDefault(filter, props.initial);
  }
  for (const [filter, props] of Object.entries(scale)) {
    resetToDefault(filter, props.initial);
  }
  for (const [filter, props] of Object.entries(filters)) {
    resetToDefault(filter, props.initial);
  }
  for (const [filter, props] of Object.entries(potraceOptions)) {
    resetToDefault(filter, props.initial);
  }
  await startProcessing();
});

export { initUI, filters, filterInputs, inputImage, COLORS, SCALE, POTRACE };
