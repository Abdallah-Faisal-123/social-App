const http = require('https');
http.get('https://route-posts.routemisr.com/demo/assets/index-cG3dT_3k.js', fileRes => {
    let js = '';
    fileRes.on('data', d => js += d);
    fileRes.on('end', () => {
        const matches = js.match(/(?:path|url)\s*:\s*[`'"](.*?)[`'"].*?(?:method)\s*:\s*[`'"](.*?)[`'"]/g) || [];
        matches.forEach(m => console.log(m));
        
        // Also look for "/notifications/"
        const nRoutes = js.match(/[^"]*\/notifications\/[^"]*/g) || [];
        [...new Set(nRoutes)].forEach(x => console.log("Route:", x));
    });
});
