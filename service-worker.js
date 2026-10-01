const CACHE_NAME = 'berryblitz-cache-v3';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',

  './public/assets/index-Cdy_on9X.js',
  './public/assets/index-CkRX1Kq5.css',

  './public/fonts/inter.json',

  './public/geometries/heart.gltf',

  './public/sounds/background.mp3',
  './public/sounds/hit.mp3',
  './public/sounds/success.mp3',

  './public/textures/asphalt.png',
  './public/textures/grass.png',
  './public/textures/sand.jpg',
  './public/textures/sky.png',
  './public/textures/wood.jpg'
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
      Promise.all(
        keys.map((key) =>
          key !== CACHE_NAME ? caches.delete(key) : null
        )
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
