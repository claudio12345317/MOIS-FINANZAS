// Service worker minimo: solo cachea el "cascaron" de la app (HTML, iconos)
// para que instale como app e inicie mas rapido. Nunca intercepta pedidos
// a otros dominios (Firebase, Google Fonts, Chart.js, etc.) para no romper
// el login ni la sincronizacion en tiempo real.
//
// Estrategia: red primero, cache solo como respaldo sin conexion. Asi cada
// vez que se abre la app con internet, se ve siempre la ultima version
// publicada (antes quedaba pegada a lo guardado y tardaba dos aperturas
// en actualizarse).
const CACHE_NAME = 'mis-finanzas-shell-v2';
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return; // deja pasar Firebase/CDN sin tocar

  event.respondWith(
    fetch(req).then((res) => {
      caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone()));
      return res;
    }).catch(() => caches.match(req))
  );
});
