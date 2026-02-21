const CACHE_NAME = "PeerLox-v2"; // Increment version for updates
const OFFLINE_URL = "/"; // Fallback page

const ASSETS_TO_CACHE = [
  "/",
  "/search",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png",
  "/favicon.ico"
];

// 1. INSTALL: Pre-cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching Core Assets");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Force the waiting service worker to become active
});

// 2. ACTIVATE: Cleanup old caches to keep storage lean
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[Service Worker] Removing Old Cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all pages immediately
});

// 3. FETCH: Stale-While-Revalidate Strategy
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // 🚀 THE SW FIX: Completely bypass the cache for API, Auth, and Next.js dynamic data payloads
  if (
    url.pathname.startsWith("/api/") || 
    url.pathname.includes("/login") ||
    url.pathname.includes(".rsc") || // App Router data payloads
    url.pathname.startsWith("/_next/data/") // Pages Router data payloads
  ) {
    return; // Force these to ALWAYS use the live network
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });

        return cachedResponse || fetchPromise;
      });
    })
  );
});