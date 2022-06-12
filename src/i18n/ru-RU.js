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
  red: 'Красный',
  green: 'Зелёный',
  blue: 'Синий',
  alpha: 'Прозрачность',

  brightness: 'Яркость',
  contrast: 'Контраст',
  grayscale: 'Монохром',
  'hue-rotate': 'Поворот цвета',
  invert: 'Инверсия',
  opacity: 'Прозрачность',
  saturate: 'Насыщенность',
  sepia: 'Сепия',

  scale: 'Масштаб',
  rotation: 'Поворот',
  turdsize: 'Уменьшить мусор',
  alphamax: 'Угловой порог',
  minPathSegments: 'Минимальная длина пути',
  strokeWidth: 'Толщина обводки',
  turnpolicy: 'Правила поворота',
  opticurve: 'Оптимизировать кривые',
  opttolerance: 'Уровень оптимизации',
  showAdvancedControls: 'Дополнительные настройки',

  '%': '%',
  deg: '°',
  steps: 'шагов',
  pixels: 'пикселей',
  segments: 'сегментов',

  reset: 'Сбросить',
  resetAll: 'Сбросить всё',

  dropFileHere: 'Бросьте файл сюда',
  openImage: 'Открыть картинку',
  saveSVG: 'Сохранить SVG',
  pasteImage: 'Вставить картинку',
  copySVG: 'Скопировать SVG',
  shareSVG: 'Поделиться SVG',
  install: 'Установить',

  posterizeInputImage: 'Постеризовать входную картинку',
  colorSVG: 'Цветной SVG',
  monochromeSVG: 'Монохромный SVG',

  colorChannels: 'Цветовые каналы',
  imageSizeAndRotation: 'Входные размеры и поворот',
  imagePreprocessing: 'Входная обработка',
  svgOptions: 'Настройки SVG',

  considerDPR: 'Учитывать плотность пикселей',

  tweak: 'Подкрутить',
  closeOptions: 'Закрыть',

  optimizingSVG: 'Оптимизирую SVG',
  copiedSVG: 'Скопированный SVG',
  savedSVG: 'Сохранённый SVG',

  readyToWorkOffline: 'Готово для работы офлайн.',
  svgSize: 'Размер SVG',
  bytes: 'байтов',
  zoom: 'Масштаб',

  license: 'Лицензия',
  about: 'О проекте',

  ...languages,
};

// ignore unused exports default
export default translations;
