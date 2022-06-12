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
  red: 'Vermell',
  green: 'Verd',
  blue: 'Blau',
  alpha: 'Alfa',

  brightness: 'Brillantor',
  contrast: 'Contrast',
  grayscale: 'Escala de gris',
  'hue-rotate': 'Gir de to',
  invert: 'Invertir',
  opacity: 'Opacitat',
  saturate: 'Saturació',
  sepia: 'Sépia',

  scale: 'Escala',
  rotation: 'Rotació',
  turdsize: 'Suprimir taques',
  alphamax: 'Llindar de la cantonada',
  minPathSegments: 'Mín. segments de camí',
  strokeWidth: 'Amplada de línia',
  turnpolicy: 'Política de gir',
  opticurve: 'Optimitzar corbes',
  opttolerance: "Tolerància d'optimització",
  showAdvancedControls: 'Mostrar opcions avançades',

  '%': '%',
  deg: '°',
  steps: 'Passos',
  pixels: 'Píxels',
  segments: 'Segments',

  reset: 'Restablir',
  resetAll: 'Restablir tot',

  dropFileHere: 'Arrossega un fitxer aquí',
  openImage: 'Obrir imatge',
  saveSVG: 'Guardar SVG',
  pasteImage: 'Enganxar imatge',
  copySVG: 'Copiar SVG',
  shareSVG: 'Compartir SVG',
  install: 'Instal·lar',

  posterizeInputImage: "Posteritzar imatge d'entrada",
  colorSVG: 'SVG de colors',
  monochromeSVG: 'SVG monocromàtic',

  colorChannels: 'Canals de color',
  imageSizeAndRotation: 'Mida i rotació de la imatge',
  imagePreprocessing: 'Preprocessament de la imatge',
  svgOptions: 'Opcions SVG',

  considerDPR: 'Usar proporció de píxels del dispositiu',

  tweak: 'Ajustar',
  closeOptions: 'Tancar',

  optimizingSVG: 'Optimitzant SVG',
  copiedSVG: 'SVG copiat',
  savedSVG: 'SVG guardat',

  readyToWorkOffline: 'Preparat per treballar fora de línia.',
  svgSize: 'Mida SVG',
  bytes: 'Bytes',
  zoom: 'Zoom',

  license: 'Llicència',
  about: 'Sobre',

  ...languages,
};

// ignore unused exports default
export default translations;
