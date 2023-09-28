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

const DISCRETE = 'discrete';

let offscreen;
let ctxOffscreen;

const preProcessMainCanvas = (
  inputImageBitmap,
  filter,
  cssFilters,
  rotate,
  width,
  height,
) => {
  console.log(filter);
  console.log(cssFilters);
  ctxOffscreen.clearRect(0, 0, width, height);
  ctxOffscreen.setTransform(1, 0, 0, 1, width / 2, height / 2);
  ctxOffscreen.rotate((rotate * Math.PI) / 180);
  ctxOffscreen.filter = cssFilters;
  ctxOffscreen.drawImage(
    inputImageBitmap,
    -inputImageBitmap.width / 2,
    -inputImageBitmap.height / 2,
  );
  ctxOffscreen.setTransform(1, 0, 0, 1, 0, 0);
  ctxOffscreen.filter = filter;
  ctxOffscreen.drawImage(
    offscreen,
    0,
    0,
    offscreen.width,
    offscreen.height,
    0,
    0,
    width,
    height,
  );
  return ctxOffscreen.getImageData(0, 0, width, height);
};

self.addEventListener('message', (e) => {
  if (e.data.offscreen) {
    offscreen = e.data.offscreen;
    ctxOffscreen = offscreen.getContext('2d');
    return;
  }
  const {
    inputImageBitmap,
    posterize,
    rgba,
    cssFilters,
    rotate,
    width,
    height,
    dpr,
  } = e.data;
  ctxOffscreen.scale(dpr, dpr);
  offscreen.width = width;
  offscreen.height = height;
  const imageData = preProcessMainCanvas(
    inputImageBitmap,
    getFilter(posterize, rgba, cssFilters),
    cssFilters,
    rotate,
    width,
    height,
    dpr,
  );
  e.ports[0].postMessage({ result: imageData });
});

const getFilter = (posterize, rgba) => {
  const filters = [];
  if (posterize) {
    filters.push({
      name: 'componentTransfer',
      filter: 'componentTransfer',
      funcR: {
        type: DISCRETE,
        tableValues: rgba.r,
      },
      funcG: {
        type: DISCRETE,
        tableValues: rgba.g,
      },
      funcB: {
        type: DISCRETE,
        tableValues: rgba.b,
      },
      funcA: {
        type: DISCRETE,
        tableValues: rgba.a,
      },
    });
  }
  return new CanvasFilter(filters);
};
