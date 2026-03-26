const https = require('https');

const userId = '664bda6d6b1d471583d73981';

  const options = {
    hostname: 'route-posts.routemisr.com',
    path: `/users/${userId}/profile`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`STATUS: ${res.statusCode} | ${data}`);
    });
  });
  req.on('error', e => console.error(`ERROR:`, e.message));
  req.end();
