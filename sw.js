// Shelf & Cart — offline startup.
// Keeps a copy of the app on the phone so it opens with no signal.
// Bump VERSION whenever you upload a new index.html so phones refresh their copy.
const VERSION = '3.16.0';
const APP_CACHE = `shelf-app-${VERSION}`;
const LIB_CACHE = 'shelf-libs-v1';   // Firebase, barcode reader, fonts
const IMG_CACHE = 'shelf-imgs-v1';   // product photos from the online databases

const APP_FILES = ['./', './index.html', './firebase-config.js', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png', './plu.json'];
const LIB_FILES = [
  'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/12.19.0/firebase-ai.js',
  'https://www.gstatic.com/firebasejs/12.19.0/firebase-app-check.js',
  'https://unpkg.com/@zxing/library@0.21.3/umd/index.min.js',
];
const LIB_HOSTS = ['www.gstatic.com', 'unpkg.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];
const IMG_HOSTS = ['www.themealdb.com', 'images.openfoodfacts.org', 'images.openproductsfacts.org', 'images.openbeautyfacts.org', 'static.openfoodfacts.org'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const app = await caches.open(APP_CACHE);
    await app.addAll(APP_FILES.map(u => new Request(u, {cache: 'reload'})));
    const libs = await caches.open(LIB_CACHE);
    await Promise.all(LIB_FILES.map(async u => {
      if (await libs.match(u)) return;
      try { const r = await fetch(u, {mode: 'cors'}); if (r.ok) await libs.put(u, r); } catch (e) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('shelf-app-') && key !== APP_CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

// Try the network for a few seconds, then fall back to the saved copy.
async function networkFirst(req, cacheName, timeoutMs) {
  const cache = await caches.open(cacheName);
  try {
    const res = await Promise.race([
      fetch(req, {cache: 'no-cache'}),   // always ask GitHub for the newest copy
      new Promise((_, reject) => setTimeout(() => reject(new Error('slow')), timeoutMs)),
    ]);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    const hit = await cache.match(req, {ignoreSearch: true}) || (req.mode === 'navigate' ? await cache.match('./index.html') : null);
    if (hit) return hit;
    throw e;
  }
}
// Use the saved copy right away; refresh it in the background.
async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const refresh = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; }).catch(() => null);
  return hit || (await refresh) || Response.error();
}

self.addEventListener('fetch', event => {
  const req = event.request;
  // something shared to the app from another app (Android): keep it, then open the import screen
  if (req.method === 'POST' && new URL(req.url).pathname.endsWith('/share-in')) {
    event.respondWith((async () => {
      try {
        const fd = await req.formData(), c = await caches.open('shelf-share'), files = fd.getAll('files').filter(f => f && f.size);
        await c.put('./__share/meta', new Response(JSON.stringify({title: fd.get('title') || '', text: fd.get('text') || '', url: fd.get('url') || '', n: files.length, names: files.map(f => f.name)})));
        for (let i = 0; i < files.length; i++) await c.put('./__share/f' + i, new Response(files[i], {headers: {'content-type': files[i].type || 'application/octet-stream'}}));
      } catch (e) {}
      return Response.redirect('./?shared=1', 303);
    })());
    return;
  }
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) { event.respondWith(networkFirst(req, APP_CACHE, 3500)); return; }
  if (LIB_HOSTS.includes(url.hostname)) { event.respondWith(cacheFirst(req, LIB_CACHE)); return; }
  if (IMG_HOSTS.includes(url.hostname)) { event.respondWith(cacheFirst(req, IMG_CACHE)); return; }
  // everything else (Firebase sync, sign-in, product lookups) goes straight to the network
});
