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
  closeOptionsButton,
  licenseLink,
  aboutLink,
  languageSelect,
} from './domrefs.js';
import { resetPanAndZoom } from './panzoom.js';
import { debounce } from './util.js';
import { startProcessing } from './orchestrate.js';
import { i18n } from './i18n.js';
import { FILE_HANDLE } from './filesystem.js';
import { get, set, del } from 'idb-keyval';
import './clipboard.js';
import './filesystem.js';
import 'pinch-zoom-element';
import 'dark-mode-toggle';

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

const MONOCHROME_SETTINGS = 'monochromeSettings';
const COLOR_SETTINGS = 'colorSettings';

const COLOR = 'color';
const MONOCHROME = 'monochrome';

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

const SCALE_ROTATION = { scale: 'scale', rotation: 'rotation' };

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

const scaleAndRotation = {
  [SCALE_ROTATION.scale]: { unit: PERCENT, initial: 100, min: 1, max: 200 },
  [SCALE_ROTATION.rotation]: { unit: DEGREES, initial: 0, min: 0, max: 360 },
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
  { name: 'imageSizeAndRotation', icon: scaleIcon },
  { name: 'imagePreprocessing', icon: filterIcon },
];

const entriesArray = [
  Object.entries(potraceOptions),
  Object.entries(posterizeComponents),
  Object.entries(scaleAndRotation),
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
  const summary = document.createElement('summary');
  const icon = createIcon(iconURL);
  summary.append(icon);
  const label = document.createElement('span');
  label.textContent = i18n.t(name);
  label.dataset.i18nKey = name;
  summary.append(label);
  details.append(summary);
  return details;
};

const advancedControls = [
  'alphamax',
  'turnpolicy',
  'optimize-curves',
  'opttolerance',
  'minPathSegments',
];

const createControls = async (filter, props, details) => {
  const { unit, min, max, initial } = props;
  const div = document.createElement('div');
  div.classList.add('preprocess-input');
  if (advancedControls.includes(filter)) {
    div.classList.add('advanced');
  }
  const label = document.createElement('label');
  const nameSpan = document.createElement('span');
  nameSpan.textContent = i18n.t(filter);
  nameSpan.dataset.i18nKey = filter;
  label.append(nameSpan);
  label.htmlFor = filter;

  const settings = await getSettings();

  const unitSpan = document.createElement('span');
  filterSpans[filter] = unitSpan;
  unitSpan.textContent = updateLabel(unit, settings[filter] || initial);
  unitSpan.dataset.dynamicI18nKey = unit;
  unitSpan.dataset.dynamicValue = settings[filter] || initial;

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
  input.value = settings[filter] || initial;

  input.addEventListener('input', () => {
    unitSpan.textContent = updateLabel(unit, input.value);
    unitSpan.dataset.dynamicValue = input.value;
  });
  if (Object.keys(COLORS).includes(filter)) {
    input.addEventListener(
      'change',
      debounce(async () => {
        await storeSettings(input);
        await startProcessing();
      }, 250),
    );
  } else if (Object.keys(POTRACE).includes(filter)) {
    input.addEventListener(
      'change',
      debounce(async () => {
        await storeSettings(input);
        await startProcessing();
      }, 250),
    );
  } else {
    input.addEventListener(
      'change',
      debounce(async () => {
        await storeSettings(input);
        await startProcessing();
      }, 250),
    );
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = i18n.t('reset');
  button.dataset.i18nKey = 'reset';
  button.addEventListener('click', async () => {
    input.value = initial;
    unitSpan.textContent = updateLabel(unit, initial);
    unitSpan.dataset.dynamicValue = initial;
    input.dispatchEvent(new Event('change'));
  });

  label.append(unitSpan);
  div.append(label);
  const wrapper = document.createElement('div');
  div.append(wrapper);
  wrapper.append(input);
  wrapper.append(button);
  details.append(div);
};

const posterizeCheckboxOnChange = () => {
  const disabled = !posterizeCheckbox.checked;
  Object.keys(COLORS).forEach((color) => {
    filterInputs[color].disabled = disabled;
  });
};

posterizeCheckbox.addEventListener('change', async () => {
  posterizeCheckboxOnChange();
  await storeSettings(posterizeCheckbox);
  await startProcessing();
});

const restoreState = async () => {
  const settings = await getSettings();

  posterizeCheckbox.checked =
    settings[posterizeCheckbox.id] ?? posterizeCheckbox.defaultChecked;
  posterizeCheckboxOnChange();

  considerDPRCheckbox.checked =
    settings[considerDPRCheckbox.id] ?? considerDPRCheckbox.defaultChecked;

  optimizeCurvesCheckbox.checked =
    settings[optimizeCurvesCheckbox.id] ??
    optimizeCurvesCheckbox.defaultChecked;
  optimizeCurvesCheckboxOnChange();

  showAdvancedControlsCheckbox.checked =
    settings[showAdvancedControlsCheckbox.id] ??
    showAdvancedControlsCheckbox.defaultChecked;
  showAdvancedControlsCheckboxOnChange();

  entriesArray.forEach((entries) => {
    for (const [filter, props] of entries) {
      const value = settings[filterInputs[filter].id] || props.initial;
      filterInputs[filter].value = value;
      filterSpans[filter].textContent = updateLabel(props.unit, value);
    }
  });
};

colorRadio.addEventListener('change', async () => {
  await set(colorRadio.id, colorRadio.checked);
  await set(monochromeRadio.id, monochromeRadio.checked);
  await restoreState();
  await startProcessing();
});

monochromeRadio.addEventListener('change', async () => {
  await set(colorRadio.id, colorRadio.checked);
  await set(monochromeRadio.id, monochromeRadio.checked);
  await restoreState();
  await startProcessing();
});

considerDPRCheckbox.addEventListener('change', async () => {
  await storeSettings(considerDPRCheckbox);
  await startProcessing();
});

const optimizeCurvesCheckboxOnChange = () => {
  filterInputs.opttolerance.disabled = !optimizeCurvesCheckbox.checked;
};

optimizeCurvesCheckbox.addEventListener('change', async () => {
  optimizeCurvesCheckboxOnChange();
  await storeSettings(optimizeCurvesCheckbox);
  await startProcessing();
});

const initUI = async () => {
  await i18n.getTranslations();
  changeLanguage();

  const mobileBreakpoint = getComputedStyle(
    document.documentElement,
  ).getPropertyValue('--mobile-breakpoint');
  const mediaQueryList = window.matchMedia(`(max-width: ${mobileBreakpoint})`);
  const onMaxWidthMatch = () => {
    if (mediaQueryList.matches) {
      details.open = false;
      return;
    }
    details.open = true;
  };
  onMaxWidthMatch();
  mediaQueryList.addEventListener('change', onMaxWidthMatch);

  colorRadio.checked = (await get(colorRadio.id)) ?? colorRadio.defaultChecked;
  monochromeRadio.checked =
    (await get(monochromeRadio.id)) ?? monochromeRadio.defaultChecked;
  if (colorRadio.checked) {
    svgOutput.classList.add(COLOR);
  }
  if (monochromeRadio.checked) {
    svgOutput.classList.add(MONOCHROME);
  }

  const createControlsPromises = [];
  entriesArray.forEach(async (entries, i) => {
    const { name, icon } = detailsArray[i];
    const details = createDetails(name, icon);
    detailsContainer.append(details);
    if (i < 2) {
      details.open = true;
    }
    if (name === 'colorChannels') {
      allDetails['colorChannels'].append(posterizeCheckbox.parentNode);
    } else if (name === 'svgOptions') {
      allDetails['svgOptions'].append(colorRadio.parentNode);
      allDetails['svgOptions'].append(monochromeRadio.parentNode);
    } else if (name === 'imageSizeAndRotation') {
      allDetails['imageSizeAndRotation'].append(considerDPRCheckbox.parentNode);
    }
    for (const [filter, props] of entries) {
      createControlsPromises.push(createControls(filter, props, details));
    }
    Promise.all(createControlsPromises).then(async () => {
      for (const [filter] of entries) {
        if (filter === 'opttolerance') {
          allDetails['svgOptions'].append(optimizeCurvesCheckbox.parentNode);
        }
        if (name === 'svgOptions') {
          allDetails['svgOptions'].append(
            showAdvancedControlsCheckbox.parentNode,
          );
        }
      }
      await restoreState();
    });
  });
  detailsContainer.append(resetAllButton.parentNode);

  inputImage.addEventListener('load', async () => {
    inputImage.width = inputImage.naturalWidth;
    inputImage.height = inputImage.naturalHeight;
    const settings = await getSettings();
    if (
      inputImage.src !== new URL('/favicon.png', location.href).toString() ||
      Object.keys(settings).length > 1
    ) {
      setTimeout(async () => {
        resetPanAndZoom();
        await startProcessing();
      }, 100);
    } else {
      const svg = await fetch(
        `/potraced-${colorRadio.checked ? 'color' : 'monochrome'}.svg`,
      ).then((response) => response.text());
      svgOutput.innerHTML = svg;
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
  licenseLink.textContent = i18n.t('license');
  aboutLink.textContent = i18n.t('about');
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
  closeOptionsButton.ariaLabel = i18n.t('closeOptions');
  document.querySelectorAll('[data-i18n-key]').forEach((element) => {
    element.textContent = i18n.t(element.dataset.i18nKey);
  });
  document.querySelectorAll('[data-dynamic-i18n-key]').forEach((element) => {
    element.textContent = updateLabel(element.dataset.dynamicI18nKey, element.dataset.dynamicValue);
  });
  languageSelect.innerHTML = '';
  i18n.supportedLocales.forEach((languageAndLocale) => {
    const [language, locale] = languageAndLocale.split('-');
    const option = document.createElement('option');
    option.value = languageAndLocale;
    option.textContent = i18n.t(`${language}${locale}`);
    if (language === i18n.currentLanguageAndLocale.language && locale === i18n.currentLanguageAndLocale.locale) {
      option.selected = true;
    }
    languageSelect.append(option);
  });
};

languageSelect.addEventListener('change', async () => {
  const [language, locale] = languageSelect.value.split('-');
  try {
    await i18n.setLanguageAndLocale(language, locale);
    changeLanguage();
  } catch (err) {
    console.error(err.name, err.message);
  }
});

resetAllButton.addEventListener('click', async () => {
  const reset = (filter, unit, initial) => {
    filterInputs[filter].value = initial;
    filterSpans[filter].textContent = updateLabel(unit, initial);
    filterSpans[filter].dataset.dynamicValue = initial;
  };

  entriesArray.forEach((entries) => {
    for (const [filter, props] of entries) {
      reset(filter, props.unit, props.initial);
    }
  });

  optimizeCurvesCheckbox.checked = optimizeCurvesCheckbox.defaultChecked;
  posterizeCheckbox.checked = posterizeCheckbox.defaultChecked;
  considerDPRCheckbox.checked = considerDPRCheckbox.defaultChecked;

  await resetSettings();
  resetPanAndZoom();
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

const showAdvancedControlsCheckboxOnChange = async () => {
  await storeSettings(showAdvancedControlsCheckbox);
  document.querySelectorAll('.advanced').forEach((el) => {
    showAdvancedControlsCheckbox.checked
      ? (el.style.display = 'block')
      : (el.style.display = 'none');
  });
};
showAdvancedControlsCheckbox.addEventListener(
  'change',
  showAdvancedControlsCheckboxOnChange,
);

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

closeOptionsButton.addEventListener('click', () => {
  details.open = false;
});

const resetSettings = async () => {
  await set(colorRadio.checked ? COLOR_SETTINGS : MONOCHROME_SETTINGS, {});
};

const getSettings = async () => {
  const settings = colorRadio.checked
    ? await get(COLOR_SETTINGS)
    : await get(MONOCHROME_SETTINGS);
  if (settings) {
    return settings;
  }
  return {};
};

const storeSettings = async (input) => {
  const settings = await getSettings();
  settings[input.id] = input.type === 'range' ? input.value : input.checked;
  await set(
    colorRadio.checked ? COLOR_SETTINGS : MONOCHROME_SETTINGS,
    settings,
  );
};

export {
  initUI,
  filters,
  filterInputs,
  showToast,
  COLORS,
  SCALE_ROTATION,
  POTRACE,
  MONOCHROME,
  COLOR,
};
