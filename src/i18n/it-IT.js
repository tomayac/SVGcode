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
  red: 'Rosso',
  green: 'Verde',
  blue: 'Blu',
  alpha: 'Alfa',

  brightness: 'Luminosità',
  contrast: 'Contrasto',
  grayscale: 'Scala di grigi',
  'hue-rotate': 'Variazione di tinta',
  invert: 'Inversione colori',
  opacity: 'Opacità',
  saturate: 'Saturazione',
  sepia: 'Effetto seppia',

  scale: 'Scala',
  rotation: 'Ruota',
  turdsize: 'Elimina difetti',
  alphamax: "Soglia d'angolo",
  minPathSegments: 'Lunghezza min. tratto',
  strokeWidth: 'Larghezza del tratto',
  turnpolicy: 'Disambiguazione tratti',
  opticurve: 'Ottimizza le curve',
  opttolerance: 'Tolleranza ottimizzazione',
  showAdvancedControls: 'Mostra opzioni avanzate',

  '%': '%',
  deg: '°',
  steps: 'Passi',
  pixels: 'Pixel',
  segments: 'Segmenti',

  reset: 'Ripristina',
  resetAll: 'Ripristina tutto',

  dropFileHere: 'Trascina un file qui',
  openImage: "Apri immagine",
  saveSVG: 'Salva SVG',
  pasteImage: 'Incolla immagine',
  copySVG: 'Copia SVG',
  install: 'Installa',

  posterizeInputImage: 'Posterizza immagine di input',
  colorSVG: 'SVG a colori',
  monochromeSVG: 'SVG monocromatico',

  colorChannels: 'Canali di colore',
  imageSizeAndRotation: "Dimensioni e rotazione dell'immagine",
  imagePreprocessing: 'Preelaborazione immagine',
  svgOptions: 'Opzioni SVG',

  considerDPR: 'Considera il rapporto pixel del dispositivo',

  tweak: 'Modifica',
  closeOptions: 'Chiudi',

  optimizingSVG: 'Ottimizzazione SVG',
  copiedSVG: 'SVG copiato',
  savedSVG: 'SVG salvato',

  readyToWorkOffline: 'Pronto per lavorare offline.',
  svgSize: 'Dimensioni SVG',
  bytes: 'Byte',
  zoom: 'Zoom',

  license: 'Licenza',
  about: 'Informazioni',

  ...languages,
};

// ignore unused exports default
export default translations;
