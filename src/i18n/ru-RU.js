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
  red: 'Красный', // Red
  green: 'Зелёный', // Green
  blue: 'Синий', // Blue
  alpha: 'Прозрачность', // Alpha

  brightness: 'Яркость', // Brightness
  contrast: 'Контраст', // Contrast
  grayscale: 'Монохром', // Grayscale
  'hue-rotate': 'Поворот цвета', // Hue Rotate
  invert: 'Инверсия', // Invert
  opacity: 'Прозрачность', // Opacity
  saturate: 'Насыщенность', // Saturate
  sepia: 'Сепия', // Sepia

  scale: 'Масштаб', // Scale
  rotation: 'Поворот', // Rotation
  turdsize: 'Уменьшить мусор', // Suppress Speckles
  alphamax: 'Угловой порог', // Corner Threshold
  minPathSegments: 'Минимальная длина пути', // Min. Path Length
  strokeWidth: 'Толщина обводки', // Stroke Width
  turnpolicy: 'Правила поворота', // Turn Policy
  opticurve: 'Оптимизировать кривые', // Optimise Curves
  opttolerance: 'Уровень оптимизации', // Optimisation Tolerance
  showAdvancedControls: 'Дополнительные настройки', // Show Expert Options

  '%': '%',
  deg: '°',
  steps: 'шагов', // Steps
  pixels: 'пикселей', // Pixels
  segments: 'сегментов', // Segments

  reset: 'Сбросить', // Reset
  resetAll: 'Сбросить всё', // Reset All

  dropFileHere: 'Бросьте файл сюда', // Drop File Here
  openImage: 'Открыть картинку', // Open Image
  saveSVG: 'Сохранить SVG', // Save SVG
  pasteImage: 'Вставить картинку', // Paste Image
  copySVG: 'Скопировать SVG', // Copy SVG
  install: 'Установить', // Install

  posterizeInputImage: 'Постеризовать входную картинку', // Posterise Input Image
  colorSVG: 'Цветной SVG', // Colour SVG
  monochromeSVG: 'Монохромный SVG', // Monochrome SVG

  colorChannels: 'Цветовые каналы', // Colour Channels
  imageSizeAndRotation: 'Входные размеры и поворот', // Input Size and Rotation
  imagePreprocessing: 'Входная обработка', // Input Preprocessing
  svgOptions: 'Настройки SVG', // SVG Options

  considerDPR: 'Учитывать плотность пикселей', // Consider Device Pixel Ratio

  tweak: 'Подкрутить', // Tweak
  closeOptions: 'Закрыть', // Close

  optimizingSVG: 'Оптимизирую SVG', // Optimising SVG
  copiedSVG: 'Скопированный SVG', // Copied SVG
  savedSVG: 'Сохранённый SVG', // Saved SVG

  readyToWorkOffline: 'Готово для работы офлайн.', // Ready to Work Offline.
  svgSize: 'Размер SVG', // SVG Size
  bytes: 'байтов', // Bytes
  zoom: 'Масштаб', // Zoom

  license: 'Лицензия', // License
  about: 'О проекте', // About

  ...languages,
};

// ignore unused exports default
export default translations;
