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

import languages from './languages.js';

const translations = {
  red: 'Rød',
  green: 'Grøn',
  blue: 'Blå',
  alpha: 'Alfa',

  brightness: 'Lysstyrke',
  contrast: 'Kontrast',
  grayscale: 'Gråtoner',
  'hue-rotate': 'Nuancerotation',
  invert: 'Invertering',
  opacity: 'Gennemsigtighed',
  saturate: 'Mætning',
  sepia: 'Sepia',

  scale: 'Skalering',
  rotation: 'Rotation',
  turdsize: 'Undertryk pletter',
  alphamax: 'Hjørnetærskel',
  minPathSegments: 'Min. stilængde',
  strokeWidth: 'Stregbredde',
  turnpolicy: 'Svingstrategi',
  opticurve: 'Optimer kurver',
  opttolerance: 'Optimeringstolerance',
  showAdvancedControls: 'Vis ekspertindstillinger',

  '%': '%',
  deg: '°',
  steps: 'trin',
  pixels: 'pixel',
  segments: 'segmenter',

  reset: 'Nulstil',
  resetAll: 'Nulstil alt',

  dropFileHere: 'Drop fil her',
  openImage: 'Åbn billede',
  saveSVG: 'Gem SVG',
  pasteImage: 'Indsæt billede',
  copySVG: 'Kopiér SVG',
  shareSVG: 'Del SVG',
  install: 'Installér',

  posterizeInputImage: 'Posterisér inputbillede',
  colorSVG: 'Farve-SVG',
  monochromeSVG: 'Monokrom-SVG',

  colorChannels: 'Farvekanaler',
  imageSizeAndRotation: 'Inputstørrelse og rotation',
  imagePreprocessing: 'Inputforbehandling',
  svgOptions: 'SVG-indstillinger',

  considerDPR: 'Betragt Device-Pixel Ratio',

  tweak: 'Justér',
  closeOptions: 'Luk',

  optimizingSVG: 'Optimerer SVG',
  copiedSVG: 'Kopierede SVG',
  savedSVG: 'Gemte SVG',

  readyToWorkOffline: 'Parat til offline-brug.',
  svgSize: 'SVG-størrelse',
  zoom: 'Zoom',

  license: 'Licens',
  about: 'Om',

  ...languages,
};

// ignore unused exports default
export default translations;
