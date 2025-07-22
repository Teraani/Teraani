// This is a basic service worker
// It doesn't do much, but it's required for a PWA to be installable

self.addEventListener('fetch', (event) => {
  // We are not caching anything in this basic example.
  // The fetch event is still required to be handled for the app to be seen as a PWA.
  return;
});
