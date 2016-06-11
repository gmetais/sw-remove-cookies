# A service worker that removes cookies on requests

Cookies have a weight. The bigger the cookies are on your website, the bigger requests to same-origin ressources will be. For example, if the cookie is 3KB, every request weights 3KB + other headers size. Then the request gets bigger than a network packet, so it needs to send several packets, so this is longer. This can also lead to upload bandwidth saturation, which is generally smaller than download bandwidth.

**Most of the time, assets don't need the cookies.**
    
The best solution is of course to reduce the cookie size on your website. But it's not always easy: authentication cookies, A/B testing cookies, ...

Another solution is to serve your assets from another domain. This leads to an additional DNS lookup and connection, which can also slow down the page load.


## Service workers to the rescue

While playing with service workers, I realized that it was possible to "omit" credentials on a request, which means remove cookies.

Note that it will only work:
- on **HTTPS**
- on <a href="http://caniuse.com/serviceworkers" target="_blank">compatible browsers</a>
- not on the first page load because the worker is not yet active, only for the second page and the others


## Install

Host the `remove-cookies-worker.js` script on your domain (no cross-domain allowed).

You can choose on which assets the cookies will be removed. Change the regex on the first line, which is set to `.*` by default.

Refer to the worker on you page with this line of JS:
```js
navigator.serviceWorker.register('my_path/remove-cookies-worker.js');
```

That's it! A good way to test if it works is through a spying proxy that can intercept HTTPS requests. I use Charles Proxy and if you do so, make sure you correctly enable spying on the HTTPS domain, it's disabled by default.


## Other headers

I tried some other ways to reduce the weight of the requests.

It also shortens the Accept-Language header to `*`. Some people can have a long string in this one.
I could not change any other headers, although the spec says we could be able to modify the `User-Agent`.