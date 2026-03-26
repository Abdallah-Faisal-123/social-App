const https = require('https');

// Token not strictly required for GET /posts usually, but let's check
const options = {
  hostname: 'route-posts.routemisr.com',
  path: `/posts`,
  method: 'GET',
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json.data[0], null, 2));
    } catch (e) {
      console.log(data);
    }
  });
});
req.on('error', e => console.error(`ERROR:`, e.message));
req.end();
