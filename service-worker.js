/* Registre Céleste — Service Worker (V1.0)
   Cache-first pour les ressources locales : l'application fonctionne
   hors connexion après le premier chargement. Aucun appel réseau tiers. */

const CACHE = 'registre-celeste-v1';
const RESSOURCES = [
  './',
  './index.html',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(RESSOURCES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(cles => Promise.all(cles.filter(c => c !== CACHE).map(c => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(rep => {
        if (rep && rep.ok) {
          const clone = rep.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return rep;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
