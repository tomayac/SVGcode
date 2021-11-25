/**
 * SVGcode—Convert raster images to SVG vector graphics
 * Copyright (C) 2021 Google LLC
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

import {
  detailsContainer,
  posterizeCheckbox,
  posterizeLabel,
  colorRadio,
  colorLabel,
  monochromeRadio,
  monochromeLabel,
  considerDPRCheckbox,
  considerDPRLabel,
  optimizeCurvesCheckbox,
  optimizeCurvesLabel,
  showAdvancedControlsCheckbox,
  showAdvancedControlsLabel,
  inputImage,
  resetAllButton,
  fileOpenButton,
  saveSVGButton,
  pasteButton,
  copyButton,
  installButton,
  dropContainer,
  debugCheckbox,
  canvasMain,
  svgOutput,
  toast,
  progress,
  details,
  summary,
} from './domrefs.js';
import {
  resetZoomAndPan,
  initialViewBox,
  storeInitialViewBox,
} from './panzoom.js';
import { debounce } from './util.js';
import { startProcessing } from './orchestrate.js';
import { i18n } from './i18n.js';
import { FILE_HANDLE } from './filesystem.js';
import { get, set, del } from 'idb-keyval';
import './clipboard.js';
import './filesystem.js';

import paletteIcon from 'material-design-icons/image/svg/production/ic_brush_48px.svg?raw';
import scaleIcon from 'material-design-icons/image/svg/production/ic_straighten_48px.svg?raw';
import filterIcon from 'material-design-icons/image/svg/production/ic_filter_48px.svg?raw';
import tuneIcon from 'material-design-icons/image/svg/production/ic_tune_48px.svg?raw';
import openIcon from 'material-design-icons/file/svg/production/ic_folder_open_48px.svg?raw';
import saveIcon from 'material-design-icons/content/svg/production/ic_save_48px.svg?raw';
import copyIcon from 'material-design-icons/content/svg/production/ic_content_copy_48px.svg?raw';
import pasteIcon from 'material-design-icons/content/svg/production/ic_content_paste_48px.svg?raw';
import optionsIcon from 'material-design-icons/image/svg/production/ic_tune_48px.svg?raw';
import installIcon from '/install.svg?raw';

const PERCENT = '%';
const DEGREES = 'deg';
const STEPS = 'steps';
const PIXELS = 'pixels';
const NONE = '';
const SEGMENTS = 'segments';

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

const POTRACE = {
  minPathLenght: 'minPathSegments',
  strokeWidth: 'strokeWidth',
  turdsize: 'turdsize',
  alphamax: 'alphamax',
  turnpolicy: 'turnpolicy',
  opticurve: 'opticurve',
  opttolerance: 'opttolerance',
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

const posterizeComponents = {
  [COLORS.red]: { unit: STEPS, initial: 5, min: 1, max: 20 },
  [COLORS.green]: { unit: STEPS, initial: 5, min: 1, max: 20 },
  [COLORS.blue]: { unit: STEPS, initial: 5, min: 1, max: 20 },
  [COLORS.alpha]: { unit: STEPS, initial: 1, min: 1, max: 10 },
};

const scale = {
  [SCALE.scale]: { unit: PERCENT, initial: 100, min: 1, max: 200 },
};

const potraceOptions = {
  [POTRACE.turdsize]: { unit: PIXELS, initial: 2, min: 0, max: 50 },
  [POTRACE.alphamax]: { unit: NONE, initial: 1.0, min: 0.0, max: 1.3334 },
  [POTRACE.turnpolicy]: { unit: STEPS, initial: 4, min: 0, max: 6 },
  [POTRACE.opttolerance]: { unit: NONE, initial: 0.2, min: 0, max: 1 },
  [POTRACE.minPathLenght]: { unit: SEGMENTS, initial: 0, min: 0, max: 30 },
  [POTRACE.strokeWidth]: { unit: PIXELS, initial: 0, min: 0, max: 100 },
};

const detailsArray = [
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
const allDetails = {};

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

const createDetails = (name, iconURL) => {
  const details = document.createElement('details');
  allDetails[name] = details;
  const legend = document.createElement('summary');
  const icon = createIcon(iconURL);
  legend.append(icon);
  legend.append(document.createTextNode(i18n.t(name)));
  details.append(legend);
  return details;
};

const advancedControls = [
  'alphamax',
  'turnpolicy',
  'optimize-curves',
  'opttolerance',
  'minPathSegments',
];

const createControls = (filter, props, details) => {
  const { unit, min, max, initial } = props;
  const div = document.createElement('div');
  div.classList.add('preprocess-input');
  if (advancedControls.includes(filter)) {
    div.classList.add('advanced');
  }
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
  if (unit) {
    input.dataset.unit = unit;
  }
  if (unit === NONE) {
    input.step = 0.01;
  }
  input.min = min;
  input.max = max;
  input.value = initial;
  input.addEventListener('input', () => {
    span.textContent = updateLabel(unit, input.value);
  });
  if (Object.keys(COLORS).includes(filter)) {
    input.addEventListener(
      'change',
      debounce(async () => {
        storeInitialViewBox();
        await startProcessing(initialViewBox);
      }, 250),
    );
  } else if (Object.keys(POTRACE).includes(filter)) {
    input.addEventListener(
      'change',
      debounce(async () => {
        storeInitialViewBox();
        await startProcessing(initialViewBox);
      }, 250),
    );
  } else {
    input.addEventListener(
      'change',
      debounce(async () => {
        storeInitialViewBox();
        await startProcessing(initialViewBox);
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
  div.append(label);
  const wrapper = document.createElement('div');
  div.append(wrapper);
  wrapper.append(input);
  wrapper.append(button);
  details.append(div);
};

posterizeCheckbox.addEventListener('change', async () => {
  const disabled = !posterizeCheckbox.checked;
  Object.keys(COLORS).forEach((color) => {
    filterInputs[color].disabled = disabled;
  });
  storeInitialViewBox();
  await startProcessing(initialViewBox);
});

colorRadio.addEventListener('change', async () => {
  storeInitialViewBox();
  await startProcessing(initialViewBox);
});

monochromeRadio.addEventListener('change', async () => {
  storeInitialViewBox();
  await startProcessing(initialViewBox);
});

considerDPRCheckbox.addEventListener('change', async () => {
  storeInitialViewBox();
  await startProcessing(initialViewBox);
});

optimizeCurvesCheckbox.addEventListener('change', async () => {
  filterInputs.opttolerance.disabled = !optimizeCurvesCheckbox.checked;
  storeInitialViewBox();
  await startProcessing(initialViewBox);
});

const initUI = async () => {
  await i18n.getTranslations();
  changeLanguage();

  const mediaQueryList = window.matchMedia('(max-width: 414px)');
  const onMaxWidthMatch = () => {
    if (mediaQueryList.matches) {
      details.open = false;
      return;
    }
    details.open = true;
  };
  onMaxWidthMatch();
  mediaQueryList.addEventListener('change', onMaxWidthMatch);

  entriesArray.forEach((entries, i) => {
    const { name, icon } = detailsArray[i];
    const details = createDetails(name, icon);
    if (i < 2) {
      details.open = true;
    }
    if (name === 'colorChannels') {
      allDetails['colorChannels'].append(posterizeCheckbox.parentNode);
    } else if (name === 'svgOptions') {
      allDetails['svgOptions'].append(colorRadio.parentNode);
      allDetails['svgOptions'].append(monochromeRadio.parentNode);
    } else if (name === 'imageSize') {
      allDetails['imageSize'].append(considerDPRCheckbox.parentNode);
    }
    for (const [filter, props] of entries) {
      if (filter === 'opttolerance') {
        allDetails['svgOptions'].append(optimizeCurvesCheckbox.parentNode);
      }
      createControls(filter, props, details);
      if (name === 'svgOptions') {
        allDetails['svgOptions'].append(
          showAdvancedControlsCheckbox.parentNode,
        );
      }
    }
    detailsContainer.append(details);
  });
  detailsContainer.append(resetAllButton.parentNode);

  showAdvancedControlsCheckbox.checked = await get('showAdvancedControls');
  showAdvancedControls();

  inputImage.addEventListener('load', async () => {
    inputImage.width = inputImage.naturalWidth;
    inputImage.height = inputImage.naturalHeight;
    if (inputImage.src !== new URL('/favicon.png', location.href).toString()) {
      setTimeout(async () => {
        resetZoomAndPan();
        await startProcessing();
      }, 200);
    } else {
      const svg = await fetch('/potraced.svg').then((response) =>
        response.text(),
      );
      svgOutput.innerHTML = svg;
      svgOutput.dataset.originalViewBox = /viewBox="([^"]+)"/.exec(svg)[1];
    }
  });

  if (inputImage.complete) {
    inputImage.dispatchEvent(new Event('load'));
  }

  progress.hidden = false;

  try {
    // Start where the user left off.
    const handle = await get(FILE_HANDLE);
    if (handle && (await checkPermissions(handle))) {
      const file = await handle.getFile();
      const blobURL = URL.createObjectURL(file);
      inputImage.src = blobURL;
    }
  } catch (err) {
    console.error(err.name, err.message);
    await del(FILE_HANDLE);
  }
};

const checkPermissions = async (handle) => {
  const options = { mode: 'read' };
  if ((await handle.queryPermission(options)) === 'granted') {
    return true;
  }
  if ((await handle.requestPermission(options)) === 'granted') {
    return true;
  }
  return false;
};

const changeLanguage = () => {
  resetAllButton.textContent = i18n.t('resetAll');
  posterizeLabel.textContent = i18n.t('posterizeInputImage');
  colorLabel.textContent = i18n.t('colorSVG');
  monochromeLabel.textContent = i18n.t('monochromeSVG');
  considerDPRLabel.textContent = i18n.t('considerDPR');
  optimizeCurvesLabel.textContent = i18n.t('opticurve');
  showAdvancedControlsLabel.textContent = i18n.t('showAdvancedControls');
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
  installButton.innerHTML = '';
  installButton.append(createIcon(installIcon));
  installButton.append(document.createTextNode(i18n.t('install')));
  dropContainer.dataset.dropText = i18n.t('dropFileHere');
  summary.innerHTML = '';
  summary.append(createIcon(optionsIcon));
  summary.append(document.createTextNode(i18n.t('tweak')));
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
  resetZoomAndPan();
  await startProcessing();
});

debugCheckbox.addEventListener('click', () => {
  canvasMain.classList.toggle('debug');
});

let toastTimeout = null;
const showToast = (message, duration = 5000) => {
  toast.innerHTML = message;
  toast.hidden = false;
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  if (duration !== Infinity) {
    toastTimeout = setTimeout(() => {
      toast.hidden = true;
      toast.textContent = '';
    }, duration);
    return;
  }
};

const showAdvancedControls = () => {
  set('showAdvancedControls', showAdvancedControlsCheckbox.checked);
  document.querySelectorAll('.advanced').forEach((el) => {
    showAdvancedControlsCheckbox.checked
      ? (el.style.display = 'block')
      : (el.style.display = 'none');
  });
};
showAdvancedControlsCheckbox.addEventListener('change', showAdvancedControls);

document.documentElement.style.setProperty(
  '--100vh',
  `${window.innerHeight}px`,
);

window.addEventListener(
  'resize',
  debounce(() => {
    document.documentElement.style.setProperty(
      '--100vh',
      `${window.innerHeight}px`,
    );
  }, 250),
);

export { initUI, filters, filterInputs, showToast, COLORS, SCALE, POTRACE };
