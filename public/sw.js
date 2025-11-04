// Service Worker 버전 (캐시 업데이트 시 버전 변경)
const CACHE_VERSION = "v1";
const CACHE_NAME = `pwa-cache-${CACHE_VERSION}`;

// 캐싱할 파일들
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
];

// Service Worker 설치
self.addEventListener("install", (event) => {
  console.log("[SW] 설치 중...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] 캐시 열림");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("[SW] 설치 완료");
        return self.skipWaiting(); // 즉시 활성화
      })
  );
});

// Service Worker 활성화
self.addEventListener("activate", (event) => {
  console.log("[SW] 활성화 중...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // 오래된 캐시 삭제
            if (cacheName !== CACHE_NAME) {
              console.log("[SW] 오래된 캐시 삭제:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("[SW] 활성화 완료");
        return self.clients.claim(); // 즉시 제어권 획득
      })
  );
});

// 네트워크 요청 가로채기
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // 캐시에 있으면 캐시에서 반환
        if (response) {
          console.log("[SW] 캐시에서 반환:", event.request.url);
          return response;
        }

        // 없으면 네트워크에서 가져오기
        console.log("[SW] 네트워크에서 가져오기:", event.request.url);
        return fetch(event.request).then((response) => {
          // 유효한 응답이면 캐시에 저장
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // 오프라인이고 캐시에도 없으면 오프라인 페이지 표시
        return caches.match("/offline.html");
      })
  );
});
