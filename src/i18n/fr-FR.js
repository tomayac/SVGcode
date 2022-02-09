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
  red: 'Rouge',
  green: 'Vert',
  blue: 'Bleu',
  alpha: 'Alpha',

  brightness: 'Luminosité',
  contrast: 'Contraste',
  grayscale: 'Niveaux de gris',
  'hue-rotate': 'Rotation de teinte',
  invert: 'Inversion',
  opacity: 'Opacité',
  saturate: 'Saturation',
  sepia: 'Sépia',

  scale: 'Échelle',
  rotation: 'Rotation',
  turdsize: 'Supprimer les tâches',
  alphamax: 'Seuil d’angle',
  minPathSegments: 'Longueur de chemin min.',
  strokeWidth: 'Épaisseur de trait',
  turnpolicy: 'Stratégie de changement de direction',
  opticurve: 'Optimiser les courbes',
  opttolerance: 'Tolérance d’optimisation',
  showAdvancedControls: 'Options avancées',

  '%': '%',
  deg: '°',
  steps: 'Étapes',
  pixels: 'Pixels',
  segments: 'Segments',

  reset: 'Réinitialiser',
  resetAll: 'Tout réinitialiser',

  dropFileHere: 'Déposez le fichier ici',
  openImage: 'Ouvrir une image',
  saveSVG: 'Enregistrer le SVG',
  pasteImage: 'Coller une image',
  copySVG: 'Copier le SVG',
  install: 'Installer',

  posterizeInputImage: 'Postériser l’image source',
  colorSVG: 'SVG en couleurs',
  monochromeSVG: 'SVG monochrome',

  colorChannels: 'Canaux de couleurs',
  imageSizeAndRotation: 'Dimensions et rotation de la source',
  imagePreprocessing: 'Précalcul de la source',
  svgOptions: 'Options SVG',

  considerDPR: 'Prendre en compte la densité de pixels de l’appareil',

  tweak: 'Ajuster',
  closeOptions: 'Fermer',

  optimizingSVG: 'Optimisation du SVG',
  copiedSVG: 'SVG copié',
  savedSVG: 'SVG enregistré',

  readyToWorkOffline: 'Prêt à fonctionner hors connexion.',
  svgSize: 'Poids du SVG',
  bytes: 'Octets',
  zoom: 'Zoom',

  license: 'Licence',
  about: 'À propos',

  ...languages,
};

// ignore unused exports default
export default translations;
