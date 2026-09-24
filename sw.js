const CACHE_NAME = "sai-fitness-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./workout.html",
    "./diet.html",
    "./progress.html",
    "./profile.html",
    "./exercises.html",
    "./goals.html",
    "./notifications.html",
    "./body.html",
    "./achievements.html",
    "./backup.html",
    "./settings.html",
    "./offline.html",
    "./style.css",
    "./animations.css",
    "./app.js",
    "./manifest.json"
];

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );

});

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );

        }).then(() => self.clients.claim())

    );

});

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        fetch(event.request)
            .then(response => {

                const copy = response.clone();

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, copy);
                });

                return response;

            })
            .catch(() => {

                return caches.match(event.request)
                    .then(cached => {

                        return cached ||
                            caches.match("./offline.html");

                    });

            })

    );

});