import { preProcessMainCanvas } from './preprocess.js';
import { convertToMonochromeSVG } from './monochrome.js';
import { convertToColorSVG } from './color.js';

const monochromeSVGOutput = document.querySelector('.output-monochrome');
const colorSVGOutput = document.querySelector('.output-color');

const startProcessing = async () => {
  const imageData = preProcessMainCanvas();
  // ToDo: Run on main thread until https://crbug.com/1195763 gets resolved.
  // const imageData = await preProcessInputImage()
  const [monochromeSVG, colorSVG] = await Promise.all([convertToMonochromeSVG(imageData),convertToColorSVG(imageData)]  )
  monochromeSVGOutput.innerHTML = monochromeSVG;
  colorSVGOutput.innerHTML = colorSVG
};

export { startProcessing, monochromeSVGOutput, colorSVGOutput };
