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

(async (r, l, s, d, h, e, u, n, i, c) => {
  const o = {
    z: `${r()}`.substr(2),
    cid: `${l.getItem(i) || ((c = `${r()}`.substr(2)), l.setItem(i, c), c)}`,
    ua: n.userAgent,
    dr: d.referrer || '',
    sr: `${s.width}x${s.height}`,
    vp: `${h.clientWidth}x${h.clientHeight}`,
    sd: `${s.pixelDepth}-bits`,
    ul: n.language,
    dl: e(u.href),
    dp: e(u.pathname),
    dt: d.title,
  };
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) {
    f.append(k, v);
  }
  try {
    await fetch('https://svgcode.glitch.me/', {
      method: 'post',
      body: f,
    });
  } catch {
    // Nothing
  }
})(
  Math.random,
  localStorage,
  screen,
  document,
  document.documentElement,
  encodeURIComponent,
  location,
  navigator,
  'cid',
  0,
);
