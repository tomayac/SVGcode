import { fileOpen, fileSave } from 'browser-fs-access';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const fileOpenButton = document.querySelector('.open');
const saveImageButton = document.querySelector('.save-image');
const saveSVGButton = document.querySelector('.save-svg');
const posterize = document.querySelector('.posterize');
const preprocess = document.querySelector('.preprocess');
const filterXML = document.querySelector('#posterize');
const inputImage = document.querySelector('img');
const outputSVG = document.querySelector('output');

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

const COLORS = { red: 'red', green: 'green', blue: 'blue' };

const posterizeComponents = {
  [COLORS.red]: { unit: null, initial: 5, min: 1, max: 10 },
  [COLORS.green]: { unit: null, initial: 5, min: 1, max: 10 },
  [COLORS.blue]: { unit: null, initial: 5, min: 1, max: 10 },
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

const getPosterizeFilter = (r, g, b) => {
  return `
    <feComponentTransfer>
      <feFuncR type="discrete" tableValues="${r.join(' ')}" />
      <feFuncG type="discrete" tableValues="${g.join(' ')}" />
      <feFuncB type="discrete" tableValues="${b.join(' ')}" />
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

const createFilter = (filter, props) => {
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
  createFilter(filter, props);
}
for (const [filter, props] of Object.entries(scale)) {
  createFilter(filter, props);
}
for (const [filter, props] of Object.entries(filters)) {
  createFilter(filter, props);
}
for (const [filter, props] of Object.entries(potraceOptions)) {
  createFilter(filter, props);
}

const convertToSVG = async () => {
  const config = {
    turdsize: parseInt(turdsize.value, 10),
  };
  const svg = await loadFromCanvas(canvas, config);
  outputSVG.innerHTML = svg;
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

const preProcessImage = () => {
  const scaleFactor = parseInt(filterInputs[SCALE.scale].value, 10) / 100;
  canvas.width = Math.ceil(inputImage.naturalWidth * scaleFactor);
  canvas.height = Math.ceil(inputImage.naturalHeight * scaleFactor);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = getFilterString();
  ctx.drawImage(
    inputImage,
    0,
    0,
    inputImage.naturalWidth,
    inputImage.naturalHeight,
    0,
    0,
    canvas.width,
    canvas.height,
  );
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
  filterXML.innerHTML = getPosterizeFilter(
    getRange(filterInputs[COLORS.red]),
    getRange(filterInputs[COLORS.green]),
    getRange(filterInputs[COLORS.blue]),
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
    await convertToSVG();
  }, 250),
);

const canvasToBlob = async (mimeType = 'image/png') => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
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
    const blob = new Blob([outputSVG.innerHTML], { type: 'image/svg+xml' });
    await fileSave(blob, { fileName: '', description: 'SVG file' });
  } catch (err) {
    console.error(err.name, err.message);
  }
});

const init = async () => {
  updateFilter();
  preProcessImage();
  try {
    await convertToSVG();
  } catch (err) {
    console.error(err.name, err.message);
  }
};

inputImage.addEventListener('load', init);

if (inputImage.complete) {
  inputImage.dispatchEvent(new Event('load'));
}
