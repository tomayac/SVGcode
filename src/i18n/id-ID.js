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
   red: 'Merah',
   green: 'Hijau',
   blue: 'Biru',
   alpha: 'Alfa',
 
   brightness: 'Cahaya',
   contrast: 'Kontras',
   grayscale: 'Monokromatik',
   'hue-rotate': 'Perputaran Corak',
   invert: 'Inversi',
   opacity: 'Transparansi',
   saturate: 'Saturasi',
   sepia: 'Sepia',
 
   scale: 'Skala',
   rotation: 'Rotasi',
   turdsize: 'Hapus Bintik',
   alphamax: 'Batas Pojok',
   minPathSegments: 'Panjang Minimal Garis',
   strokeWidth: 'Lebar Goresan',
   turnpolicy: 'Balik Haluan',
   opticurve: 'Optimasi Lengkungan',
   opttolerance: 'Optimasi Toleransi',
   showAdvancedControls: 'Munculkan Opsi Tambahan',
 
   '%': '%',
   deg: '°',
   steps: 'Langkah',
   pixels: 'Piksel',
   segments: 'Segmen',
 
   reset: 'Atur Ulang',
   resetAll: 'Atur Ulang Semua',
 
   dropFileHere: 'Taruh File Di sini',
   openImage: 'Buka gambar',
   saveSVG: 'Simpan SVG',
   pasteImage: 'Tempel Gambar',
   copySVG: 'Salin SVG',
   install: 'Pasang',
 
   posterizeInputImage: 'Posterisasi Gambar',
   colorSVG: 'SVG Berwarna',
   monochromeSVG: 'SVG Hitam Putih',
 
   colorChannels: 'Kanal warna',
   imageSizeAndRotation: 'Ukuran dan Rotasi',
   imagePreprocessing: 'Pra Pemrosesan',
   svgOptions: 'Pengaturan SVG',
 
   considerDPR: 'Pertimbangkan Proporsi Piksel Perangkat',
 
   tweak: 'Modifikasi',
   closeOptions: 'Tutup',
 
   optimizingSVG: 'Optimasi SVG',
   copiedSVG: 'SVG Tersalin',
   savedSVG: 'SVG Tersimpan',
 
   readyToWorkOffline: 'Siap Bekerja Offline',
   svgSize: 'Ukuran SVG',
   bytes: 'Bytes',
   zoom: 'Perbesar',
 
   license: 'Lisensi',
   about: 'Tentang',
 
   ...languages,
 };
 
 // ignore unused exports default
 export default translations;
 