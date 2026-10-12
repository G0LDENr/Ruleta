const CACHE_VERSION = 'ruleta-v1';
const CACHE_STATIC = `${CACHE_VERSION}-static`;

// Recursos que se cachean al instalar
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

// INSTALL → precachea todo
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE → limpia versiones viejas
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

// FETCH → cache-first, con fallback a offline.html
self.addEventListener('fetch', event => {
  const req = event.request;

  // Solo GET
  if (req.method !== 'GET') return;

  // Ignora requests a otros orígenes
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navegación (HTML) → network-first con fallback a cache / offline
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

  // Resto de assets → cache-first
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        // Cachea solo respuestas válidas del mismo origen
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_STATIC).then(c => c.put(req, copy));
        }
        return res;
      });
    })
  );
});

// Mensajes desde la app (para forzar actualización)
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});