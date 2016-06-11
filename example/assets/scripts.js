function initPage() {
    document.getElementById('compatibility').className = ('serviceWorker' in navigator) ? 'yes' : 'no';
    if ('serviceWorker' in navigator) {
        if (navigator.serviceWorker.controller) {
            document.getElementById('serviceWorkerActive').className = 'yes';
        } else {
            document.getElementById('serviceWorkerInactive').className = 'yes';
        }
    }
    document.getElementById('cookieSize').innerHTML = document.cookie.length;
    document.getElementById('totalCookieSize').innerHTML = 52 * document.cookie.length;

    var image;
    var imagesDiv = document.getElementById('images');
    for (var i = 0; i < 50; i++) {
        image = document.createElement('img');
        image.src = 'assets/cookie.jpg?q=' + Date.now() + i;
        imagesDiv.appendChild(image);
    }
}

initPage();