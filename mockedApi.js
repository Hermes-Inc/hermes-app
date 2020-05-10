// SETUP
// npm install -g nodemon
// nodemon --watch mockedApi.js --exec node mockedApi.js

// USAGE
// curl -X POST http://localhost:3000/sessions -H 'Content-Type: application/json' -d '{"email": "Juani"}'

const http = require('http');

// helper functions
const _ = {
  createServer: (requestListener, port) => {
    http.createServer(requestListener).listen(port, () => {
      console.log(`Running on port: ${port}`);
    });
  },
  guid: () => {
    // noinspection SpellCheckingInspection
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c =>{
      // eslint-disable-next-line no-bitwise
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  getBody: async (req) => {
    return new Promise((resolve) => {
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        // eslint-disable-next-line no-undef
        try {
          body = Buffer.concat(body).toString();
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });
  },
  logRequestData: (req, body) => {
    console.log(req.url);
    console.log(JSON.stringify(req.headers));
    console.log(body);
    console.log('----------------');
  },
  respond: (res, status, payload) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(payload));
    res.end();
  },
};

// endpoint detection
const is = {
  login: (req) => {
    return req && req.url === '/sessions' && req.method === 'POST';
  },
};

// endpoint handling
const handle = {
  login: (res, body) => {
    if (body.email === 'Juani') {
      _.respond(res, 200,{name: 'Juani', token: _.guid()});
    } else {
      _.respond(res, 401, {error: 'Incorrect Email'});
    }
  },
};

function createMockApi(port) {
  _.createServer(async (req, res) => {
    const body = await _.getBody(req);
    _.logRequestData(req, body);
    if (is.login(req)) {
      handle.login(res, body);
    } else {
      _.respond(res, 200, { msg: 'Test!' });
    }
  }, port);
}

createMockApi(3000);
