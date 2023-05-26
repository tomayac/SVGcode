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

const MEDIA_CACHE = 'media-cache';
const ALL_CACHES = [MEDIA_CACHE];

self.addEventListener('install', (installEvent) => {
  installEvent.waitUntil(
    (async () => {
      await caches.open(MEDIA_CACHE);
      self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (activateEvent) => {
  activateEvent.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys.map(async (cacheKey) => {
          if (!ALL_CACHES.includes(cacheKey)) {
            await caches.delete(cacheKey);
          }
        }),
      );
      self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (fetchEvent) => {
  if (
    fetchEvent.request.url.endsWith('/share-target/') &&
    fetchEvent.request.method === 'POST'
  ) {
    return fetchEvent.respondWith(
      (async () => {
        const formData = await fetchEvent.request.formData();
        const image = formData.get('image');
        const keys = await caches.keys();
        const mediaCache = await caches.open(
          keys.filter((key) => key.startsWith('media'))[0],
        );
        await mediaCache.put('shared-image', new Response(image));
        return Response.redirect('./?share-target', 303);
      })(),
    );
  }
});
