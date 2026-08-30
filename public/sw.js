const CACHE_NAME = "meal-scanner-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Don't cache/interfere with model files or API-like requests during navigation
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const networkResponse = await fetch(event.request);
        // Only cache successful GET requests
        if (event.request.method === "GET" && networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (err) {
        // Network failed (offline) — try cache
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;
        throw err;
      }
    })
  );
});