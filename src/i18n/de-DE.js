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
  red: 'Rot',
  green: 'Grün',
  blue: 'Blau',
  alpha: 'Alpha',

  brightness: 'Helligkeit',
  contrast: 'Kontrast',
  grayscale: 'Graustufen',
  'hue-rotate': 'Farbtonrotation',
  invert: 'Invertieren',
  opacity: 'Transparenz',
  saturate: 'Sättigung',
  sepia: 'Sepia',

  scale: 'Skalierung',
  rotation: 'Rotation',
  turdsize: 'Flecken unterdrücken',
  alphamax: 'Eckenschwellwert',
  minPathSegments: 'Min. Pfadlänge',
  strokeWidth: 'Strichbreite',
  turnpolicy: 'Wendestrategie',
  opticurve: 'Kurven optimieren',
  opttolerance: 'Optimierungstoleranz',
  showAdvancedControls: 'Expertenoptionen anzeigen',

  '%': '%',
  deg: '°',
  steps: 'Schritte',
  pixels: 'Pixel',
  segments: 'Segmente',

  reset: 'Zurücksetzen',
  resetAll: 'Alles zurücksetzen',

  dropFileHere: 'Datei hier ablegen',
  openImage: 'Bild öffnen',
  saveSVG: 'SVG speichern',
  pasteImage: 'Bild einfügen',
  copySVG: 'SVG kopieren',
  shareSVG: 'SVG teilen',
  install: 'Installieren',

  posterizeInputImage: 'Eingabebild posterisieren',
  colorSVG: 'Farbiges SVG',
  monochromeSVG: 'Monochromes SVG',

  colorChannels: 'Farbkanäle',
  imageSizeAndRotation: 'Bildgröße und -rotation',
  imagePreprocessing: 'Bildvorverarbeitung',
  svgOptions: 'SVG-Optionen',

  considerDPR: 'Pixelverhältnis des Geräts beachten',

  tweak: 'Anpassen',
  closeOptions: 'Schließen',

  optimizingSVG: 'Optimiere SVG',
  copiedSVG: 'SVG kopiert',
  savedSVG: 'SVG gespeichert',

  readyToWorkOffline: 'Bereit für Offline-Nutzung.',
  svgSize: 'SVG-Größe',
  zoom: 'Zoom',

  license: 'Lizenz',
  about: 'Über',

  ...languages,
};

// ignore unused exports default
export default translations;
