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

import { debounce } from './util.js';
import { main, menu } from './domrefs.js';

const WINDOW_CONTROLS_OVERLAY = 'window-controls-overlay';

const onGeometryChange = () => {
  menu.classList.toggle(
    WINDOW_CONTROLS_OVERLAY,
    navigator.windowControlsOverlay.visible,
  );
  main.classList.toggle(
    WINDOW_CONTROLS_OVERLAY,
    navigator.windowControlsOverlay.visible,
  );
};

navigator.windowControlsOverlay.addEventListener(
  'geometrychange',
  debounce(async () => {
    onGeometryChange();
  }, 250),
);

onGeometryChange();
