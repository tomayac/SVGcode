import { fileOpen, fileSave, supported } from 'browser-fs-access';

const canvasMain = /*'OffscreenCanvas' in window ? new OffscreenCanvas(1, 1) : */ document.querySelector(
  '.canvas-main',
);
const ctxMain = canvasMain.getContext('2d', { desynchronized: true });
ctxMain.imageSmoothingEnabled = false;

const canvasChannel =
  'OffscreenCanvas' in window
    ? new OffscreenCanvas(1, 1)
    : document.querySelector('.canvas-channel');
const ctxChannel = canvasChannel.getContext('2d', { desynchronized: true });
ctxChannel.imageSmoothingEnabled = false;

const inputImage = document.querySelector('img');
const outputBlackWhite = document.querySelector('.output-main');
const outputColor = document.querySelector('.output-channel');

const fileOpenButton = document.querySelector('.open');
const saveImageButton = document.querySelector('.save-image');
const saveSVGButton = document.querySelector('.save-svg');

const dropArea = document.querySelector('.drop');

const posterize = document.querySelector('.posterize');
const preprocess = document.querySelector('.preprocess');
const posterizeFilterXML = document.querySelector('#posterize');

const PERCENT = '%';
const DEGREES = 'deg';

const filters = {
  brightness: { unit: PERCENT, initial: 100, min: 0, max: 200 },
  contrast: { unit: PERCENT, initial: 100, min: 0, max: 200 },
  grayscale: { unit: PERCENT, initial: 0, min: 0, max: 100 },
  'hue-rotate': { unit: DEGREES, initial: 0, min: 0, max: 360 },
  invert: { unit: PERCENT, initial: 0, min: 0, max: 100 },
  opacity: { unit: PERCENT, initial: 100, min: 0, max: 100 },
  saturate: { unit: PERCENT, initial: 100, min: 0, max: 200 },
  sepia: { unit: PERCENT, initial: 0, min: 0, max: 100 },
};

const COLORS = { red: 'red', green: 'green', blue: 'blue', alpha: 'alpha' };

const posterizeComponents = {
  [COLORS.red]: { unit: null, initial: 1, min: 1, max: 10 },
  [COLORS.green]: { unit: null, initial: 1, min: 1, max: 10 },
  [COLORS.blue]: { unit: null, initial: 1, min: 1, max: 10 },
  [COLORS.alpha]: { unit: null, initial: 1, min: 1, max: 10 },
};

const SCALE = {
  scale: 'scale',
};

const scale = {
  [SCALE.scale]: { unit: null, initial: 100, min: 1, max: 200 },
};

const POTRACE = { turdsize: 'turdsize' };

const potraceOptions = {
  [POTRACE.turdsize]: { unit: null, initial: 2, min: 1, max: 1000 },
};

const filterInputs = {};

const getPosterizeFilter = (r, g, b, a) => {
  return `
    <feComponentTransfer>
      <feFuncR type="discrete" tableValues="${r.join(' ')}" />
      <feFuncG type="discrete" tableValues="${g.join(' ')}" />
      <feFuncB type="discrete" tableValues="${b.join(' ')}" />
      <feFuncA type="discrete" tableValues="${a.join(' ')}" />
    </feComponentTransfer>`;
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const createControls = (filter, props) => {
  const { unit, min, max, initial } = props;
  const div = document.createElement('div');
  div.classList.add('preprocess-input');

  const label = document.createElement('label');
  label.textContent = `${filter}${unit ? ` (${unit})` : ''}`;
  label.for = filter;

  const input = document.createElement('input');
  input.id = filter;
  input.type = 'range';
  input.class = filter;
  input.min = min;
  input.max = max;
  input.value = initial;
  if (unit) {
    input.dataset.unit = unit;
  }
  filterInputs[filter] = input;
  if (Object.keys(COLORS).includes(filter)) {
    input.addEventListener(
      'change',
      debounce(async () => {
        await updateFilter();
      }, 250),
    );
  } else if (Object.keys(POTRACE).includes(filter)) {
    input.addEventListener(
      'change',
      debounce(async () => {
        await convertToSVG();
      }, 250),
    );
  } else {
    input.addEventListener(
      'change',
      debounce(async () => {
        preProcessImage();
        await convertToSVG();
      }, 250),
    );
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Reset';
  button.addEventListener('click', async () => {
    input.value = initial;
    input.dispatchEvent(new Event('change'));
  });

  label.append(input);
  div.append(label);
  div.append(button);
  preprocess.append(div);
};

for (const [filter, props] of Object.entries(posterizeComponents)) {
  createControls(filter, props);
}
for (const [filter, props] of Object.entries(scale)) {
  createControls(filter, props);
}
for (const [filter, props] of Object.entries(filters)) {
  createControls(filter, props);
}
for (const [filter, props] of Object.entries(potraceOptions)) {
  createControls(filter, props);
}

const extractColors = () => {
  const colors = {};
  const imageData = ctxMain.getImageData(
    0,
    0,
    canvasMain.width,
    canvasMain.height,
  );
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i + 0];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];
    const rgba = `${r},${g},${b},${a}`;
    if (colors[rgba]) {
      colors[rgba] += 1;
    } else {
      colors[rgba] = 1;
    }
  }
  return { colors, imageData };
};

const convertToSVG = async () => {
  const config = {
    turdsize: parseInt(turdsize.value, 10),
  };
  const svg = await loadFromCanvas(canvasMain, config);
  outputBlackWhite.innerHTML = svg;
};

const getFilterString = () => {
  let string = `${posterize.checked ? 'url("#posterize") ' : ''}`;
  for (const [filter, props] of Object.entries(filters)) {
    const input = filterInputs[filter];
    if (props.initial === parseInt(input.value, 10)) {
      continue;
    }
    string += `${filter}(${input.value}${input.dataset.unit}) `;
  }
  return string.trim() || 'none';
};

const preProcessMainCanvas = () => {
  console.log('preProcessMainCanvas');
  const scaleFactor = parseInt(filterInputs[SCALE.scale].value, 10) / 100;
  canvasMain.width = Math.ceil(inputImage.naturalWidth * scaleFactor);
  canvasMain.height = Math.ceil(inputImage.naturalHeight * scaleFactor);
  canvasChannel.width = canvasMain.width;
  canvasChannel.height = canvasMain.height;
  ctxMain.clearRect(0, 0, canvasMain.width, canvasMain.height);
  ctxMain.filter = getFilterString();
  ctxMain.drawImage(
    inputImage,
    0,
    0,
    inputImage.naturalWidth,
    inputImage.naturalHeight,
    0,
    0,
    canvasMain.width,
    canvasMain.height,
  );
};

const preProcessImage = async () => {
  console.log('preProcessImage');
  preProcessMainCanvas();

  const { colors, imageData } = extractColors();
  ctxChannel.clearRect(0, 0, canvasChannel.width, canvasChannel.height);

  let prefix = '';
  let suffix = '';
  let svgString = '';

  const imageDataObjects = {};

  for (let i = 0; i < imageData.data.length; i += 4) {
    for (const [color, occurrences] of Object.entries(colors)) {
      const [red, green, blue, alpha] = color.split(',');
      //console.log(color, '=>', occurrences)
      if (!imageDataObjects[color]) {
        imageDataObjects[color] = new ImageData(
          canvasMain.width,
          canvasMain.height,
        );
      }
      const r = imageData.data[i + 0];
      if (r !== red) {
        continue;
      }
      const g = imageData.data[i + 1];
      if (g !== green) {
        continue;
      }
      const b = imageData.data[i + 2];
      if (b !== blue) {
        continue;
      }
      const a = imageData.data[i + 3];
      if (a !== alpha) {
        continue;
      }
      imageDataObjects[color].data[i + 0] = 0;
      imageDataObjects[color].data[i + 1] = 0;
      imageDataObjects[color].data[i + 2] = 0;
      imageDataObjects[color].data[i + 3] = 255;
    }
  }
  for (const [color, occurrences] of Object.entries(colors)) {
    ctxChannel.putImageData(imageDataObjects[color], 0, 0);
    const config = {
      turdsize: parseInt(turdsize.value, 10),
    };
    let svg = await loadFromCanvas(canvasChannel, config);
    console.log(svg);
    svg = svg.replace('fill="#000000"', `fill="rgba(${color})"`);
    if (!prefix) {
      prefix = svg.replace(/(.*?<svg[^>]+>)(.*?)(<\/svg>)/, '$1');
      suffix = svg.replace(/(.*?<svg[^>]+>)(.*?)(<\/svg>)/, '$3');
      svgString = prefix;
    }
    svgString += svg.replace(/(.*?<svg[^>]+>)(.*?)(<\/svg>)/, '$2');
  }
  outputColor.innerHTML = svgString + suffix;
};

const getRange = (input) => {
  const value = parseInt(input.value, 10);
  const array = [];
  for (let i = 0; i <= value; i++) {
    array[i] = ((1 / value) * i).toFixed(1);
  }
  return array;
};

const updateFilter = async () => {
  posterizeFilterXML.innerHTML = getPosterizeFilter(
    getRange(filterInputs[COLORS.red]),
    getRange(filterInputs[COLORS.green]),
    getRange(filterInputs[COLORS.blue]),
    getRange(filterInputs[COLORS.alpha]),
  );
  preProcessImage();
  await convertToSVG();
};

posterize.addEventListener('change', async () => {
  preProcessImage();
  await convertToSVG();
});

turdsize.addEventListener(
  'change',
  debounce(async () => {
    preProcessImage();
    await convertToSVG();
  }, 250),
);

const canvasToBlob = async (mimeType = 'image/png') => {
  return new Promise((resolve) => {
    canvasMain.toBlob((blob) => {
      resolve(blob);
    }, mimeType);
  });
};

fileOpenButton.addEventListener('click', async () => {
  try {
    const files = await fileOpen({
      mimeTypes: ['image/*'],
      description: 'Image files',
      multiple: true,
    });
    files.forEach((file) => {
      const blobURL = URL.createObjectURL(file);
      inputImage.src = blobURL;
      inputImage.dispatchEvent(new Event('load'));
    });
  } catch (err) {
    console.error(err.name, err.message);
  }
});

dropArea.addEventListener('dragover', (event) => {
  // Prevent navigation.
  event.preventDefault();
  // Style the drag-and-drop as a "copy file" operation.
  event.dataTransfer.dropEffect = 'copy';
});

dropArea.addEventListener('drop', async (event) => {
  // Prevent navigation.
  event.preventDefault();
  const item = event.dataTransfer.items[0];
  if (item.kind === 'file') {
    if (supported) {
      const entry = await item.getAsFileSystemHandle();
      if (entry.kind === 'directory') {
        return;
      } else {
        const file = await entry.getFile();
        inputImage.src = URL.createObjectURL(file);
      }
    } else {
      const file = item.getAsFile();
      inputImage.src = URL.createObjectURL(file);
    }
  }
});

saveImageButton.addEventListener('click', async () => {
  try {
    const blob = await canvasToBlob();
    await fileSave(blob, { fileName: '', description: 'PNG file' });
  } catch (err) {
    console.error(err.name, err.message);
  }
});

saveSVGButton.addEventListener('click', async () => {
  try {
    const blob = new Blob([outputBlackWhite.innerHTML], {
      type: 'image/svg+xml',
    });
    await fileSave(blob, { fileName: '', description: 'SVG file' });
  } catch (err) {
    console.error(err.name, err.message);
  }
});

const init = async () => {
  console.log('Entering Init');
  updateFilter();
  /*
  console.log('Done Update filter')
  preProcessImage();
  console.log('DOne preprocess ')
  try {
    await convertToSVG();
    console.log('done convert')
  } catch (err) {
    console.error(err.name, err.message);
  }*/
};

inputImage.addEventListener('load', () => {
  init();
});

if (inputImage.complete) {
  inputImage.dispatchEvent(new Event('load'));
}
