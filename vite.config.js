import { VitePWA as vitePWA } from 'vite-plugin-pwa';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

// ignore unused exports default
export default {
  plugins: [
    dynamicImportVars({
      include: ['./src/i18n/*', './src/js/filehandling.js'],
    }),
    vitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'SVGcode',
        short_name: 'SVGcode',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#131313',
        background_color: '#131313',
        icons: [
          {
            src: './favicon.svg',
            type: 'image/svg+xml',
            sizes: '340x340',
          },
          {
            src: './favicon.png',
            type: 'image/png',
            sizes: '768x768',
          },
        ],
        file_handlers: [
          {
            action: './',
            accept: {
              'image/*': [
                '.jpg',
                '.jpeg',
                '.webp',
                '.png',
                '.avif',
                '.gif',
                '.svg',
                '.bmp',
              ],
            },
          },
        ],
      },
    }),
  ],
  build: {
    outDir: 'docs',
    target: 'esnext',
  },
};
