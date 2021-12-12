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
import { optimizeCurvesCheckbox } from './domrefs.js';
import MonochromeSVGWorker from './monochromeworker.js?worker';

let monochromeSVGWorker = null;

const convertToMonochromeSVG = async (imageData) => {
  if (monochromeSVGWorker) {
    monochromeSVGWorker.terminate();
  }
  monochromeSVGWorker = new MonochromeSVGWorker();

  return new Promise(async (resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
      channel.port1.close();
      if (monochromeSVGWorker) {
        monochromeSVGWorker.terminate();
        monochromeSVGWorker = null;
      }
      resolve(data.result);
    };

    const params = {
      turdsize: Number(filterInputs[POTRACE.turdsize].value),
      alphamax: Number(filterInputs[POTRACE.alphamax].value),
      turnpolicy: Number(filterInputs[POTRACE.turnpolicy].value),
      opttolerance: Number(filterInputs[POTRACE.opttolerance].value),
      opticurve: optimizeCurvesCheckbox.checked ? 1 : 0,
    };
    monochromeSVGWorker.postMessage({ imageData, params }, [channel.port2]);
  });
};

export { convertToMonochromeSVG };
