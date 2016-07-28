# A service worker that removes cookies on requests

Cookies have a weight. Big cookies mean big requests to the server. For example, if the cookie on your website is 3KB, every request on the same-origin automatically weights 3KB + other headers size. If the request is bigger than a network packet (depends, but generally around 1500 Bytes), then the request is splitted in several packets and it takes more time to be sent to the server. Cookies can also lead to upload bandwidth saturation, because upload bandwidth is generally smaller than download bandwidth.

This is something that's rarely discussed, and I don't know any tool that helps developers figuring out there's a problem. But I do webperf audits for companies and I've seen some terrible perf issues caused by cookies.

## Most of the time, assets don't need cookies.
    
If your assets are called with large cookies, you should care about this problem. The best solution is of course to reduce the cookie size on your website. But it's not always easy: authentication cookies, A/B testing cookies, ...

Another solution is to serve your assets from a cookieless domain. But this leads to an additional DNS lookup and connection, which can also slow down the page load.


## Service workers to the rescue

While playing with service workers, I realized that it was possible to "omit" credentials on a request, which means remove cookies.

Note that it will only work:
- on **HTTPS**
- on <a href="http://caniuse.com/serviceworkers" target="_blank">compatible browsers</a>
- not on the first page load because the worker is not yet active, only on the next pages


## Installation

Download and host the `remove-cookies-worker.js` script on your domain (no cross-domain allowed).

You can specify on which assets the cookies will be removed. Just change the regex on the first line of the script, which is set to `.*` by default. The following example specifies every scripts, stylesheets, images and fonts inside the /assets/ directory:
```js
var ASSETS_PATH_REGEX = /\/assets\/.*\.(js|css|jpg|png|gif|svg|woff|woff2|ttf)$/;
```

Minify your service worker.

Refer to the worker on you page with this line of JS:
```js
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('my_path/remove-cookies-worker.js');
}
```

That's it! A good way to test if it works is through a spying proxy that can intercept HTTPS requests. I use Charles Proxy and if you do so, make sure you correctly enable spying on the HTTPS domain, it's disabled by default.


## Is it production ready?

No. It has not been tested in production and this is very new for the moment. I'd be VERY happy if some of you could give me your feedback, and than I'll be able to say that yes, it's production ready.


## Other headers

I tried some other ways to reduce the weight of the requests. I managed to shorten the Accept-Language header to `*`. Some people can have a long string in this one.

I could not change any other headers, although the spec says we should be able to modify the `User-Agent`.

The name of the `remove-cookies-worker.js` is quite long, and its URL will be sent in the `Referer` header. Shorten its name to light up a little bit more the request header.


## Third parties

The goal of this service worker is to optimize load time on same-origin assets. You can slightly modify so it removes cookies on other origins. Just remember that removing cookies on a tracker makes it useless, so you'd rather completly remove it from the page!


## HTTP/2 and hpack

Hpack is the compression technology used in HTTP/2. In theory hpack is able to "diff" the headers, and prevent sending the same header in subsequent requests. Results should be similar to this service worker, so you might not need it if you're on HTTP2.


## Author

Gaël Métais. I'm a webperf freelance. Follow me on Twitter [@gaelmetais](https://twitter.com/gaelmetais), I tweet mostly about Web Performances.

I can also help your company implement Service Workers, visit [my website](https://www.gaelmetais.com).