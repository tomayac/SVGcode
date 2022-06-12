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
  red: 'أحمر',
  green: 'أخضر',
  blue: 'أزرق',
  alpha: 'ألفا',

  brightness: 'السطوع',
  contrast: 'التباين',
  grayscale: 'التدرج الرمادي',
  'hue-rotate': 'تدوير فارق الألوان',
  invert: 'عكس',
  opacity: 'العتامة',
  saturate: 'التشبع',
  sepia: 'بني داكن',

  scale: 'حجم',
  rotation: 'دوران',
  turdsize: 'ترطيب الاخاديد',
  alphamax: 'عتبة الزاوية',
  minPathSegments: 'الحد الأدنى لطول المسار',
  strokeWidth: 'سمك الخط',
  turnpolicy: 'سياسة الدوران',
  opticurve: 'تحسين المنحنيات',
  opttolerance: 'درجة التسامح الأمثل',
  showAdvancedControls: 'إظهار الخيارات متقدمة',

  '%': '%',
  deg: '°',
  steps: 'خطوات',
  pixels: 'بكسل',
  segments: 'شرائح',

  reset: 'إعادة ضبط',
  resetAll: 'إعادة ضبط الكل',

  dropFileHere: 'أضف الملف هنا',
  openImage: 'استيراد صورة',
  saveSVG: 'حفظ كـ SVG',
  pasteImage: 'لصق الصورة',
  copySVG: 'نسخ كـ SVG',
  shareSVG: 'مشاركة كـ SVG',
  install: 'تثبيت',

  posterizeInputImage: 'صورة الإدخال المتتالية',
  colorSVG: 'لون SVG',
  monochromeSVG: 'أحادية اللون SVG',

  colorChannels: 'قنوات اللون',
  imageSizeAndRotation: 'حجم الصورة والدوران',
  imagePreprocessing: 'المعالجة المسبقة',
  svgOptions: 'خيارات SVG',

  considerDPR: 'اخذ بعين الاعتبار نسبة وحدات البكسل للجهاز',

  tweak: 'تعديل',
  closeOptions: 'قفل الخيارات',

  optimizingSVG: 'تحسين SVG',
  copiedSVG: 'تم نسخ SVG',
  savedSVG: 'تم حفظ SVG',

  readyToWorkOffline: 'جاهز للعمل دون اتصال.',
  svgSize: 'حجم SVG',
  bytes: 'بايت',
  zoom: 'تكبير',

  license: 'رخصة الاستخدام',
  about: 'عن',

  ...languages,
};

// ignore unused exports default
export default translations;
