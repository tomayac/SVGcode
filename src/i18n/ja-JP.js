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
  red: '赤',
  green: '緑',
  blue: '青',
  alpha: 'アルファ',

  brightness: '明度',
  contrast: 'コントラスト',
  grayscale: 'グレースケール',
  'hue-rotate': '色相',
  invert: '階調の反転',
  opacity: '透明度',
  saturate: '彩度',
  sepia: 'セピア',

  scale: '拡大/縮小',
  rotation: '回転',
  turdsize: 'ノイズ除去',
  alphamax: 'コーナーしきい値',
  minPathSegments: 'パスの最小の長さ',
  strokeWidth: 'ストローク幅',
  turnpolicy: 'ターンポリシー',
  opticurve: '曲線を最適化',
  opttolerance: '許容差を最適化',
  showAdvancedControls: '上級者向け機能を表示する',

  '%': '%',
  deg: '°',
  steps: 'ステップ',
  pixels: 'ピクセル',
  segments: 'セグメント',

  reset: 'リセット',
  resetAll: 'すべてリセット',

  dropFileHere: 'ここにファイルをドロップ',
  openImage: '画像を開く',
  saveSVG: 'SVG として保存',
  pasteImage: '画像を貼り付ける',
  copySVG: 'SVG をコピーする',
  shareSVG: 'SVG を共有する',
  install: 'インストール',

  posterizeInputImage: 'ポスタライズする',
  colorSVG: 'カラー SVG',
  monochromeSVG: 'モノクロ SVG',

  colorChannels: 'カラーチャンネル',
  imageSizeAndRotation: '大きさと回転',
  imagePreprocessing: '前処理',
  svgOptions: 'SVG 設定',

  considerDPR: 'デバイスのピクセル比を考慮する',

  tweak: '微調整',
  closeOptions: '閉じる',

  optimizingSVG: 'SVG を最適化する',
  copiedSVG: 'コピーした SVG',
  savedSVG: '保存した SVG',

  readyToWorkOffline: 'オフライン作業可能',
  svgSize: 'SVG のサイズ',
  zoom: 'ズーム',

  license: 'ライセンス',
  about: 'について',

  ...languages,
};

// ignore unused exports default
export default translations;
