'use strict';

const Hapi = require('hapi'),
    Routes = require('./routes'),
    config = require('./config'),
    Db     = require('./database');

let envConfig

switch (process.env['NODE_ENV']) {
  case 'test':
    envConfig = config.test
    break;
  default:
    envConfig = config.development
    break;
}

// Create a server with a host and port
const server = new Hapi.Server()

server.connection({
    host: 'localhost',
    port: envConfig.server.port
});

let goodOptions = {
  reporters: [{
    reporter: require('good-console'),
    events: { log: ['error'], response: '*' }
  }]
}

server.register([
  {register: require('good'), options: goodOptions},
  require('hapi-auth-jwt2')
], err => {


  // bring your own validation function
  const validate = function (decoded, request, callback) {
    console.log('VVVVVVVVVVVVVVVVVVV');
    console.log(decoded);

    console.log('validate!');
    // do your checks to see if the person is valid
    // if (!people[decoded.id]) {
    //   return callback(null, false);
    // }
    // else {
      return callback(null, true);
    // }
  }

  server.auth.strategy('jwt', 'jwt',
  { key: process.env['SIGNING_SECRET'],          // Never Share your secret key
    validateFunc: validate,            // validate function defined above
    verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
  });

  server.auth.default('jwt');

  server.route(Routes.endpoints)

  // Start the server
  server.start((err) => {

      if (err) {
          throw err;
      }
      console.log('Server running at:', server.info.uri)
  })
})

module.exports = server
