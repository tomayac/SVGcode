import {
  preProcessMainCanvas /* , preProcessInputImage*/,
} from './preprocess.js';
import { colorRadio, svgOutput } from './ui.js';
import { convertToMonochromeSVG } from './monochrome.js';
import { convertToColorSVG } from './color.js';
import { optimizeSVG } from './svgo.js';
import spinner from '/spinner.svg?raw';

const displayResult = (optimizedSVG, img) => {
  optimizedSVG = optimizedSVG
    .replace(/width="\d+" /, '')
    .replace(/height="\d+" /, '');
  img.src = URL.createObjectURL(
    new Blob([optimizedSVG], { type: 'image/svg+xml' }),
  );
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
      .then((optimizedColorSVG) => displayResult(optimizedColorSVG, img));
  } else {
    convertToMonochromeSVG(imageData)
      .then(optimizeSVG)
      .then((optimizedMonochromeSVG) =>
        displayResult(optimizedMonochromeSVG, img),
      );
  }
};

export { startProcessing };
