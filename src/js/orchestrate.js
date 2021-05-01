import {
  preProcessMainCanvas /* , preProcessInputImage*/,
} from './preprocess.js';
import { colorRadio, svgOutput } from './domrefs.js';
import { convertToMonochromeSVG } from './monochrome.js';
import { convertToColorSVG } from './color.js';
import { optimizeSVG } from './svgo.js';

import spinner from '/spinner.svg?raw';

const COLOR = 'color';
const MONOCHROME = 'monochrome';
/*
let lastOptimizedSVG = null;
let lastImg = null;
let lastClassName = null;
*/

const displayResult = (optimizedSVG, img, className) => {
  optimizedSVG = optimizedSVG
    .replace(/width="\d+" /, '')
    .replace(/height="\d+" /, '');
  svgOutput.classList.remove(COLOR);
  svgOutput.classList.remove(MONOCHROME);
  svgOutput.classList.add(className);
  svgOutput.innerHTML = optimizedSVG;
};

const startProcessing = async () => {
  const previousImage = svgOutput.querySelector('img');
  if (previousImage) {
    URL.revokeObjectURL(previousImage.src);
  }
  svgOutput.innerHTML = '';
  const img = document.createElement('img');
  img.classList.add('spinner');
  img.src = URL.createObjectURL(new Blob([spinner], { type: 'image/svg+xml' }));
  svgOutput.append(img);
  const imageData = preProcessMainCanvas();
  // ToDo: Run on main thread until https://crbug.com/1195763 gets resolved.
  // const imageData = await preProcessInputImage();
  if (colorRadio.checked) {
    convertToColorSVG(imageData)
      .then(optimizeSVG)
      .then((optimizedColorSVG) =>
        displayResult(optimizedColorSVG, img, COLOR),
      );
  } else {
    convertToMonochromeSVG(imageData)
      .then(optimizeSVG)
      .then((optimizedMonochromeSVG) =>
        displayResult(optimizedMonochromeSVG, img, MONOCHROME),
      );
  }
};

export { startProcessing };
