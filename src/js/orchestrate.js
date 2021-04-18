import {
  preProcessMainCanvas /* , preProcessInputImage*/,
} from './preprocess.js';
import {colorCheckbox} from './ui.js';
import { convertToMonochromeSVG } from './monochrome.js';
import { convertToColorSVG } from './color.js';
import { optimizeSVG } from './svgo.js';

const svgOutput = document.querySelector('output');

const startProcessing = async () => {
  const imageData = preProcessMainCanvas();
  // ToDo: Run on main thread until https://crbug.com/1195763 gets resolved.
  // const imageData = await preProcessInputImage();
  if (colorCheckbox.checked) {
    convertToColorSVG(imageData)
    .then(optimizeSVG)
    .then(
      (optimizedColorSVG) => (svgOutput.innerHTML = optimizedColorSVG),
    );
  } else {
    convertToMonochromeSVG(imageData)
      .then(optimizeSVG)
      .then(
        (optimizedMonochromeSVG) =>
          (svgOutput.innerHTML = optimizedMonochromeSVG),
      );
      }
};

export { startProcessing, svgOutput };
