const VERSION = "3"
const STATIC_CACHE_NAME = `static-cache-${VERSION}`
const DYNAMIC_CACHE_NAME = `dynamic-cache-${VERSION}`
const RESOURCE_NOT_CACHED = ["/node_modules"]

const APP_STATIC_RESOURCE = ["/", "/offline.html", "/src/style.css"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => cache.addAll(APP_STATIC_RESOURCE))
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      console.log("keys : ", keys)
      return Promise.all(
        keys
          .filter(
            (key) => key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME
          )
          .map((key) => caches.delete(key))
      )
    })
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then(
        (cacheRes) =>
          cacheRes ||
          fetch(event.request).then(async (fetchRes) => {
            console.log("event.requestrequestrequest", event.request)
            return fetchRes
            // return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            //   cache.put(event.request.url, fetchRes.clone())
            //   return fetchRes
            // })
          })
      )
      .catch(() => {
        if (event.request.url.indexOf(".html") > -1) {
          return caches.match("/offline.html")
        }
      })
  )
})
