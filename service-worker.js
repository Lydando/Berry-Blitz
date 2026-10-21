const CACHE_NAME = "berryblitz-cache-v22";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",

  "./public/assets/index-Cdy_on9X.js",
  "./public/assets/index-CkRX1Kq5.css",

  "./public/fonts/inter.json",
  "./public/geometries/heart.gltf",

  "./public/sounds/background.mp3",
  "./public/sounds/hit.mp3",
  "./public/sounds/success.mp3",

  "./public/textures/asphalt.png",
  "./public/textures/grass.png",
  "./public/textures/sand.jpg",
  "./public/textures/sky.png",
  "./public/textures/wood.jpg",

  "./Avatar.png",
  "./Avatar-Shield.png",
  "./Bomb.png",
  "./Guardian.png",
  "./Guardian-Danger.png",
  "./Guardian-berry.png",
  "./obstacle.png",
  "./predator.png",

  "./berry-blue-speed.png",
  "./berry-gray-thorn.png",
  "./berry-green-reverse.png",
  "./berry-purple-freeze.png",
  "./berry-rainbow.png",
  "./berry-red.png",
  "./berry-white-shield.png",

  "./Betterbackground.mp3",
  "./Betterhit.mp3",
  "./Bettersuccess.mp3",
  "./Chaos.mp3",
  "./Explosion.mp3",
  "./Home-screen.mp3",
  "./Overdrive.mp3"
];

const GOOGLE_FONT_HOSTS = new Set([
  "fonts.googleapis.com",
  "fonts.gstatic.com"
]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) =>
            name.startsWith("berryblitz-cache-") && name !== CACHE_NAME
          )
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);

  const isAppRequest =
    requestUrl.origin === self.location.origin &&
    requestUrl.pathname.startsWith(scopeUrl.pathname);

  const isGoogleFontRequest =
    GOOGLE_FONT_HOSTS.has(requestUrl.hostname);

  // Leave other third-party requests to the browser.
  if (!isAppRequest && !isGoogleFontRequest) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) return cachedResponse;

    try {
      const networkResponse = await fetch(request);

      // Google Fonts stylesheets may be opaque responses.
      if (
        networkResponse.ok ||
        (isGoogleFontRequest && networkResponse.type === "opaque")
      ) {
        cache.put(request, networkResponse.clone()).catch(() => {});
      }

      return networkResponse;
    } catch (error) {
      if (request.mode === "navigate") {
        const offlinePage = await cache.match(
          new URL("./index.html", scopeUrl).href
        );

        if (offlinePage) return offlinePage;
      }

      return new Response("This game file is not available offline yet.", {
        status: 503,
        statusText: "Offline",
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  })());
});
