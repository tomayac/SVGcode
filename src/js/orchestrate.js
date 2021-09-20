import {
  preProcessMainCanvas /* , preProcessInputImage*/,
} from './preprocess.js';
import { colorRadio, svgOutput } from './domrefs.js';
import { convertToMonochromeSVG } from './monochrome.js';
import { convertToColorSVG } from './color.js';
import { showToast } from './ui.js';
import { i18n } from './i18n.js';

import spinnerSVG from '/spinner.svg?raw';

const COLOR = 'color';
const MONOCHROME = 'monochrome';

const displayResult = (svg, className, initialViewBox) => {
  // Remove `width` and `height` attributes.
  svg = svg
    .replace(/\s+width="\d+(?:\.\d+)?"/, '')
    .replace(/\s+height="\d+(?:\.\d+)"/, '');
  // Store the original `viewBox`.
  svgOutput.dataset.originalViewBox = /viewBox="([^"]+)"/.exec(svg)[1];
  // Restore the previous pan and zoom settings.
  if (initialViewBox.width) {
    svg = svg.replace(
      /viewBox="([^"]+)"/,
      `viewBox="${initialViewBox.x} ${initialViewBox.y} ${initialViewBox.width} ${initialViewBox.height}"`,
    );
  }
  svgOutput.classList.remove(COLOR);
  svgOutput.classList.remove(MONOCHROME);
  svgOutput.classList.add(className);
  svgOutput.innerHTML = svg;
  showToast(`${i18n.t('svgSize')}: ${svg.length} ${i18n.t('bytes')}`, 3000);
};

const startProcessing = async (initialViewBox = {}) => {
  svgOutput.innerHTML = '';
  let spinner = svgOutput.querySelector('img');
  if (!spinner) {
    spinner = document.createElement('img');
    spinner.classList.add('spinner');
    spinner.src = URL.createObjectURL(
      new Blob([spinnerSVG], { type: 'image/svg+xml' }),
    );
    svgOutput.append(spinner);
  }
  spinner.style.display = 'block';
  const imageData = preProcessMainCanvas();
  // ToDo: Run on main thread until https://crbug.com/1195763 gets resolved.
  // const imageData = await preProcessInputImage();
  if (colorRadio.checked) {
    const svg = await convertToColorSVG(imageData);
    displayResult(svg, COLOR, initialViewBox);
  } else {
    const svg = await convertToMonochromeSVG(imageData);
    displayResult(svg, MONOCHROME, initialViewBox);
  }
  spinner.style.display = 'none';
};

export { startProcessing };
