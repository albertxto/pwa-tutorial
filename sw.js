importScripts('./node_modules/workbox-sw/build/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.precaching.precacheAndRoute([
	'./',
	'./app.js',
	'./fallback.json',
	'./images/fetch-dog.jpg',
	{ url: '/index.html', revision: '383676' },
]);

workbox.routing.registerRoute(
	'https://newsapi.org/(.*)',
	workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
	new RegExp('.*\.js'),
	workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
	// Cache CSS files
	/.*\.css/,
	// Use cache but update in the background ASAP
	workbox.strategies.staleWhileRevalidate({
		// Use a custom cache name
		cacheName: 'css-cache',
	})
);

workbox.routing.registerRoute(
	// Cache image files
	/.*\.(?:png|jpg|jpeg|svg|gif)/,
	// Use the cache if it's available
	workbox.strategies.cacheFirst({
		// Use a custom cache name
		cacheName: 'news-images',
		plugins: [
			new workbox.expiration.Plugin({
				// Cache only 20 images
				maxEntries: 20,
				// Cache for a maximum of a week
				maxAgeSeconds: 7 * 24 * 60 * 60,
			})
		],
	})
);

/*self.addEventListener('install', async event => {
	const cache = await caches.open('news-static');
	cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
	const req = event.request;
	const url = new URL(req.url);

	if(url.origin === location.origin){
		event.respondWith(cacheFirst(req));
	}else{
		event.respondWith(networkFirst(req));
	}
});

async function cacheFirst(req){
	const cachedResponse = await caches.match(req);
	return cachedResponse || fetch(req);
}

async function networkFirst(req){
	const cache = await caches.open('news-dynamic');

	try{
		//network
		const res = await fetch(req);
		cache.put(req, res.clone());
		return res;
	} catch(error){
		//cache
		const cachedResponse = await cache.match(req);
		return cachedResponse || await caches.match('./fallback.json');
	}
}*/
