const canvasMain = document.querySelector('canvas');
const preprocessContainer = document.querySelector('.preprocess');
const posterizeCheckbox = document.querySelector('.posterize');
const posterizeLabel = document.querySelector('[for=posterize]');
const colorRadio = document.querySelector('.color');
const colorLabel = document.querySelector('[for=color]');
const monochromeRadio = document.querySelector('.monochrome');
const monochromeLabel = document.querySelector('[for=monochrome]');
const inputImage = document.querySelector('img');
const resetAllButton = document.querySelector('.reset-all');
const fileOpenButton = document.querySelector('.open');
const saveSVGButton = document.querySelector('.save');
const svgOutput = document.querySelector('output');
const dropContainer = document.documentElement;

export {
  canvasMain,
  preprocessContainer,
  posterizeCheckbox,
  posterizeLabel,
  colorRadio,
  colorLabel,
  monochromeRadio,
  monochromeLabel,
  inputImage,
  resetAllButton,
  fileOpenButton,
  saveSVGButton,
  svgOutput,
  dropContainer,
};
