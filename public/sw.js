const CACHE_NAME = 'rakshak-pwa-v1.0.0';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sih251_eagle_logo.png',
  '/sih251_eagle_logo.svg',
  '/rakshak_logo.png',
  '/rakshak_logo.svg',
  '/army_convoy_hero.png',
  '/army_depot_command.png',
  '/army_outpost_guard.png',
  '/military_map_bg.png',
  '/favicon.svg'
];

// Install Event: Cache Core App Shell & Static Assets
self.addEventListener('install', (event) => {
  console.log('🛡️ [ServiceWorker] Installing RAKSHAK PWA Cache...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 [ServiceWorker] Caching App Shell & High-Altitude Tactical Assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clear Old Caches
self.addEventListener('activate', (event) => {
  console.log('🛡️ [ServiceWorker] Activating RAKSHAK PWA Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🧹 [ServiceWorker] Removing Old Cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Offline-First Strategy with Cache Fallback for Zero-Internet Border Posts
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests or browser extension URLs
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  // API Requests: Try Network First, Fallback to Offline Response
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          console.warn('📶 [ServiceWorker] API Network Failed. Serving Cached Response for Zero-Net Mode.');
          return caches.match(event.request);
        })
    );
    return;
  }

  // App Shell & Assets: Cache-First, Fallback to Network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset immediately
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {/* Offline */});
        return cachedResponse;
      }

      // If not in cache, fetch from network
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
