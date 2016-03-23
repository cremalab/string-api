'use strict';

const Hapi = require('hapi'),
    Routes = require('./routes'),
    config = require('./config'),
    Db     = require('./database');

// Create a server with a host and port
const server = new Hapi.Server()

server.connection({
    host: 'localhost',
    port: 8000
});

let goodOptions = {
  reporters: [{
    reporter: require('good-console'),
    events: { log: ['error'], response: '*' }
  }]
}

server.register({
  register: require('good'),
  options: goodOptions
}, err => {

  server.route(Routes.endpoints)

  // Start the server
  server.start((err) => {

      if (err) {
          throw err;
      }
      console.log('Server running at:', server.info.uri)
  })
})
