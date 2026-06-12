const CACHE_NAME = "e-vara-cache-v1";
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/placeholder.svg",
  "/robots.txt"
];

// Install Event - Pre-cache core shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Intercept request and handle offline fallback
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Ignore API requests (e.g. Supabase, PostHog, or external domains)
  if (url.origin !== self.location.origin) return;

  // Ignore chrome-extension or other non-http protocols
  if (!url.protocol.startsWith("http")) return;

  // Handle SPA routing navigation requests
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Offline fallback to index.html
          return caches.match("/index.html");
        })
    );
    return;
  }

  // Network-First strategy with Cache fallback for static assets
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache valid responses
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
  );
});
