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
  red: 'Чырвоны',
  green: 'Зялёны',
  blue: 'Блакітны',
  alpha: 'Празрыстасць',

  brightness: 'Яркасць',
  contrast: 'Кантраст',
  grayscale: 'Манахром',
  'hue-rotate': 'Паварот колеру',
  invert: 'Інверсія',
  opacity: 'Празрыстасць',
  saturate: 'Насычэнне',
  sepia: 'Сепія',

  scale: 'Маштаб',
  rotation: 'Паварот',
  turdsize: 'Паменшыць смецце',
  alphamax: 'Кутні парог',
  minPathSegments: 'Мінімальная даўжыня шляху',
  strokeWidth: 'Таўшчыня абводкі',
  turnpolicy: 'Правілы павароту',
  opticurve: 'Аптымізаваць крывыя',
  opttolerance: 'Узровень аптымізацыі',
  showAdvancedControls: 'Дадатковыя налады',

  '%': '%',
  deg: '°',
  steps: 'крокаў',
  pixels: 'пікселяў',
  segments: 'сегментаў',

  reset: 'Скінуць',
  resetAll: 'Скінуць усё',

  dropFileHere: 'Кіньце файл сюды',
  openImage: 'Адкрыць карцінку',
  saveSVG: 'Захаваць SVG',
  pasteImage: 'Уставіць карцінку',
  copySVG: 'Скапіяваць SVG',
  install: 'Усталяваць',

  posterizeInputImage: 'Пастэрызаваць ўваходную карцінку',
  colorSVG: 'Каляровы SVG',
  monochromeSVG: 'Манахромны SVG',

  colorChannels: 'Каляровыя каналы',
  imageSizeAndRotation: 'Ўваходныя памеры і паварот',
  imagePreprocessing: 'Уваходная апрацоўка',
  svgOptions: 'Налады SVG',

  considerDPR: 'Ўлічваць шчыльнасць пікселяў',

  tweak: 'Падкруціць',
  closeOptions: 'Закрыць',

  optimizingSVG: 'Аптымізую SVG',
  copiedSVG: 'Скапіяваны SVG',
  savedSVG: 'Захаваны SVG',

  readyToWorkOffline: 'Гатова для працы афлайн.',
  svgSize: 'Памер SVG',
  bytes: 'байтаў',
  zoom: 'Маштаб',

  license: 'Ліцэнзія',
  about: 'Аб праекце',

  ...languages,
};

// ignore unused exports default
export default translations;
