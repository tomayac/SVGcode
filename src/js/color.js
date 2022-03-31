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

import { filterInputs, POTRACE } from './ui.js';
import { progress, svgOutput, optimizeCurvesCheckbox } from './domrefs.js';
import ColorWorker from './colorworker?worker';

let colorWorker = null;
const intervalID = {};

const convertToColorSVG = async (imageData) => {
  if (colorWorker) {
    colorWorker.terminate();
  }
  colorWorker = new ColorWorker();

  return new Promise(async (resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
      channel.port1.close();
      if (colorWorker) {
        colorWorker.terminate();
        colorWorker = null;
      }
      resolve(data.result);
    };

    progress.value = 0;
    let prefix = '';
    let suffix = '';
    let paths = '';
    let lastLength = 0;

    if (intervalID.current) {
      clearInterval(intervalID.current);
      intervalID.current = null;
    }
    intervalID.current = setInterval(() => {
      const svg = `${prefix}${paths}${suffix}`;
      if (svg.length !== lastLength) {
        const transform = svgOutput.dataset.transform;
        if (transform) {
          svgOutput.setAttribute('transform', transform);
        }
        svgOutput.innerHTML = svg;
        lastLength = svg.length;
      }
    }, 500);

    const progressChannel = new MessageChannel();
    progressChannel.port1.onmessage = ({ data }) => {
      const percentage = Math.floor((data.processed / data.total) * 100);
      progress.value = percentage;
      if (data.svg) {
        if (!prefix) {
          prefix = data.svg
            .replace(/(.*?<svg[^>]+>)(.*?)(<\/svg>)/, '$1')
            .replace(/\s+width="\d+(?:\.\d+)?"/, '')
            .replace(/\s+height="\d+(?:\.\d+)"/, '');
          suffix = data.svg.replace(/(.*?<svg[^>]+>)(.*?)(<\/svg>)/, '$3');
        }
        const path = data.svg.replace(/(.*?<svg[^>]+>)(.*?)(<\/svg>)/, '$2');
        paths += path;
      }
      if (data.processed === data.total) {
        clearInterval(intervalID.current);
        intervalID.current = null;
        progressChannel.port1.close();
        progress.value = 0;
      }
    };

    const params = {
      minPathSegments: Number(filterInputs[POTRACE.minPathLength].value),
      strokeWidth: Number(filterInputs[POTRACE.strokeWidth].value),
      turdsize: Number(filterInputs[POTRACE.turdsize].value),
      alphamax: Number(filterInputs[POTRACE.alphamax].value),
      turnpolicy: Number(filterInputs[POTRACE.turnpolicy].value),
      opttolerance: Number(filterInputs[POTRACE.opttolerance].value),
      opticurve: optimizeCurvesCheckbox.checked ? 1 : 0,
      extractcolors: false,
      posterizelevel: 2, // [1, 255]
      posterizationalgorithm: 0,
    };
    colorWorker.postMessage({ imageData, params }, [
      channel.port2,
      progressChannel.port2,
    ]);
  });
};

export { convertToColorSVG, intervalID };
