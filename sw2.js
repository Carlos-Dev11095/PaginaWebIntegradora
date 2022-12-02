//La prioridad es la red

const CACHE_STATIC_NAME = 'cache-estático-V1-Vestige PRP';
const CACHE_DYNAMIC_NAME = 'Caché dinámico-v1-Vestige PRP';
const CACHE_INMUTABLE_NAME = 'Caché-inmutable-v1-Vestige PRP';
const CAHE_ITEMS = 50;

function limpiarCache(cacheName, numItems) {
    caches.open(cacheName)
        .then(cache => {
            return cache.keys()
                .then(keys => {
                    //console.log(keys)
                    if (keys.length > numItems) {
                        cache.delete(keys[0])
                            .then(limpiarCache(cacheName, numItems))
                    }
                })
        })
}

self.addEventListener('install', e => {
    const cacheStatic = caches.open(CACHE_STATIC_NAME)
        .then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/js/app.js',
                '/css/style.css',
                '/img/logo.png',
                '/img/slider-bg-1.jpg',
                '/img/slider-bg-2.jpg',
                '/img/carlosIcon.png',
                '/img/vidalIcon.png',
            ])
        })

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME)
        .then(cache => {
            return cache.addAll([
                'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js'
            ])
        })
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]))
});

//Responder con el cache. Prioridad: la red.
self.addEventListener('fetch', e => {

    //console.log('fetch: ',e)
    const respuesta = fetch(e.request)
        .then(res => {
            caches.open(CACHE_DYNAMIC_NAME)
                .then(cache => {
                    cache.put(e.request.res)
                    limpiarCache(CACHE_DYNAMIC_NAME, CACHE_ITEMS)
                });
            return respuesta.clone();
        }).catch(err => {
            return caches.match(e.request)
        })



    e.respondWith(respCacheNet)

});


//if(navigator.serviceWorker)´
//navigator.serviceWorker.