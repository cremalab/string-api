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
    if( !decoded.token || !decoded.userId ) {
      return callback(null, false)
    }

    const User = require('./app/models/user').User

    User.findOne({_id: decoded.userId}, (err, user) => {
      if ( !user ) { return callback(`Could not find User with ID ${decoded.userId}`, false) }
      if ( user.token === decoded.token ) {
        return callback(null, true, user)
      } else {
        return callback("Encoded token does not match", false)
      }
    })
  }

  // Authenticate with JWT
  server.auth.strategy('jwt', 'jwt',
  { key: process.env['SIGNING_SECRET'],
    validateFunc: validate,
    verifyOptions: { algorithms: [ 'HS256' ] }
  });
  server.auth.default('jwt'); // User as default for all requests

  // Decorate requests with a currentUser function
  const currentUser = function () {
    return this.auth.credentials
  }
  server.decorate('request', 'currentUser', currentUser)

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
