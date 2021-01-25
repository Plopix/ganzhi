var CACHE_NAME = 'ganzhi-cache-v3.0.0.0';

function log (message) {
    if (CACHE_NAME.indexOf("debug") === 0) {
        console.log(CACHE_NAME + ': ' + message);
    }
}

self.addEventListener('install', function (event) {
    log("Service Worker Install");
    self.skipWaiting();
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
    log("Service Worker Fetch");
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                    // Cache hit - return response
                    if (response) {
                        // log("Hit: " + event.request.url);
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
                                    // log("Put " + event.request.url);
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
    log("Service Worker Activate");
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (CACHE_NAME.indexOf(cacheName) === -1) {
                        log("Deleting => " + cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
