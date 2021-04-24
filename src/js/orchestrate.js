import {
  preProcessMainCanvas /* , preProcessInputImage*/,
} from './preprocess.js';
import { colorRadio, svgOutput } from './ui.js';
import { convertToMonochromeSVG } from './monochrome.js';
import { convertToColorSVG } from './color.js';
import { optimizeSVG } from './svgo.js';
import spinner from '/spinner.svg?raw';

const COLOR = 'color';
const MONOCHROME = 'monochrome';

const displayResult = (optimizedSVG, img, className) => {
  optimizedSVG = optimizedSVG
    .replace(/width="\d+" /, '')
    .replace(/height="\d+" /, '');
  img.src = URL.createObjectURL(
    new Blob([optimizedSVG], { type: 'image/svg+xml' }),
  );
  img.classList.remove(COLOR);
  img.classList.remove(MONOCHROME);
  img.classList.add(className);
};

const startProcessing = async () => {
  svgOutput.innerHTML = '';
  const img = document.createElement('img');
  img.classList.add('output-image');
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
