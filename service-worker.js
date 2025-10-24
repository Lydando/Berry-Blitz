const CACHE_NAME = 'berryblitz-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './public/assets/',
  './public/fonts/',
  './public/geometries/',
  './public/sounds/',
  './public/textures/'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
