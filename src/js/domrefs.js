const canvasMain = document.querySelector('canvas');
const menu = document.querySelector('.menu');
const main = document.querySelector('main');
const detailsContainer = document.querySelector('.details');
const posterizeCheckbox = document.querySelector('.posterize');
const posterizeLabel = document.querySelector('[for=posterize]');
const colorRadio = document.querySelector('.color');
const colorLabel = document.querySelector('[for=color]');
const monochromeRadio = document.querySelector('.monochrome');
const monochromeLabel = document.querySelector('[for=monochrome]');
const considerDPRCheckbox = document.querySelector('.consider-dpr');
const considerDPRLabel = document.querySelector('[for="consider-dpr"]');
const optimizeCurvesCheckbox = document.querySelector('.optimize-curves');
const optimizeCurvesLabel = document.querySelector('[for="optimize-curves"]');
const inputImage = document.querySelector('img');
const resetAllButton = document.querySelector('.reset-all');
const fileOpenButton = document.querySelector('.open');
const saveSVGButton = document.querySelector('.save');
const copyButton = document.querySelector('.copy');
const pasteButton = document.querySelector('.paste');
const installButton = document.querySelector('.install');
const svgOutput = document.querySelector('output');
const debugCheckbox = document.querySelector('.debug');
const progress = document.querySelector('progress');
const toast = document.querySelector('.toast');
const dropContainer = document.documentElement;
const details = document.querySelector('details.main');
const summary = document.querySelector('summary');

const dpr = window.devicePixelRatio;

export {
  canvasMain,
  main,
  menu,
  detailsContainer,
  posterizeCheckbox,
  posterizeLabel,
  colorRadio,
  colorLabel,
  monochromeRadio,
  monochromeLabel,
  considerDPRCheckbox,
  considerDPRLabel,
  optimizeCurvesCheckbox,
  optimizeCurvesLabel,
  inputImage,
  resetAllButton,
  fileOpenButton,
  saveSVGButton,
  copyButton,
  pasteButton,
  installButton,
  svgOutput,
  dropContainer,
  debugCheckbox,
  toast,
  progress,
  details,
  summary,
  dpr,
};
