// This is a basic service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: O service worker foi instalado.');
  // Precaching assets can be done here if needed
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: O service worker foi ativado.');
  // Clean up old caches here if needed
});

self.addEventListener('fetch', (event) => {
  // This is a simple pass-through fetch handler.
  // For offline functionality, you would implement a caching strategy here.
  event.respondWith(fetch(event.request));
});
