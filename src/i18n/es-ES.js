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
  red: 'Rojo',
  green: 'Verde',
  blue: 'Azul',
  alpha: 'Alfa',

  brightness: 'Brillo',
  contrast: 'Contraste',
  grayscale: 'Escala de gris',
  'hue-rotate': 'Rotación de tono',
  invert: 'Invertir',
  opacity: 'Opacidad',
  saturate: 'Saturación',
  sepia: 'Sepia',

  scale: 'Escala',
  rotation: 'Rotación',
  turdsize: 'Suprimir manchas',
  alphamax: 'Umbral de la esquina',
  minPathSegments: 'Mín. segmentos de camino',
  strokeWidth: 'Ancho de línea',
  turnpolicy: 'Política de giro',
  opticurve: 'Optimizar curvas',
  opttolerance: 'Tolerancia de optimización',
  showAdvancedControls: 'Mostrar opciones avanzadas',

  '%': '%',
  deg: '°',
  steps: 'Pasos',
  pixels: 'Píxeles',
  segments: 'Segmentos',

  reset: 'Restablecer',
  resetAll: 'Restablecer todo',

  dropFileHere: 'Arrastra un archivo aquí',
  openImage: 'Abrir imagen',
  saveSVG: 'Guardar SVG',
  pasteImage: 'Pegar imagen',
  copySVG: 'Copiar SVG',
  install: 'Instalar',

  posterizeInputImage: 'Posterizar imagen de entrada',
  colorSVG: 'SVG de colores',
  monochromeSVG: 'SVG monocromático',

  colorChannels: 'Canales de color',
  imageSizeAndRotation: 'Tamaño y rotación de la imagen',
  imagePreprocessing: 'Preprocesamiento de la imagen',
  svgOptions: 'Opciones SVG',

  considerDPR: 'Usar proporción de píxeles del dispositivo',

  tweak: 'Ajustar',
  closeOptions: 'Cerrar',

  optimizingSVG: 'Optimizando SVG',
  copiedSVG: 'SVG copiado',
  savedSVG: 'SVG guardado',

  readyToWorkOffline: 'Listo para trabajar sin conexión',
  svgSize: 'Tamaño SVG',
  bytes: 'Bytes',
  zoom: 'Zoom',

  license: 'Licencia',
  about: 'Acerca de',

  ...languages,
};

// ignore unused exports default
export default translations;
