// Version 20261010-121210 — généré par outils/construire_appli.py
const CACHE = 'dos-forme-20261010-121210';
const FICHIERS = ['./', './index.html', './manifest.webmanifest', './icone-192.png', './icone-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((cles) => Promise.all(cles.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((enCache) => {
    const reseau = fetch(req).then((rep) => {
      if (rep.ok) { const copie = rep.clone(); caches.open(CACHE).then((c) => c.put(req, copie)); }
      return rep;
    }).catch(() => enCache || caches.match('./index.html'));
    return enCache || reseau;
  }));
});
