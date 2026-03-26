const https = require('https');

const postId = '664bda6d6b1d471583d73981'; // Just a random ID for testing if it's 401 vs 404

const testEndpoint = (path, methods = ['POST', 'PUT', 'DELETE']) => {
  methods.forEach(method => {
    const options = {
      hostname: 'route-posts.routemisr.com',
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`${method} ${path} => STATUS: ${res.statusCode} | ${data.substring(0, 100)}`);
      });
    });
    req.on('error', e => console.error(`${method} ERROR:`, e.message));
    req.end();
  });
};

testEndpoint(`/posts/${postId}/share`, ['POST', 'PUT']);
testEndpoint(`/posts/${postId}/like`, ['POST', 'PUT']);
testEndpoint(`/posts/${postId}`, ['PUT', 'DELETE']);
