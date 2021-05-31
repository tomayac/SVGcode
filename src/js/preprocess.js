import { filterInputs, filters, COLORS, SCALE } from './ui.js';
import { inputImage, canvasMain, posterizeCheckbox } from './domrefs.js';

// ToDo: Run on main thread until https://crbug.com/1195763 gets resolved.
// import PreProcessWorker from './preprocessworker.js?worker&inline';
// const preProcessWorker = new PreProcessWorker();

// const offscreen = canvasMain.transferControlToOffscreen();
const ctxMain = canvasMain.getContext('2d', { desynchronized: true });
ctxMain.imageSmoothingEnabled = false;

const preProcessMainCanvas = () => {
  const { width, height } = getScaledDimensions();
  canvasMain.width = width;
  canvasMain.height = height;
  ctxMain.clearRect(0, 0, width, height);
  ctxMain.filter = getFilterString();
  ctxMain.drawImage(
    inputImage,
    0,
    0,
    inputImage.naturalWidth,
    inputImage.naturalHeight,
    0,
    0,
    width,
    height,
  );
  return ctxMain.getImageData(0, 0, width, height);
};

// ToDo: Run on main thread until https://crbug.com/1195763 gets resolved.
/*
const preProcessInputImage = async () => {
  return new Promise(async (resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({data}) => {
      channel.port1.close();
      resolve(data.result);
    };

    const { width, height } = getScaledDimensions();
    preProcessWorker.postMessage({
      offscreen,
      inputImageBitmap: await createImageBitmap(inputImage),
      filterString: getFilterString(),
      width,
      height,
    }, [channel.port2, offscreen]);
  });
};
*/

const getScaledDimensions = () => {
  const scaleFactor = (2 * Number(filterInputs[SCALE.scale].value)) / 100;
  return {
    width: Math.ceil(inputImage.naturalWidth * scaleFactor),
    height: Math.ceil(inputImage.naturalHeight * scaleFactor),
  };
};

const getPosterizeFilter = () => {
  const getRange = (input) => {
    const value = Number(input.value);
    const array = [];
    for (let i = 0; i <= value; i++) {
      array[i] = ((1 / value) * i).toFixed(1);
    }
    return array.join(',');
  };

  return `data:image/svg+xml;utf8,<svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <filter id="posterize">
        <feComponentTransfer>
          <feFuncR type="discrete" tableValues="${getRange(
            filterInputs[COLORS.red],
          )}" />
          <feFuncG type="discrete" tableValues="${getRange(
            filterInputs[COLORS.green],
          )}" />
          <feFuncB type="discrete" tableValues="${getRange(
            filterInputs[COLORS.blue],
          )}" />
          <feFuncA type="discrete" tableValues="${getRange(
            filterInputs[COLORS.alpha],
          )}" />
        </feComponentTransfer>
      </filter>
    </svg>`
    .replace(/[\r\n]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const getFilterString = () => {
  let string = `${
    posterizeCheckbox.checked ? `url('${getPosterizeFilter()}#posterize') ` : ''
  }`;
  for (const [filter, props] of Object.entries(filters)) {
    const input = filterInputs[filter];
    if (props.initial === Number(input.value)) {
      continue;
    }
    string += `${filter}(${input.value}${input.dataset.unit}) `;
  }
  return string.trim() || 'none';
};

export { preProcessMainCanvas /* preProcessInputImage,*/ };
