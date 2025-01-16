const VERSION = "6.3"
const STATIC_CACHE_NAME = `static-cache-${VERSION}`
const DYNAMIC_CACHE_NAME = `dynamic-cache-${VERSION}`
const RESOURCE_NOT_CACHED = []

const APP_STATIC_RESOURCE = [
  "/",
  "/offline.html",
  "/src/main.ts",
  "/src/styles/main.css",
  "/src/styles/todo.css",
  "/src/styles/modal.css",
]

const removeInitialSlash = (resource) =>
  resource.map((resource) =>
    resource.at(0) === "/" ? resource.slice(1) : resource
  )

const RESOURCE_NOT_CACHED_NORMALIZED = removeInitialSlash(RESOURCE_NOT_CACHED)
const RESOURCE_CACHED_NORMALIZED = removeInitialSlash(RESOURCE_NOT_CACHED)

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
    caches.match(event.request).then((cacheRes) => {
      if (cacheRes) return cacheRes

      return fetch(event.request)
        .then(async (fetchRes) => {
          const urlSegments = new URL(event.request.url).pathname.split("/")
          const isSourceNotCached = urlSegments.some(
            (segment) =>
              RESOURCE_NOT_CACHED_NORMALIZED.includes(segment) ||
              RESOURCE_CACHED_NORMALIZED.includes(segment)
          )

          if (isSourceNotCached) return fetchRes

          return caches
            .open(DYNAMIC_CACHE_NAME)
            .then((cache) => {
              cache.put(event.request.url, fetchRes.clone())
              return fetchRes
            })
            .catch((error) => {
              console.error("Error caching the resource:", error)
              return fetchRes
            })
        })
        .catch(() => {
          if (event.request.url.includes(".html")) {
            return caches.match("/offline.html")
          }
        })
    })
  )
})
