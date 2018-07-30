importScripts('/cache-polyfill.js');

self.addEventListener('install', function(e) {
	e
		.waitUntil
		// caches.open('airhorner').then(function(cache) {
		// 	return cache.addAll([
		// 		'/',
		// 		'/index.html',
		// 		'/index.html?homescreen=1',
		// 		'/?homescreen=1',
		// 		'/styles/main.css',
		// 		'/scripts/main.min.js',
		// 		'/sounds/airhorn.mp3'
		// 	]);
		// })
		();
});

self.addEventListener('fetch', function(event) {
	console.log('Request -->', event.request.url);

	//To tell browser to evaluate the result of event
	event.respondWith(
		caches
			.match(event.request) //To match current request with cached request it
			.then(function(response) {
				//If response found return it, else fetch again.
				return response || fetch(event.request);
			})
			.catch(function(error) {
				console.error('Error: ', error);
			})
	);
});
