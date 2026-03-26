const fs = require('fs');
const http = require('https');

http.get('https://route-posts.routemisr.com/demo/', res => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
        // find src="/demo/static/js/main.xxxx.js"
        const matches = html.match(/src="([^"]+\.js)"/g);
        if (matches) {
            matches.forEach(m => {
                const src = m.match(/src="([^"]+)"/)[1];
                const url = 'https://route-posts.routemisr.com' + (src.startsWith('/') ? src : '/demo/' + src);
                console.log("Fetching: " + url);
                http.get(url, fileRes => {
                    let js = '';
                    fileRes.on('data', d => js += d);
                    fileRes.on('end', () => {
                        // find routes
                        if(js.includes('notifications')) {
                            const notifUrls = js.match(/(https:\/\/route-posts\.routemisr\.com\/[a-zA-Z0-9\/\-\_]*)/g);
                            if(notifUrls) {
                                console.log([...new Set(notifUrls)].filter(x => x.includes('notification')));
                            }
                            
                            // Let's specifically look for put or mark read
                            const pieces = js.match(/.{0,50}notifications.{0,50}/g) || [];
                            pieces.forEach(p => console.log('FOUND:', p));
                        }
                    });
                });
            });
        }
    });
});
