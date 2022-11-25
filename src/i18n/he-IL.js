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
  red: 'אדום',
  green: 'ירוק',
  blue: 'כחול',
  alpha: 'אלפא',

  brightness: 'בהירות',
  contrast: 'ניגודיות',
  grayscale: 'גווני אפור',
  'hue-rotate': 'רוטציית גוון',
  invert: 'היפוך',
  opacity: 'אטימות',
  saturate: 'רוויה',
  sepia: 'ספיה',

  scale: 'קנה מידה',
  rotation: 'סיבוב',
  turdsize: 'דיכוי כתמים',
  alphamax: 'סף פינתי',
  minPathSegments: 'אורך מסלול מינימלי',
  strokeWidth: 'עובי קו',
  turnpolicy: 'אסטרטגיית שינוי כיוון',
  opticurve: 'אופטימיזציית עקומות',
  opttolerance: 'רגישות אופטימיזצייה',
  showAdvancedControls: 'הצג אפשרויות מתקדמות',

  '%': '%',
  deg: '°',
  steps: 'שלבים',
  pixels: 'פיקסלים',
  segments: 'מקטעים',

  reset: 'איתחול',
  resetAll: 'אתחל הכל',

  dropFileHere: 'שחרר קובץ כאן',
  openImage: 'פתח תמונה',
  saveSVG: 'SVG שמור',
  pasteImage: 'הדבק תמונה',
  copySVG: 'SVG העתק',
  shareSVG: 'SVG שתפורסם',
  install: 'התקן',

  posterizeInputImage: 'פוסטריזציה של תמונה',
  colorSVG: 'צבעוני SVG',
  monochromeSVG: 'שחור לבן SVG',

  colorChannels: 'ערוצי צבע',
  imageSizeAndRotation: 'מידות וסיבוב',
  imagePreprocessing: 'עיבוד מקדים',
  svgOptions: 'SVG אפשרויות',

  considerDPR: 'התחשב ביחס הפיקסלים של ההתקן',

  tweak: 'כיוונון',
  closeOptions: 'סגור',

  optimizingSVG: 'בתהליך אופטימיזציה SVG',
  copiedSVG: 'העותק SVG',
  savedSVG: 'נשמר SVG',

  readyToWorkOffline: '.מוכן לעבוד במצב לא מקוון',
  svgSize: 'SVG גודל',
  zoom: 'זום',

  license: 'רישיון',
  about: 'אודות',

  ...languages,
};

// ignore unused exports default
export default translations;
