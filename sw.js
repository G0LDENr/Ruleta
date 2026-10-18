// Service Worker — Ruleta PWA
const CACHE_VERSION = 'ruleta-v3';
const CACHE_STATIC = `${CACHE_VERSION}-static`;

const PRECACHE_URLS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './css/styles.css',
  './js/state.js',
  './js/storage.js',
  './js/wheel.js',
  './js/ui.js',
  './js/pwa.js',
  './js/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('ruleta-') && k !== CACHE_STATIC)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Navegación
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_STATIC).then(c => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req)
            .then(cached => cached || caches.match('./offline.html'))
        )
    );
    return;
  }

  // Assets (incluye CDN de Reicon y fuentes)
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_STATIC).then(c => c.put(req, copy));
        }
        return res;
      });
    })
  );
});