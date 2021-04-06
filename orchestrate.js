import {
  preProcessMainCanvas /* , preProcessInputImage*/,
} from './preprocess.js';
import { convertToMonochromeSVG } from './monochrome.js';
import { convertToColorSVG } from './color.js';
import { optimizeSVG } from './svgo.js';

const monochromeSVGOutput = document.querySelector('.output-monochrome');
const colorSVGOutput = document.querySelector('.output-color');

const startProcessing = async () => {
  const imageData = preProcessMainCanvas();
  // ToDo: Run on main thread until https://crbug.com/1195763 gets resolved.
  // const imageData = await preProcessInputImage();
  convertToMonochromeSVG(imageData)
    .then(optimizeSVG)
    .then(
      (optimizedMonochromeSVG) =>
        (monochromeSVGOutput.innerHTML = optimizedMonochromeSVG),
    );
  convertToColorSVG(imageData)
    .then(optimizeSVG)
    .then(
      (optimizedColorSVG) => (colorSVGOutput.innerHTML = optimizedColorSVG),
    );
};

export { startProcessing, monochromeSVGOutput, colorSVGOutput };
