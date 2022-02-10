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
  red: 'Червоний', // Red
  green: 'Зелений', // Green
  blue: 'Синій', // Blue
  alpha: 'Прозорість', // Alpha

  brightness: 'Яскравість', // Brightness
  contrast: 'Контраст', // Contrast
  grayscale: 'Монохром', // Grayscale
  'hue-rotate': 'Тон', // Hue Rotate
  invert: 'Інверсія', // Invert
  opacity: 'Прозорість', // Opacity
  saturate: 'Насиченість', // Saturate
  sepia: 'Сепія', // Sepia

  scale: 'Масштаб', // Scale
  rotation: 'Поворот', // Rotation
  turdsize: 'Придушити плями', // Suppress Speckles
  alphamax: 'Згладжування', // Corner Threshold
  minPathSegments: 'Мін. довжина лінії', // Min. Path Length
  strokeWidth: 'Товщина контуру', // Stroke Width
  turnpolicy: 'Правила повороту', // Turn Policy
  opticurve: 'Оптимізувати криві', // Optimise Curves
  opttolerance: 'Рівень оптимізації', // Optimisation Tolerance
  showAdvancedControls: 'Додаткові налаштування', // Show Expert Options

  '%': '%',
  deg: '°',
  steps: 'кроків', // Steps
  pixels: 'пікселів', // Pixels
  segments: 'сегментів', // Segments

  reset: 'Скинути', // Reset
  resetAll: 'Скинути все', // Reset All

  dropFileHere: 'Киньте файл сюди', // Drop File Here
  openImage: 'Відкрити зображення', // Open Image
  saveSVG: 'Зберегти SVG', // Save SVG
  pasteImage: 'Зберегти зображення', // Paste Image
  copySVG: 'Скопіювати SVG', // Copy SVG
  install: 'Встановити', // Install

  posterizeInputImage: 'Постеризувати вхідне зображення', // Posterise Input Image
  colorSVG: 'Кольоровий SVG', // Colour SVG
  monochromeSVG: 'Монохромний SVG', // Monochrome SVG

  colorChannels: 'Кольорові канали', // Colour Channels
  imageSizeAndRotation: 'Вхідні розміри і обертання', // Input Size and Rotation
  imagePreprocessing: 'Вхідна обробка', // Input Preprocessing
  svgOptions: 'Налаштування SVG', // SVG Options

  considerDPR: 'Враховувати щільність пікселів', // Consider Device Pixel Ratio

  tweak: 'Підкрутити', // Tweak
  closeOptions: 'Закрити', // Close

  optimizingSVG: 'Оптимізую SVG', // Optimising SVG
  copiedSVG: 'Скопійований SVG', // Copied SVG
  savedSVG: 'Збережений SVG', // Saved SVG

  readyToWorkOffline: 'Готовий для роботи офлайн.', // Ready to Work Offline.
  svgSize: 'Розмір SVG', // SVG Size
  bytes: 'байт', // Bytes
  zoom: 'Масштаб', // Zoom

  license: 'Ліцензія', // License
  about: 'Про проект', // About

  ...languages,
};

// ignore unused exports default
export default translations;
