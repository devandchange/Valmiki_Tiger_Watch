// Valmiki Tiger Watch Service Worker
// Version: 2.4.0
const CACHE_NAME = 'vtw-core-v6';
const DYNAMIC_CACHE = 'vtw-dynamic-v6';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-1024.png',
  '/icons/maskable-512.png',
  '/vtw-logo.svg',
  '/vtw-logo.png',
  '/favicon.png',
  '/apple-touch-icon.png'
];

// Install Event - Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[VTW SW] Pre-caching application shell');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[VTW SW] Some static assets failed to pre-cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name !== DYNAMIC_CACHE) {
            console.log('[VTW SW] Removing obsolete cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests and chrome-extension / non-http schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Never cache admin API endpoints or sensitive actions
  if (url.pathname.startsWith('/api/admin') || url.pathname.includes('/admin/')) {
    event.respondWith(fetch(request));
    return;
  }

  // API requests: Network-First with cached fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response(JSON.stringify({ 
              offline: true, 
              message: 'You are currently offline. Displaying cached data where available.' 
            }), {
              headers: { 'Content-Type': 'application/json' },
              status: 503
            });
          });
        })
    );
    return;
  }

  // Static assets & App shell: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          // If offline and request is for navigation (HTML page), return cached index.html
          if (request.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/');
          }
          return null;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
