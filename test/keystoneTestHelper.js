'use strict'

const keystone = require('../keystone.js');

const port = process.env.TEST_PORT || 5150;
keystone.set('port', port);
keystone.set('mongo','mongodb://localhost/string_api_test');

const swaggerTools = require('swagger-tools');
const swaggerDoc   = require('../swagger.json');

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  keystone.app.use(middleware.swaggerMetadata());

  // Start the server
  keystone.start()
});

module.exports = keystone;
