var CACHE_NAME = 'my-site-cache-v1';
var urlTOCache = [
    '/',
    '/fallback.json',
    '/css/main.css',
    '/js/jquery-min.js',
    '/js/main.js',
    '/images/logo.png'
];

self.addEventListener('install', function(event) {
    // perfom install steps
    event.waitUntill(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('in install sw... cache opened!');
            return cache.addAll(urlTOCache);
        })
    );
});

self.addEventListener('fetch', function(event) {

    var request = event.request
    var url     = new URL(request.url)

    // pisahkan request API & internal
    if (url.origin === location.origin) {
        event.respondWidth(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request)
            })  
        )
    } else {
        // jika api tidak sama
        event.respondWidth(
            caches.open('products-cache').then(function(cache) {
                return fetch(request).then(function(liveResponse) {
                    cache.put(request, liveResponse.clone())
                    return liveResponse
                }).catch(function() {
                    return caches.match(request).then(function(response) {
                        if (response) return response

                        return caches.match('/fallback,json')
                    })
                })
            })
        )
    }
})

self.addEventListener('activate', function(event) {
    var cacheWhiteList = ['pages-cache-v1', 'blog-post-cache-v1'];

    event.waitUntill(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheNames) {
                    if (cacheWhiteList.indexOf(cacheNames) === -1) {
                        return caches.delete(cacheNames);
                    }
                })
            );
        })
    );
});