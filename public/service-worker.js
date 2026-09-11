// Valmiki Tiger Watch - Offline Service Worker
// Version: 2026.1.0
// Ensures Valmiki Tiger Reserve wildlife data, species guides, maps, and reserve information
// remain fully accessible to field rangers, researchers, and visitors in remote jungle tracts.

const CACHE_VERSION = 'vtw-v2026.1.0';
const CORE_CACHE = `vtw-core-${CACHE_VERSION}`;
const ASSETS_CACHE = `vtw-assets-${CACHE_VERSION}`;
const DATA_CACHE = `vtw-data-${CACHE_VERSION}`;
const IMAGES_CACHE = `vtw-images-${CACHE_VERSION}`;

const CURRENT_CACHES = [CORE_CACHE, ASSETS_CACHE, DATA_CACHE, IMAGES_CACHE];

// Core shell assets precached during installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/vtw-logo.png',
  '/vtw-logo.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-1024.png',
  '/icons/maskable-512.png',
  '/IMG-20260907-WA0005.jpg'
];

// Installation: Precache app shell and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CORE_CACHE)
      .then((cache) => {
        console.log('[VTW SW] Precaching application shell for offline field use');
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('[VTW SW] Non-fatal precache warning:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activation: Clean up old caches and claim connected clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!CURRENT_CACHES.includes(cacheName) && cacheName.startsWith('vtw-')) {
              console.log('[VTW SW] Removing stale cache version:', cacheName);
              return caches.delete(cacheName);
            }
            return Promise.resolve();
          })
        );
      })
      .then(() => {
        console.log('[VTW SW] Claiming clients for immediate offline capability');
        return self.clients.claim();
      })
  );
});

// Fetch Dispatcher: Optimized strategies based on resource type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests (e.g. POST for submissions or admin operations)
  if (request.method !== 'GET') {
    // Handle offline fallback for AI chat POST requests
    if (url.pathname === '/api/chat') {
      event.respondWith(
        fetch(request).catch(() => {
          return new Response(
            JSON.stringify({
              reply:
                'Valmiki Tiger Watch is currently operating in offline mode. Species profiles, tiger records, emergency contacts, and field guides remain fully accessible. Reconnect to the internet to chat with the AI assistant.',
              offline: true
            }),
            {
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
              status: 200
            }
          );
        })
      );
    }
    return;
  }

  // 1. Navigation requests (HTML SPA routing)
  // Network-First with instant fallback to cached /index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CORE_CACHE).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          console.log('[VTW SW] Offline navigation detected - serving cached application shell');
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          return caches.match('/index.html');
        })
    );
    return;
  }

  // 2. Google Fonts & Web Font styles
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(ASSETS_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return cached || new Response('', { status: 408 });
        }
      })
    );
    return;
  }

  // 3. Static Images & Icons (Cache-First)
  if (
    request.destination === 'image' ||
    /\.(?:png|jpg|jpeg|svg|webp|ico|gif)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.open(IMAGES_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // Check core cache for fallback icons
          const fallback = await caches.match(request);
          if (fallback) return fallback;
          return new Response('', { status: 408, statusText: 'Image unavailable offline' });
        }
      })
    );
    return;
  }

  // 4. API Endpoints (Network-First with fallback to cached API data)
  if (url.pathname.startsWith('/api/')) {
    // Avoid caching sensitive admin endpoints
    if (url.pathname.startsWith('/api/admin')) {
      return;
    }

    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(DATA_CACHE).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          console.log('[VTW SW] Network unavailable for API:', url.pathname, '– reading cached response');
          const cached = await caches.match(request);
          if (cached) return cached;

          // If weather is requested but unavailable, provide structured offline fallback
          if (url.pathname.startsWith('/api/weather')) {
            return new Response(
              JSON.stringify({
                success: true,
                offline: true,
                message: 'Operating in Valmiki Tiger Reserve offline mode with cached telemetry.',
                source: 'VTW Offline Cache'
              }),
              { headers: { 'Content-Type': 'application/json' }, status: 200 }
            );
          }

          return new Response(
            JSON.stringify({
              error: 'Offline mode active. Reconnect when cellular coverage is restored.',
              offline: true
            }),
            { headers: { 'Content-Type': 'application/json' }, status: 503 }
          );
        })
    );
    return;
  }

  // 5. JavaScript chunks, CSS styles, and other bundled static assets (Stale-While-Revalidate)
  event.respondWith(
    caches.open(ASSETS_CACHE).then(async (cache) => {
      const cached = await cache.match(request);

      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => {
          // Ignore network failure when serving from cache
          return cached;
        });

      return cached || fetchPromise;
    })
  );
});

// Support communication with client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
