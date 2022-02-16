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
  red: 'Vermelho',
  green: 'Verde',
  blue: 'Azul',
  alpha: 'Alfa',

  brightness: 'Brilho',
  contrast: 'Contraste',
  grayscale: 'Tons de cinza',
  'hue-rotate': 'Rotação de tonalidade',
  invert: 'Inverter',
  opacity: 'Opacidade',
  saturate: 'Saturação',
  sepia: 'Sépia',

  scale: 'Escala',
  rotation: 'Rotação',
  turdsize: 'Suprimir manchas',
  alphamax: 'Limiar de canto',
  minPathSegments: 'Mín. de segmentos de caminho',
  strokeWidth: 'Largura do traço',
  turnpolicy: 'Política de turno',
  opticurve: 'Otimizar curvas',
  opttolerance: 'Tolerância de otimização',
  showAdvancedControls: 'Mostrar controles avançados',

  '%': '%',
  deg: '°',
  steps: 'Passos',
  pixels: 'Pixels',
  segments: 'Segmentos',

  reset: 'Resetar',
  resetAll: 'Resetar tudo',

  dropFileHere: 'Arraste um arquivo aqui',
  openImage: 'Abrir imagem',
  saveSVG: 'Salvar SVG',
  pasteImage: 'Colar imagem',
  copySVG: 'Copiar SVG',
  install: 'Instalar',

  posterizeInputImage: 'Posterizar imagem de entrada',
  colorSVG: 'SVG colorido',
  monochromeSVG: 'SVG monocromático',

  colorChannels: 'Canais de cor',
  imageSizeAndRotation: 'Tamanho e rotação da imagem',
  imagePreprocessing: 'Preprocessamento da imagem',
  svgOptions: 'Opções SVG',

  considerDPR: 'Usar a proporção de pixels do dispositivo',

  tweak: 'Ajustar',
  closeOptions: 'Fechar',

  optimizingSVG: 'Otimizando SVG',
  copiedSVG: 'SVG copiado',
  savedSVG: 'SVG salvado',

  readyToWorkOffline: 'Pronto para trabalhar offline',
  svgSize: 'Tamanho do SVG',
  bytes: 'Bytes',
  zoom: 'Zoom',

  license: 'Licença',
  about: 'Sobre',

  ...languages,
};

// ignore unused exports default
export default translations;
