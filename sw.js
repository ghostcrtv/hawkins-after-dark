const V = 'had-v1';
const FILES = ['./', 'index.html', 'css/style.css', 'manifest.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
  'fonts/bungee-inline.woff2', 'fonts/righteous.woff2', 'fonts/special-elite.woff2', 'fonts/vt323.woff2', 'fonts/yellowtail.woff2',
  'js/core.js', 'js/audio.js', 'js/art.js', 'js/trivia-data.js', 'js/trivia.js', 'js/story.js', 'js/match.js', 'js/codered.js', 'js/menu.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// network first (so updates show up right away), cache as the offline fallback
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok && new URL(e.request.url).origin === location.origin) { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request)));
});
