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
  red: '红',
  green: '绿',
  blue: '蓝',
  alpha: 'Alpha',

  brightness: '亮度',
  contrast: '对比度',
  grayscale: '灰度',
  'hue-rotate': '色调反转',
  invert: '反转',
  opacity: '透明度',
  saturate: '饱和度',
  sepia: '褐度',

  scale: '缩放',
  rotation: '旋转',
  turdsize: '抑制噪点',
  alphamax: '边角阈值',
  minPathSegments: '最小路径长度',
  strokeWidth: '笔触大小',
  turnpolicy: '转化程度',
  opticurve: '优化曲线',
  opttolerance: '优化容差',
  showAdvancedControls: '显示高级设置',

  '%': '%',
  deg: '°',
  steps: '级',
  pixels: '像素',
  segments: '段',

  reset: '重置',
  resetAll: '重置全部',

  dropFileHere: '拖拽文件到此处',
  openImage: '打开图像',
  saveSVG: '保存 SVG',
  pasteImage: '粘贴图像',
  copySVG: '复制 SVG',
  shareSVG: '分享 SVG',
  install: '安装',

  posterizeInputImage: '对图像进行色彩处理',
  colorSVG: '彩色 SVG',
  monochromeSVG: '单色 SVG',

  colorChannels: '色彩通道',
  imageSizeAndRotation: '图像尺寸及旋转角度',
  imagePreprocessing: '图像处理',
  svgOptions: 'SVG 选项',

  considerDPR: '考虑设备像素比',

  tweak: '调整',
  closeOptions: '关闭',

  optimizingSVG: '压缩 SVG',
  copiedSVG: '复制 SVG',
  savedSVG: '保存 SVG',

  readyToWorkOffline: '离线工作已就绪。',
  svgSize: 'SVG 大小',
  bytes: '字节',
  zoom: '缩放',

  license: '许可',
  about: '关于',

  ...languages,
};

// ignore unused exports default
export default translations;
