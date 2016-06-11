var ASSETS_PATH_REGEX = /.*/;

self.addEventListener('fetch', function(event) {
    console.log('[Service worker] Request sent: ', event.request.url);

    if (hostParser(event.request.url) === self.location.origin // same origin
        && event.request.mode !== 'navigate' // not the html page
        && event.request.url.match(ASSETS_PATH_REGEX) // matches the configuration regex
        ) {

        var modifiedRequest = new Request(event.request, {
            credentials: 'omit' // this is what removes cookies
        });

        modifiedRequest.headers.set('Accept-Language', '*');
        
        event.respondWith(
            fetch(modifiedRequest)

            .then(function(response) {
                return response;
            })

            .catch(function(error) {
                console.log('[Service worker] Fetch failed:');
                console.log(error);
            })
        );
    }

});

function hostParser(url) {
    var match = url.match(/^(https?\:\/\/[^\/]*)(\/|$)/);
    return match && match[1];
}