import { VitePWA as vitePWA } from 'vite-plugin-pwa';

export default {
  plugins: [
    vitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
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
            sizes: '150x150',
          },
          {
            src: './favicon.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
      },
    }),
  ],
  build: {
    target: 'esnext',
  },
};
