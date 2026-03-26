const https = require('https');

const options = {
  hostname: 'route-posts.routemisr.com',
  path: `/notifications/unread-count`,
  method: 'GET',
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
        console.log("STATUS: " + res.statusCode);
        const json = JSON.parse(data);
        console.log(JSON.stringify(json, null, 2));
    } catch(e) {
        console.log(data)
    }
  });
});
req.on('error', e => console.error(`ERROR:`, e.message));
req.end();
