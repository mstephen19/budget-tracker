const DATA_CACHE = 'data-cache-1';

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/index.js',
  '/indexedDb.js',
  '/styles.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
];

self.addEventListener('install', async (e) => {
  const cache = await e.waitUntil(caches.open(DATA_CACHE));
  cache.addAll(FILES_TO_CACHE);
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== DATA_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});
