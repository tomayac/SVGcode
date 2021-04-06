import { optimize, extendDefaultPlugins } from 'svgo/dist/svgo.browser.js';

self.addEventListener('message', async (e) => {
  const { svg } = e.data;
  const optimized = optimize(svg, {
    multipass: true,
    plugins: extendDefaultPlugins([
      {
        name: 'removeViewBox',
        active: false,
      },
    ]),
  });
  e.ports[0].postMessage({ result: optimized.data });
});
