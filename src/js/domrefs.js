/**
 * SVGcode—Convert raster images to SVG vector graphics
 * Copyright (C) 2021 Google LLC
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

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
const showAdvancedControlsCheckbox = document.querySelector('.show-advanced');
const showAdvancedControlsLabel = document.querySelector(
  '[for="show-advanced"]',
);
const inputImage = document.querySelector('img');
const resetAllButton = document.querySelector('.reset-all');
const fileOpenButton = document.querySelector('.open');
const saveSVGButton = document.querySelector('.save');
const copyButton = document.querySelector('.copy');
const shareSVGButton = document.querySelector('.share');
const pasteButton = document.querySelector('.paste');
const installButton = document.querySelector('.install');
const svgOutput = document.querySelector('.svg-output');
const debugCheckbox = document.querySelector('.debug');
const progress = document.querySelector('progress');
const toast = document.querySelector('.toast');
const details = document.querySelector('details.main');
const summary = document.querySelector('summary');
const closeOptionsButton = document.querySelector('.close-options-button');
const licenseLink = document.querySelector('.license');
const aboutLink = document.querySelector('.about');
const pinchZoom = document.querySelector('pinch-zoom');
const languageSelect = document.querySelector('.language');
const darkModeToggle = document.querySelector('dark-mode-toggle');
const documentElement = document.documentElement;
const metaThemeColor = document.querySelector('meta[name=theme-color]');

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
  showAdvancedControlsCheckbox,
  showAdvancedControlsLabel,
  inputImage,
  resetAllButton,
  fileOpenButton,
  saveSVGButton,
  shareSVGButton,
  copyButton,
  pasteButton,
  installButton,
  svgOutput,
  documentElement,
  debugCheckbox,
  toast,
  progress,
  details,
  summary,
  closeOptionsButton,
  dpr,
  licenseLink,
  aboutLink,
  pinchZoom,
  languageSelect,
  darkModeToggle,
  metaThemeColor,
};
