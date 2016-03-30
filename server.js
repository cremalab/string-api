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
  case 'production':
    envConfig = config.production
  default:
    envConfig = config.development
    break;
}

// Create a server with a host and port
const server = new Hapi.Server()

server.connection({
    host: envConfig.server.host,
    port: process.env.PORT || 8000,
    labels: ['api']
});

let goodOptions = {
  reporters: [{
    reporter: require('good-console'),
    events: { log: ['error'], response: '*' }
  }]
}

server.register([
  {register: require('good'), options: goodOptions},
  require('hapi-auth-jwt2'),
  require('inert'),
  require('vision'),
  {
    register: require('hapi-swaggered'),
    options: {
      auth: false,
      tags: {
        'foobar/test': 'Example foobar description'
      },
      info: {
        title: 'String API',
        description: 'Powered by node, hapi, joi, mongoose, hapi-swaggered, hapi-swaggered-ui and swagger-ui',
        version: '0.1'
      }
    }
  },
  {
    register: require('hapi-swaggered-ui'),
    options: {
      auth: false,
      authorization: {
        scope: 'header',
        field: 'Authorization',
        placeholder: 'paste your signed user authToken here'
      },
      title: 'String API',
      path: '/docs',
      auth: false,
      swaggerOptions: {
        validatorUrl: null
      }
    }
  }
], {select: 'api'}, err => {


  // bring your own validation function
  const validate = function (decoded, request, callback) {
    if( !decoded.token || !decoded.userId ) {
      return callback(null, false)
    }

    const User = require('./app/models/user').User

    User.findOne({_id: decoded.userId}, (err, user) => {
      if ( !user || err ) { return callback(err, false) }
      if ( user.token === decoded.token ) {
        return callback(null, true, user)
      } else {
        return callback(null, false)
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
