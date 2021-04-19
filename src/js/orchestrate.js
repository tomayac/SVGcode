import {
  preProcessMainCanvas /* , preProcessInputImage*/,
} from './preprocess.js';
import { colorRadio, svgOutput } from './ui.js';
import { convertToMonochromeSVG } from './monochrome.js';
import { convertToColorSVG } from './color.js';
import { optimizeSVG } from './svgo.js';
import spinner from '/spinner.svg?raw';

const startProcessing = async () => {
  svgOutput.innerHTML = spinner;
  const imageData = preProcessMainCanvas();
  // ToDo: Run on main thread until https://crbug.com/1195763 gets resolved.
  // const imageData = await preProcessInputImage();
  if (colorRadio.checked) {
    convertToColorSVG(imageData)
      .then(optimizeSVG)
      .then((optimizedColorSVG) => (svgOutput.innerHTML = optimizedColorSVG));
  } else {
    convertToMonochromeSVG(imageData)
      .then(optimizeSVG)
      .then(
        (optimizedMonochromeSVG) =>
          (svgOutput.innerHTML = optimizedMonochromeSVG),
      );
  }
};

export { startProcessing };
