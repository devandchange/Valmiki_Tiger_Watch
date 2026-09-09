// Valmiki Tiger Watch Service Worker - Self-Purging Reset Worker
// Version: 99.0.0
// This worker clears all stale cache stores and unregisters itself immediately to guarantee fresh asset loading.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            console.log('[VTW SW] Evicting stale cache bucket:', key);
            return caches.delete(key);
          })
        );
      })
      .then(() => {
        console.log('[VTW SW] Unregistering service worker to restore clean network pipeline');
        return self.registration.unregister();
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Pass through all fetch requests natively
self.addEventListener('fetch', () => {
  // Return early - browser handles request via native network stack
});
