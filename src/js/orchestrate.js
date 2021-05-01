import {
  preProcessMainCanvas /* , preProcessInputImage*/,
} from './preprocess.js';
import { colorRadio, svgOutput } from './domrefs.js';
import { convertToMonochromeSVG } from './monochrome.js';
import { convertToColorSVG } from './color.js';

import spinnerSVG from '/spinner.svg?raw';

const COLOR = 'color';
const MONOCHROME = 'monochrome';

const displayResult = (svg, className) => {
  svg = svg
    .replace(/\s+width="\d+(?:\.\d+)?"/, '')
    .replace(/\s+height="\d+(?:\.\d+)"/, '');
  svgOutput.classList.remove(COLOR);
  svgOutput.classList.remove(MONOCHROME);
  svgOutput.classList.add(className);
  svgOutput.innerHTML = svg;
};

const startProcessing = async () => {
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
    displayResult(svg, COLOR);
  } else {
    const svg = await convertToMonochromeSVG(imageData);
    displayResult(svg, MONOCHROME);
  }
  spinner.style.display = 'none';
};

export { startProcessing };
