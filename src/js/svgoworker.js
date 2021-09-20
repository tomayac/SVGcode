import { optimize } from 'svgo/dist/svgo.browser.js';

self.addEventListener('message', async (e) => {
  let { svg, originalViewBox } = e.data;
  svg = svg.replace(/viewBox="[^"]+"/, `viewBox="${originalViewBox}"`);
  const optimized = optimize(svg, {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
    ],
  });
  e.ports[0].postMessage({ result: optimized.data });
});
