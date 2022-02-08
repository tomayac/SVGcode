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

const translations = {
  red: 'Κόκκινο',
  green: 'Πράσινο',
  blue: 'Μπλε',
  alpha: 'Άλφα',

  brightness: 'Φωτεινότητα',
  contrast: 'Αντίθεση',
  grayscale: 'Κλίμακα Γκρι',
  'hue-rotate': 'Περιστροφή Απόχρωσης',
  invert: 'Αντιστροφή',
  opacity: 'Αδιαφάνεια',
  saturate: 'Κορεσμός',
  sepia: 'Σέπια',

  scale: 'Κλίμακα',
  rotation: 'Περιστροφή',
  turdsize: 'Καταστολή Κηλίδων',
  alphamax: 'Κατώφλι Γωνίας',
  minPathSegments: 'Ελάχ. Μήκος διαδρομής',
  strokeWidth: 'Πλάτος Διαδρομής',
  turnpolicy: 'Πολιτική Περιστροφής',
  opticurve: 'Βελτιστοποίηση Καμπυλών',
  opttolerance: 'Ανοχή Βελτιστοποίησης',
  showAdvancedControls: 'Εμφάνιση Ειδικών Επιλογών',

  '%': '%',
  deg: '°',
  steps: 'Βήματα',
  pixels: 'Εικονοστοιχεία',
  segments: 'Τμήματα',

  reset: 'Επαναφορά',
  resetAll: 'Επαναφορά Όλων',

  dropFileHere: 'Αποθέστε το αρχείο εδώ',
  openImage: 'Άνοιγμα Εικόνας',
  saveSVG: 'Αποθήκευση SVG',
  pasteImage: 'Επικόλληση Εικόνας',
  copySVG: 'Αντιγραφή SVG',
  install: 'Εγκατάσταση',

  posterizeInputImage: 'Posterize Εικόνα Εισόδου',
  colorSVG: 'Έγχρωμο SVG',
  monochromeSVG: 'Μονόχρωμο SVG',

  colorChannels: 'Κανάλια Χρώματος',
  imageSizeAndRotation: 'Μέγεθος Εισόδου Και Περιστροφή',
  imagePreprocessing: 'Προεπεξεργασία Εισόδου',
  svgOptions: 'Επιλογές SVG',

  considerDPR: 'Λάβετε υπόψη την αναλογία pixel της συσκευής',

  tweak: 'Προσαρμογή',
  closeOptions: 'Κλείσιμο',

  optimizingSVG: 'Βελτιστοποίηση SVG',
  copiedSVG: 'SVG Αντιγράφηκε',
  savedSVG: 'SVG Αποθηκεύτηκε',

  readyToWorkOffline: 'Έτοιμο για εργασία χωρίς σύνδεση.',
  svgSize: 'Μέγεθος SVG',
  bytes: 'Bytes',
  zoom: 'Μεγέθυνση',

  license: 'Αδεια',
  about: 'Σχετικά με',

  daDK: 'Dansk (Danmark)',
  deDE: 'Deutsch (Deutschland)',
  elGR: 'Ελληνικά (Ελλάδα)',
  enGB: 'English (United Kingdom)',
  enUS: 'English (United States)',
  frFR: 'Français (France)',
  koKR: '한국어 (대한민국)',
  nlNL: 'Nederlands (Nederland)',
  zhCN: '中文（中国）',
};

// ignore unused exports default
export default translations;
