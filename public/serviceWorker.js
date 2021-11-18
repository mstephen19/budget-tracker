const DATA_CACHE = 'data-cache-1';

const FILES_TO_CACHE = [
  '/',
  './index.html',
  './index.js',
  './indexedDb.js',
  './styles.css',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(DATA_CACHE).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
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
