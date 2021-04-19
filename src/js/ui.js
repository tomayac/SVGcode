import {
  canvasMain,
  preprocessContainer,
  posterizeCheckbox,
  posterizeLabel,
  colorRadio,
  colorLabel,
  monochromeRadio,
  monochromeLabel,
  inputImage,
  resetAllButton,
  fileOpenButton,
  saveSVGButton,
  svgOutput,
  dropContainer,
} from './domrefs.js';
import { debounce } from './util.js';
import { startProcessing } from './orchestrate.js';
import I18N from './i18n.js';
import './filesystem.js';

const i18n = new I18N();

const PERCENT = '%';
const DEGREES = 'deg';
const STEPS = 'steps';
const PIXELS = 'pixels';

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

const COLORS = { red: 'red', green: 'green', blue: 'blue', alpha: 'alpha' };

const SCALE = { scale: 'scale' };

const POTRACE = { turdsize: 'turdsize' };

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

const posterizeComponents = {
  [COLORS.red]: { unit: STEPS, initial: 5, min: 1, max: 10 },
  [COLORS.green]: { unit: STEPS, initial: 5, min: 1, max: 10 },
  [COLORS.blue]: { unit: STEPS, initial: 5, min: 1, max: 10 },
  [COLORS.alpha]: { unit: STEPS, initial: 1, min: 1, max: 10 },
};

const scale = {
  [SCALE.scale]: { unit: PERCENT, initial: 100, min: 1, max: 100 },
};

const potraceOptions = {
  [POTRACE.turdsize]: { unit: PIXELS, initial: 2, min: 1, max: 50 },
};

const filterInputs = {};
const filterSpans = {};

const updateLabel = (unit, value) => {
  const translatedUnit = i18n.t(unit);
  return ` (${
    unit
      ? `${value}${
          translatedUnit.length === 1 ? translatedUnit : ` ${translatedUnit}`
        }`
      : value
  })`;
};

const createControls = (filter, props) => {
  const { unit, min, max, initial } = props;
  const div = document.createElement('div');
  div.classList.add('preprocess-input');

  const label = document.createElement('label');
  label.textContent = i18n.t(filter) || filter;
  label.for = filter;

  const span = document.createElement('span');
  filterSpans[filter] = span;
  span.textContent = updateLabel(unit, initial);

  const input = document.createElement('input');
  filterInputs[filter] = input;
  input.id = filter;
  input.type = 'range';
  input.class = filter;
  input.min = min;
  input.max = max;
  input.value = initial;
  if (unit) {
    input.dataset.unit = unit;
  }
  input.addEventListener('input', () => {
    span.textContent = updateLabel(unit, input.value);
  });
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
        await startProcessing();
      }, 250),
    );
  } else {
    input.addEventListener(
      'change',
      debounce(async () => {
        await startProcessing();
      }, 250),
    );
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = i18n.t('reset');
  button.addEventListener('click', async () => {
    input.value = initial;
    input.dispatchEvent(new Event('change'));
  });

  label.append(span);
  label.append(input);
  div.append(label);
  div.append(button);
  preprocessContainer.append(div);
};

posterizeCheckbox.addEventListener('change', async () => {
  startProcessing();
});

colorRadio.addEventListener('change', async () => {
  startProcessing();
});

monochromeRadio.addEventListener('change', async () => {
  startProcessing();
});

const initUI = async () => {
  await i18n.getTranslations();
  changeLanguage();

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
    inputImage.width = inputImage.naturalWidth;
    inputImage.height = inputImage.naturalHeight;
    startProcessing();
  });
  if (inputImage.complete) {
    inputImage.dispatchEvent(new Event('load'));
  }
};

const changeLanguage = () => {
  resetAllButton.textContent = i18n.t('resetAll');
  posterizeLabel.textContent = i18n.t('posterizeInputImage');
  colorLabel.textContent = i18n.t('colorSVG');
  monochromeLabel.textContent = i18n.t('monochromeSVG');
  fileOpenButton.textContent = i18n.t('openImage');
  saveSVGButton.textContent = i18n.t('saveSVG');
  dropContainer.dataset.dropText = i18n.t('dropFileHere');
};

resetAllButton.addEventListener('click', async () => {
  const reset = (filter, unit, initial) => {
    filterInputs[filter].value = initial;
    filterSpans[filter].textContent = updateLabel(unit, initial);
  };

  for (const [filter, props] of Object.entries(posterizeComponents)) {
    reset(filter, props.unit, props.initial);
  }
  for (const [filter, props] of Object.entries(scale)) {
    reset(filter, props.unit, props.initial);
  }
  for (const [filter, props] of Object.entries(filters)) {
    reset(filter, props.unit, props.initial);
  }
  for (const [filter, props] of Object.entries(potraceOptions)) {
    reset(filter, props.unit, props.initial);
  }
  startProcessing();
});

export {
  initUI,
  filters,
  filterInputs,
  inputImage,
  colorRadio,
  posterizeCheckbox,
  fileOpenButton,
  dropContainer,
  saveSVGButton,
  canvasMain,
  svgOutput,
  COLORS,
  SCALE,
  POTRACE,
};
