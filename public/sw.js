var CACHE_NAME = 'ganzhi-cache-v1.9.8';

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                fetch("/build/manifest.json")
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        return cache.addAll(Object.keys(data).map((key) => data[key]));
                    });
            })
    );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then(
                        function (response) {
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }
                            var responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(function (cache) {
                                    cache.put(event.request, responseToCache);
                                });
                            return response;
                        }
                    );
                }
            )
    );
});


self.addEventListener('activate', function (event) {
    var cacheWhitelist = [
        'ganzhi-cache-v1.9.1',
        'ganzhi-cache-v1.9.2',
        'ganzhi-cache-v1.9.3',
        'ganzhi-cache-v1.9.4',
        'ganzhi-cache-v1.9.5',
        'ganzhi-cache-v1.9.6',
        'ganzhi-cache-v1.9.7'
    ];
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
