self.addEventListener('message', async (e) => {
  try {
    const workerCache = await caches.open('worker-cache');
    await workerCache.addAll(e.data.urls);
    console.log(e);
    e.ports[0].postMessage({
      result: `Cached ${e.data.urls.join(', ')}`,
    });
  } catch (err) {
    e.ports[0].postMessage({
      error: `${err.name}: ${err.message}`,
    });
  }
});

self.addEventListener('install', (e) => {
  e.waitUntil(
    (async () => {
      skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      clients.claim();
    })(),
  );
});
