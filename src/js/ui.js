import {
  fieldsetsContainer,
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
  pasteButton,
  copyButton,
  dropContainer,
  svgOutput,
  debugCheckbox,
  canvasMain,
} from './domrefs.js';
import { debounce } from './util.js';
import { startProcessing } from './orchestrate.js';
import I18N from './i18n.js';
import './filesystem.js';

import paletteIcon from 'material-design-icons/image/svg/production/ic_brush_48px.svg?raw';
import scaleIcon from 'material-design-icons/image/svg/production/ic_straighten_48px.svg?raw';
import filterIcon from 'material-design-icons/image/svg/production/ic_filter_48px.svg?raw';
import tuneIcon from 'material-design-icons/image/svg/production/ic_tune_48px.svg?raw';
import openIcon from 'material-design-icons/file/svg/production/ic_folder_open_48px.svg?raw';
import saveIcon from 'material-design-icons/content/svg/production/ic_save_48px.svg?raw';
import copyIcon from 'material-design-icons/content/svg/production/ic_content_copy_48px.svg?raw';
import pasteIcon from 'material-design-icons/content/svg/production/ic_content_paste_48px.svg?raw';

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
  [COLORS.red]: { unit: STEPS, initial: 10, min: 1, max: 20 },
  [COLORS.green]: { unit: STEPS, initial: 10, min: 1, max: 20 },
  [COLORS.blue]: { unit: STEPS, initial: 10, min: 1, max: 20 },
  [COLORS.alpha]: { unit: STEPS, initial: 1, min: 1, max: 10 },
};

const scale = {
  [SCALE.scale]: { unit: PERCENT, initial: 100, min: 1, max: 200 },
};

const potraceOptions = {
  [POTRACE.turdsize]: { unit: PIXELS, initial: 2, min: 1, max: 50 },
};

const fieldsetsArray = [
  { name: 'svgOptions', icon: tuneIcon },
  { name: 'colorChannels', icon: paletteIcon },
  { name: 'imageSize', icon: scaleIcon },
  { name: 'imagePreprocessing', icon: filterIcon },
];

const entriesArray = [
  Object.entries(potraceOptions),
  Object.entries(posterizeComponents),
  Object.entries(scale),
  Object.entries(filters),
];

const filterInputs = {};
const filterSpans = {};
const fieldsets = {};

let x = 0;
let y = 0;
let svg = null;
let zoomScale = 1;
const initialViewBox = {};

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

const createIcon = (src) => {
  const icon = document.createElement('span');
  icon.classList.add('icon');
  icon.innerHTML = src;
  return icon;
};

const createFieldset = (name, iconURL) => {
  const fieldset = document.createElement('fieldset');
  fieldsets[name] = fieldset;
  const legend = document.createElement('legend');
  const icon = createIcon(iconURL);
  legend.append(icon);
  legend.append(document.createTextNode(i18n.t(name)));
  fieldset.append(legend);
  return fieldset;
};

const createControls = (filter, props, fieldset) => {
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
    span.textContent = updateLabel(unit, initial);
    input.dispatchEvent(new Event('change'));
  });

  label.append(span);
  label.append(input);
  div.append(label);
  div.append(button);
  fieldset.append(div);
};

posterizeCheckbox.addEventListener('change', async () => {
  const disabled = !posterizeCheckbox.checked;
  Object.keys(COLORS).forEach((color) => {
    filterInputs[color].disabled = disabled;
  });
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

  entriesArray.forEach((entries, i) => {
    const { name, icon } = fieldsetsArray[i];
    const fieldset = createFieldset(name, icon);
    if (name === 'colorChannels') {
      fieldsets['colorChannels'].append(posterizeCheckbox.parentNode);
    } else if (name === 'svgOptions') {
      fieldsets['svgOptions'].append(colorRadio.parentNode);
      fieldsets['svgOptions'].append(monochromeRadio.parentNode);
    }
    for (const [filter, props] of entries) {
      createControls(filter, props, fieldset);
    }
    fieldsetsContainer.append(fieldset);
  });
  fieldsetsContainer.append(resetAllButton.parentNode);

  inputImage.addEventListener('load', () => {
    inputImage.width = inputImage.naturalWidth;
    inputImage.height = inputImage.naturalHeight;
    setTimeout(() => {
      startProcessing();
    }, 100);
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
  fileOpenButton.innerHTML = '';
  fileOpenButton.append(createIcon(openIcon));
  fileOpenButton.append(document.createTextNode(i18n.t('openImage')));
  saveSVGButton.innerHTML = '';
  saveSVGButton.append(createIcon(saveIcon));
  saveSVGButton.append(document.createTextNode(i18n.t('saveSVG')));
  copyButton.innerHTML = '';
  copyButton.append(createIcon(copyIcon));
  copyButton.append(document.createTextNode(i18n.t('copySVG')));
  pasteButton.innerHTML = '';
  pasteButton.append(createIcon(pasteIcon));
  pasteButton.append(document.createTextNode(i18n.t('pasteImage')));
  dropContainer.dataset.dropText = i18n.t('dropFileHere');
};

resetAllButton.addEventListener('click', async () => {
  const reset = (filter, unit, initial) => {
    filterInputs[filter].value = initial;
    filterSpans[filter].textContent = updateLabel(unit, initial);
  };

  entriesArray.forEach((entries) => {
    for (const [filter, props] of entries) {
      reset(filter, props.unit, props.initial);
    }
  });
  startProcessing();
});

const onDragStart = (e) => {
  e.preventDefault();
  return false;
};

const onPointerMove = (e) => {
  const newX = Math.floor(e.x - x);
  const newY = Math.floor(e.y - y);
  svg.setAttribute(
    'viewBox',
    `${-newX} ${-newY} ${initialViewBox.width} ${initialViewBox.height}`,
  );
};

svgOutput.addEventListener('pointerdown', (e) => {
  if (e.buttons > 1) {
    return;
  }
  svg = svg || svgOutput.querySelector('svg');
  if (!svg) {
    return;
  }
  svg.addEventListener('dragstart', onDragStart);
  storeInitialViewBox();
  x = Math.floor(e.x + initialViewBox.x);
  y = Math.floor(e.y + initialViewBox.y);
  svgOutput.addEventListener('pointermove', onPointerMove);
  svgOutput.style.cursor = 'grabbing';
});

svgOutput.addEventListener('pointerup', (e) => {
  if (!svg) {
    return;
  }
  svgOutput.removeEventListener('pointermove', onPointerMove);
  svg.removeEventListener('dragstart', onDragStart);
  storeInitialViewBox();
  svgOutput.style.cursor = 'grab';
});

const storeInitialViewBox = () => {
  const viewBox = svg.getAttribute('viewBox');
  const [x, y, width, height] = viewBox.split(' ');
  initialViewBox.x = Number(x);
  initialViewBox.y = Number(y);
  initialViewBox.width = Number(width);
  initialViewBox.height = Number(height);
};

svgOutput.addEventListener('wheel', (e) => {
  e.preventDefault();
  svg = svg || svgOutput.querySelector('svg');
  if (!svg) {
    return;
  }
  if (initialViewBox.width === undefined) {
    storeInitialViewBox();
  }
  zoomScale += e.deltaY * -0.005;
  zoomScale = Math.min(Math.max(0.1, zoomScale), 10);
  const newWidth = Math.ceil(initialViewBox.width * zoomScale);
  const newHeight = Math.ceil(initialViewBox.height * zoomScale);
  if (newWidth <= 0 || newHeight <= 0) {
    return;
  }
  const newX = Math.floor(
    initialViewBox.x + (initialViewBox.width - newWidth) / 2,
  );
  const newY = Math.floor(
    initialViewBox.y + (initialViewBox.height - newHeight) / 2,
  );
  svg.setAttribute('viewBox', `${newX} ${newY} ${newWidth} ${newHeight}`);
});

debugCheckbox.addEventListener('click', () => {
  canvasMain.classList.toggle('debug');
});

export { initUI, filters, filterInputs, COLORS, SCALE, POTRACE };
