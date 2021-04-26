import {
  preProcessMainCanvas /* , preProcessInputImage*/,
} from './preprocess.js';
import { colorRadio, svgOutput, zoomInput } from './domrefs.js';
import { convertToMonochromeSVG } from './monochrome.js';
import { convertToColorSVG } from './color.js';
import { optimizeSVG } from './svgo.js';

import spinner from '/spinner.svg?raw';

const COLOR = 'color';
const MONOCHROME = 'monochrome';

let lastOptimizedSVG = null
let lastImg = null
let lastClassName = null

zoomInput.addEventListener('change', () => {
  displayResult(lastOptimizedSVG, lastImg, lastClassName)
});

const displayResult = (optimizedSVG, img, className) => {
  URL.revokeObjectURL(img.src);
  const scale = Number(zoomInput.value);
  optimizedSVG = optimizedSVG
    .replace(/width="\d+" /, '')
    .replace(/height="\d+" /, '');
  optimizedSVG = optimizedSVG.replace(/viewBox="(-?\d+) (-?\d+) (-?\d+) (-?\d+)"/, (_, $1, $2, $3, $4) => {
    $1 = Number($1)
    $2 = Number($2)
    $3 = Number($3)
    $4 = Number($4)
    const width = Math.floor($3 * scale)
    const height = Math.floor($4 * scale)
    const x = Math.floor($1 + ($3 - width) / 2)
    const y = Math.floor($2 + ($4 - height) /2)
    console.log(`viewBox="${x} ${y} ${width} ${height}"`)
    return `viewBox="${x} ${y} ${width} ${height}"`
  })
  img.src = URL.createObjectURL(
    new Blob([optimizedSVG], { type: 'image/svg+xml' }),
  );
  img.classList.remove(COLOR);
  img.classList.remove(MONOCHROME)
  img.classList.add(className);
  if (!lastOptimizedSVG) {
    lastOptimizedSVG = optimizedSVG;
    lastImg = img;
    lastClassName = className;
  }
};

const startProcessing = async () => {
  const previousImage = svgOutput.querySelector('img');
  if (previousImage) {
    URL.revokeObjectURL(previousImage.src);
  }
  lastOptimizedSVG = null
  lastImg = null
  lastClassName = null
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
