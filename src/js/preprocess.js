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

import { filterInputs, filters, showToast, COLORS, SCALE } from './ui.js';
import {
  inputImage,
  canvasMain,
  posterizeCheckbox,
  dpr,
  considerDPRCheckbox,
  svgOutput,
} from './domrefs.js';
import canvasSize from 'canvas-size';

let preProcessInputImage;
let preProcessMainCanvas;
const supportsOffscreenCanvas =
  'OffscreenCanvas' in window && 'CanvasFilter' in window;

if (supportsOffscreenCanvas) {
  import('./preprocessworker.js?worker').then((module) => {
    const PreProcessWorker = module.default;
    let preProcessWorker = null;
    const ctxCanvasMain = canvasMain.getContext('2d');

    preProcessInputImage = async () => {
      if (preProcessWorker) {
        preProcessWorker.terminate();
      }
      preProcessWorker = new PreProcessWorker();
      // A canvas can only be detached once, so clone each time.
      const offscreen = canvasMain.cloneNode().transferControlToOffscreen();
      preProcessWorker.postMessage({ offscreen }, [offscreen]);

      return new Promise(async (resolve) => {
        const { width, height } = getScaledDimensions();
        let inputImageBitmap;
        try {
          inputImageBitmap = await createImageBitmap(inputImage);
        } catch {
          try {
            // For SVGs without an intrinsic size.
            inputImageBitmap = await createImageBitmap(
              inputImage,
              0,
              0,
              width,
              height,
            );
          } catch (err) {
            console.error(err.name, err.message);
            svgOutput.innerHTML = '';
            showToast(err.message);
            return;
          }
        }
        const channel = new MessageChannel();
        channel.port1.onmessage = ({ data }) => {
          channel.port1.close();
          if (preProcessWorker) {
            preProcessWorker.terminate();
            preProcessWorker = null;
          }
          canvasMain.width = width;
          canvasMain.height = height;
          ctxCanvasMain.putImageData(data.result, 0, 0);
          resolve(data.result);
        };

        preProcessWorker.postMessage(
          {
            inputImageBitmap,
            posterize: posterizeCheckbox.checked,
            rgba: {
              r: getRange(filterInputs[COLORS.red]),
              g: getRange(filterInputs[COLORS.green]),
              b: getRange(filterInputs[COLORS.blue]),
              a: getRange(filterInputs[COLORS.alpha]),
            },
            cssFilters: getCSSFilters(),
            width,
            height,
            dpr,
          },
          [channel.port2],
        );
      });
    };
  });
} else {
  const ctxMain = canvasMain.getContext('2d', { desynchronized: true });
  ctxMain.scale(dpr, dpr);
  ctxMain.imageSmoothingEnabled = true;
  preProcessMainCanvas = () => {
    let { width, height } = getScaledDimensions();
    const factor = considerDPRCheckbox.checked ? dpr : 1;
    // Don't exceed the maximum canvas size.
    let shrinkFactor = 1;
    while (!canvasSize.test({ width, height })) {
      width = Math.floor(width / 2);
      height = Math.floor(height / 2);
      shrinkFactor /= 2;
    }
    canvasMain.width = width;
    canvasMain.height = height;
    ctxMain.clearRect(0, 0, width, height);
    ctxMain.filter = getFilterString();
    ctxMain.drawImage(
      inputImage,
      0,
      0,
      factor * inputImage.naturalWidth * shrinkFactor,
      factor * inputImage.naturalHeight * shrinkFactor,
      0,
      0,
      width,
      height,
    );
    return ctxMain.getImageData(0, 0, width, height);
  };
}

const getScaledDimensions = () => {
  const scaleFactor = Number(filterInputs[SCALE.scale].value) / 100;
  return {
    width: Math.ceil(dpr * inputImage.naturalWidth * scaleFactor),
    height: Math.ceil(dpr * inputImage.naturalHeight * scaleFactor),
  };
};

const getRange = (input) => {
  const value = Number(input.value);
  const array = [];
  for (let i = 0; i <= value; i++) {
    array[i] = Number(((1 / value) * i).toFixed(1));
  }
  return array;
};

const getPosterizeFilter = () => {
  return `data:image/svg+xml;utf8,<svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <filter id="posterize">
        <feComponentTransfer>
          <feFuncR type="discrete" tableValues="${getRange(
            filterInputs[COLORS.red],
          ).join(',')}" />
          <feFuncG type="discrete" tableValues="${getRange(
            filterInputs[COLORS.green],
          ).join(',')}" />
          <feFuncB type="discrete" tableValues="${getRange(
            filterInputs[COLORS.blue],
          ).join(',')}" />
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

const getCSSFilters = () => {
  let filterString = '';
  for (const [filter, props] of Object.entries(filters)) {
    const input = filterInputs[filter];
    if (props.initial === Number(input.value)) {
      continue;
    }
    filterString += `${filter}(${input.value}${input.dataset.unit}) `;
  }
  return filterString;
};

const getFilterString = () => {
  let filterString = `${
    posterizeCheckbox.checked ? `url('${getPosterizeFilter()}#posterize') ` : ''
  }`;
  filterString += getCSSFilters();
  return filterString.trim() || 'none';
};

export { preProcessMainCanvas, preProcessInputImage, supportsOffscreenCanvas };
