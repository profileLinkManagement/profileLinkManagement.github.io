'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "f0a7d788a76f8632e24d73607472cc1f",
"assets/AssetManifest.bin.json": "2d21ef0bd24d38fcdea0b31754a91d20",
"assets/AssetManifest.json": "1280424ab23deb2b6fa85e937361a55e",
"assets/assets/fonts/noto_sans/NotoSans-Black.ttf": "bd5128e54a5262c4ceacd4a823dc2fc8",
"assets/assets/fonts/noto_sans/NotoSans-Bold.ttf": "8ac165243fb633296963b149f206a377",
"assets/assets/fonts/noto_sans/NotoSans-ExtraBold.ttf": "2cc6e79e65da29bd416f187ececac850",
"assets/assets/fonts/noto_sans/NotoSans-ExtraLight.ttf": "2e7ecb3f8f24b1f0c331f76a405281e5",
"assets/assets/fonts/noto_sans/NotoSans-Light.ttf": "1853a578246d1b2182b73ee5fadd57b7",
"assets/assets/fonts/noto_sans/NotoSans-Medium.ttf": "f2197cc8a55ba75995cd38d00e8be599",
"assets/assets/fonts/noto_sans/NotoSans-Regular.ttf": "ac08e269b7f479624b266c0ea20013b4",
"assets/assets/fonts/noto_sans/NotoSans-SemiBold.ttf": "63bbc52e6ef89a5b1a50f1c9c4710d1b",
"assets/assets/fonts/noto_sans/NotoSans-Thin.ttf": "80459ea7de432a2999dd0c3afa6fe747",
"assets/assets/images/app_logo.png": "007050a84b4210796778d72838c409a7",
"assets/assets/images/easelinked_name_ico.png": "c21cf0370635689a4243f67d8ef32876",
"assets/assets/images/feature_img.png": "14742a2cce83361cd9ee23bc727d69a5",
"assets/assets/images/icons/contact_us_ico.png": "55f6293148d1e936d49ef4fe397b336c",
"assets/assets/images/icons/play_store_icon.png": "fa7e4072f2589d5d1b47a3d386a0e14f",
"assets/assets/images/welcome_mobile_screen_img.png": "2a79aedf8c14ab3ae16d0ac0e99558c2",
"assets/assets/translations/en-US.json": "3c3865a22202d75c4c6f87171f926a16",
"assets/FontManifest.json": "735d0f55442ee0cd13b2526075af9100",
"assets/fonts/MaterialIcons-Regular.otf": "0c4a456ef1becca7bba3d195197670a8",
"assets/NOTICES": "c7cb827e14dadbb59dba3903105e89bb",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "0b8c6f9dde4b0286fcf2bafa0f536533",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"icons/Icon-192.png": "007050a84b4210796778d72838c409a7",
"icons/Icon-512.png": "a358adf7892001ded7269fa14cc0dba5",
"icons/Icon-maskable-192.png": "007050a84b4210796778d72838c409a7",
"icons/Icon-maskable-512.png": "a358adf7892001ded7269fa14cc0dba5",
"index.html": "bd6965471b56d65c7d89729be3bd6d5a",
"/": "bd6965471b56d65c7d89729be3bd6d5a",
"main.dart.js": "959ab9ee82062073cd0f4d2a04475eaf",
"manifest.json": "db79dcd7f84565c310b99bdb6f95c351",
"style.css": "5e794f471bd8e66e7a3ecf0d500185b0",
"version.json": "4bade4b77330791c98d074d42b5e16cc"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
