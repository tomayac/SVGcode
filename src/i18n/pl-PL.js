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
  red: 'Czerwony',
  green: 'Zielony',
  blue: 'Niebieski',
  alpha: 'Alfa',

  brightness: 'Jasność',
  contrast: 'Kontrast',
  grayscale: 'Odcień szarości',
  'hue-rotate': 'Zmiana odcienia',
  invert: 'Odwrócenie',
  opacity: 'Przejrzystość',
  saturate: 'Nasycenie',
  sepia: 'Sepia',

  scale: 'Skala',
  rotation: 'Obrót',
  turdsize: 'Tłumienie plamek',
  alphamax: 'Próg narożnika',
  minPathSegments: 'Min. długość ścieżki',
  strokeWidth: 'Szerokość przeciągnięcia',
  turnpolicy: 'Strategia przekształcenia',
  opticurve: 'Optymalizacja krzywych',
  opttolerance: 'Tolerancja optymalizacji',
  showAdvancedControls: 'Zaawansowane opcje',

  '%': '%',
  deg: '°',
  steps: 'Kroki',
  pixels: 'Piksele',
  segments: 'Segmenty',

  reset: 'Resetuj',
  resetAll: 'Zresetuj wszystko',

  dropFileHere: 'Dodaj plik',
  openImage: 'Otwórz obraz',
  saveSVG: 'Zapisz SVG',
  pasteImage: 'Wklej obraz',
  copySVG: 'Kopiuj SVG',
  shareSVG: 'Udostępnij SVG',
  install: 'Zainstaluj',

  posterizeInputImage: 'Posteryzacja obrazu wejściowego',
  colorSVG: 'Kolor SVG',
  monochromeSVG: 'Monochromatyczny SVG',

  colorChannels: 'Kanały koloru',
  imageSizeAndRotation: 'Rozmiar obrazu wejściowego i obrót',
  imagePreprocessing: 'Wstępne przetwarzanie obrazu',
  svgOptions: 'Opcje SVG',

  considerDPR: 'Uwzględnij stosunek pikseli urządzenia',

  tweak: 'Dostosuj',
  closeOptions: 'Zamknij',

  optimizingSVG: 'Optymalizacja SVG',
  copiedSVG: 'Skopiowany SVG',
  savedSVG: 'Zapisany SVG',

  readyToWorkOffline: 'Gotowy do pracy Offline.',
  svgSize: 'Rozmiar SVG',
  zoom: 'Powiększenie',

  license: 'Linencja',
  about: 'O projekcie',

  ...languages,
};

// ignore unused exports default
export default translations;
