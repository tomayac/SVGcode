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
  red: 'Червоний',
  green: 'Зелений',
  blue: 'Синій',
  alpha: 'Прозорість',

  brightness: 'Яскравість',
  contrast: 'Контраст',
  grayscale: 'Монохром',
  'hue-rotate': 'Тон',
  invert: 'Інверсія',
  opacity: 'Прозорість',
  saturate: 'Насиченість',
  sepia: 'Сепія',

  scale: 'Масштаб',
  rotation: 'Поворот',
  turdsize: 'Придушити плями',
  alphamax: 'Згладжування',
  minPathSegments: 'Мін. довжина лінії',
  strokeWidth: 'Товщина контуру',
  turnpolicy: 'Правила повороту',
  opticurve: 'Оптимізувати криві',
  opttolerance: 'Рівень оптимізації',
  showAdvancedControls: 'Додаткові налаштування',

  '%': '%',
  deg: '°',
  steps: 'кроків',
  pixels: 'пікселів',
  segments: 'сегментів',

  reset: 'Скинути',
  resetAll: 'Скинути все',

  dropFileHere: 'Киньте файл сюди',
  openImage: 'Відкрити зображення',
  saveSVG: 'Зберегти SVG',
  pasteImage: 'Зберегти зображення',
  copySVG: 'Скопіювати SVG',
  install: 'Встановити',

  posterizeInputImage: 'Постеризувати вхідне зображення',
  colorSVG: 'Кольоровий SVG',
  monochromeSVG: 'Монохромний SVG',

  colorChannels: 'Кольорові канали',
  imageSizeAndRotation: 'Вхідні розміри і обертання',
  imagePreprocessing: 'Вхідна обробка',
  svgOptions: 'Налаштування SVG',

  considerDPR: 'Враховувати щільність пікселів',

  tweak: 'Підкрутити',
  closeOptions: 'Закрити',

  optimizingSVG: 'Оптимізую SVG',
  copiedSVG: 'Скопійований SVG',
  savedSVG: 'Збережений SVG',

  readyToWorkOffline: 'Готовий для роботи офлайн.',
  svgSize: 'Розмір SVG',
  bytes: 'байт',
  zoom: 'Масштаб',

  license: 'Ліцензія',
  about: 'Про проект',

  ...languages,
};

// ignore unused exports default
export default translations;
