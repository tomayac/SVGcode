import { VitePWA as vitePWA } from 'vite-plugin-pwa';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import webmanifest from './src/manifest.json';

// ignore unused exports default
export default {
  plugins: [
    dynamicImportVars({
      include: ['./src/i18n/*', './src/js/filehandling.js'],
    }),
    vitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: webmanifest,
    }),
  ],
  build: {
    outDir: 'docs',
    target: 'esnext',
  },
};
