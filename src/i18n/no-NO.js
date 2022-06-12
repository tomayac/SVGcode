/**
 * SVGcode—Convert raster images to SVG vector graphics
 * Copyright (C) 2022 Google LLC
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
  green: 'Grønn',
  blue: 'Blå',
  alpha: 'Alfa',

  brightness: 'Lysstyrke',
  contrast: 'Kontrast',
  grayscale: 'Gråtoner',
  'hue-rotate': 'Nyanserotasjon',
  invert: 'Invertering',
  opacity: 'Gjennomsiktighet',
  saturate: 'Metning',
  sepia: 'Sepia',

  scale: 'Skalering',
  rotation: 'Rotasjon',
  turdsize: 'Undertrykk flekker',
  alphamax: 'Hjørneterskel',
  minPathSegments: 'Min. stilengde',
  strokeWidth: 'Strøkbredde',
  turnpolicy: 'Svingstrategi',
  opticurve: 'Optimaliser kurver',
  opttolerance: 'Optimaliseringstoleranse',
  showAdvancedControls: 'Vis avanserte alternativer',

  '%': '%',
  deg: '°',
  steps: 'trinn',
  pixels: 'piksler',
  segments: 'segmenter',

  reset: 'Nullstill',
  resetAll: 'Nullstill alt',

  dropFileHere: 'Slipp fil her',
  openImage: 'Åpne bilde',
  saveSVG: 'Lagre SVG',
  pasteImage: 'Lim inn bilde',
  copySVG: 'Kopier SVG',
  shareSVG: 'Del SVG',
  install: 'Installer',

  posterizeInputImage: 'Posteriser inndatabilde',
  colorSVG: 'Farget SVG',
  monochromeSVG: 'Monokrom SVG',

  colorChannels: 'Fargekanaler',
  imageSizeAndRotation: 'Inndata størrelse og rotasjon',
  imagePreprocessing: 'Inndataforbehandling',
  svgOptions: 'SVG-alternativer',

  considerDPR: 'Ta hensyn til enhetens pikselforhold',

  tweak: 'Justér',
  closeOptions: 'Lukk',

  optimizingSVG: 'Optimaliserer SVG',
  copiedSVG: 'Kopierte SVG',
  savedSVG: 'Lagret SVG',

  readyToWorkOffline: 'Klar for offline-bruk.',
  svgSize: 'SVG-størrelse',
  bytes: 'bytes',
  zoom: 'Zoom',

  license: 'Lisens',
  about: 'Om',

  ...languages,
};

// ignore unused exports default
export default translations;
