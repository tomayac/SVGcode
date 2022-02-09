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
  red: '빨강',
  green: '초록',
  blue: '파랑',
  alpha: '알파(투명도)',

  brightness: '밝기',
  contrast: '대비',
  grayscale: '그레이 스케일',
  'hue-rotate': '색조 회전',
  invert: '반전',
  opacity: '투명도',
  saturate: '채도',
  sepia: '세피아',

  scale: '확대/축소',
  rotation: '회전',
  turdsize: '얼룩 줄이기',
  alphamax: '알파 맥스',
  minPathSegments: '최소 패스 구간수',
  strokeWidth: '선 두께',
  turnpolicy: 'Turn Policy',
  opticurve: '곡선 최적화하기',
  opttolerance: '최적화 허용치',
  showAdvancedControls: '고급 설정 보기',

  '%': '%',
  deg: '°',
  steps: '단계',
  pixels: '픽셀',
  segments: '구간',

  reset: '초기화',
  resetAll: '모두 초기화',

  dropFileHere: '파일을 여기 놓아주세요',
  openImage: '이미지 열기',
  saveSVG: 'SVG 저장하기',
  pasteImage: '이미지 붙여넣기',
  copySVG: 'SVG 복사하기',
  install: '설치하기',

  posterizeInputImage: '입력한 이미지 포스터효과',
  colorSVG: 'SVG 색상 주기',
  monochromeSVG: 'SVG 단색 만들기',

  colorChannels: '색상 채널',
  imageSizeAndRotation: '크기 입력/회전',
  imagePreprocessing: '사전 처리 입력',
  svgOptions: 'SVG 설정',

  considerDPR: '기기 픽셀 비율 고려',

  tweak: '조정',
  closeOptions: '닫기',

  optimizingSVG: 'SVG 최적화중',
  copiedSVG: 'SVG 복사완료',
  savedSVG: 'SVG 저장완료',

  readyToWorkOffline: '오프라인 작업 준비됨.',
  svgSize: 'SVG 크기',
  bytes: '바이트(bytes)',
  zoom: '확대',

  license: '사용권(라이센스)',
  about: 'About',

  ...languages,
};

// ignore unused exports default
export default translations;
