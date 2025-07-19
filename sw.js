const CACHE_NAME = 'gaming-today-cache-v4'; // Updated version
const urlsToCache = [
    '/', // Root
    '/index.html',
    '/games.html',
    '/videos.html',
    '/contact.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',

    // Game detail pages
    '/game1.html',
    '/game2.html',
    '/game3.html',
    '/game4.html',
    '/game5.html',
    '/game6.html',
    '/game7.html',
    '/game8.html',
    '/game9.html',
    '/game10.html',

    // External images (these will only cache successfully if CORS allows it)
    'https://cdn.oneesports.gg/cdn-data/wp-content/uploads/2020/06/MetalSlug_CodeJCharacters.jpg',
    'https://www.vizzed.com/Uploads/street_fighter_ii_wallpaper_by_darkninjavampire_d4fp6ax.jpg',
    'https://www.capcom-games.com/marvel-vs-capcom-fc/assets/images/title/title2/ss/ss2.png',
    'https://www.nintendo.com/eu/media/images/10_share_images/games_15/nintendo_switch_download_software_1/H2x1_NSwitchDS_AcaNeogeoTheLastBlade_image1600w.jpg',

    // Icons
    '/images/icons/icon-72x72.png',
    '/images/icons/icon-96x96.png',
    '/images/icons/icon-128x128.png',
    '/images/icons/icon-144x144.png',
    '/images/icons/icon-152x152.png',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-384x384.png',
    '/images/icons/icon-512x512.png'
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Service Worker: Failed to cache during install:', error);
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('Service Worker: Serving from cache:', event.request.url);
                    return response;
                }
                console.log('Service Worker: Fetching from network:', event.request.url);
                return fetch(event.request).then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            if (event.request.method === 'GET') {
                                cache.put(event.request, responseToCache);
                            }
                        });

                    return networkResponse;
                });
            })
            .catch((error) => {
                console.error('Service Worker: Fetch failed for:', event.request.url, error);
                if (event.request.mode === 'navigate') {
                    // return caches.match('/offline.html'); // Optional fallback
                }
            })
    );
});
