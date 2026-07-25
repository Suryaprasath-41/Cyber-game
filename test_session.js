const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/users/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let setCookie = res.headers['set-cookie'];
  console.log('Set-Cookie:', setCookie);
  
  let sessionCookie = setCookie ? setCookie[0].split(';')[0] : '';

  const sectionOpts = {
    hostname: 'localhost',
    port: 8080,
    path: '/game/section/1',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  };
  
  const sectionReq = http.request(sectionOpts, (sectionRes) => {
    console.log(`SECTION 1 STATUS: ${sectionRes.statusCode}`);
    
    // Now hit next-question with the cookie
    const getOpts = {
      hostname: 'localhost',
      port: 8080,
      path: '/game/api/next-question',
      method: 'GET',
      headers: { 'Cookie': sessionCookie }
    };
    
    const getReq = http.request(getOpts, (getRes) => {
      console.log(`NEXT QUESTION STATUS: ${getRes.statusCode}`);
      let data = '';
      getRes.on('data', chunk => data += chunk);
      getRes.on('end', () => console.log(`NEXT QUESTION BODY: ${data}`));
    });
    getReq.end();
  });
  sectionReq.end();
});

req.write(`rollNumber=test${Math.random()}&name=Test`);
req.end();
